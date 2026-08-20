import {
  Creature,
  CreatureState,
  spawnCritText,
} from "./classes/creatureclasses";
import { CharacterFlags, GameObject } from "./classes/gameobject";
import type { Human } from "./classes/humanclasses";
import {
  Blasts,
  Blood,
  Bones,
  Bullets,
  Exclamations,
  Smoke,
  GameModel,
  Graveyard,
  Humans,
  ZmMap,
  characterContainer,
  uiContainer,
  KeysPressed,
  fastDistance,
  magnitude,
  getRandomElementFromArray,
  CreatureFactory,
} from "./internal";

class ZombieFlags extends CharacterFlags {
  dog = false;
  super = false;
}

export class Zombie extends Creature {
  flags = new ZombieFlags();
  mod = 1;
  scaleMod = 1;
  textureId = 0;
  turnTimer = 0;
}

export class Zombies {
  private static instance: Zombies;
  creatureFactory: CreatureFactory;
  constructor() {
    if (Zombies.instance) return Zombies.instance;
    Zombies.instance = this;
  }
  map: ZmMap;
  model: GameModel;
  humans: Humans;
  graveyard: Graveyard;
  smoke: Smoke;
  blood: Blood;
  bones: Bones;
  exclamations: Exclamations;
  blasts: Blasts;
  bullets: Bullets;
  zombies: Zombie[] = [];
  discardedZombies: Zombie[] = [];
  aliveZombies: Creature[] = [];
  aliveHumans = [];
  zombiePartition: Creature[][][] = [];
  scaling = 2;
  moveTargetDistance = 15;
  attackDistance = 15;
  attackSpeed = 3;
  targetDistance = 100;
  fadeSpeed = 0.1;
  refundChance = 0;
  currId = 1;
  scanTime = 3;
  textures = [];
  dogTexture = [];
  deadDogTexture = [];
  maxSpeed = 10;
  zombieCursor = null;
  zombieCursorText = null;
  zombieCursorScale = 3;
  mouseOutOfBounds = false;
  burnTickTimer = 5;
  bloodpact = 1;
  bloodborn = 0;
  gigamutagen = 0;
  gigamutationTimer = 10;
  smokeTimer = 0.3;
  fastDistance = fastDistance;
  magnitude = magnitude;
  detonate = false;
  super = false;

  populate(): void {
    this.map = new ZmMap();
    this.model = GameModel.getInstance();
    this.humans = new Humans();
    this.graveyard = new Graveyard();
    this.creatureFactory = new CreatureFactory();
    this.smoke = new Smoke();
    this.blood = new Blood();
    this.bones = new Bones();
    this.exclamations = new Exclamations();
    this.blasts = new Blasts();
    this.bullets = new Bullets();
    this.model.zombieCount = 0;
    if (this.textures.length == 0) {
      for (let i = 0; i < 3; i++) {
        const animated = [];
        for (let j = 0; j < 3; j++) {
          animated.push(
            PIXI.Texture.from("zombie" + (i + 1) + "_" + (j + 1) + ".png")
          );
        }
        this.textures.push({
          animated: animated,
          dead: [PIXI.Texture.from("zombie" + (i + 1) + "_dead.png")],
        });
      }
      for (let i = 0; i < 2; i++) {
        this.dogTexture.push(PIXI.Texture.from("zombiedog" + (i + 1) + ".png"));
      }
      this.deadDogTexture = [PIXI.Texture.from("zombiedogdead.png")];
    }

    if (this.zombies.length > 0) {
      for (let i = 0; i < this.zombies.length; i++) {
        characterContainer.removeChild(this.zombies[i]);
        this.zombies[i].stop();
      }
      this.discardedZombies = this.zombies.slice();
      this.zombies.length = 0;
      this.aliveZombies.length = 0;
    }
    if (!this.zombieCursor) {
      this.zombieCursor = new PIXI.Container();
      const cursorSprite = new PIXI.Sprite(PIXI.Texture.from("zombie1_1.png"));
      cursorSprite.alpha = 0.6;
      cursorSprite.scale.x = cursorSprite.scale.y = 1;
      cursorSprite.anchor.set(35 / 80, 1);
      this.zombieCursorText = new PIXI.Text("1", {
        fontFamily: "sans-serif",
        fontSize: 40,
        fill: "#FFF",
        stroke: "#000",
        strokeThickness: 0,
        align: "center",
      });
      this.zombieCursorText.anchor = { x: 0.5, y: 1 };
      this.zombieCursorText.scale.x = this.zombieCursorText.scale.y = 0.1;
      this.zombieCursorText.y = -9;
      this.zombieCursorText.visible = false;
      this.zombieCursorText.alpha = 0.7;

      this.zombieCursor.addChild(cursorSprite);
      this.zombieCursor.addChild(this.zombieCursorText);
      uiContainer.addChild(this.zombieCursor);
    }
  }

  createZombie(x: number, y: number, isDog = false): void {
    const textureId = Math.floor(Math.random() * this.textures.length);
    let zombie: Zombie;
    if (this.discardedZombies.length > 0) {
      zombie = this.discardedZombies.pop();
      if (isDog) {
        zombie.textures = this.dogTexture;
      } else {
        zombie.textures = this.textures[textureId].animated;
      }
    } else {
      if (isDog) {
        zombie = new Zombie(this.dogTexture);
      } else {
        zombie = new Zombie(this.textures[textureId].animated);
      }
    }
    zombie.zombie = true;
    zombie.mod = 1;
    zombie.scaleMod = 1;
    if (this.super) {
      zombie.mod = 10;
      zombie.scaleMod = 1.5;
    }
    zombie.flags = new ZombieFlags();
    zombie.flags.dog = isDog;
    zombie.flags.super = this.super;
    zombie.deadTexture = zombie.flags.dog
      ? this.deadDogTexture
      : this.textures[textureId].dead;
    zombie.textureId = textureId;
    zombie.burnDamage = 0;
    zombie.lastKnownBuilding = false;
    zombie.alpha = 1;
    zombie.animationSpeed = 0.15;
    zombie.anchor.set(35 / 80, 1);
    zombie.bloodbornTimer = this.bloodborn;
    zombie.position.set(x, y);
    zombie.target = null;
    zombie.zIndex = zombie.position.y;
    zombie.visible = true;
    zombie.maxHealth = zombie.health = this.model.zombieHealth * zombie.mod;
    zombie.regenTimer = 5;
    zombie.state = CreatureState.lookingForTarget;
    const dogScale = isDog ? 0.7 : 1;
    zombie.scaling = zombie.scaleMod * this.scaling * dogScale;
    zombie.scale.set(
      Math.random() > 0.5 ? zombie.scaling : -1 * zombie.scaling,
      zombie.scaling
    );
    zombie.timer.attack = 0;
    zombie.xSpeed = 0;
    zombie.ySpeed = 0;
    zombie.speedMultiplier = 1;
    zombie.timer.scan = 0;
    zombie.timer.burnTick = this.burnTickTimer;
    zombie.timer.smoke = this.smokeTimer;
    zombie.play();
    zombie.zombieId = this.currId++;
    this.zombies.push(zombie);
    characterContainer.addChild(zombie);
    this.smoke.newZombieSpawnCloud(x, y - 2);
  }

  spawnZombie(x: number, y: number): void {
    if (this.model.energy < this.model.zombieCost) return;

    this.model.energy -= this.model.zombieCost;
    this.createZombie(x, y, false);
  }

  spawnAllZombies(x: number, y: number): void {
    const numZombies = Math.min(
      Math.floor(this.model.energy / this.model.zombieCost),
      100
    );
    for (let i = 0; i < numZombies; i++) {
      this.spawnZombie(
        x + 4 * (Math.random() - 1),
        y + 4 * (Math.random() - 1)
      );
    }
  }

  damageZombie(zombie: Creature, damage: number, human: Human): void {
    if (zombie.graveyard) {
      this.graveyard.damageGraveyard(damage);
      return;
    }
    if (zombie.boneshield) {
      zombie.boneshield--;
      this.bones.newPart(zombie.x, zombie.y, 1);
      return;
    }
    if (this.graveyard.isWithinFence(zombie)) {
      damage *= 0.5;
      this.exclamations.newShield(zombie);
    }
    if (zombie.bloodbornTimer > 0) {
      damage *= 0.5;
      this.exclamations.newShield(zombie);
    }
    if (human && human.flags.infected) {
      damage *= this.model.plagueDmgReduction;
    }
    zombie.health -= damage * this.model.runeEffects.damageReduction;
    this.setSpeedMultiplier(zombie);
    if (zombie.flags.burning) {
      zombie.speedMultiplier = this.model.burningSpeedMod;
    }
    this.blood.newSplatter(zombie.x, zombie.y);
    if (zombie.health <= 0 && !zombie.flags.dead) {
      this.bones.newBones(zombie.x, zombie.y);
      zombie.flags.dead = true;
      if (zombie.flags.golem) {
        if (this.refundChance > 0) {
          this.model.sendMessage("Golem Refunded!");
          this.creatureFactory.refundParts(zombie, this.refundChance);
        }
      }
      if (Math.random() < this.model.infectedBlastChance) {
        this.causePlagueExplosion(zombie, zombie.maxHealth * 0.2, true);
      }
      zombie.textures = zombie.deadTexture;
      zombie.gotoAndStop(0);
      if (Math.random() < this.model.brainRecoverChance) {
        this.model.addBrains(1);
      }
    }
    if (human && this.model.runeEffects.damageReflection > 0) {
      this.humans.damageHuman(
        human,
        damage * this.model.runeEffects.damageReflection
      );
    }
  }

  causePlagueExplosion(
    zombie: GameObject,
    damage: number,
    killZombie = true,
    detonate = false
  ): void {
    const explosionRadius = detonate ? 75 : 50;
    this.blood.newPlagueSplatter(zombie.x, zombie.y);
    if (detonate) {
      this.blasts.newDetonateBlast(zombie.x, zombie.y - 4);
    } else {
      this.blasts.newZombieBlast(zombie.x, zombie.y - 4);
    }
    if (killZombie) {
      zombie.visible = false;
      characterContainer.removeChild(zombie);
    }
    for (let i = 0; i < this.aliveHumans.length; i++) {
      if (Math.abs(this.aliveHumans[i].x - zombie.x) < explosionRadius) {
        if (Math.abs(this.aliveHumans[i].y - zombie.y) < explosionRadius) {
          if (
            this.fastDistance(
              zombie.x,
              zombie.y,
              this.aliveHumans[i].x,
              this.aliveHumans[i].y
            ) < explosionRadius
          ) {
            this.inflictPlague(this.aliveHumans[i]);
            this.humans.damageHuman(this.aliveHumans[i], damage);
          }
        }
      }
    }
    if (this.model.blastHealing > 0) {
      const healingDone = damage * this.model.blastHealing;
      for (let i = 0; i < this.aliveZombies.length; i++) {
        if (Math.abs(this.aliveZombies[i].x - zombie.x) < explosionRadius) {
          if (Math.abs(this.aliveZombies[i].y - zombie.y) < explosionRadius) {
            if (
              this.fastDistance(
                zombie.x,
                zombie.y,
                this.aliveZombies[i].x,
                this.aliveZombies[i].y
              ) < explosionRadius
            ) {
              this.healZombie(this.aliveZombies[i], healingDone);
            }
          }
        }
      }
    }
  }

  partitionInsert(partition: Creature[][][], zombie: Creature): void {
    const x = Math.round(zombie.x / 10);
    const y = Math.round(zombie.y / 10);
    if (!partition[x]) partition[x] = [];
    if (!partition[x][y]) partition[x][y] = [];
    partition[x][y].push(zombie);
  }

  partitionGetNeighbours(zombie: Creature): Creature[] {
    const neighbours: Creature[] = [];
    const x = Math.round(zombie.x / 10);
    const y = Math.round(zombie.y / 10);
    for (let i = x - 1; i <= x + 1; i++) {
      if (this.zombiePartition[i]) {
        for (let j = y - 1; j <= y + 1; j++) {
          if (this.zombiePartition[i][j]) {
            neighbours.push(...this.zombiePartition[i][j]);
          }
        }
      }
    }
    return neighbours;
  }

  reactionTime = 0;
  graveyardAttackers = [];

  update(timeDiff: number): void {
    this.maxSpeed = this.model.zombieSpeed;
    if (this.detonate) {
      this.maxSpeed *= 1.5;
    }
    this.reactionTime = Math.max(0.2, this.aliveZombies.length / 2000);
    const aliveZombies = [];
    const zombiePartition = [];
    this.aliveHumans = this.humans.aliveHumans;
    this.graveyardAttackers = this.humans.graveyardAttackers;
    if (this.gigamutagen > 0) {
      this.gigamutationTimer -= timeDiff;
    }
    for (let i = 0; i < this.zombies.length; i++) {
      if (this.zombies[i].visible) {
        this.updateZombie(this.zombies[i], timeDiff);
        if (!this.zombies[i].flags.dead) {
          aliveZombies.push(this.zombies[i]);
          this.partitionInsert(zombiePartition, this.zombies[i]);
        }
      }
    }
    this.model.zombieCount = aliveZombies.length;
    this.aliveZombies = aliveZombies;
    this.zombiePartition = zombiePartition;
    if (
      this.model.energy >= this.model.zombieCost &&
      this.model.currentState == this.model.states.playingLevel
    ) {
      this.zombieCursor.visible = !this.mouseOutOfBounds;
      if (KeysPressed.shift && !this.mouseOutOfBounds) {
        this.zombieCursorText.visible = true;
        const numZombies = Math.min(
          Math.floor(this.model.energy / this.model.zombieCost),
          100
        );
        if (this.zombieCursorText.text != numZombies) {
          this.zombieCursorText.text = numZombies;
        }
      } else {
        this.zombieCursorText.visible = false;
      }
    } else {
      this.zombieCursor.visible = false;
    }
  }

  detonateZombie(zombie: Zombie): void {
    if (
      zombie.state === CreatureState.attackingTarget ||
      (this.aliveHumans.length === 0 && Math.random() < 0.05)
    ) {
      this.bones.newBones(zombie.x, zombie.y);
      zombie.flags.dead = true;
      this.causePlagueExplosion(zombie, zombie.maxHealth, true, true);
      if (Math.random() < this.model.brainRecoverChance) {
        this.model.addBrains(1);
      }
    }
  }

  updateZombie(zombie: Zombie, timeDiff: number): void {
    if (zombie.flags.dead) {
      if (!zombie.visible) return;

      zombie.alpha -= this.fadeSpeed * timeDiff;
      if (zombie.alpha < 0) {
        zombie.visible = false;
        characterContainer.removeChild(zombie);
      }
      return;
    }
    if (zombie.mod === 1 && this.gigamutationTimer < 0) {
      zombie.mod = 10;
      zombie.scaling *= 1.5;
      zombie.scale.set(zombie.scaling, zombie.scaling);
      zombie.maxHealth *= 10;
      zombie.health *= 10;
      this.gigamutationTimer = this.gigamutagen;
      this.smoke.newZombieSpawnCloud(zombie.x, zombie.y - 2);
    }
    zombie.bloodbornTimer -= timeDiff;
    zombie.timer.attack -= timeDiff;
    zombie.timer.scan -= timeDiff;

    if (this.model.runeEffects.healthRegen > 0) {
      this.updateZombieRegen(zombie, timeDiff);
    }

    if (this.detonate) {
      this.detonateZombie(zombie);
    }

    if (zombie.flags.burning) this.updateBurns(zombie, timeDiff);

    if ((!zombie.target || zombie.target.flags.dead) && zombie.timer.scan < 0) {
      zombie.state = CreatureState.lookingForTarget;
    }

    switch (zombie.state) {
      case CreatureState.lookingForTarget:
        this.searchClosestTarget(zombie.target ?? zombie);
        if (!zombie.target || zombie.target.flags.dead)
          this.assignRandomTarget(zombie);
        if (zombie.target) {
          zombie.state = CreatureState.movingToTarget;
        }
        break;

      case CreatureState.movingToTarget: {
        const distanceToHumanTarget = this.fastDistance(
          zombie.position.x,
          zombie.position.y,
          zombie.target.x,
          zombie.target.y
        );

        if (distanceToHumanTarget < this.attackDistance) {
          zombie.state = CreatureState.attackingTarget;
          break;
        }
        if (
          zombie.timer.attack < 0 &&
          distanceToHumanTarget < this.model.spitDistance
        ) {
          this.bullets.newBullet(
            zombie,
            zombie.target,
            this.model.zombieDamage / 2,
            true
          );
          zombie.timer.attack =
            this.attackSpeed * (1 / this.model.runeEffects.attackSpeed);
        }

        if (
          distanceToHumanTarget > this.attackDistance * 3 &&
          zombie.timer.scan < 0
        ) {
          this.searchClosestTarget(zombie);
        }
        this.updateZombieSpeed(zombie, timeDiff);

        break;
      }
      case CreatureState.attackingTarget: {
        const distanceToTarget = this.fastDistance(
          zombie.position.x,
          zombie.position.y,
          zombie.target.x,
          zombie.target.y
        );
        if (distanceToTarget < this.attackDistance) {
          zombie.scale.x =
            zombie.target.x > zombie.x ? zombie.scaling : -zombie.scaling;
          if (zombie.timer.attack < 0) {
            this.humans.damageHuman(
              zombie.target,
              this.calculateDamage(zombie)
            );
            if (zombie.flags.dog) {
              zombie.target.timer.dogStun = 1;
            }
            if (Math.random() < this.model.infectedBiteChance) {
              this.inflictPlague(zombie.target);
            }
            zombie.timer.attack =
              this.attackSpeed * (1 / this.model.runeEffects.attackSpeed);
            if (zombie.flags.burning) {
              zombie.timer.attack *= 1 / this.model.burningSpeedMod;
            }
          }
          if (distanceToTarget > this.attackDistance / 2) {
            this.updateZombieSpeed(zombie, timeDiff);
          }
        } else {
          zombie.state = CreatureState.movingToTarget;
        }
        break;
      }
    }
  }
  setSpeedMultiplier(zombie: Creature): void {
    if (zombie.flags.burning) {
      zombie.speedMultiplier = this.model.burningSpeedMod;
    } else {
      zombie.speedMultiplier = Math.max(
        Math.min(1, zombie.health / zombie.maxHealth),
        0.4
      );
    }
  }
  updateZombieRegen(zombie: Creature, timeDiff: number): void {
    zombie.regenTimer -= timeDiff;

    if (zombie.regenTimer < 0) {
      zombie.regenTimer = 5;
      if (zombie.health < zombie.maxHealth) {
        zombie.health += zombie.maxHealth * this.model.runeEffects.healthRegen;
        if (zombie.health > zombie.maxHealth) {
          zombie.health = zombie.maxHealth;
        }
        this.setSpeedMultiplier(zombie);
      }
    }
  }

  healZombie(zombie: Creature, healingDone: number): void {
    if (zombie.health < zombie.maxHealth) {
      zombie.health += healingDone;
      this.exclamations.newHealing(zombie);
      if (zombie.health > zombie.maxHealth) {
        zombie.health = zombie.maxHealth;
      }
      this.setSpeedMultiplier(zombie);
    }
  }

  calculateDamage(zombie: Zombie): number {
    let damage = this.model.zombieDamage * zombie.mod;
    if (
      this.model.runeEffects.critChance > 0 &&
      Math.random() < this.model.runeEffects.critChance
    ) {
      damage *= this.model.runeEffects.critDamage;
      spawnCritText(zombie.x, zombie.y, damage);
    }
    if (this.bloodpact > 0) {
      this.model.addBlood(damage * this.bloodpact);
    }
    return damage;
  }

  inflictPlague(human: Human): void {
    if (!human.flags.infected) {
      this.exclamations.newPoison(human);
      human.plagueDamage =
        this.model.zombieDamage / 2 + this.model.plagueDamageMod;
      human.plagueTicks = this.model.plagueticks;
    } else {
      human.plagueDamage +=
        this.model.zombieDamage / 2 + this.model.plagueDamageMod;
      human.plagueTicks = this.model.plagueticks;
    }
    human.flags.infected = true;
  }

  updateBurns(zombie: Creature, timeDiff: number): void {
    zombie.timer.burnTick -= timeDiff;
    zombie.timer.smoke -= timeDiff;

    if (zombie.timer.smoke < 0) {
      this.smoke.newFireSmoke(zombie.x, zombie.y - 14);
      zombie.timer.smoke = this.smokeTimer;
    }

    if (zombie.timer.burnTick < 0) {
      this.damageZombie(zombie, zombie.burnDamage, null);
      zombie.timer.burnTick = this.burnTickTimer;
      this.exclamations.newFire(zombie);
    }
  }

  searchClosestTarget(zombie: Creature | Human): void {
    if (zombie.timer.scan > 0) return;

    zombie.timer.scan = this.scanTime * Math.random();
    let distanceToTarget = 300;

    if (this.model.isBossStage(this.model.level) && Math.random() > 0.3) {
      for (let i = 0; i < this.graveyardAttackers.length; i++) {
        if (
          Math.abs(this.graveyardAttackers[i].x - zombie.x) < distanceToTarget
        ) {
          if (
            Math.abs(this.graveyardAttackers[i].y - zombie.y) < distanceToTarget
          ) {
            const distanceToHuman = this.fastDistance(
              zombie.x,
              zombie.y,
              this.graveyardAttackers[i].x,
              this.graveyardAttackers[i].y
            );
            if (distanceToHuman < distanceToTarget) {
              zombie.target = this.graveyardAttackers[i];
              distanceToTarget = distanceToHuman;
            }
          }
        }
      }
    }

    if (distanceToTarget == 300) {
      distanceToTarget = 10000;
      for (let i = 0; i < this.aliveHumans.length; i++) {
        if (Math.abs(this.aliveHumans[i].x - zombie.x) < distanceToTarget) {
          if (Math.abs(this.aliveHumans[i].y - zombie.y) < distanceToTarget) {
            const distanceToHuman = this.fastDistance(
              zombie.x,
              zombie.y,
              this.aliveHumans[i].x,
              this.aliveHumans[i].y
            );
            if (distanceToHuman < distanceToTarget) {
              zombie.target = this.aliveHumans[i];
              distanceToTarget = distanceToHuman;
            }
          }
        }
      }
    }
  }

  assignRandomTarget(zombie: Creature): void {
    if (this.aliveHumans.length == 0) return;

    const building = this.map.findBuilding(zombie);
    if (building && this.map.isInsidePoi(zombie.x, zombie.y, building, 0)) {
      for (let i = 0; i < this.aliveHumans.length; i++) {
        if (
          this.map.isInsidePoi(
            this.aliveHumans[i].x,
            this.aliveHumans[i].y,
            building,
            0
          )
        ) {
          zombie.target = this.aliveHumans[i];
          return;
        }
      }
    }
    zombie.target = getRandomElementFromArray(this.aliveHumans, Math.random());
  }

  dotProduct(x: number, y: number): number {
    return x * x + y * y;
  }

  updateZombieSpeed(zombie: Zombie, timeDiff: number): void {
    if (zombie.timer.dogStun && zombie.timer.dogStun > 0) {
      zombie.timer.dogStun -= timeDiff;
      return;
    }

    if (!zombie.timer.target || !zombie.targetVector) {
      zombie.timer.target = 0;
    }
    zombie.timer.target -= timeDiff;
    if (zombie.timer.target <= 0) {
      zombie.targetVector = this.map.howDoIGetToMyTarget(zombie, zombie.target);
      zombie.timer.target = this.reactionTime;
    }

    if (this.model.gameSpeed > 1 || zombie.flags.dog) {
      const dogSpeed = zombie.flags.dog ? 1.5 : 1;
      const zombieMaxSpeed = Math.max(
        this.maxSpeed * zombie.speedMultiplier * dogSpeed,
        8
      );
      zombie.xSpeed = zombie.targetVector.x * zombieMaxSpeed;
      zombie.ySpeed = zombie.targetVector.y * zombieMaxSpeed;
    } else {
      const factor = this.maxSpeed * 5 * timeDiff;

      zombie.xSpeed += zombie.targetVector.x * factor;
      zombie.ySpeed += zombie.targetVector.y * factor;

      const speedMagnitudeSq = this.dotProduct(zombie.xSpeed, zombie.ySpeed);
      const zombieMaxSpeedSq = Math.pow(
        Math.max(this.maxSpeed * zombie.speedMultiplier, 8),
        2
      );
      if (speedMagnitudeSq > zombieMaxSpeedSq) {
        zombie.xSpeed *= zombieMaxSpeedSq / speedMagnitudeSq;
        zombie.ySpeed *= zombieMaxSpeedSq / speedMagnitudeSq;
      }
    }

    let newPosition = {
      x: zombie.position.x + zombie.xSpeed * timeDiff,
      y: zombie.position.y + zombie.ySpeed * timeDiff,
    };

    zombie.turnTimer -= timeDiff;

    if (zombie.turnTimer < 0) {
      zombie.turnTimer = 0.5;
      if (!this.isSpaceToMove(zombie, newPosition.x, newPosition.y)) {
        if (Math.random() > 0.5) {
          const newSpeed = {
            x: -zombie.ySpeed / 2 + zombie.xSpeed / 2,
            y: zombie.xSpeed / 2 + zombie.ySpeed / 2,
          }; // 45 degrees
          zombie.xSpeed = newSpeed.x;
          zombie.ySpeed = newSpeed.y;
        } else {
          const newSpeed = {
            x: zombie.ySpeed / 2 + zombie.xSpeed / 2,
            y: -zombie.xSpeed / 2 + zombie.ySpeed / 2,
          }; // 45 degrees
          zombie.xSpeed = newSpeed.x;
          zombie.ySpeed = newSpeed.y;
        }
        newPosition = {
          x: zombie.position.x + zombie.xSpeed * timeDiff,
          y: zombie.position.y + zombie.ySpeed * timeDiff,
        };
      }
    }

    const collision = this.map.checkCollisions(zombie.position, newPosition);
    if (collision) {
      if (collision.x) {
        zombie.xSpeed = 0;
      }
      if (collision.y) {
        zombie.ySpeed = 0;
      }
      newPosition = {
        x: zombie.position.x + zombie.xSpeed * timeDiff,
        y: zombie.position.y + zombie.ySpeed * timeDiff,
      };
      if (collision.x) {
        newPosition.x = collision.validX;
      }
      if (collision.y) {
        newPosition.y = collision.validY;
      }
    }
    zombie.position.set(newPosition.x, newPosition.y);
    zombie.zIndex = zombie.position.y;
    zombie.scale.x = zombie.xSpeed > 0 ? zombie.scaling : -zombie.scaling;
  }

  spaceNeeded = 3;

  isSpaceToMove(zombie: Zombie, x: number, y: number): boolean {
    const neighbours = this.partitionGetNeighbours(zombie);
    for (let i = 0; i < neighbours.length; i++) {
      if (
        neighbours[i].health >= zombie.health &&
        neighbours[i].zombieId != zombie.zombieId &&
        Math.abs(neighbours[i].x - x) < this.spaceNeeded
      ) {
        if (
          Math.abs(neighbours[i].y - y) < this.spaceNeeded &&
          Math.abs(neighbours[i].x - x) < this.spaceNeeded
        ) {
          return (
            this.fastDistance(x, y, neighbours[i].x, neighbours[i].y) >
            this.fastDistance(
              zombie.x,
              zombie.y,
              neighbours[i].x,
              neighbours[i].y
            )
          );
        }
      }
    }
    return true;
  }
}
