import {
  Creature,
  CreatureState,
  spawnCritText,
} from "./classes/creatureclasses";
import { CharacterFlags } from "./classes/gameobject";
import { Human as Creature, Human } from "./classes/humanclasses";
import {
  characterContainer,
  GameModel,
  Graveyard,
  ZmMap,
  Spells,
  PrestigePoints,
  Smoke,
  Zombies,
  Upgrades,
  Blood,
  Humans,
  fastDistance,
  magnitude,
  getRandomElementFromArray,
  formatWhole,
  Bones,
  Blasts,
  Exclamations,
  Bullets,
  PartFactory,
} from "./internal";

class SkeletonCharacter extends Creature {
  boneshieldTimer = 3;
  boneshield = 0;
  boneshieldContainer = new BoneshieldContainer();
}
class Boneshield extends PIXI.Sprite {
  speed = { x: 0, y: 0 };
  flying = false;
}
class BoneshieldContainer extends PIXI.Container {
  spacing = (Math.PI * 2) / 10;
  bones: Boneshield[] = [];
  texture: PIXI.Texture | null = null;

  getTexture(): PIXI.Texture {
    if (this.texture) {
      return this.texture;
    }
    const canv = document.createElement("canvas");
    canv.width = 4;
    canv.height = 1;
    const ctx = canv.getContext("2d")!;
    ctx.fillStyle = "#ddd";
    ctx.fillRect(0, 0, 4, 1);
    this.texture = PIXI.Texture.from(canv);
    return this.texture;
  }

  getBone(): Boneshield {
    const bone = new Boneshield(this.getTexture());
    bone.anchor.set(0.5, 20);
    this.addChild(bone);
    this.bones.push(bone);
    return bone;
  }

  update(boneshield: number): void {
    if (boneshield > this.bones.length) {
      this.getBone().rotation = this.spacing * this.bones.length;
    }
    for (let i = 0; i < this.bones.length; i++) {
      this.bones[i].visible = i < boneshield;
    }
  }
}

export class Skeleton {
  private static instance: Skeleton;
  partFactory: PartFactory;
  constructor() {
    if (Skeleton.instance) return Skeleton.instance;
    Skeleton.instance = this;
  }
  map: ZmMap;
  model: GameModel;
  graveyard: Graveyard;
  spells: Spells;
  smoke: Smoke;
  upgrades: Upgrades;
  humans: Humans;
  zombies: Zombies;
  prestigePoints: PrestigePoints;
  exclamations: Exclamations;
  bullets: Bullets;
  bones: Bones;
  blasts: Blasts;
  blood: Blood;
  skeletons: SkeletonCharacter[] = [];
  aliveSkeletons: SkeletonCharacter[] = [];
  discardedSprites: SkeletonCharacter[] = [];
  aliveHumans = [];
  scaling = 1;
  moveTargetDistance = 15;
  attackDistance = 25;
  attackSpeed = 3;
  targetDistance = 100;
  fadeSpeed = 0.1;
  currId = 1;
  scanTime = 3;
  spawnTimer = 0;
  respawnTime = 10;
  moveSpeed = 40;
  lastKillingBlow = 0;
  randomSpells = [];
  lootChance = 0.001;
  spellTimer = 3;
  textures = {
    set: false,
    up: [] as PIXI.Texture[],
    down: [] as PIXI.Texture[],
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
  damageZombie = null;
  searchClosestTarget = null;
  updateBurns = null;
  updateZombieRegen = null;
  causePlagueExplosion = null;
  inflictPlague = null;
  healZombie = null;
  setSpeedMultiplier = null;
  storageName = "incremancerskele";
  talentsStorageName = "incremancertalents";
  persistent = {
    xpRate: 0,
    skeletons: 0,
    level: 1,
    xp: 0,
    items: [] as Loot[],
    currItemId: 0,
    talentReset: false,
  };
  talents: number[] = [];
  talentPoints = 0;
  killingBlowParts = 0;
  lootChanceMod = 1;
  increaseChance = 0;
  darkorb = 0;
  darkorbTimer = 0;
  boneshield = 0;

  getUsedPoints(): number {
    return this.talents.reduce((prev, curr) => prev + curr, 0);
  }
  getAvailablePoints(): number {
    return this.talentPoints - this.getUsedPoints();
  }
  xpForNextLevel(): number {
    return 1000 * Math.pow(this.persistent.level, 2);
  }

  addXp(xp: number): void {
    if (this.isAlive()) {
      this.persistent.xp += xp * this.persistent.xpRate;
      if (this.persistent.xp > this.xpForNextLevel()) {
        this.persistent.xp -= this.xpForNextLevel();
        this.persistent.level++;
        this.upgrades.applyUpgrades();
        this.model.sendMessage(
          "Skeleton Champion reached level " + this.persistent.level + "!"
        );
        const skeletonElement = document.getElementById("skeleton");
        if (skeletonElement) {
          skeletonElement.classList.toggle("levelup");
          setTimeout(function () {
            skeletonElement.classList.toggle("levelup");
          }, 3000);
        }
      }
    }
  }

  isAlive(): boolean {
    for (let i = 0; i < this.skeletons.length; i++) {
      if (!this.skeletons[i].flags.dead) {
        return true;
      }
    }
    return false;
  }

  applyUpgrades(): void {
    if (this.persistent.skeletons > 0) {
      this.applyItemUpgrades();
      const multiplier = 1 + this.persistent.level / 100;
      this.model.bloodPCMod *= multiplier;
      this.model.brainsPCMod *= multiplier;
      this.model.bonesPCMod *= multiplier;
      this.model.partsPCMod *= multiplier;
      this.model.zombieDamagePCMod *= multiplier;
      this.model.zombieHealthPCMod *= multiplier;
    }
  }

  acceptOffer(): void {
    this.model.persistentData.trophies = [];

    if (this.persistent.skeletons < 1) {
      this.persistent.skeletons = 1;
      this.persistent.xpRate = 1;
      this.model.sendMessage("Skeleton Champion joins the fight!");
    } else {
      this.persistent.xpRate *= 2;
    }
    this.upgrades.applyUpgrades();
    this.model.saveData();
  }

  populate(): void {
    this.model = GameModel.getInstance();
    this.map = new ZmMap();
    this.graveyard = new Graveyard();
    this.exclamations = new Exclamations();
    this.bullets = new Bullets();
    this.spells = new Spells();
    this.smoke = new Smoke();
    this.upgrades = new Upgrades();
    this.humans = new Humans();
    this.zombies = new Zombies();
    this.prestigePoints = new PrestigePoints();
    this.partFactory = new PartFactory();
    this.bones = new Bones();
    this.blasts = new Blasts();
    this.blood = new Blood();
    this.damageZombie = this.zombies.damageZombie;
    this.searchClosestTarget = this.zombies.searchClosestTarget;
    this.updateBurns = this.zombies.updateBurns;
    this.updateZombieRegen = this.zombies.updateZombieRegen;
    this.causePlagueExplosion = this.zombies.causePlagueExplosion;
    this.inflictPlague = this.zombies.inflictPlague;
    this.healZombie = this.zombies.healZombie;
    this.setSpeedMultiplier = this.zombies.setSpeedMultiplier;
    if (!this.textures.set) {
      this.textures.down = [];
      this.textures.up = [];
      this.textures.right = [];
      this.textures.dead = [];
      for (let i = 0; i < 3; i++) {
        this.textures.down.push(PIXI.Texture.from("skeleton" + i + ".png"));
      }
      for (let i = 3; i < 6; i++) {
        this.textures.up.push(PIXI.Texture.from("skeleton" + i + ".png"));
      }
      for (let i = 6; i < 9; i++) {
        this.textures.right.push(PIXI.Texture.from("skeleton" + i + ".png"));
      }
      this.textures.dead.push(PIXI.Texture.from("skeleton9.png"));
      this.textures.set = true;
    }

    // reset creature position at start of level
    const skeletons = [];
    for (let i = 0; i < this.skeletons.length; i++) {
      if (!this.skeletons[i].flags.dead) {
        skeletons.push(this.skeletons[i]);
        this.skeletons[i].x = this.graveyard.sprite.x;
        this.skeletons[i].zIndex = this.skeletons[i].y =
          this.graveyard.sprite.y + (this.graveyard.level > 2 ? 8 : 0);
        this.skeletons[i].target = null;
        this.skeletons[i].state = CreatureState.lookingForTarget;
        this.skeletons[i].timer.scan = 0;
      } else {
        this.discardedSprites.push(this.skeletons[i]);
        characterContainer.removeChild(this.skeletons[i]);
      }
    }
    this.skeletons = skeletons;
    this.aliveSkeletons = [];

    this.lootChance = 0.001;
    if (this.model.level < this.persistent.level) this.lootChance *= 0.5;
    if (this.model.level > this.persistent.level * 2) this.lootChance *= 1.5;
  }

  spawnCreature(): void {
    let creature: SkeletonCharacter;
    if (this.discardedSprites.length > 0) {
      creature = this.discardedSprites.pop();
      creature.textures = this.textures.down;
    } else {
      creature = new SkeletonCharacter(this.textures.down);
      creature.addChild(creature.boneshieldContainer);
      creature.boneshieldContainer.position.set(0, -16);
    }
    creature.tint = 0xeeeeee;
    creature.immuneToBurns = false;
    creature.bulletReflect = 0;
    creature.zombie = true;
    creature.textureSet = this.textures;
    creature.deadTexture = this.textures.dead;
    creature.currentDirection = this.directions.down;
    creature.flags = new CharacterFlags();
    creature.burnDamage = 0;
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
    creature.maxHealth = creature.health = this.model.zombieHealth * 10;
    creature.attackDamage = this.model.zombieDamage * 10;
    creature.regenTimer = 5;
    creature.state = CreatureState.lookingForTarget;
    creature.scaling = this.scaling;
    creature.scale.set(creature.scaling, creature.scaling);
    creature.timer.ability = Math.random() * 4;
    creature.timer.attack = 0;
    creature.timer.scan = 0;
    creature.timer.burnTick = this.burnTickTimer;
    creature.timer.smoke = this.smokeTimer;
    creature.xSpeed = 0;
    creature.ySpeed = 0;
    creature.speedMultiplier = 1;
    creature.maxSpeed = this.moveSpeed;
    creature.play();
    creature.zombieId = this.currId++;
    this.skeletons.push(creature);
    characterContainer.addChild(creature);
    this.smoke.newZombieSpawnCloud(creature.x, creature.y - 2);
  }

  skeletonTimer(): number {
    if (this.aliveSkeletons.length < this.persistent.skeletons) {
      return this.spawnTimer;
    }
    return 0;
  }

  aliveZombies: Creature[] = [];
  graveyardAttackers = [];

  update(timeDiff: number): void {
    this.aliveHumans = this.humans.aliveHumans;
    this.graveyardAttackers = this.humans.graveyardAttackers;
    this.aliveZombies = this.zombies.aliveZombies;

    this.aliveSkeletons = [];

    this.spellTimer -= timeDiff;

    for (let i = 0; i < this.skeletons.length; i++) {
      if (this.skeletons[i].visible) {
        this.updateCreature(this.skeletons[i], timeDiff);
        if (!this.skeletons[i].flags.dead) {
          this.aliveZombies.push(this.skeletons[i]);
          this.aliveSkeletons.push(this.skeletons[i]);
        }
      }
    }

    if (this.aliveSkeletons.length < this.persistent.skeletons) {
      this.spawnTimer -= timeDiff;
      if (this.spawnTimer < 0) {
        this.spawnCreature();
        this.spawnTimer = this.respawnTime;
      }
    }
    this.lastKillingBlow -= timeDiff;
    if (
      this.model.persistentData.autoSellGear == true &&
      this.aliveSkeletons.length > 0
    ) {
      this.destroyAllItems();
    }
    if (
      this.model.persistentData.autoSellGearLegendary == true &&
      this.aliveSkeletons.length > 0
    ) {
      this.destroyAllItemsLegendary();
    }
  }

  updateCreature(creature: SkeletonCharacter, timeDiff: number): void {
    if (creature.flags.dead) {
      if (!creature.visible) return;

      creature.alpha -= this.fadeSpeed * timeDiff;
      if (creature.alpha < 0) {
        creature.visible = false;
        characterContainer.removeChild(creature);
      }
      return;
    }

    if (this.boneshield > 0 && creature.boneshield < this.boneshield) {
      creature.boneshieldTimer -= timeDiff;
      if (creature.boneshieldTimer < 0) {
        creature.boneshieldTimer = 10 / this.boneshield;
        creature.boneshield++;
      }
    }
    if (this.boneshield) {
      creature.boneshieldContainer.visible = true;
      creature.boneshieldContainer.update(creature.boneshield);
      creature.boneshieldContainer.rotation += timeDiff;
    } else {
      creature.boneshieldContainer.visible = false;
    }
    if (this.darkorb > 0) {
      this.darkorbTimer -= timeDiff;
      if (
        this.darkorbTimer < 0 &&
        creature.target &&
        !creature.target.flags.dead
      ) {
        console.log("shot darkorb");
        this.darkorbTimer = this.darkorb;
        this.bullets.newBullet(
          creature,
          creature.target,
          this.calculateDamage(creature),
          false,
          false,
          false,
          true
        );
      }
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
      // do abilities
    }

    if (!(creature.target && !creature.target.flags.dead)) {
      creature.state = CreatureState.lookingForTarget;
      creature.timer.target = 0;
      creature.timer.scan = 0;
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
          if (creature.timer.attack < 0 && !creature.target.flags.dead) {
            this.humans.damageHuman(
              creature.target,
              this.calculateDamage(creature)
            );
            if (creature.target.flags.dead) {
              this.killingBlow(creature.target);
            }
            creature.timer.attack =
              this.attackSpeed * (1 / this.model.runeEffects.attackSpeed);
            if (creature.flags.burning) {
              creature.timer.attack *= 1 / this.model.burningSpeedMod;
            }
            if (this.randomSpells.length > 0) {
              for (let i = 0; i < this.randomSpells.length; i++) {
                if (
                  this.spellTimer < 0 &&
                  Math.random() < 0.07 + this.increaseChance
                ) {
                  this.spells.castSpellNoMana(this.randomSpells[i]);
                  this.spellTimer = 3;
                }
              }
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

  killingBlow(creature: Human) {
    if (this.killingBlowParts) {
      this.model.persistentData.parts +=
        this.killingBlowParts * this.partFactory.factoryStats().partsPerSec;
    }
    if (this.lastKillingBlow <= 0) {
      this.model.addPrestigePoints(this.persistent.level);
      this.lastKillingBlow = 20;
      this.prestigePoints.newPart(creature.x, creature.y);
    }
  }

  orbHit(creature: Human) {
    if (creature.flags.dead) {
      this.killingBlow(creature);
    }
    if (this.randomSpells.length > 0) {
      for (let i = 0; i < this.randomSpells.length; i++) {
        if (this.spellTimer < 0 && Math.random() < 0.07) {
          this.spells.castSpellNoMana(this.randomSpells[i]);
          this.spellTimer = 3;
        }
      }
    }
  }

  incinerate(): void {
    let creature: Creature;
    for (let i = 0; i < this.skeletons.length; i++) {
      if (this.skeletons[i].visible) {
        creature = this.skeletons[i];
      }
    }
    if (creature)
      for (let i = 0; i < this.aliveHumans.length; i++) {
        if (Math.abs(this.aliveHumans[i].x - creature.x) < 200) {
          if (Math.abs(this.aliveHumans[i].y - creature.y) < 200) {
            this.humans.burnHuman(this.aliveHumans[i], creature.attackDamage);
          }
        }
      }
  }

  getCreatureDirection(creature: SkeletonCharacter): number {
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

  changeTextureDirection(creature: SkeletonCharacter): void {
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

  updateCreatureSpeed(creature: SkeletonCharacter, timeDiff: number): void {
    if (creature.timer.dogStun > 0) {
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

    const distanceToTarget =
      4 *
      this.fastDistance(
        creature.x,
        creature.y,
        creature.target.x,
        creature.target.y
      );
    const speedMod = Math.min(
      creature.speedMultiplier * creature.maxSpeed,
      distanceToTarget
    );

    creature.xSpeed = creature.targetVector.x * speedMod;
    creature.ySpeed = creature.targetVector.y * speedMod;

    creature.position.x += creature.xSpeed * timeDiff;
    creature.position.y += creature.ySpeed * timeDiff;
    creature.zIndex = creature.position.y;
    this.changeTextureDirection(creature);
  }

  calculateDamage(creature: SkeletonCharacter): number {
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

  lootPositions = {
    helmet: { id: 1, name: "Helmet" },
    chest: { id: 2, name: "Chest" },
    legs: { id: 3, name: "Legs" },
    gloves: { id: 4, name: "Gloves" },
    boots: { id: 5, name: "Boots" },
    sword: { id: 6, name: "Sword" },
    shield: { id: 7, name: "Shield" },
  };

  rarity = {
    common: 1,
    rare: 2,
    epic: 3,
    legendary: 4,
    ancient: 5,
    divine: 6,
  };

  prefixes = {
    commonQuality: [
      "Wooden",
      "Sturdy",
      "Rigid",
      "Iron",
      "Rusty",
      "Flimsy",
      "Battered",
      "Damaged",
      "Used",
      "Stained",
      "Training",
    ],
    rareQuality: [
      "Steel",
      "Shiny",
      "Polished",
      "Forged",
      "Plated",
      "Bronze",
      "Reinforced",
      "Veteran's",
      "Reliable",
    ],
    epicQuality: [
      "Antique",
      "Ancient",
      "Famous",
      "Bejeweled",
      "Notorious",
      "Historic",
      "Mythical",
      "Extraordinary",
    ],
    legendaryQuality: [
      "Monstrous",
      "Diabolical",
      "Withering",
      "Terrible",
      "Demoniacal",
    ],
    ancientQuality: ["Grim", "Miserable", "Luxurious"],
    divineQuality: ["Divine"],
  };

  stats = {
    respawnTime: { id: 1, scaling: 1 },
    speed: { id: 2, scaling: 1 },
    zombieHealth: { id: 3, scaling: 24 },
    zombieDamage: { id: 4, scaling: 3 },
    zombieSpeed: { id: 5, scaling: 1 },
    harpySpeed: { id: 6, scaling: 1 },
  };

  applyItemUpgrades(): void {
    this.model = GameModel.getInstance();
    this.moveSpeed = 40;
    this.respawnTime = 10;
    this.randomSpells = [];
    this.persistent.items
      .filter((i) => i.q)
      .forEach((item) => {
        item.e.forEach((effect) => {
          switch (effect) {
            case this.stats.respawnTime.id:
              this.respawnTime--;
              break;
            case this.stats.speed.id:
              this.moveSpeed++;
              break;
            case this.stats.zombieHealth.id:
              this.model.zombieHealth +=
                item.l * this.stats.zombieHealth.scaling;
              break;
            case this.stats.zombieDamage.id:
              this.model.zombieDamage +=
                item.l * this.stats.zombieDamage.scaling;
              break;
            case this.stats.zombieSpeed.id:
              this.model.zombieSpeed++;
              break;
            case this.stats.harpySpeed.id:
              this.model.harpySpeed += 10;
          }
        });
        if (item.se)
          item.se.forEach((specialEffect) => {
            this.randomSpells.push(specialEffect);
          });
      });
  }

  getLootName(loot: Loot): string {
    let prefix = "";
    switch (loot.r) {
      case this.rarity.common:
        prefix = this.prefixes.commonQuality[loot.p];
        break;
      case this.rarity.rare:
        prefix = this.prefixes.rareQuality[loot.p];
        break;
      case this.rarity.epic:
        prefix = this.prefixes.epicQuality[loot.p];
        break;
      case this.rarity.legendary:
        prefix = this.prefixes.legendaryQuality[loot.p];
        break;
      case this.rarity.ancient:
        prefix = this.prefixes.ancientQuality[loot.p];
        break;
      case this.rarity.divine:
        prefix = this.prefixes.divineQuality[loot.p];
        break;
    }
    // TODO: future bug fix, add default in case it tries to get an item out of
    // the indexs range
    // while im thinking about it, this would make saves easier to transfer
    // (save game identification, [base, CM, DM]) and allow for the game to not
    // completely explode if something tiny happens
    let suffix = "";
    switch (loot.s) {
      case this.lootPositions.helmet.id:
        suffix = this.lootPositions.helmet.name;
        break;
      case this.lootPositions.chest.id:
        suffix = this.lootPositions.chest.name;
        break;
      case this.lootPositions.legs.id:
        suffix = this.lootPositions.legs.name;
        break;
      case this.lootPositions.gloves.id:
        suffix = this.lootPositions.gloves.name;
        break;
      case this.lootPositions.boots.id:
        suffix = this.lootPositions.boots.name;
        break;
      case this.lootPositions.sword.id:
        suffix = this.lootPositions.sword.name;
        break;
      case this.lootPositions.shield.id:
        suffix = this.lootPositions.shield.name;
        break;
    }
    return prefix + " " + suffix;
  }

  getLootClass(loot: Loot): string {
    switch (loot.r) {
      case this.rarity.common:
        return "common";
      case this.rarity.rare:
        return "rare";
      case this.rarity.epic:
        return "epic";
      case this.rarity.legendary:
        return "legendary";
      case this.rarity.ancient:
        return "ancient";
      case this.rarity.divine:
        return "divine";
    }
  }

  getLootStats(loot: Loot): string[] {
    const stats = [];
    if (loot.e)
      for (let i = 0; i < loot.e.length; i++) {
        switch (loot.e[i]) {
          case this.stats.respawnTime.id:
            stats.push("-1 second respawn time");
            break;
          case this.stats.speed.id:
            stats.push("+1 movement speed");
            break;
          case this.stats.zombieHealth.id:
            stats.push(
              "+" +
                formatWhole(this.stats.zombieHealth.scaling * loot.l) +
                " zombie health"
            );
            break;
          case this.stats.zombieDamage.id:
            stats.push(
              "+" +
                formatWhole(this.stats.zombieDamage.scaling * loot.l) +
                " zombie damage"
            );
            break;
          case this.stats.zombieSpeed.id:
            stats.push("+1 zombie speed");
            break;
          case this.stats.harpySpeed.id:
            stats.push("+10 harpy speed");
            break;
        }
      }

    return stats;
  }

  getSpecialEffects(loot: Loot): string[] {
    const stats = [];
    if (loot.se)
      for (let i = 0; i < loot.se.length; i++) {
        const spell = this.spells.spells.filter((sp) => sp.id == loot.se[i])[0];
        stats.push(
          spell.itemText ||
            "Has a chance to cast " +
              spell.name +
              " when attacking, this does not cost energy or trigger a cooldown"
        );
      }
    return stats;
  }

  testForLoot(): void {
    if (this.persistent.skeletons > 0) {
      if (Math.random() < this.lootChance) {
        const loot = this.generateLoot(this.persistent.level);
        this.model.sendMessage(this.getLootName(loot) + " collected!");
        this.persistent.items.push(loot);
      }
    }
  }

  generateLoot(level: number): Loot {
    const position = Math.round(Math.random() * 6) + 1;
    let rarity = this.rarity.common;
    const specialEffects = [];
    if (Math.random() < this.lootChanceMod * 0.2) {
      rarity = this.rarity.rare;
      if (Math.random() < this.lootChanceMod * 0.2) {
        rarity = this.rarity.epic;
        if (Math.random() < this.lootChanceMod * 0.1) {
          rarity = this.rarity.legendary;
          if (Math.random() < this.lootChanceMod * 0.1) {
            rarity = this.rarity.ancient;
            if (Math.random() < this.lootChanceMod * 0.1) {
              rarity = this.rarity.divine;
            }
          }
        }
      }
    }
    if (rarity >= this.rarity.legendary) {
      const spell = getRandomElementFromArray(
        this.spells.spells,
        Math.random()
      );
      specialEffects.push(spell.id);
    }
    let prefixIndex = 0;
    switch (rarity) {
      case this.rarity.common:
        prefixIndex = Math.floor(
          Math.random() * this.prefixes.commonQuality.length
        );
        break;
      case this.rarity.rare:
        prefixIndex = Math.floor(
          Math.random() * this.prefixes.rareQuality.length
        );
        break;
      case this.rarity.epic:
        prefixIndex = Math.floor(
          Math.random() * this.prefixes.epicQuality.length
        );
        break;
      case this.rarity.legendary:
        prefixIndex = Math.floor(
          Math.random() * this.prefixes.legendaryQuality.length
        );
        break;
      case this.rarity.ancient:
        prefixIndex = Math.floor(
          Math.random() * this.prefixes.ancientQuality.length
        );
        break;
      case this.rarity.divine:
        prefixIndex = Math.floor(
          Math.random() * this.prefixes.divineQuality.length
        );
        break;
    }
    const effects = [
      Math.random() > 0.5
        ? this.stats.zombieHealth.id
        : this.stats.zombieDamage.id,
    ];
    for (let i = 0; i < rarity - 1; i++) {
      // NOTE: needs to be updated IF new item effect added
      let effect = Math.ceil(Math.random() * 6);
      while (effects.indexOf(effect) > -1) {
        effect = Math.ceil(Math.random() * 6);
      }
      effects.push(effect);
    }
    return {
      id: this.persistent.currItemId++,
      l: level,
      s: position,
      r: rarity,
      p: prefixIndex,
      e: effects,
      se: specialEffects,
      q: false,
    };
  }

  destroyItem(item: Loot): void {
    this.addXp(item.l * item.r * 10);
    for (let i = 0; i < this.persistent.items.length; i++) {
      if (this.persistent.items[i].id === item.id) {
        this.persistent.items.splice(i, 1);
      }
    }
  }
  destroyAllItems(): void {
    this.addXp(this.xpForItems() - this.xpForAncient() - this.xpForDivine());
    this.persistent.items = this.persistent.items.filter(
      (i) => i.q || i.r == this.rarity.legendary
    );
  }
  destroyAllItemsLegendary() {
    this.addXp(this.xpForLegendary());
    this.persistent.items = this.persistent.items.filter(
      (i) =>
        i.q ||
        i.r == this.rarity.common ||
        i.r == this.rarity.rare ||
        i.r == this.rarity.epic ||
        i.r == this.rarity.ancient ||
        i.r == this.rarity.divine
    );
  }
  xpForItems(): number {
    let xp = 0;
    this.persistent.items
      .filter((i) => !i.q || i.r != this.rarity.legendary)
      .forEach(function (item) {
        xp += item.l * item.r * 10;
      });
    return xp;
  }
  xpForLegendary() {
    let xp = 0;
    this.persistent.items
      .filter((i) => !i.q && i.r == this.rarity.legendary)
      .forEach(function (item) {
        xp += item.l * item.r * 10;
      });
    return xp;
  }
  xpForAncient() {
    let xp = 0;
    this.persistent.items
      .filter((i) => !i.q && i.r == this.rarity.ancient)
      .forEach(function (item) {
        xp += item.l * item.r * 10;
      });
    return xp;
  }
  xpForDivine() {
    let xp = 0;
    this.persistent.items
      .filter((i) => !i.q && i.r == this.rarity.divine)
      .forEach(function (item) {
        xp += item.l * item.r * 10;
      });
    return xp;
  }
  xpTotal() {
    // NOTE: in the original version, xpForAncient and xpForDivine are not called (-this.xpForAncient)
    // I assume this is a bug, and has been fixed here.
    return this.xpForItems() - this.xpForAncient() - this.xpForDivine();
  }
}

type Loot = {
  id: number;
  l: number;
  s: number;
  r: number;
  p: number;
  e: number[];
  se: number[];
  q: boolean;
};
