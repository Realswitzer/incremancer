import {
  Creature,
  CreatureState,
  spawnCritText,
} from "./classes/creatureclasses";
import { CharacterFlags } from "./classes/gameobject";
import {
  Bullets,
  Smoke,
  fastDistance,
  magnitude,
  CreatureFactory,
  GameModel,
  Graveyard,
  Humans,
  ZmMap,
  Blasts,
  Blood,
  Bones,
  Exclamations,
  characterContainer,
  Zombies,
} from "./internal";

export class Creatures {
  private static instance: Creatures;
  constructor() {
    if (Creatures.instance) return Creatures.instance;
    Creatures.instance = this;
  }
  creatureFactory = new CreatureFactory();
  map: ZmMap;
  model: GameModel;
  graveyard: Graveyard;
  smoke: Smoke;
  bullets: Bullets;
  humans: Humans;
  zombies = new Zombies();
  exclamations: Exclamations;
  blood: Blood;
  bones: Bones;
  blasts: Blasts;
  creatures: Creature[] = [];
  creatureCount = [];
  aliveCreatures: Creature[] = [];
  aliveZombies = [];
  graveyardAttackers = [];
  discardedSprites: Creature[] = [];
  aliveHumans = [];
  scaling = 1.6;
  moveTargetDistance = 15;
  attackDistance = 20;
  attackSpeed = 3;
  targetDistance = 100;
  fadeSpeed = 0.1;
  currId = 1;
  scanTime = 3;
  refundChance = 0;
  creatureTypes = this.creatureFactory.types;
  golemTextures = {
    set: false,
    down: [] as PIXI.Texture[],
    up: [] as PIXI.Texture[],
    left: [] as PIXI.Texture[],
    right: [] as PIXI.Texture[],
    dead: [] as PIXI.Texture[],
  };
  directions = {
    down: 1,
    up: 2,
    right: 3,
    left: 4,
    dead: 5,
  };
  burnTickTimer = 5;
  smokeTimer = 0.3;
  fastDistance = fastDistance;
  magnitude = magnitude;
  damageZombie = this.zombies.damageZombie;
  searchClosestTarget = this.zombies.searchClosestTarget;
  updateBurns = this.zombies.updateBurns;
  updateZombieRegen = this.zombies.updateZombieRegen;
  causePlagueExplosion = this.zombies.causePlagueExplosion;
  inflictPlague = this.zombies.inflictPlague;
  healZombie = this.zombies.healZombie;

  populate(): void {
    this.map = new ZmMap();
    this.model = GameModel.getInstance();
    this.graveyard = new Graveyard();
    this.smoke = new Smoke();
    this.bullets = new Bullets();
    this.humans = new Humans();
    this.exclamations = new Exclamations();
    this.blood = new Blood();
    this.bones = new Bones();
    this.blasts = new Blasts();

    if (!this.golemTextures.set) {
      this.golemTextures.down = [];
      this.golemTextures.up = [];
      this.golemTextures.right = [];
      this.golemTextures.dead = [];
      for (let i = 0; i < 3; i++) {
        this.golemTextures.down.push(PIXI.Texture.from("golem" + i + ".png"));
      }
      for (let i = 3; i < 6; i++) {
        this.golemTextures.up.push(PIXI.Texture.from("golem" + i + ".png"));
      }
      for (let i = 6; i < 9; i++) {
        this.golemTextures.right.push(PIXI.Texture.from("golem" + i + ".png"));
      }
      this.golemTextures.dead.push(PIXI.Texture.from("golem9.png"));
      this.golemTextures.set = true;
    }

    // reset creature position at start of level
    const creatures = [];
    for (let i = 0; i < this.creatures.length; i++) {
      if (!this.model.constructions.monsterFactory) {
        this.discardedSprites.push(this.creatures[i]);
        characterContainer.removeChild(this.creatures[i]);
      } else {
        if (!this.creatures[i].flags.dead) {
          creatures.push(this.creatures[i]);
          this.creatures[i].x = this.graveyard.sprite.x;
          this.creatures[i].zIndex = this.creatures[i].y =
            this.graveyard.sprite.y + (this.graveyard.level > 2 ? 8 : 0);
          this.creatures[i].target = null;
          this.creatures[i].state = CreatureState.lookingForTarget;
        } else {
          this.discardedSprites.push(this.creatures[i]);
          characterContainer.removeChild(this.creatures[i]);
        }
      }
    }
    this.creatures = creatures;
    this.aliveCreatures = [];

    this.creatureFactory.spawnSavedCreatures();
  }

  spawnCreature(
    health: number,
    damage: number,
    speed: number,
    type: number,
    level: number
  ): void {
    if (this.model.creatureCount >= this.model.creatureLimit) {
      return;
    }

    let creature: Creature;
    if (this.discardedSprites.length > 0) {
      creature = this.discardedSprites.pop();
      creature.textures = this.golemTextures.down;
    } else {
      creature = new Creature(this.golemTextures.down);
    }
    switch (type) {
      case this.creatureTypes.earthGolem:
        creature.tint = 0xa87f32;
        creature.bulletReflect = this.model.bulletproofChance;
        break;
      case this.creatureTypes.airGolem:
        creature.tint = 0x9ca5b8;
        break;
      case this.creatureTypes.fireGolem:
        creature.tint = 0xdb471a;
        creature.immuneToBurns = true;
        break;
      case this.creatureTypes.waterGolem:
        creature.tint = 0x4d86e8;
        creature.immuneToBurns = true;
        break;
    }
    creature.flags = new CharacterFlags();
    creature.flags.golem = true;
    creature.burnDamage = 0;
    creature.level = level;
    creature.textureSet = this.golemTextures;
    creature.deadTexture = this.golemTextures.dead;
    creature.currentDirection = this.directions.down;
    creature.creatureType = type;
    creature.lastKnownBuilding = false;
    creature.alpha = 1;
    creature.animationSpeed = 0.15;
    creature.anchor.set(8.5 / 16, 1);
    creature.position.set(
      this.graveyard.sprite.x,
      this.graveyard.sprite.y + (this.graveyard.level > 2 ? 8 : 0)
    );
    creature.target = null;
    creature.zIndex = creature.position.y;
    creature.visible = true;
    creature.maxHealth = creature.health = health;
    creature.attackDamage = damage;
    creature.regenTimer = 5;
    creature.state = CreatureState.lookingForTarget;
    creature.scaling = this.scaling;
    creature.scale.set(creature.scaling, creature.scaling);
    creature.xSpeed = 0;
    creature.ySpeed = 0;
    creature.speedMultiplier = 1;
    creature.maxSpeed = speed;
    creature.timer.ability = Math.random() * 4;
    creature.timer.attack = 0;
    creature.timer.scan = 0;
    creature.timer.burnTick = this.burnTickTimer;
    creature.timer.smoke = this.smokeTimer;
    creature.play();
    creature.zombieId = this.currId++;
    this.creatures.push(creature);
    characterContainer.addChild(creature);
    this.smoke.newZombieSpawnCloud(creature.x, creature.y - 2);
    this.model.creatureCount++;
  }

  update(timeDiff: number): void {
    let aliveCreatures = 0;
    this.aliveHumans = this.humans.aliveHumans;
    this.graveyardAttackers = this.humans.graveyardAttackers;
    this.aliveZombies = this.zombies.aliveZombies;
    this.creatureCount = [];
    for (let i = 0; i < this.creatureFactory.creatures.length; i++) {
      this.creatureCount[this.creatureFactory.creatures[i].type] = 0;
    }

    this.model.persistentData.savedCreatures = [];

    for (let i = 0; i < this.creatures.length; i++) {
      if (this.creatures[i].visible) {
        this.updateCreature(this.creatures[i], timeDiff);
      }
    }
    for (let i = 0; i < this.creatures.length; i++) {
      if (this.creatures[i].visible) {
        if (!this.creatures[i].flags.dead) {
          this.aliveZombies.push(this.creatures[i]);
          aliveCreatures++;
          this.creatureCount[this.creatures[i].creatureType]++;
          this.model.persistentData.savedCreatures.push({
            t: this.creatures[i].creatureType,
            l: this.creatures[i].level,
          });
        }
      }
    }
    this.model.creatureCount = aliveCreatures;
  }

  updateCreature(creature: Creature, timeDiff: number): void {
    if (creature.flags.dead) {
      if (!creature.visible) return;

      creature.alpha -= this.fadeSpeed * timeDiff;
      if (creature.alpha < 0) {
        creature.visible = false;
        characterContainer.removeChild(creature);
      }
      return;
    }

    creature.timer.attack -= timeDiff;
    creature.timer.scan -= timeDiff;
    creature.timer.ability -= timeDiff;

    if (this.model.runeEffects.healthRegen > 0) {
      this.updateZombieRegen(creature, timeDiff);
    }

    if (creature.flags.burning && !creature.immuneToBurns) {
      this.updateBurns(creature, timeDiff);
    }

    if (creature.timer.ability < 0) {
      creature.timer.ability = 4;
      switch (creature.creatureType) {
        case this.creatureTypes.earthGolem:
          this.golemTaunt(creature);
          break;
        case this.creatureTypes.waterGolem:
          this.golemHeal(creature);
          break;
        case this.creatureTypes.fireGolem:
          this.golemFireball(creature);
          break;
      }
    }

    if (
      (!creature.target || creature.target.flags.dead) &&
      creature.timer.scan < 0
    ) {
      creature.state = CreatureState.lookingForTarget;
    }

    switch (creature.state) {
      case CreatureState.lookingForTarget:
        this.searchClosestTarget(creature);
        if (creature.target) {
          creature.state = CreatureState.movingToTarget;
        }
        break;

      case CreatureState.movingToTarget: {
        const distanceToHumanTarget = this.fastDistance(
          creature.position.x,
          creature.position.y,
          creature.target.x,
          creature.target.y
        );

        if (distanceToHumanTarget < this.attackDistance) {
          creature.state = CreatureState.attackingTarget;
          break;
        }

        if (
          distanceToHumanTarget > this.attackDistance * 3 &&
          creature.timer.scan < 0
        ) {
          this.searchClosestTarget(creature);
        }
        this.updateCreatureSpeed(creature, timeDiff);

        break;
      }
      case CreatureState.attackingTarget: {
        const distanceToTarget = this.fastDistance(
          creature.position.x,
          creature.position.y,
          creature.target.x,
          creature.target.y
        );
        if (distanceToTarget < this.attackDistance) {
          creature.scale.x =
            creature.target.x > creature.x
              ? creature.scaling
              : -creature.scaling;
          if (creature.timer.attack < 0) {
            this.humans.damageHuman(
              creature.target,
              this.calculateDamage(creature)
            );
            if (creature.creatureType == this.creatureTypes.fireGolem) {
              this.humans.burnHuman(creature.target, creature.attackDamage / 2);
            }
            creature.timer.attack =
              this.attackSpeed * this.model.runeEffects.attackSpeed;
            if (creature.flags.burning) {
              creature.timer.attack *= 1 / this.model.burningSpeedMod;
            }
          }
          if (distanceToTarget > this.attackDistance / 2) {
            this.updateCreatureSpeed(creature, timeDiff);
          }
        } else {
          creature.state = CreatureState.movingToTarget;
        }
        break;
      }
    }
  }

  getCreatureDirection(creature: Creature): number {
    if (Math.abs(creature.xSpeed) > Math.abs(creature.ySpeed)) {
      //left right
      if (creature.xSpeed < 0) {
        return this.directions.left;
      }
      return this.directions.right;
    } else {
      // up down
      if (creature.ySpeed < 0) {
        return this.directions.up;
      }
      return this.directions.down;
    }
  }

  changeTextureDirection(creature: Creature): void {
    const direction = this.getCreatureDirection(creature);
    if (direction !== creature.currentDirection) {
      switch (direction) {
        case this.directions.up:
          creature.textures = creature.textureSet.up;
          creature.scale.x = creature.scaling;
          break;
        case this.directions.down:
          creature.textures = creature.textureSet.down;
          creature.scale.x = creature.scaling;
          break;
        case this.directions.right:
          creature.textures = creature.textureSet.right;
          creature.scale.x = creature.scaling;
          break;
        case this.directions.left:
          creature.textures = creature.textureSet.right;
          creature.scale.x = -creature.scaling;
          break;
      }
      creature.currentDirection = direction;
      creature.play();
    }
  }

  updateCreatureSpeed(creature: Creature, timeDiff: number): void {
    if (creature.timer.dogStun && creature.timer.dogStun > 0) {
      creature.timer.dogStun -= timeDiff;
      return;
    }

    if (!creature.timer.target || !creature.targetVector) {
      creature.timer.target = 0;
    }
    creature.timer.target -= timeDiff;
    if (creature.timer.target <= 0) {
      creature.targetVector = this.map.howDoIGetToMyTarget(
        creature,
        creature.target
      );
      creature.timer.target = 0.2;
    }

    const speedMod = creature.speedMultiplier * creature.maxSpeed;

    creature.xSpeed = creature.targetVector.x * speedMod;
    creature.ySpeed = creature.targetVector.y * speedMod;

    creature.position.x += creature.xSpeed * timeDiff;
    creature.position.y += creature.ySpeed * timeDiff;
    creature.zIndex = creature.position.y;
    this.changeTextureDirection(creature);
  }

  calculateDamage(creature: Creature): number {
    let damage = creature.attackDamage;
    if (
      this.model.runeEffects.critChance > 0 &&
      Math.random() < this.model.runeEffects.critChance
    ) {
      damage *= this.model.runeEffects.critDamage;
      spawnCritText(creature.x, creature.y, damage);
    }
    return damage;
  }

  golemTaunt(creature: Creature): void {
    for (let i = 0; i < this.aliveHumans.length; i++) {
      if (Math.abs(this.aliveHumans[i].x - creature.x) < this.targetDistance) {
        if (
          Math.abs(this.aliveHumans[i].y - creature.y) < this.targetDistance
        ) {
          if (!this.aliveHumans[i].vip) {
            this.aliveHumans[i].zombieTarget = creature;
            this.aliveHumans[i].target = creature;
          }
        }
      }
    }
  }

  golemHeal(creature: Creature): void {
    const healingDone = creature.attackDamage;
    for (let i = 0; i < this.aliveZombies.length; i++) {
      if (Math.abs(this.aliveZombies[i].x - creature.x) < this.targetDistance) {
        if (
          Math.abs(this.aliveZombies[i].y - creature.y) < this.targetDistance
        ) {
          this.healZombie(this.aliveZombies[i], healingDone);
        }
      }
    }
    for (let i = 0; i < this.creatures.length; i++) {
      if (!this.creatures[i].flags.dead && this.creatures[i].visible) {
        if (Math.abs(this.creatures[i].x - creature.x) < this.targetDistance) {
          if (
            Math.abs(this.creatures[i].y - creature.y) < this.targetDistance
          ) {
            this.healZombie(this.creatures[i], healingDone);
          }
        }
      }
    }
  }

  golemFireball(creature: Creature): void {
    let fireBalls = 5;
    for (let i = 0; i < this.aliveHumans.length; i++) {
      if (fireBalls > 0) {
        if (
          Math.abs(this.aliveHumans[i].x - creature.x) < this.targetDistance
        ) {
          if (
            Math.abs(this.aliveHumans[i].y - creature.y) < this.targetDistance
          ) {
            fireBalls--;
            this.bullets.newBullet(
              creature,
              this.aliveHumans[i],
              creature.attackDamage / 2,
              false,
              false,
              true
            );
          }
        }
      }
    }
  }
}
