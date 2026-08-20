import { Creature } from "./classes/creatureclasses";
import { Human, HumanState, VIPText } from "./classes/humanclasses";
import {
  Blasts,
  Blood,
  Bones,
  Bullets,
  Exclamations,
  Fragments,
  Smoke,
  foregroundContainer,
  gameFieldSize,
  characterContainer,
  GameModel,
  Skeleton,
  Trophies,
  ZmMap,
  Zombies,
  Graveyard,
  fastDistance,
} from "./internal";

export class Humans {
  private static instance: Humans;
  constructor() {
    if (Humans.instance) return Humans.instance;
    Humans.instance = this;
  }

  map: ZmMap;
  gameModel: GameModel;
  blood: Blood;
  smoke: Smoke;
  bones: Bones;
  zombies: Zombies;
  skeleton: Skeleton;
  blasts: Blasts;
  fragments: Fragments;
  trophies: Trophies;
  exclamations: Exclamations;
  bullets: Bullets;
  police: Police;
  army: Army;
  tanks: Tanks;
  maxWalkSpeed = 15;
  maxRunSpeed = 35;
  minSecondsTostand = 1;
  maxSecondsToStand = 60; // 60
  chanceToStayInCurrentBuilding = 0.95; // 0.95
  textures = [];
  doctorTextures = [];
  doctorDeadTexture: PIXI.Texture[];
  humans: Human[] = [];
  discardedHumans: Human[] = [];
  aliveHumans: Human[] = [];
  graveyardAttackers = [];
  humansPerLevel = 50; // 50
  maxHumans = 1000; // 1000
  scaling = 2;
  visionDistance = 60;
  vipEscaping = false;
  vip: Human;
  fleeChancePerZombie = 0.1;
  fleeTime = 10;
  scanTime = 3;
  attackDistance = 20;
  moveTargetDistance = 3;
  attackSpeed = 2;
  attackDamage = 5;
  fadeSpeed = 0.1;
  plagueTickTimer = 5;
  healTickTimer = 5;
  burnTickTimer = 5;
  smokeTimer = 0.3;
  fastDistance = fastDistance;
  frozen = false;
  pandemic = false;

  graveYardPosition = null;

  randomSecondsToStand(): number {
    return (
      this.minSecondsTostand +
      Math.random() * (this.maxSecondsToStand - this.minSecondsTostand)
    );
  }

  vipText: VIPText;

  damageHuman(human: Human, damage: number): void {
    this.gameModel.addBlood(Math.round(damage / 3));
    human.health -= damage;
    human.timer.scan = 0;
    if (!human.flags.tank) {
      this.blood.newSplatter(human.x, human.y);
      human.speedMod = Math.max(
        Math.min(1, human.health / human.maxHealth),
        0.25
      );
    } else {
      this.fragments.newPart(human.x, human.y - 18, 0x7b650e);
    }
    if (human.health <= 0 && !human.flags.dead) {
      this.bones.newBones(human.x, human.y);
      human.flags.dead = true;
      this.gameModel.addBrains(1);
      this.skeleton.addXp(this.gameModel.level);
      this.skeleton.testForLoot();

      if (human.flags.tank) {
        this.blasts.newDroneBlast(human.x, human.y - 5);
        this.fragments.newFragmentExplosion(human.x, human.y - 5, 0x7b650e);
        human.visible = false;
      } else {
        human.textures = human.deadTexture;
      }

      if (human.flags.vip) {
        this.vipText.visible = false;
        this.trophies.trophyAquired(this.gameModel.level);
        setTimeout(() => {
          this.vipEscaping = false;
        }, 1000);
      }
    }
    if (!this.army.assaultStarted) {
      if (
        Math.random() > 0.9 &&
        this.gameModel.isBossStage(this.gameModel.level)
      ) {
        this.army.assaultStarted = true;
        this.gameModel.sendMessage("The assault has begun!");
      }
    }
  }

  updateBurns(human: Human, timeDiff: number): void {
    human.timer.burnTick -= timeDiff;
    human.timer.smoke -= timeDiff;

    if (human.timer.smoke < 0) {
      this.smoke.newFireSmoke(human.x, human.y - 14);
      human.timer.smoke = this.smokeTimer;
    }

    if (human.timer.burnTick < 0) {
      this.damageHuman(human, human.burnDamage);
      human.timer.burnTick = this.burnTickTimer;
      this.exclamations.newFire(human);
    }
  }

  assignRandomTarget(human: Human): void {
    if (
      Math.random() > this.chanceToStayInCurrentBuilding ||
      human.timer.flee > 0
    ) {
      human.currentPoi = this.map.getRandomBuilding();
    }
    human.target = this.map.randomPositionInBuilding(human.currentPoi);
    human.maxSpeed =
      human.timer.flee > 0 ? this.maxRunSpeed : this.maxWalkSpeed;
    human.xSpeed = 0;
    human.ySpeed = 0;
  }

  getMaxNpcs(): number {
    return Math.min(this.humansPerLevel * this.gameModel.level, this.maxHumans);
  }

  getMaxHumans(): number {
    if (this.gameModel.isBossStage(this.gameModel.level)) {
      return 0;
    }
    return (
      this.getMaxNpcs() - (this.police.police.length + this.army.armymen.length)
    );
  }

  getMaxDoctors(): number {
    if (this.gameModel.level < 18) return 0;

    return Math.min(Math.round(0.7 * this.gameModel.level), 75);
  }

  getTorchChance(): number {
    if (this.gameModel.level < 10) return 0;

    return Math.min(this.gameModel.level - 10, 40) * 0.02;
  }

  getMaxHealth(level: number): number {
    if (level < 7) {
      return (level + 4) * 10;
    }
    if (level < 12) {
      return (level - 1) * 20;
    }
    if (level < 16) {
      return (level - 3) * 25;
    }
    if (level < 29) {
      return (level - 9) * 50;
    }
    if (level < 49) {
      return (level - 19) * 100;
    }
    if (level < 64) {
      return (level - 39) * 300;
    }
    if (level < 85) {
      return (level - 49) * 500;
    }
    if (level > 499) {
      return 8500000 * Math.pow(1.03, level - 499);
    }

    return 17800 * Math.pow(1.015, level - 84);
  }

  getAttackDamage(): void {
    if (this.gameModel.level == 1) {
      this.attackDamage = 2;
      return;
    }
    if (this.gameModel.level == 2) {
      this.attackDamage = 4;
      return;
    }
    if (this.gameModel.level == 3) {
      this.attackDamage = 5;
      return;
    }
    this.attackDamage = Math.round(
      this.getMaxHealth(this.gameModel.level) / 10
    );
  }

  setupVipText(human: Human): void {
    if (!this.vipText) {
      this.vipText = new VIPText("VIP", {
        fontFamily: "sans-serif",
        fontSize: 64,
        fill: "#FC0",
        stroke: "#000",
        strokeThickness: 5,
        align: "center",
      });
      this.vipText.anchor.set(0.5, 1);
      this.vipText.scale.x = 0.25;
      this.vipText.scale.y = 0.25;
      foregroundContainer.addChild(this.vipText);
    }
    this.vipText.visible = true;
    this.vipText.human = human;
    this.vipText.yOffset = -20;
    this.vipText.x = human.x;
    this.vipText.y = human.y + this.vipText.yOffset;
  }

  escapeTarget: { x: number; y: number };

  populate(): void {
    this.map = new ZmMap();
    this.zombies = new Zombies();
    this.gameModel = GameModel.getInstance();
    this.blood = new Blood();
    this.smoke = new Smoke();
    this.bones = new Bones();
    this.skeleton = new Skeleton();
    this.blasts = new Blasts();
    this.fragments = new Fragments();
    this.trophies = new Trophies();
    this.exclamations = new Exclamations();
    this.bullets = new Bullets();
    this.police = new Police();
    this.army = new Army();
    this.tanks = new Tanks();
    this.map.populatePois();

    if (this.textures.length == 0) {
      for (let i = 0; i < 6; i++) {
        const animated = [];
        for (let j = 0; j < 3; j++) {
          animated.push(
            PIXI.Texture.from("human" + (i + 1) + "_" + (j + 1) + ".png")
          );
        }
        this.textures.push({
          animated: animated,
          dead: [PIXI.Texture.from("human" + (i + 1) + "_dead.png")],
        });
      }
    }
    if (this.doctorTextures.length == 0) {
      for (let i = 0; i < 3; i++) {
        this.doctorTextures.push(
          PIXI.Texture.from("doctor" + (i + 1) + ".png")
        );
      }
      this.doctorDeadTexture = [PIXI.Texture.from("doctor4.png")];
    }

    if (this.humans.length > 0) {
      for (let i = 0; i < this.humans.length; i++) {
        characterContainer.removeChild(this.humans[i]);
        this.humans[i].stop();
      }
      this.discardedHumans = this.humans.slice();
      this.humans.length = 0;
      this.aliveHumans.length = 0;
    }

    this.police.populate();
    this.army.populate();
    this.tanks.populate();

    this.getAttackDamage();
    const maxHumans = this.getMaxHumans();
    let numDoctors = this.getMaxDoctors();
    const maxHealth = this.getMaxHealth(this.gameModel.level);
    let vipNeeded = this.trophies.doesLevelHaveTrophy(this.gameModel.level);
    this.vip = undefined;
    if (vipNeeded) {
      this.escapeTarget = { x: gameFieldSize.x / 2, y: gameFieldSize.y + 50 };
    } else {
      if (this.vipText) {
        this.vipText.visible = false;
      }
    }

    for (let i = 0; i < maxHumans; i++) {
      let human: Human;
      if (numDoctors > 0) {
        if (this.discardedHumans.length > 0) {
          human = this.discardedHumans.pop();
          human.textures = this.doctorTextures;
        } else {
          human = new Human(this.doctorTextures);
        }
        human.deadTexture = this.doctorDeadTexture;
        human.flags.doctor = true;
        human.flags.torchBearer = false;
        human.timer.healTick = Math.random() * this.healTickTimer;
        numDoctors--;
      } else {
        const torchBearer = Math.random() < this.getTorchChance();
        const textureId = Math.floor(Math.random() * 3) + (torchBearer ? 3 : 0);
        if (this.discardedHumans.length > 0) {
          human = this.discardedHumans.pop();
          human.textures = this.textures[textureId].animated;
        } else {
          human = new Human(this.textures[textureId].animated);
        }
        human.flags.torchBearer = torchBearer;
        human.deadTexture = this.textures[textureId].dead;
        human.flags.doctor = false;
      }
      human.reset();
      human.flags.vip = false;
      human.flags.dead = false;
      human.flags.burning = false;
      human.flags.infected = false;
      human.burnDamage = 0;
      human.plagueDamage = 0;
      human.plagueTicks = 0;
      human.animationSpeed = 0.15;
      human.anchor.set(35 / 80, 1);
      human.currentPoi = this.map.getRandomBuilding();
      human.position.copyFrom(
        this.map.randomPositionInBuilding(human.currentPoi)
      );
      human.zIndex = human.position.y;
      human.xSpeed = 0;
      human.ySpeed = 0;
      human.timer.plagueTick = Math.random() * this.plagueTickTimer;
      human.target = false;
      human.speedMod = 1;
      human.zombieTarget = null;
      human.lastKnownBuilding = null;
      human.visionDistance = this.visionDistance;
      human.visible = true;
      human.alpha = 1;
      human.maxHealth = human.health = maxHealth;
      if (vipNeeded && !human.flags.doctor) {
        human.flags.vip = true;
        this.vip = human;
        vipNeeded = false;
        human.maxHealth = human.health = maxHealth * 2;
        this.setupVipText(human);
      }
      human.timer.scan = Math.random() * this.scanTime;
      human.timer.flee = 0;
      this.changeState(human, HumanState.standing);
      human.timer.standing = Math.random() * this.randomSecondsToStand();
      human.timer.attack = this.attackSpeed;
      human.scale.set(
        Math.random() > 0.5 ? this.scaling : -1 * this.scaling,
        this.scaling
      );
      this.humans.push(human);
      characterContainer.addChild(human);
    }
  }

  updateHumanSpeed(human: Human, timeDiff: number): void {
    if (this.frozen) {
      human.gotoAndStop(0);
      return;
    } else {
      if (!human.playing) {
        human.play();
      }
    }

    if (human.timer.dogStun && human.timer.dogStun > 0) {
      human.timer.dogStun -= timeDiff;
      return;
    }

    if (human.timer.target != 0 || !human.targetVector) {
      human.timer.target = 0;
    }
    human.timer.target -= timeDiff;
    if (human.timer.target <= 0) {
      human.targetVector = this.map.howDoIGetToMyTarget(human, human.target);
      human.timer.target = 0.2;
    }
    const humanSpeedMod = human.speedMod * human.maxSpeed;

    human.xSpeed = human.targetVector.x * humanSpeedMod;
    human.ySpeed = human.targetVector.y * humanSpeedMod;

    if (isNaN(human.xSpeed) || isNaN(human.ySpeed)) {
      human.xSpeed = 0;
      human.ySpeed = 0;
    }

    human.position.x += human.xSpeed * timeDiff;
    human.position.y += human.ySpeed * timeDiff;
    human.zIndex = human.position.y;
    if (Math.abs(human.xSpeed) > 1 && !human.flags.tank)
      human.scale.x = human.xSpeed > 0 ? this.scaling : -this.scaling;
  }

  drawTargets = false;

  update(timeDiff: number): void {
    if (this.gameModel.currentState != this.gameModel.states.playingLevel) {
      return;
    }
    const aliveHumans = [];
    const aliveZombies = this.zombies.aliveZombies;
    this.graveyardAttackers.length = 0;
    for (let i = 0; i < this.humans.length; i++) {
      this.updateHuman(this.humans[i], timeDiff, aliveZombies);
      if (!this.humans[i].flags.dead) aliveHumans.push(this.humans[i]);
    }
    this.aliveHumans = aliveHumans;
    this.gameModel.stats.human.count = this.aliveHumans.length;
    this.police.update(timeDiff, aliveZombies);
    this.army.update(timeDiff, aliveZombies);
    this.tanks.update(timeDiff, aliveZombies);

    if (this.vipText && this.vipText.visible) {
      this.vipText.x = this.vipText.human.x;
      this.vipText.y = this.vipText.human.y + this.vipText.yOffset;
    }

    this.gameModel.humanCount = this.aliveHumans.length;
  }

  updateDeadHumanFading(human: Human, timeDiff: number): void {
    if (!human.visible) return;

    if (human.alpha > 0.5 && human.alpha - this.fadeSpeed * timeDiff <= 0.5) {
      if (
        !human.flags.tank &&
        Math.random() < this.gameModel.riseFromTheDeadChance
      ) {
        this.zombies.createZombie(human.x, human.y, human.flags.dog);
        human.visible = false;
        characterContainer.removeChild(human);
        return;
      }
    }
    human.alpha -= this.fadeSpeed * timeDiff;

    if (human.alpha < 0) {
      human.visible = false;
      characterContainer.removeChild(human);
    }
    return;
  }

  changeState(human: Human, state: HumanState): void {
    switch (state) {
      case HumanState.standing:
        human.gotoAndStop(0);
        human.maxSpeed = this.maxWalkSpeed;
        human.timer.standing = this.randomSecondsToStand();
        break;
      case HumanState.walking:
        human.play();
        human.maxSpeed = this.maxWalkSpeed;
        break;
      case HumanState.fleeing:
        human.play();
        human.timer.flee = this.fleeTime;
        human.maxSpeed = this.maxRunSpeed;
        this.assignRandomTarget(human);
        this.exclamations.newExclamation(human);
        break;
      case HumanState.escaping:
        human.play();
        human.maxSpeed = this.maxRunSpeed;
        human.target = this.escapeTarget;
        this.exclamations.newExclamation(human);
        this.gameModel.sendMessage("The VIP is escaping!");
        this.vipEscaping = true;
        break;
      case HumanState.attacking:
        human.play();
        human.maxSpeed = this.maxRunSpeed;
        break;
    }
    human.state = state;
  }

  inflictBurn(human: Human, zombie: Creature): void {
    if (human.flags.torchBearer) {
      if (!zombie.flags.burning) {
        this.exclamations.newFire(zombie);
        zombie.burnDamage = this.attackDamage;
      } else {
        zombie.burnDamage += this.attackDamage;
      }
      zombie.flags.burning = true;
    }
  }

  burnHuman(human: Human, damage: number): void {
    if (!human) return;

    if (!human.flags.burning) {
      human.timer.burnTick = this.burnTickTimer;
      human.timer.smoke = this.smokeTimer;
      this.exclamations.newFire(human);
      human.burnDamage = damage;
    } else {
      human.burnDamage += damage;
    }
    human.flags.burning = true;
  }

  updatePlague(human: Human, timeDiff: number): void {
    human.timer.plagueTick -= timeDiff;

    if (human.timer.plagueTick < 0) {
      this.damageHuman(human, human.plagueDamage);
      human.timer.plagueTick =
        this.plagueTickTimer * (1 / this.gameModel.runeEffects.attackSpeed);
      this.exclamations.newPoison(human);
      human.plagueTicks--;
      if (this.pandemic) {
        this.pandemicBullet(human);
      }
      if (human.plagueTicks <= 0) {
        human.flags.infected = false;
        human.plagueDamage = 0;
      }
    }
  }

  pandemicBullet(human: Human): void {
    for (let i = 0; i < this.aliveHumans.length; i++) {
      if (
        Math.abs(this.aliveHumans[i].x - human.x) < 30 &&
        Math.abs(this.aliveHumans[i].y - human.y) < 30
      ) {
        if (Math.random() < 0.3) {
          this.bullets.newBullet(
            human,
            this.aliveHumans[i],
            this.gameModel.zombieDamage / 2,
            true
          );
        }
      }
    }
  }

  healHuman(human: Human): void {
    if (human.health < human.maxHealth) {
      if (human.flags.infected && human.plagueTicks > 0) {
        human.plagueTicks--;
      }
      human.health += this.attackDamage * 2;
      if (human.health > human.maxHealth) {
        human.health = human.maxHealth;
        human.speedMod = Math.max(
          Math.min(1, human.health / human.maxHealth),
          0.25
        );
      }
      this.exclamations.newHealing(human);
    }
  }

  doHeal(human: Human, timeDiff: number): void {
    human.timer.healTick -= timeDiff;
    if (human.timer.healTick < 0) {
      const healRadius = 100;
      human.timer.healTick = this.healTickTimer;
      for (let i = 0; i < this.aliveHumans.length; i++) {
        if (Math.abs(this.aliveHumans[i].x - human.x) < healRadius) {
          if (Math.abs(this.aliveHumans[i].y - human.y) < healRadius) {
            if (
              this.fastDistance(
                human.x,
                human.y,
                this.aliveHumans[i].x,
                this.aliveHumans[i].y
              ) < healRadius
            ) {
              this.healHuman(this.aliveHumans[i]);
            }
          }
        }
      }
    }
  }

  updateHuman(human: Human, timeDiff: number, aliveZombies: Creature[]): void {
    if (human.flags.dead) return this.updateDeadHumanFading(human, timeDiff);

    human.timer.attack -= timeDiff;
    human.timer.scan -= timeDiff;
    human.timer.flee -= timeDiff;

    if (human.flags.infected) this.updatePlague(human, timeDiff);
    if (human.flags.doctor) this.doHeal(human, timeDiff);
    if (human.flags.burning) this.updateBurns(human, timeDiff);

    if (
      (!human.zombieTarget || human.zombieTarget.flags.dead) &&
      human.timer.scan < 0
    ) {
      const count = this.scanForZombies(human, aliveZombies);

      if (count > 0) {
        if (human.flags.vip) {
          if (human.state !== HumanState.escaping)
            this.changeState(human, HumanState.escaping);
        } else if (Math.random() < count * this.fleeChancePerZombie) {
          this.changeState(human, HumanState.fleeing);
        } else {
          human.target = human.zombieTarget;
          this.changeState(human, HumanState.attacking);
        }
      }
    }

    switch (human.state) {
      case HumanState.standing:
        human.timer.standing -= timeDiff;
        if (human.timer.standing < 0) {
          this.assignRandomTarget(human);
          this.changeState(human, HumanState.walking);
        }
        break;
      case HumanState.walking:
      case HumanState.fleeing:
        if (
          this.fastDistance(
            human.position.x,
            human.position.y,
            human.target.x,
            human.target.y
          ) < this.moveTargetDistance
        ) {
          human.target = undefined;
          human.zombieTarget = undefined;
          this.changeState(human, HumanState.standing);
        } else {
          this.updateHumanSpeed(human, timeDiff);
        }
        break;
      case HumanState.escaping:
        if (
          this.fastDistance(
            human.position.x,
            human.position.y,
            human.target.x,
            human.target.y
          ) < this.moveTargetDistance
        ) {
          this.smoke.newDroneCloud(human.x, human.y);
          human.flags.dead = true;
          human.zombieTarget = undefined;
          human.visible = false;
          this.vipText.visible = false;
          this.gameModel.sendMessage("The VIP has escaped!");
          this.gameModel.vipEscaped();
          setTimeout(() => {
            this.vipEscaping = false;
          }, 1000);
        } else {
          this.updateHumanSpeed(human, timeDiff);
        }
        break;
      case HumanState.attacking:
        human.scale.x = human.target.x > human.x ? this.scaling : -this.scaling;
        if (human.zombieTarget && !human.zombieTarget.flags.dead) {
          const distanceToTarget = this.fastDistance(
            human.position.x,
            human.position.y,
            human.target.x,
            human.target.y
          );
          if (distanceToTarget < this.attackDistance) {
            if (human.timer.attack < 0) {
              this.zombies.damageZombie(
                human.zombieTarget,
                this.attackDamage,
                human
              );
              this.inflictBurn(human, human.zombieTarget);
              human.timer.attack = this.attackSpeed;
            }
          } else {
            this.updateHumanSpeed(human, timeDiff);
          }
        } else {
          this.changeState(human, HumanState.standing);
        }
        break;
    }
  }

  scanForZombies(human: Human, aliveZombies: Creature[]): number {
    human.timer.scan = this.scanTime;
    let zombieSpottedCount = 0;
    for (let i = 0; i < aliveZombies.length; i++) {
      if (
        !aliveZombies[i].flags.dead &&
        Math.abs(aliveZombies[i].x - human.x) < human.visionDistance &&
        Math.abs(aliveZombies[i].y - human.y) < human.visionDistance &&
        ((human.zombieTarget = aliveZombies[i]),
        zombieSpottedCount++,
        zombieSpottedCount > 9)
      )
        return zombieSpottedCount;
    }
    return zombieSpottedCount;
  }
}

class PoliceMan extends Human {
  radioTime = 0;
  followTimer = 0;
  policeState: PoliceState;
  owner: PoliceMan;
}

enum PoliceState {
  shooting,
  attacking,
  walking,
  running,
  standing,
  following,
  hunting,
}

export class Police {
  private static instance: Police;
  constructor() {
    if (Police.instance) return Police.instance;
    Police.instance = this;
  }
  map: ZmMap;
  gameModel: GameModel;
  humans: Humans;
  exclamations: Exclamations;
  zombies: Zombies;
  bullets: Bullets;
  maxWalkSpeed = 15;
  maxRunSpeed = 40;
  police: PoliceMan[] = [];
  discardedPolice: PoliceMan[] = [];
  walkTexture = [];
  deadTexture = [];
  dogTexture = [];
  deadDogTexture = [];
  policeDogLevel = 20;
  policePerLevel = 1;
  attackSpeed = 2;
  attackDamage = 16;
  attackDistance = 20;
  moveTargetDistance = 5;
  shootDistance = 110;
  visionDistance = 150;
  scaling = 2;
  dogScaling = 1.3;
  radioTime = 30;

  isExtraPolice(): boolean {
    return (this.gameModel.level + 10) % 20 == 0;
  }

  getMaxPolice(): number {
    const maxPolice = Math.min(
      Math.round(this.policePerLevel * this.gameModel.level),
      100
    );

    if (this.gameModel.level < 3) return 0;

    if (this.isExtraPolice()) {
      return Math.max(maxPolice * 2, 150);
    }

    return maxPolice;
  }

  getMaxHealth(): number {
    return Math.round(this.humans.getMaxHealth(this.gameModel.level) * 1.1);
  }

  getAttackDamage(): void {
    this.attackDamage = Math.round(this.getMaxHealth() / 10);
  }

  populate(): void {
    this.map = new ZmMap();
    this.gameModel = GameModel.getInstance();
    this.humans = new Humans();
    this.exclamations = new Exclamations();
    this.zombies = new Zombies();
    this.bullets = new Bullets();
    if (this.walkTexture.length == 0) {
      for (let i = 0; i < 3; i++) {
        this.walkTexture.push(PIXI.Texture.from("cop" + (i + 1) + ".png"));
      }
      this.deadTexture = [PIXI.Texture.from("cop4.png")];
      for (let i = 0; i < 2; i++) {
        this.dogTexture.push(PIXI.Texture.from("dog" + (i + 1) + ".png"));
      }
      this.deadDogTexture = [PIXI.Texture.from("dogdead.png")];
    }

    if (this.police.length > 0) {
      for (let i = 0; i < this.police.length; i++) {
        characterContainer.removeChild(this.police[i]);
      }
      this.discardedPolice = this.police.slice();
      this.police = [];
    }

    const maxPolice = this.getMaxPolice();
    const maxHealth = this.getMaxHealth();
    const maxDogHealth = maxHealth * 0.6;
    this.getAttackDamage();

    for (let i = 0; i < maxPolice; i++) {
      let police: PoliceMan;
      if (this.discardedPolice.length > 0) {
        police = this.discardedPolice.pop();
        police.alpha = 1;
        police.textures = this.walkTexture;
      } else {
        police = new PoliceMan(this.walkTexture);
      }
      police.reset();
      police.flags.dog = false;
      police.flags.dead = false;
      police.flags.infected = false;
      police.flags.burning = false;
      police.burnDamage = 0;
      police.plagueDamage = 0;
      police.plagueTicks = 0;
      police.deadTexture = this.deadTexture;
      police.animationSpeed = 0.2;
      police.anchor.set(35 / 80, 1);
      police.currentPoi = this.map.getRandomBuilding();
      police.position.copyFrom(
        this.map.randomPositionInBuilding(police.currentPoi)
      );
      police.zIndex = police.position.y;
      police.xSpeed = 0;
      police.ySpeed = 0;
      police.radioTime = 5;
      police.speedMod = 1;
      police.lastKnownBuilding = undefined;
      police.timer.plagueTick = Math.random() * this.humans.plagueTickTimer;
      police.maxSpeed = this.maxWalkSpeed;
      police.visionDistance = this.visionDistance;
      police.visible = true;
      police.maxHealth = police.health = maxHealth;
      police.timer.scan = Math.random() * this.humans.scanTime;
      police.timer.standing =
        Math.random() * this.humans.randomSecondsToStand();
      police.target = false;
      police.zombieTarget = undefined;
      police.policeState = PoliceState.standing;
      police.timer.attack = this.attackSpeed;
      police.scale.set(
        Math.random() > 0.5 ? this.scaling : -1 * this.scaling,
        this.scaling
      );
      this.police.push(police);
      characterContainer.addChild(police);

      if (this.gameModel.level >= this.policeDogLevel && Math.random() > 0.5) {
        this.createPoliceDog(police, maxDogHealth);
      }
    }

    if (this.isExtraPolice()) {
      this.gameModel.sendMessage("Warning: High Police Activity!");
    }
  }

  createPoliceDog(police: PoliceMan, maxDogHealth: number): void {
    let dog: PoliceMan;
    if (this.discardedPolice.length > 0) {
      dog = this.discardedPolice.pop();
      dog.alpha = 1;
      dog.textures = this.dogTexture;
    } else {
      dog = new PoliceMan(this.dogTexture);
    }
    dog.reset();
    dog.owner = police;
    dog.flags.dog = true;
    dog.flags.dead = false;
    dog.flags.infected = false;
    dog.flags.burning = false;
    dog.burnDamage = 0;
    dog.plagueDamage = 0;
    dog.plagueTicks = 0;
    dog.deadTexture = this.deadDogTexture;
    dog.animationSpeed = 0.15;
    dog.anchor.set(0.5, 1);
    dog.position.set(police.position.x + 3, police.position.y);
    dog.zIndex = dog.position.y;
    dog.xSpeed = 0;
    dog.ySpeed = 0;
    dog.speedMod = 1;
    dog.lastKnownBuilding = null;
    dog.timer.plagueTick = Math.random() * this.humans.plagueTickTimer;
    dog.maxSpeed = this.maxRunSpeed;
    dog.visionDistance = this.visionDistance;
    dog.visible = true;
    dog.maxHealth = dog.health = maxDogHealth;
    dog.timer.scan = Math.random() * this.humans.scanTime;
    dog.target = police;
    dog.zombieTarget = null;
    dog.policeState = PoliceState.following;
    dog.followTimer = 0;
    dog.timer.attack = this.attackSpeed;
    dog.scale.set(
      Math.random() > 0.5 ? this.dogScaling : -1 * this.dogScaling,
      this.dogScaling
    );
    this.police.push(dog);
    characterContainer.addChild(dog);
  }

  update(timeDiff: number, aliveZombies: Creature[]): void {
    let count = 0;
    for (let i = 0; i < this.police.length; i++) {
      if (this.police[i].flags.dog) {
        this.updatePoliceDog(this.police[i], timeDiff, aliveZombies);
      } else {
        this.updatePolice(this.police[i], timeDiff, aliveZombies);
      }
      if (!this.police[i].flags.dead) {
        this.humans.aliveHumans.push(this.police[i]);
        count++;
      }
    }
    this.gameModel.stats.police.count = count;
  }

  decideStateOnZombieDistance(police: PoliceMan): void {
    if (police.zombieTarget && !police.zombieTarget.flags.dead) {
      police.target = police.zombieTarget;
      const distanceToTarget = fastDistance(
        police.position.x,
        police.position.y,
        police.zombieTarget.x,
        police.zombieTarget.y
      );

      if (distanceToTarget > this.shootDistance) {
        this.changeState(police, PoliceState.running);
        return;
      }

      if (distanceToTarget < this.attackDistance) {
        this.changeState(police, PoliceState.attacking);
        return;
      }
      this.changeState(police, PoliceState.shooting);
    }
  }

  changeState(police: PoliceMan, state: PoliceState): void {
    switch (state) {
      case PoliceState.standing:
        police.gotoAndStop(0);
        break;
      case PoliceState.walking:
        police.play();
        police.maxSpeed = this.maxWalkSpeed;
        break;
      case PoliceState.running:
        police.play();
        police.maxSpeed = this.maxRunSpeed;
        break;
      case PoliceState.shooting:
        police.gotoAndStop(0);
        break;
      case PoliceState.attacking:
        police.play();
        break;
    }
    police.policeState = state;
  }

  radioForBackup(police: PoliceMan): void {
    let closestPolice = null;
    let closestDistance = 2000;

    for (let i = 0; i < this.police.length; i++) {
      if (
        !this.police[i].flags.dead &&
        !this.police[i].flags.dog &&
        (!this.police[i].zombieTarget || this.police[i].zombieTarget.flags.dead)
      ) {
        const distance = fastDistance(
          police.x,
          police.y,
          this.police[i].x,
          this.police[i].y
        );
        if (distance < closestDistance) {
          closestPolice = this.police[i];
          closestDistance = distance;
        }
      }
    }

    if (closestPolice) {
      closestPolice.zombieTarget = police.zombieTarget;
      this.exclamations.newRadio(police);
      this.exclamations.newRadio(closestPolice);
      police.radioTime = this.radioTime;
      closestPolice.radioTime = this.radioTime;
    }
  }

  updatePolice(
    police: PoliceMan,
    timeDiff: number,
    aliveZombies: Creature[]
  ): void {
    if (police.flags.dead)
      return this.humans.updateDeadHumanFading(police, timeDiff);

    police.timer.attack -= timeDiff;
    police.timer.scan -= timeDiff;
    police.radioTime -= timeDiff;

    if (police.flags.infected) this.humans.updatePlague(police, timeDiff);
    if (police.flags.burning) this.humans.updateBurns(police, timeDiff);

    if (
      (!police.zombieTarget || police.zombieTarget.flags.dead) &&
      police.timer.scan < 0
    ) {
      this.humans.scanForZombies(police, aliveZombies);
      if (police.zombieTarget && !police.zombieTarget.flags.dead) {
        if (police.radioTime < 0) this.radioForBackup(police);
      }
    }

    this.decideStateOnZombieDistance(police);

    switch (police.policeState) {
      case PoliceState.standing:
        police.timer.standing -= timeDiff;
        if (police.timer.standing < 0) {
          this.humans.assignRandomTarget(police);
          this.changeState(police, PoliceState.walking);
        }

        break;
      case PoliceState.walking:
        if (
          fastDistance(
            police.position.x,
            police.position.y,
            police.target.x,
            police.target.y
          ) < this.moveTargetDistance
        ) {
          police.target = false;
          police.zombieTarget = null;
          police.timer.standing = this.humans.randomSecondsToStand();
          this.changeState(police, PoliceState.standing);
        } else {
          this.humans.updateHumanSpeed(police, timeDiff);
        }

        break;
      case PoliceState.running:
        if (police.zombieTarget && !police.zombieTarget.flags.dead) {
          if (police.target) {
            this.humans.updateHumanSpeed(police, timeDiff);
          }
        } else {
          this.changeState(police, PoliceState.standing);
        }
        break;
      case PoliceState.attacking:
        if (police.zombieTarget && !police.zombieTarget.flags.dead) {
          police.scale.x =
            police.zombieTarget.x > police.x ? this.scaling : -this.scaling;
          if (police.timer.attack < 0) {
            this.zombies.damageZombie(
              police.zombieTarget,
              this.attackDamage,
              police
            );
            police.timer.attack = this.attackSpeed;
          }
        } else {
          this.changeState(police, PoliceState.standing);
        }

        break;
      case PoliceState.shooting:
        if (police.zombieTarget && !police.zombieTarget.flags.dead) {
          police.scale.x =
            police.zombieTarget.x > police.x ? this.scaling : -this.scaling;
          if (police.timer.attack < 0) {
            this.bullets.newBullet(
              police,
              police.zombieTarget,
              this.attackDamage
            );
            police.timer.attack = this.attackSpeed;
          }
        } else {
          this.changeState(police, PoliceState.standing);
        }

        break;
    }
  }
  updateDogSpeed(dog: PoliceMan, timeDiff: number): void {
    this.humans.updateHumanSpeed(dog, timeDiff);
    if (Math.abs(dog.xSpeed) > 1)
      dog.scale.x = dog.xSpeed > 0 ? this.dogScaling : -this.dogScaling;
  }
  updatePoliceDog(
    dog: PoliceMan,
    timeDiff: number,
    aliveZombies: Creature[]
  ): void {
    if (dog.flags.dead) return this.humans.updateDeadHumanFading(dog, timeDiff);

    dog.timer.attack -= timeDiff;
    dog.timer.scan -= timeDiff;

    if (dog.flags.infected) this.humans.updatePlague(dog, timeDiff);
    if (dog.flags.burning) this.humans.updateBurns(dog, timeDiff);

    switch (dog.policeState) {
      case PoliceState.following: {
        if (dog.owner.flags.dead) {
          dog.policeState = PoliceState.hunting;
          dog.play();
          break;
        }

        if (dog.owner.zombieTarget && !dog.owner.zombieTarget.flags.dead) {
          dog.policeState = PoliceState.attacking;
          dog.play();
          dog.target = dog.owner.zombieTarget;
          break;
        }
        dog.target = dog.owner;
        if (
          fastDistance(
            dog.position.x,
            dog.position.y,
            dog.target.x,
            dog.target.y
          ) < this.moveTargetDistance
        ) {
          dog.followTimer = Math.random() * 3;
          dog.gotoAndStop(0);
        } else {
          dog.followTimer -= timeDiff;
          if (dog.followTimer < 0) {
            dog.play();
            this.updateDogSpeed(dog, timeDiff);
          }
        }
        break;
      }
      case PoliceState.attacking: {
        if (dog.zombieTarget && !dog.zombieTarget.flags.dead) {
          if (
            fastDistance(
              dog.position.x,
              dog.position.y,
              dog.zombieTarget.x,
              dog.zombieTarget.y
            ) < this.moveTargetDistance
          ) {
            dog.scale.x =
              dog.target.x > dog.x ? this.dogScaling : -this.dogScaling;
            if (dog.timer.attack < 0) {
              this.zombies.damageZombie(
                dog.zombieTarget,
                this.attackDamage,
                dog
              );
              dog.target.dogStun = 1;
              dog.timer.attack = this.attackSpeed;
            }
          } else {
            dog.target = dog.zombieTarget;
            this.updateDogSpeed(dog, timeDiff);
          }
        } else {
          dog.policeState = PoliceState.following;
        }
        break;
      }
      case PoliceState.hunting: {
        if (
          (!dog.zombieTarget || dog.zombieTarget.flags.dead) &&
          dog.timer.scan < 0
        ) {
          this.humans.scanForZombies(dog, aliveZombies);
          if (dog.zombieTarget) {
            dog.policeState = PoliceState.attacking;
          }
        }

        if (
          fastDistance(
            dog.position.x,
            dog.position.y,
            dog.target.x,
            dog.target.y
          ) < this.moveTargetDistance
        ) {
          dog.target = {
            x: Math.random() * gameFieldSize.x,
            y: Math.random() * gameFieldSize.y,
          };
          dog.maxSpeed = this.maxRunSpeed;
        } else {
          this.updateDogSpeed(dog, timeDiff);
        }
        break;
      }
    }
  }
}

class ArmyMan extends Human {
  minigun = false;
  rocketlauncher = false;
  attackingGraveyard = false;
  armyState: ArmyState;
  graveYardTarget: { graveyard: boolean; x: number; y: number };
  shotsLeft = 0;
  shotTimer = 0;
}

enum ArmyState {
  shooting,
  attacking,
  walking,
  running,
  standing,
}

export class Army {
  private static instance: Army;
  constructor() {
    if (Army.instance) return Army.instance;
    Army.instance = this;
  }
  map: ZmMap;
  zombies: Zombies;
  humans: Humans;
  gameModel: GameModel;
  graveyard: Graveyard;
  bullets: Bullets;
  blasts: Blasts;
  exclamations: Exclamations;
  maxWalkSpeed = 20;
  maxRunSpeed = 50;
  armymen: ArmyMan[] = [];
  discardedArmymen: ArmyMan[] = [];
  textures = [];
  aliveZombies: Creature[] = [];
  armyPerLevel = 0.9;
  attackSpeed = 2;
  attackDamage = 20;
  attackDistance = 25;
  moveTargetDistance = 5;
  shootDistance = 130;
  visionDistance = 200;
  scaling = 2;
  shotsPerBurst = 3;
  droneStrikeTimer = 0;
  droneStrikeTime = 35;
  assaultStarted = false;

  isExtraArmy(): boolean {
    return this.gameModel.level % 20 == 0;
  }

  getMaxArmy(): number {
    const maxArmy = Math.min(
      Math.round(this.armyPerLevel * this.gameModel.level),
      100
    );

    if (this.gameModel.level < 11) return 0;

    if (this.isExtraArmy()) {
      return Math.max(maxArmy * 2, 150);
    }

    if (this.gameModel.isBossStage(this.gameModel.level)) {
      return Math.max(maxArmy, 75);
    }

    return maxArmy;
  }

  getMaxHealth(): number {
    return Math.round(this.humans.getMaxHealth(this.gameModel.level) * 1.2);
  }

  getAttackDamage(): void {
    this.attackDamage = Math.round(this.getMaxHealth() / 10);
  }

  droneStrike = null;
  droneActive = false;

  populate(): void {
    this.map = new ZmMap();
    this.zombies = new Zombies();
    this.humans = new Humans();
    this.gameModel = GameModel.getInstance();
    this.graveyard = new Graveyard();
    this.bullets = new Bullets();
    this.assaultStarted = false;
    this.blasts = new Blasts();
    this.exclamations = new Exclamations();

    if (this.textures.length == 0) {
      for (let i = 0; i < 3; i++) {
        const animated = [];
        for (let j = 0; j < 3; j++) {
          animated.push(
            PIXI.Texture.from("army" + (i + 1) + "_" + (j + 1) + ".png")
          );
        }
        this.textures.push({
          animated: animated,
          dead: [PIXI.Texture.from("army" + (i + 1) + "_dead.png")],
        });
      }
    }

    if (this.droneStrike && this.droneStrike.laser) {
      foregroundContainer.removeChild(this.droneStrike.text);
      foregroundContainer.removeChild(this.droneStrike.laser);
    }

    if (this.armymen.length > 0) {
      for (let i = 0; i < this.armymen.length; i++) {
        characterContainer.removeChild(this.armymen[i]);
      }
      this.discardedArmymen = this.armymen.slice();
      this.armymen = [];
    }

    const maxArmy = this.getMaxArmy();
    const maxHealth = this.getMaxHealth();
    this.getAttackDamage();

    this.droneStrike = false;
    this.droneStrikeTimer = Math.random() * this.droneStrikeTime;
    this.droneActive = this.gameModel.level >= 25;

    for (let i = 0; i < maxArmy; i++) {
      let armyman: ArmyMan;
      let textureId = 0;
      if (this.gameModel.level > 35 && Math.random() < 0.3) {
        textureId = 1;
      }
      if (
        (this.gameModel.level > 45 && Math.random() < 0.3) ||
        (this.gameModel.isBossStage(this.gameModel.level) &&
          Math.random() < 0.5)
      ) {
        textureId = 2;
      }
      if (this.discardedArmymen.length > 0) {
        armyman = this.discardedArmymen.pop();
        armyman.alpha = 1;
        armyman.textures = this.textures[textureId].animated;
      } else {
        armyman = new ArmyMan(this.textures[textureId].animated);
      }
      armyman.reset();
      armyman.flags.dead = false;
      armyman.flags.infected = false;
      armyman.flags.burning = false;
      armyman.burnDamage = 0;
      armyman.plagueDamage = 0;
      armyman.minigun = textureId == 1;
      armyman.rocketlauncher = textureId == 2;
      armyman.deadTexture = this.textures[textureId].dead;
      armyman.animationSpeed = 0.2;
      armyman.anchor.set(35 / 80, 1);
      armyman.currentPoi = this.map.getRandomBuilding();
      armyman.position.copyFrom(
        this.map.randomPositionInBuilding(armyman.currentPoi)
      );
      armyman.zIndex = armyman.position.y;
      armyman.xSpeed = 0;
      armyman.ySpeed = 0;
      armyman.speedMod = 1;
      armyman.lastKnownBuilding = null;
      armyman.maxSpeed = this.maxWalkSpeed;
      armyman.visionDistance = this.visionDistance;
      armyman.visible = true;
      armyman.maxHealth = armyman.health = maxHealth;
      armyman.timer.attack = this.attackSpeed;
      armyman.timer.plagueTick = Math.random() * this.humans.plagueTickTimer;
      armyman.timer.scan = Math.random() * this.humans.scanTime;
      armyman.timer.standing =
        Math.random() * this.humans.randomSecondsToStand();
      armyman.target = false;
      armyman.zombieTarget = null;
      armyman.graveYardTarget = null;
      armyman.armyState = ArmyState.standing;
      armyman.attackingGraveyard = false;
      armyman.scale.set(
        Math.random() > 0.5 ? this.scaling : -1 * this.scaling,
        this.scaling
      );
      this.armymen.push(armyman);
      characterContainer.addChild(armyman);
    }

    if (this.isExtraArmy()) {
      this.gameModel.sendMessage("Warning: High Military Activity!");
    }
  }

  update(timeDiff: number, aliveZombies: Creature[]): void {
    let count = 0;
    this.aliveZombies = aliveZombies;
    if (this.droneActive) {
      this.droneStrikeTimer -= timeDiff;
    }
    for (let i = 0; i < this.armymen.length; i++) {
      this.updateArmy(this.armymen[i], timeDiff, aliveZombies);
      if (!this.armymen[i].flags.dead) {
        this.humans.aliveHumans.push(this.armymen[i]);
        if (this.armymen[i].attackingGraveyard) {
          this.humans.graveyardAttackers.push(this.armymen[i]);
        }
        count++;
      }
    }
    this.gameModel.stats.army.count = count;
    this.updateDroneStrike(timeDiff, aliveZombies);
  }

  decideStateOnZombieDistance(armyman: ArmyMan): void {
    if (
      armyman.graveYardTarget ||
      (armyman.zombieTarget && !armyman.zombieTarget.flags.dead)
    ) {
      armyman.target = armyman.graveYardTarget ?? armyman.zombieTarget;
      const distanceToTarget = fastDistance(
        armyman.position.x,
        armyman.position.y,
        armyman.target.x,
        armyman.target.y
      );

      if (distanceToTarget > this.shootDistance && !armyman.rocketlauncher) {
        this.changeState(armyman, ArmyState.running);
        return;
      }

      if (
        distanceToTarget > this.shootDistance * 1.2 &&
        armyman.rocketlauncher
      ) {
        this.changeState(armyman, ArmyState.running);
        return;
      }

      if (distanceToTarget < this.attackDistance && !armyman.graveYardTarget) {
        this.changeState(armyman, ArmyState.attacking);
        return;
      }
      this.changeState(armyman, ArmyState.shooting);
    }
  }

  changeState(armyman: ArmyMan, state: ArmyState): void {
    switch (state) {
      case ArmyState.standing:
        armyman.gotoAndStop(0);
        break;
      case ArmyState.walking:
        armyman.play();
        armyman.maxSpeed = this.maxWalkSpeed;
        break;
      case ArmyState.running:
        armyman.play();
        armyman.maxSpeed = this.maxRunSpeed;
        break;
      case ArmyState.shooting:
        armyman.gotoAndStop(0);
        break;
      case ArmyState.attacking:
        armyman.play();
        break;
    }
    armyman.armyState = state;
  }

  updateArmy(
    armyman: ArmyMan,
    timeDiff: number,
    aliveZombies: Creature[]
  ): void {
    if (armyman.flags.dead)
      return this.humans.updateDeadHumanFading(armyman, timeDiff);

    armyman.timer.attack -= timeDiff;
    armyman.timer.scan -= timeDiff;

    if (armyman.flags.infected) this.humans.updatePlague(armyman, timeDiff);
    if (armyman.flags.burning) this.humans.updateBurns(armyman, timeDiff);

    if (
      !armyman.graveYardTarget &&
      (!armyman.zombieTarget || armyman.zombieTarget.flags.dead) &&
      armyman.timer.scan < 0
    ) {
      const zombies = this.humans.scanForZombies(armyman, aliveZombies);
      if (zombies > 3 && this.droneActive && this.droneStrikeTimer < 0) {
        this.callDroneStrike(armyman, aliveZombies);
      }
      if (
        this.assaultStarted &&
        armyman.rocketlauncher &&
        Math.random() > 0.98
      ) {
        armyman.graveYardTarget = this.graveyard.target;
        armyman.attackingGraveyard = true;
      }
    }

    this.decideStateOnZombieDistance(armyman);

    switch (armyman.armyState) {
      case ArmyState.standing:
        armyman.timer.standing -= timeDiff;
        if (armyman.timer.standing < 0) {
          this.humans.assignRandomTarget(armyman);
          this.changeState(armyman, ArmyState.walking);
        }

        break;
      case ArmyState.walking:
        if (
          fastDistance(
            armyman.position.x,
            armyman.position.y,
            armyman.target.x,
            armyman.target.y
          ) < this.moveTargetDistance
        ) {
          armyman.target = null;
          armyman.zombieTarget = null;
          armyman.timer.standing = this.humans.randomSecondsToStand();
          this.changeState(armyman, ArmyState.standing);
        } else {
          this.humans.updateHumanSpeed(armyman, timeDiff);
        }

        break;
      case ArmyState.running:
        if (
          armyman.graveYardTarget ||
          (armyman.zombieTarget && !armyman.zombieTarget.flags.dead)
        ) {
          armyman.target = armyman.graveYardTarget ?? armyman.zombieTarget;
          this.humans.updateHumanSpeed(armyman, timeDiff);
        } else {
          this.changeState(armyman, ArmyState.standing);
        }
        break;
      case ArmyState.attacking:
        if (armyman.zombieTarget && !armyman.zombieTarget.flags.dead) {
          armyman.scale.x =
            armyman.zombieTarget.x > armyman.x ? this.scaling : -this.scaling;
          if (armyman.timer.attack < 0) {
            this.zombies.damageZombie(
              armyman.zombieTarget,
              this.attackDamage,
              armyman
            );
            armyman.timer.attack = this.attackSpeed;
          }
        } else {
          this.changeState(armyman, ArmyState.standing);
        }

        break;
      case ArmyState.shooting:
        if (
          armyman.graveYardTarget ||
          (armyman.zombieTarget && !armyman.zombieTarget.flags.dead)
        ) {
          armyman.target = armyman.graveYardTarget ?? armyman.zombieTarget;
          armyman.scale.x =
            armyman.target.x > armyman.x ? this.scaling : -this.scaling;
          if (armyman.timer.attack < 0) {
            armyman.shotsLeft = this.shotsPerBurst;
            if (armyman.minigun) {
              armyman.shotsLeft = this.shotsPerBurst * 3;
            }
            if (armyman.rocketlauncher) {
              armyman.shotsLeft = 1;
            }
            armyman.timer.attack = armyman.rocketlauncher
              ? this.attackSpeed * 1.5
              : this.attackSpeed;
            armyman.shotTimer = 0;
          }
          if (armyman.shotsLeft > 0) {
            armyman.shotTimer -= timeDiff;
            if (armyman.shotTimer < 0) {
              armyman.shotTimer = 0.15;
              if (armyman.minigun) {
                armyman.shotTimer = 0.08;
              }
              this.bullets.newBullet(
                armyman,
                armyman.target,
                armyman.rocketlauncher
                  ? this.attackDamage * 1.2
                  : armyman.minigun
                    ? this.attackDamage / 2
                    : this.attackDamage,
                false,
                armyman.rocketlauncher
              );
              armyman.shotsLeft--;
            }
          }
        } else {
          this.changeState(armyman, ArmyState.standing);
        }

        break;
    }
  }

  droneBlastRadius = 35;

  callDroneStrike(armyman: ArmyMan, aliveZombies: Creature[]): void {
    let zombiesInArea = 0;
    for (let i = 0; i < aliveZombies.length; i++) {
      if (
        aliveZombies[i].x > armyman.zombieTarget.x - this.droneBlastRadius &&
        aliveZombies[i].x < armyman.zombieTarget.x + this.droneBlastRadius
      ) {
        if (
          aliveZombies[i].y > armyman.zombieTarget.y - this.droneBlastRadius &&
          aliveZombies[i].y < armyman.zombieTarget.y + this.droneBlastRadius
        ) {
          zombiesInArea++;
        }
      }
    }
    let humansInArea = 0;
    const aliveHumans = this.humans.aliveHumans;
    for (let i = 0; i < aliveHumans.length; i++) {
      if (
        aliveHumans[i].x > armyman.zombieTarget.x - this.droneBlastRadius &&
        aliveHumans[i].x < armyman.zombieTarget.x + this.droneBlastRadius
      ) {
        if (
          aliveHumans[i].y > armyman.zombieTarget.y - this.droneBlastRadius &&
          aliveHumans[i].y < armyman.zombieTarget.y + this.droneBlastRadius
        ) {
          humansInArea++;
        }
      }
    }

    if (zombiesInArea > 1 && humansInArea == 0) {
      this.exclamations.newRadio(armyman);
      this.droneStrikeTimer = this.droneStrikeTime;
      this.droneStrike = {
        caller: armyman,
        target: armyman.zombieTarget,
        timer: 3,
        bombsLeft: 3,
      };
    }
  }

  droneBomb(aliveZombies: Creature[]): void {
    const variance = 32;
    this.droneExplosion(
      this.droneStrike.target.x + (Math.random() - 1) * variance,
      this.droneStrike.target.y + (Math.random() - 1) * variance,
      aliveZombies,
      this.attackDamage * 3
    );
    this.droneStrike.timer = 0.3;
    this.droneStrike.bombsLeft--;
  }

  droneExplosion(
    x: number,
    y: number,
    aliveZombies: Creature[],
    damage: number
  ): void {
    if (!aliveZombies) {
      aliveZombies = this.aliveZombies;
    }
    this.blasts.newDroneBlast(x, y);
    for (let i = 0; i < aliveZombies.length; i++) {
      if (
        aliveZombies[i].x > x - this.droneBlastRadius &&
        aliveZombies[i].x < x + this.droneBlastRadius
      ) {
        if (
          aliveZombies[i].y > y - this.droneBlastRadius &&
          aliveZombies[i].y < y + this.droneBlastRadius
        ) {
          this.zombies.damageZombie(aliveZombies[i], damage, null);
        }
      }
    }
  }

  updateDroneStrike(timeDiff: number, aliveZombies: Creature[]): void {
    if (this.droneStrike) {
      this.droneStrike.timer -= timeDiff;

      if (!this.droneStrike.startedBombing) {
        if (!this.droneStrike.text) {
          this.droneStrike.text = new PIXI.Text("3", {
            fontFamily: "sans-serif",
            fontSize: 40,
            fill: "#F00",
            stroke: "#000",
            strokeThickness: 0,
            align: "center",
          });
          this.droneStrike.text.anchor = { x: 0.5, y: 1 };
          this.droneStrike.text.scale.x = 0.5;
          this.droneStrike.text.scale.y = 0.5;
          foregroundContainer.addChild(this.droneStrike.text);

          this.droneStrike.laser = new PIXI.Graphics();
          foregroundContainer.addChild(this.droneStrike.laser);
        }
        this.droneStrike.text.text = Math.ceil(this.droneStrike.timer);
        this.droneStrike.text.x = this.droneStrike.target.x;
        this.droneStrike.text.y = this.droneStrike.target.y - 30;

        this.droneStrike.laser.clear();
        this.droneStrike.laser.lineStyle(1, 0xff0000);
        this.droneStrike.laser.moveTo(
          this.droneStrike.caller.x,
          this.droneStrike.caller.y - 10
        );
        this.droneStrike.laser.lineTo(
          this.droneStrike.target.x,
          this.droneStrike.target.y - 10
        );
      }

      if (
        (this.droneStrike.caller.dead || this.droneStrike.target.dead) &&
        !this.droneStrike.startedBombing
      ) {
        foregroundContainer.removeChild(this.droneStrike.text);
        foregroundContainer.removeChild(this.droneStrike.laser);
        this.droneStrike = false;
        this.droneStrikeTimer = 0;
        return;
      }

      if (this.droneStrike.timer < 0) {
        if (!this.droneStrike.startedBombing) {
          foregroundContainer.removeChild(this.droneStrike.text);
          foregroundContainer.removeChild(this.droneStrike.laser);
          this.droneStrike.startedBombing = true;
        }

        this.droneBomb(aliveZombies);

        if (this.droneStrike.bombsLeft <= 0) {
          this.droneStrike = false;
        }
      }
    }
  }
}

class Tank extends Human {
  turretSprite: PIXI.Sprite;
  tankState: TankState;
  currentDirection: TankDirection;
  attackingGraveyard = false;
  graveYardTarget: { graveyard: boolean; x: number; y: number };
}

enum TankState {
  shooting,
  attacking,
  patrolling,
}

enum TankDirection {
  horizontal,
  vertical,
}

export class Tanks {
  private static instance: Tanks;
  constructor() {
    if (Tanks.instance) return Tanks.instance;
    Tanks.instance = this;
  }
  map: ZmMap;
  gameModel: GameModel;
  zombies: Zombies;
  humans: Humans;
  army: Army;
  graveyard: Graveyard;
  bullets: Bullets;
  speed = 20;
  tanks: Tank[] = [];
  aliveTanks: Tank[] = [];
  textures: {
    vertical: PIXI.Texture[];
    horizontal: PIXI.Texture[];
    turret: PIXI.Texture;
  };
  attackDamage = 0;
  attackSpeed = 3;
  scaling = 3;
  moveTargetDistance = 20;
  shootDistance = 300;

  getMaxTanks(): number {
    if (this.gameModel.isBossStage(this.gameModel.level)) {
      return Math.min(Math.round(this.gameModel.level / 30), 20);
    }
    return 0;
  }

  getMaxHealth(): number {
    return Math.round(this.humans.getMaxHealth(this.gameModel.level) * 10);
  }

  getAttackDamage(): void {
    this.attackDamage = Math.round(this.getMaxHealth() / 10);
  }

  populate(): void {
    this.map = new ZmMap();
    this.gameModel = GameModel.getInstance();
    this.zombies = new Zombies();
    this.humans = new Humans();
    this.army = new Army();
    this.graveyard = new Graveyard();
    this.bullets = new Bullets();
    if (!this.textures) {
      this.textures = {
        vertical: [],
        horizontal: [],
        turret: null,
      };
      for (let i = 0; i < 2; i++) {
        this.textures.horizontal.push(PIXI.Texture.from("tank" + i + ".png"));
      }
      for (let i = 2; i < 4; i++) {
        this.textures.vertical.push(PIXI.Texture.from("tank" + i + ".png"));
      }
      this.textures.turret = PIXI.Texture.from("tank4.png");
    }

    if (this.tanks.length > 0) {
      for (let i = 0; i < this.tanks.length; i++) {
        characterContainer.removeChild(this.tanks[i]);
      }
      this.tanks = [];
      this.aliveTanks = [];
    }

    const maxTanks = this.getMaxTanks();
    const maxHealth = this.getMaxHealth();
    this.getAttackDamage();

    for (let i = 0; i < maxTanks; i++) {
      const tank = new Tank(this.textures.horizontal);

      tank.flags.tank = true;
      tank.turretSprite = new PIXI.Sprite(this.textures.turret);

      tank.addChild(tank.turretSprite);

      tank.animationSpeed = 0.2;
      tank.anchor.set(0.5, 1);
      tank.turretSprite.anchor.set(7.5 / 16, 7.5 / 16);
      tank.x = 0;
      tank.y = 0;
      tank.play();
      tank.turretSprite.x = 0;
      tank.turretSprite.y = -7;

      tank.currentDirection = TankDirection.horizontal;

      tank.currentPoi = this.map.getRandomBuilding();
      tank.position.copyFrom(
        this.map.randomPositionInBuilding(tank.currentPoi)
      );
      tank.zIndex = tank.position.y;
      tank.xSpeed = 0;
      tank.ySpeed = 0;
      tank.speedMod = 1;
      tank.flags.dead = false;
      tank.flags.infected = false;
      tank.flags.burning = false;
      tank.burnDamage = 0;
      tank.lastKnownBuilding = null;
      tank.plagueDamage = 0;
      tank.timer.plagueTick = Math.random() * this.humans.plagueTickTimer;
      tank.maxSpeed = this.speed;
      tank.visionDistance = 250;
      tank.visible = true;
      tank.maxHealth = tank.health = maxHealth;
      tank.timer.scan = Math.random() * this.humans.scanTime;
      tank.target = false;
      tank.zombieTarget = null;
      tank.graveYardTarget = null;
      tank.attackingGraveyard = false;
      tank.tankState = TankState.patrolling;
      tank.timer.attack = this.attackSpeed;
      tank.scale.set(this.scaling, this.scaling);
      this.tanks.push(tank);
      characterContainer.addChild(tank);
    }
  }

  aliveZombies = null;

  update(timeDiff: number, aliveZombies: Creature[]): void {
    this.aliveZombies = aliveZombies;
    this.aliveTanks = [];
    for (let i = 0; i < this.tanks.length; i++) {
      this.updateTank(this.tanks[i], timeDiff, aliveZombies);
      if (!this.tanks[i].flags.dead) {
        this.humans.aliveHumans.push(this.tanks[i]);
        this.aliveTanks.push(this.tanks[i]);
        if (this.tanks[i].attackingGraveyard) {
          this.humans.graveyardAttackers.push(this.tanks[i]);
        }
      }
    }
  }

  updateTank(tank: Tank, timeDiff: number, aliveZombies: Creature[]): void {
    if (tank.flags.dead)
      return this.humans.updateDeadHumanFading(tank, timeDiff);

    tank.timer.attack -= timeDiff;
    tank.timer.scan -= timeDiff;

    if (tank.flags.burning) this.humans.updateBurns(tank, timeDiff);

    if (
      !tank.attackingGraveyard &&
      (!tank.zombieTarget || tank.zombieTarget.flags.dead) &&
      tank.timer.scan < 0
    ) {
      this.humans.scanForZombies(tank, aliveZombies);
      if (this.army.assaultStarted && Math.random() > 0.9) {
        tank.graveYardTarget = this.graveyard.target;
        tank.attackingGraveyard = true;
      }
    }

    this.decideStateOnZombieDistance(tank);

    switch (tank.tankState) {
      case TankState.patrolling:
        if (!tank.target) {
          tank.target = this.map.randomPositionInBuilding(null);
        }

        if (
          fastDistance(
            tank.position.x,
            tank.position.y,
            tank.target.x,
            tank.target.y
          ) < this.moveTargetDistance
        ) {
          tank.target = false;
          tank.zombieTarget = null;
        } else {
          this.humans.updateHumanSpeed(tank, timeDiff);
        }
        break;
      case TankState.attacking:
        if (tank.attackingGraveyard) {
          tank.target = tank.graveYardTarget;
          this.humans.updateHumanSpeed(tank, timeDiff);
        } else if (tank.zombieTarget && !tank.zombieTarget.flags.dead) {
          this.humans.updateHumanSpeed(tank, timeDiff);
        } else {
          this.changeState(tank, TankState.patrolling);
        }
        break;
      case TankState.shooting:
        if (
          tank.graveYardTarget ||
          (tank.zombieTarget && !tank.zombieTarget.flags.dead)
        ) {
          if (tank.timer.attack < 0) {
            tank.timer.attack = this.attackSpeed;
            this.bullets.newBullet(
              tank,
              tank.graveYardTarget || tank.zombieTarget,
              this.attackDamage,
              false,
              true
            );
          }
        } else {
          this.changeState(tank, TankState.patrolling);
        }

        break;
    }

    this.updateTankSprites(tank, timeDiff);
  }

  updateTankSprites(tank: Tank, timeDiff: number): void {
    if (Math.abs(tank.xSpeed) > Math.abs(tank.ySpeed)) {
      if (tank.currentDirection != TankDirection.horizontal) {
        tank.currentDirection = TankDirection.horizontal;
        tank.textures = this.textures.horizontal;
        tank.play();
        tank.turretSprite.y = -7;
      }
    } else {
      if (tank.currentDirection != TankDirection.vertical) {
        tank.currentDirection = TankDirection.vertical;
        tank.textures = this.textures.vertical;
        tank.play();
        tank.turretSprite.y = -8;
      }
    }
    if (tank.graveYardTarget || tank.zombieTarget) {
      tank.target = tank.graveYardTarget ?? tank.zombieTarget;
      const targetAngle =
        Math.atan2(tank.target.x - tank.x, tank.y - tank.target.y) +
        Math.PI / 2;
      if (tank.turretSprite.rotation > targetAngle) {
        tank.turretSprite.rotation -= timeDiff * 3;
      } else {
        tank.turretSprite.rotation += timeDiff * 3;
      }
    }
  }

  decideStateOnZombieDistance(tank: Tank): void {
    if (
      tank.graveYardTarget ||
      (tank.zombieTarget && !tank.zombieTarget.flags.dead)
    ) {
      tank.target = tank.graveYardTarget ?? tank.zombieTarget;
      const distanceToTarget = fastDistance(
        tank.position.x,
        tank.position.y,
        tank.target.x,
        tank.target.y
      );

      if (distanceToTarget > this.shootDistance) {
        this.changeState(tank, TankState.attacking);
        return;
      }

      this.changeState(tank, TankState.shooting);
    }
  }

  changeState(tank: Tank, state: TankState): void {
    switch (state) {
      case TankState.patrolling:
        tank.play();
        break;
      case TankState.attacking:
        tank.play();
        break;
      case TankState.shooting:
        tank.gotoAndStop(0);
        break;
    }
    tank.tankState = state;
  }
}
