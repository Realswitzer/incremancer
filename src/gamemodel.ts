import {
  zoom,
  centerGameContainer,
  update,
  setGameFieldSizeForLevel,
  Trophies,
  Particles,
  Bones,
  CreatureFactory,
  BoneCollectors,
  Graveyard,
  Spells,
  PartFactory,
  Creatures,
  Skeleton,
  Upgrades,
  Zombies,
  Army,
  Humans,
  Police,
  formatWhole,
} from "./internal";

export class GameModel {
  private static instance: GameModel;
  private constructor() {
    //
  }
  static getInstance(): GameModel {
    if (!GameModel.instance) {
      GameModel.instance = new GameModel();
      GameModel.instance.particles = new Particles();
      GameModel.instance.trophies = new Trophies();
      GameModel.instance.bones = new Bones();
      GameModel.instance.creatureFactory = new CreatureFactory();
      GameModel.instance.creatures = new Creatures();
      GameModel.instance.boneCollectors = new BoneCollectors();
      GameModel.instance.graveyard = new Graveyard();
      GameModel.instance.spells = new Spells();
      GameModel.instance.partFactory = new PartFactory();
      GameModel.instance.skeleton = new Skeleton();
      GameModel.instance.upgrades = new Upgrades();
      GameModel.instance.zombies = new Zombies();
      GameModel.instance.humans = new Humans();
      GameModel.instance.police = new Police();
      GameModel.instance.army = new Army();
    }

    return GameModel.instance;
  }
  particles: Particles;
  trophies: Trophies;
  bones: Bones;
  creatureFactory: CreatureFactory;
  creatures: Creatures;
  boneCollectors: BoneCollectors;
  graveyard: Graveyard;
  spells: Spells;
  partFactory: PartFactory;
  skeleton: Skeleton;
  upgrades: Upgrades;
  zombies: Zombies;
  humans: Humans;
  police: Police;
  army: Army;
  app: PIXI.Application;
  storageName = "ZombieData";
  hidden = false;
  autoShatter = false;
  energy = 0;
  energyMax = 10;
  energyRate = 1;
  brainsRate = 0;
  bonesRate = 0;
  endLevelBones = 0;
  energySpellMultiplier = 1;
  prestigePointsEarned = 0;
  zombieCost = 10;
  bonesPCMod = 1;
  partsPCMod = 1;
  bloodMax = 1000;
  bloodPCMod = 1;
  bloodStorePCMod = 1;
  brainsMax = 50;
  brainsPCMod = 1;
  brainsStorePCMod = 1;
  zombieHealth = 100;
  zombieHealthPCMod = 1;
  HshellHealthPCMod = 1;
  CryoVatPCMod = 1;
  PlagueVatPCMod = 1;
  CloningRep1PCMod = 1;
  BloodSynPCMod = 1;
  SynBonePCMod = 1;
  SmolPartsPCMod = 1;
  AvionicsPCMod = 1;
  ShockPCMod = 1;
  EnergyCostMod = 0;
  zombieDamage = 10;
  zombieDamagePCMod = 1;
  HstrengthDmgPCMod = 1;
  zombieSpeed = 10;
  zombieCages = 0;
  zombiesInCages = 0;
  golemDamagePCMod = 1;
  golemHealthPCMod = 1;
  plagueDamageMod = 0;
  plagueticks = 2;
  graveyardHealthMod = 1;
  burningSpeedMod = 1;
  startingResources = 0;
  blastHealing = 0;
  plagueDmgReduction = 0;
  brainRecoverChance = 0;
  riseFromTheDeadChance = 0;
  infectedBiteChance = 0;
  infectedBlastChance = 0;
  spitDistance = 0;
  spikeDelay = 5;
  startTimer = 0;
  fenceRadius = 50;
  constructions = {} as any;
  construction = 0;
  boneCollectorCapacity = 10;
  frameRate = 0;
  humanCount = 50;
  zombieCount = 0;
  creatureCount = 0;
  creatureLimit = 1;
  harpySpeed = 75;
  tankBuster = false;
  harpyBombs = 1;
  stats = null;
  runicSyphon = {
    percentage: 0,
    blood: 0,
    bones: 0,
    brains: 0,
  };
  gigazombies = false;
  endLevelTimer = 3;
  endLevelDelay = 3;
  messageQueue = [];
  offlineMessage = "";
  runeEffects = {
    attackSpeed: 1,
    critChance: 0,
    critDamage: 0,
    damageReduction: 1,
    healthRegen: 0,
    damageReflection: 0,
  };
  encodedContent = "";
  savefilename = "";
  blob: Blob;
  autoUpgrades = false;
  autoconstruction = false;
  autoconstructionUnlocked = false;
  levelResourcesAdded = false;
  bulletproofChance = 0;
  gameSpeed = 1;

  level = 1;

  currentState = "startGame";

  states = {
    playingLevel: "playingLevel",
    levelCompleted: "levelCompleted",
    startGame: "startGame",
    prestiged: "prestiged",
    failed: "failed",
  };

  baseStats = {
    energyRate: 1,
    brainsRate: 0,
    bonesRate: 0,
    energyMax: 10,
    bloodMax: 1000,
    brainsMax: 50,
    zombieCost: 10,
    zombieHealth: 100,
    zombieDamage: 10,
    zombieSpeed: 10,
    level: 1,
    graveyard: 0,
    construction: 0,
    boneCollectorCapacity: 10,
  };

  zoom = zoom;
  centerGameContainer = centerGameContainer;

  resetToBaseStats(): void {
    this.energyRate = this.baseStats.energyRate;
    this.brainsRate = this.baseStats.brainsRate;
    this.bonesRate = this.baseStats.bonesRate;
    this.energyMax = this.baseStats.energyMax;
    this.bloodMax = this.baseStats.bloodMax;
    this.brainsMax = this.baseStats.brainsMax;
    this.zombieHealth = this.baseStats.zombieHealth;
    this.zombieDamage = this.baseStats.zombieDamage;
    this.zombieSpeed = this.baseStats.zombieSpeed;
    this.zombieCost = this.baseStats.zombieCost;
    this.zombieCages = 0;
    this.brainRecoverChance = 0;
    this.riseFromTheDeadChance = 0;
    this.infectedBiteChance = 0;
    this.infectedBlastChance = 0;
    this.construction = this.baseStats.construction;
    this.constructions = {};
    this.boneCollectorCapacity = this.baseStats.boneCollectorCapacity;
    this.bonesPCMod = 1;
    this.partsPCMod = 1;
    this.bloodPCMod = 1;
    this.bloodStorePCMod = 1;
    this.brainsPCMod = 1;
    this.brainsStorePCMod = 1;
    this.zombieHealthPCMod = 1;
    this.HshellHealthPCMod = 1;
    this.CryoVatPCMod = 1;
    this.PlagueVatPCMod = 1;
    this.CloningRep1PCMod = 1;
    this.BloodSynPCMod = 1;
    this.SynBonePCMod = 1;
    this.SmolPartsPCMod = 1;
    this.AvionicsPCMod = 1;
    this.ShockPCMod = 1;
    this.EnergyCostMod = 0;
    this.zombieDamagePCMod = 1;
    this.HstrengthDmgPCMod = 1;
    this.golemHealthPCMod = 1;
    this.golemDamagePCMod = 1;
    this.plagueDamageMod = 0;
    this.plagueticks = 2;
    this.burningSpeedMod = 1;
    this.startingResources = 0;
    this.fenceRadius = 50;
    this.spitDistance = 0;
    this.spikeDelay = 5;
    this.blastHealing = 0;
    this.plagueDmgReduction = 1;
    this.creatureLimit = 1;
    this.runicSyphon.percentage = 0;
    this.autoconstructionUnlocked = false;
    this.autoUpgrades = false;
    this.graveyardHealthMod = 1;
    this.bulletproofChance = 0;
    this.gigazombies = false;
    this.harpySpeed = 75;
    this.tankBuster = false;
    this.harpyBombs = 1;
  }

  addEnergy(value: number): void {
    this.energy += value;
    if (this.energy > this.energyMax) this.energy = this.energyMax;
  }

  addBlood(value: number): void {
    if (isNaN(this.persistentData.blood)) {
      this.persistentData.blood = 0;
    }
    if (isNaN(value)) return;
    this.persistentData.blood += value * this.bloodPCMod;
    if (this.persistentData.blood > this.bloodMax) {
      this.persistentData.blood = this.bloodMax;
      if (this.constructions.runesmith && this.runicSyphon.percentage > 0) {
        this.runicSyphon.blood += value * this.bloodPCMod;
      }
    }

    if (this.runicSyphon.percentage > 0) {
      this.runicSyphon.blood +=
        value * this.bloodPCMod * this.runicSyphon.percentage;
    }
  }

  addBrains(value: number): void {
    if (isNaN(this.persistentData.brains)) {
      this.persistentData.brains = 0;
    }
    if (isNaN(value)) return;
    this.persistentData.brains += value * this.brainsPCMod;

    if (this.persistentData.brains > this.brainsMax) {
      this.persistentData.brains = this.brainsMax;
      if (this.constructions.runesmith && this.runicSyphon.percentage > 0) {
        this.runicSyphon.brains += value * this.brainsPCMod;
      }
    }

    if (this.runicSyphon.percentage > 0) {
      this.runicSyphon.brains +=
        value * this.brainsPCMod * this.runicSyphon.percentage;
    }
  }

  addBones(value: number): void {
    if (isNaN(this.persistentData.bones)) {
      this.persistentData.bones = 0;
    }
    if (isNaN(value)) return;
    this.persistentData.bones += value * this.bonesPCMod;
    this.persistentData.bonesTotal += value * this.bonesPCMod;

    if (this.runicSyphon.percentage > 0) {
      this.runicSyphon.bones +=
        value * this.bonesPCMod * this.runicSyphon.percentage;
    }
  }

  getHumanCount(): number {
    return this.humanCount;
  }

  getEnergyRate(): number {
    return (
      this.energySpellMultiplier * this.energyRate -
      (this.persistentData.boneCollectors + this.persistentData.harpies)
    );
  }

  update(timeDiff: number, updateTime: number): void {
    if (this.currentState != this.states.levelCompleted) {
      this.startTimer = 2;
    }
    if (
      this.persistentData.autoStartWait == false &&
      this.currentState != this.states.levelCompleted
    ) {
      this.startTimer = 0;
    }

    // spell update before gamespeed modifier
    this.spells.updateSpells(timeDiff);

    timeDiff *= this.gameSpeed;

    if (this.hidden) {
      // force PIXI update
      update(timeDiff, this.app);
    }

    this.partFactory.update(timeDiff);

    this.autoRemoveCollectorsHarpies();
    this.addEnergy(this.getEnergyRate() * timeDiff);

    if (this.currentState == this.states.playingLevel) {
      this.addBones(this.bonesRate * timeDiff);
      this.addBrains(this.brainsRate * timeDiff);
      this.upgrades.updateRunicSyphon(this.runicSyphon);

      if (this.lastSave + 30000 < updateTime) {
        this.saveData();
        this.lastSave = updateTime;
      }

      if (this.getHumanCount() <= 0) {
        if (this.endLevelTimer < 0) {
          if (
            this.isBossStage(this.level) &&
            this.trophies.doesLevelHaveTrophy(this.level)
          ) {
            this.trophies.trophyAquired(this.level);
          }
          this.prestigePointsEarned = this.prestigePointsForLevel(this.level);
          this.currentState = this.states.levelCompleted;
          this.levelResourcesAdded = false;
          this.calculateEndLevelBones();
          this.calculateEndLevelZombieCages();
          if (this.persistentData.levelsCompleted.indexOf(this.level) == -1) {
            this.addPrestigePoints(this.prestigePointsForLevel(this.level));
            this.persistentData.levelsCompleted.push(this.level);
          }
          this.persistentData.levelUnlocked = this.level + 1;
          if (
            !this.persistentData.allTimeHighestLevel ||
            this.level > this.persistentData.allTimeHighestLevel
          ) {
            this.persistentData.allTimeHighestLevel = this.level;
          }
        } else {
          this.endLevelTimer -= timeDiff;
        }
      }
      this.upgrades.updateConstruction(timeDiff);
      this.upgrades.updateAutoUpgrades();
      this.creatureFactory.update(timeDiff);
    }
    if (this.currentState == this.states.levelCompleted) {
      this.startTimer -= timeDiff;
    }
    if (this.startTimer < 0 && this.persistentData.autoStart) {
      this.startLevel(this.level);
    }
    if (this.currentState == this.states.levelCompleted) {
      if (this.startTimer < 0) {
        this.nextLevel();
      }
    }
    if (this.currentState == this.states.failed) {
      this.startTimer -= timeDiff;
      if (this.startTimer < 0 && this.persistentData.autoStart) {
        this.startLevel(this.level);
      }
    }
    // TODO: seems unintentional? if not fixed in DM then figure out whats happening
    if (this.currentState == this.states.failed) {
      this.startTimer -= timeDiff;
      if (this.startTimer < 0) {
        this.startLevel(this.level - 1);
      }
    }
    this.updateStats();
  }

  calculateEndLevelBones(): void {
    this.endLevelBones = 0;
    // TODO: possibly remove bone collector check IF over a certain total obtained points (milestone system?)
    // If there was a milestone system, also reducing time to build would be nicer.
    if (this.persistentData.boneCollectors > 0 && this.bones.uncollected) {
      this.endLevelBones = this.bones.uncollected
        .map((bone) => bone.value)
        .reduce((prev, curr) => prev + curr, 0);
      this.addBones(this.endLevelBones);
    }
  }

  calculateEndLevelZombieCages(): void {
    if (this.zombieCages > 0) {
      this.zombiesInCages += this.zombieCount;
      if (this.zombiesInCages > this.zombieCages)
        this.zombiesInCages = this.zombieCages;
    }
  }

  autoRemoveCollectorsHarpies(): void {
    if (this.getEnergyRate() < 0) {
      const energyRate = this.getEnergyRate();
      if (this.persistentData.harpies > 0) {
        this.persistentData.harpies -= Math.ceil(Math.abs(energyRate));
        if (this.persistentData.harpies < 0) {
          this.persistentData.harpies = 0;
        }
      }
      if (this.getEnergyRate() < 0 && this.persistentData.boneCollectors > 0) {
        this.persistentData.boneCollectors--;
      }
    }
  }

  releaseCagedZombies(): void {
    if (this.currentState == this.states.playingLevel) {
      for (let i = 0; i < this.zombiesInCages; i++) {
        this.zombies.createZombie(
          this.graveyard.sprite.x,
          this.graveyard.sprite.y
        );
      }
      this.zombiesInCages = 0;
    }
  }

  sacrificeCagedZombies(): void {
    this.addBlood(this.cagedZombieSacrificeValue().blood);
    this.addBrains(this.cagedZombieSacrificeValue().brains);
    this.addBones(this.cagedZombieSacrificeValue().bones);
    this.zombiesInCages = 0;
  }

  cagedZombieSacrificeValue(): {
    blood: number;
    brains: number;
    bones: number;
  } {
    return {
      blood: this.zombiesInCages * this.zombieHealth * 0.5,
      brains: this.zombiesInCages,
      bones: this.zombiesInCages * 3,
    };
  }

  startLevel(level: number): void {
    this.level = level;
    this.startGame();
  }

  startGame(): void {
    this.currentState = this.states.playingLevel;
    this.setupLevel();
    this.updatePlayingLevel();
    if (this.persistentData.autoRelease) {
      this.releaseCagedZombies();
    }
  }

  nextLevel(): void {
    this.level++;
    this.currentState = this.states.playingLevel;
    this.setupLevel();
    this.updatePlayingLevel();
    if (this.persistentData.autoRelease) {
      this.releaseCagedZombies();
    }
  }

  setupLevel(): void {
    this.endLevelTimer = this.endLevelDelay;
    setGameFieldSizeForLevel();
    this.particles.initialize();
    this.humans.populate();
    this.zombies.populate();
    this.graveyard.initialize();
    setTimeout(centerGameContainer, 10);
    this.upgrades.applyUpgrades();
    this.upgrades.updateRuneEffects();
    this.partFactory.applyGenerators();
    this.creatures.populate();
    this.skeleton.populate();
    this.addStartLevelResources();
    this.populateStats();
  }

  populateStats(): void {
    this.stats = {
      skeleton: {
        show: this.skeleton.persistent.skeletons > 0,
        health: this.zombieHealth * 10,
        damage: this.zombieDamage * 10,
        speed: this.skeleton.moveSpeed,
      },
      zombie: {
        health: this.zombieHealth,
        damage: this.zombieDamage,
        speed: this.zombieSpeed,
      },
      human: {
        health: this.humans.getMaxHealth(this.level),
        damage: this.humans.attackDamage,
        speed: this.humans.maxRunSpeed,
      },
      police: {
        show: this.police.getMaxPolice() > 0,
        health: this.police.getMaxHealth(),
        damage: this.police.attackDamage,
        speed: this.police.maxRunSpeed,
      },
      army: {
        show: this.army.getMaxArmy() > 0,
        health: this.army.getMaxHealth(),
        damage: this.army.attackDamage,
        speed: this.army.maxRunSpeed,
      },
    };
  }

  updateStats(): void {
    if (this.stats) {
      this.stats.zombie.health = this.zombieHealth;
      this.stats.zombie.damage = this.zombieDamage;
      this.stats.zombie.speed = this.zombieSpeed;
      this.stats.zombie.count = this.zombieCount;
      this.stats.skeleton.health = this.zombieHealth * 10;
      this.stats.skeleton.damage = this.zombieDamage * 10;
      this.stats.skeleton.speed = this.skeleton.moveSpeed;
    }
  }

  vipEscaped(): void {
    if (!this.persistentData.vipEscaped) {
      this.persistentData.vipEscaped = [];
    }
    this.persistentData.vipEscaped.push(this.level);
    this.saveData();
  }

  updatePlayingLevel(): void {
    this.saveData();
  }

  addStartLevelResources(): void {
    this.energy = this.energyMax;

    if (!this.levelResourcesAdded) {
      this.persistentData.blood += this.startingResources * 500;
      if (this.persistentData.blood > this.bloodMax)
        this.persistentData.blood = this.bloodMax;

      this.persistentData.brains += this.startingResources * 50;
      if (this.persistentData.brains > this.brainsMax)
        this.persistentData.brains = this.brainsMax;

      this.persistentData.bones += this.startingResources * 200;
      this.persistentData.bonesTotal += this.startingResources * 200;

      this.levelResourcesAdded = true;
    }
  }

  onReady(): void {
    this.upgrades.upgradeIdCheck();
  }

  lastSave = 0;

  persistentData = {
    saveCreated: Date.now(),
    dateOfSave: Date.now(),
    autoStart: false,
    autoStartWait: true,
    autoSellGear: false,
    autoSellGearLegendary: false,
    levelUnlocked: 1,
    allTimeHighestLevel: 0,
    blood: 0,
    brains: 0,
    bones: 0,
    parts: 0,
    bonesTotal: 0,
    upgrades: [],
    constructions: [],
    prestigePointsEarned: 0,
    prestigePointsToSpend: 0,
    boneCollectors: 0,
    graveyardZombies: 1,
    harpies: 0,
    resolution: 1,
    zoomButtons: false,
    particles: true,
    generators: [],
    currentConstruction: null,
    creatureLevels: [],
    creatures: [],
    creatureAutobuild: [],
    savedCreatures: [],
    levelsCompleted: [],
    showfps: false,
    runeshatter: 0,
    runes: {
      life: {
        blood: 0,
        brains: 0,
        bones: 0,
      },
      death: {
        blood: 0,
        brains: 0,
        bones: 0,
      },
    },
    trophies: [],
    vipEscaped: [],
    autoRelease: false,
    skeleton: null,
    skeletonTalents: [],
  };

  addPrestigePoints(points: number): void {
    if (typeof this.persistentData.prestigePointsEarned == "undefined") {
      this.persistentData.prestigePointsEarned = 0;
      this.persistentData.prestigePointsToSpend = 0;
    }
    this.persistentData.prestigePointsEarned += points;
  }

  prestige(): void {
    if (this.persistentData.prestigePointsEarned > 0) {
      this.persistentData.levelUnlocked = 1;
      this.persistentData.autoUpgrades = [];
      this.persistentData.blood = 0;
      this.persistentData.brains = 0;
      this.persistentData.bones = 0;
      this.persistentData.parts = 0;
      this.persistentData.generators = [];
      this.persistentData.bonesTotal = 0;
      this.persistentData.upgrades = this.persistentData.upgrades.filter(
        (upgrade) => upgrade.costType == this.upgrades.costs.prestigePoints
      );
      this.persistentData.constructions = [];
      this.persistentData.boneCollectors = 0;
      this.persistentData.currentConstruction = false;
      this.persistentData.harpies = 0;
      this.persistentData.graveyardZombies = 1;
      this.persistentData.prestigePointsToSpend +=
        this.persistentData.prestigePointsEarned;
      this.persistentData.prestigePointsEarned = 0;
      this.persistentData.runes = {
        life: {
          blood: 0,
          brains: 0,
          bones: 0,
        },
        death: {
          blood: 0,
          brains: 0,
          bones: 0,
        },
      };
      this.persistentData.vipEscaped = [];
      this.persistentData.creatureLevels = [];
      this.persistentData.creatureAutobuild = [];
      this.persistentData.levelsCompleted = [];
      this.persistentData.runeshatter = 0;
      this.zombiesInCages = 0;
      this.autoconstruction = false;
      this.levelResourcesAdded = false;
      this.gigazombies = false;
      this.runeEffects = {
        attackSpeed: 1,
        critChance: 0,
        critDamage: 0,
        damageReduction: 1,
        healthRegen: 0,
        damageReflection: 0,
      };
      this.boneCollectors.update(0.1);
      this.partFactory.generatorsApplied = [];
      this.creatureFactory.updateAutoBuild();
      this.creatureFactory.resetLevels();
      this.level = 1;
      this.currentState = this.states.prestiged;
      this.skeleton.persistent.talentReset = true;
      this.setupLevel();
      this.saveData();
      // NOTE: in CM, this block is removed to make autoupgrades persistent
      // I vaguely remember something finnicky happening if this is removed though I'll have to check later.
      // for (let i = 0; i < this.upgrades.upgrades.length; i++) {
      //   this.upgrades.upgrades[i].auto = false;
      // }
    }
  }

  saveData(): void {
    this.persistentData.dateOfSave = Date.now();
    try {
      localStorage.setItem(
        this.storageName,
        JSON.stringify(this.persistentData)
      );
      localStorage.setItem(
        this.skeleton.storageName,
        JSON.stringify(this.skeleton.persistent)
      );
      localStorage.setItem(
        this.skeleton.talentsStorageName,
        JSON.stringify(this.skeleton.talents)
      );
    } catch (e) {
      console.log(e);
    }
  }

  loadData(): void {
    try {
      if (localStorage.getItem(this.storageName) !== null) {
        this.persistentData = JSON.parse(
          localStorage.getItem(this.storageName)
        );
        this.level = this.persistentData.levelUnlocked;
        if (localStorage.getItem(this.skeleton.storageName) !== null) {
          this.skeleton.persistent = JSON.parse(
            localStorage.getItem(this.skeleton.storageName)
          );
        } else {
          this.skeleton.persistent = {
            xpRate: 0,
            skeletons: 0,
            level: 1,
            xp: 0,
            items: [],
            currItemId: 0,
            talentReset: false,
          };
        }
        if (localStorage.getItem(this.skeleton.talentsStorageName) !== null) {
          this.skeleton.talents = JSON.parse(
            localStorage.getItem(this.skeleton.talentsStorageName)
          );
        } else {
          this.skeleton.talents = [];
        }
        this.updatePersistentData();
        this.calcOfflineProgress();
      }
    } catch (e) {
      console.log(e);
    }
  }

  calcOfflineProgress(): void {
    this.upgrades.applyUpgrades();
    this.upgrades.updateRuneEffects();
    this.partFactory.applyGenerators();
    if (this.constructions.partFactory) {
      const timeDiff = (Date.now() - this.persistentData.dateOfSave) / 1000;
      const partsCreated = this.partFactory.updateLongTime(timeDiff);
      if (partsCreated > 0) {
        this.offlineMessage =
          "Your factory has generated " +
          formatWhole(partsCreated) +
          " parts while you were away";
        this.persistentData.parts += partsCreated;
      }
    }
  }

  resetData(): void {
    try {
      localStorage.removeItem(this.storageName);
      localStorage.removeItem(this.skeleton.storageName);
      localStorage.removeItem(this.skeleton.talentsStorageName);
    } catch (e) {
      console.log(e);
    }
  }

  updatePersistentData(): void {
    if (!this.persistentData.constructions) {
      this.persistentData.constructions = [];
    }
    if (!this.persistentData.generators) {
      this.persistentData.generators = [];
    }
    if (!this.persistentData.parts) {
      this.persistentData.parts = 0;
    }
    if (!this.persistentData.creatureLevels) {
      this.persistentData.creatureLevels = [];
    }
    if (!this.persistentData.creatureAutobuild) {
      this.persistentData.creatureAutobuild = [];
    }
    if (!this.persistentData.savedCreatures) {
      this.persistentData.savedCreatures = [];
    }
    if (!this.persistentData.levelsCompleted) {
      this.persistentData.levelsCompleted = [];
    }
    if (!this.persistentData.saveCreated) {
      this.persistentData.saveCreated = Date.now();
    }
    if (typeof this.persistentData.particles == "undefined") {
      this.persistentData.particles = true;
    }
    if (!this.persistentData.runeshatter) {
      this.persistentData.runeshatter = 0;
    }
    this.creatureFactory.updateAutoBuild();
  }

  sendMessage(message: string): void {
    if (this.messageQueue.indexOf(message) == -1) {
      this.messageQueue.push(message);
    }
  }

  setResolution(resolution: number): void {
    if (!this.app) return;

    this.app.renderer.resolution = resolution;

    if ((this.app.renderer as any).rootRenderTarget)
      (this.app.renderer as any).rootRenderTarget.resolution = resolution;

    this.app.renderer.plugins.interaction.resolution = resolution;
    this.app.renderer.resize(
      document.body.clientWidth,
      document.body.clientHeight
    );
  }

  downloadSaveGame(): void {
    this.persistentData.skeleton = this.skeleton.persistent;
    this.persistentData.skeletonTalents = this.skeleton.talents;
    this.blob = new Blob(
      [
        LZString.compressToEncodedURIComponent(
          JSON.stringify(this.persistentData)
        ),
      ],
      { type: "octet/stream" }
    );
    delete this.persistentData.skeleton;
    this.encodedContent = window.URL.createObjectURL(this.blob);
    const datestamp = new Date().toISOString().replace(/:|T|Z|\./g, "");
    this.savefilename = "incremancer-" + datestamp + ".sav";
  }

  importFile(): void {
    const files = document.getElementById("import-file").files;

    if (files && files.length == 1) {
      const file = files[0];
      const reader = new FileReader();
      const model = GameModel.getInstance();
      reader.onload = function (event) {
        const savegame = JSON.parse(
          LZString.decompressFromEncodedURIComponent(event.target.result)
        );
        if (savegame.dateOfSave) {
          if (savegame.skeleton) {
            model.skeleton.persistent = savegame.skeleton;
            delete savegame.skeleton;
          }
          if (savegame.skeletonTalents) {
            model.skeleton.talents = savegame.skeletonTalents;
            delete savegame.skeletonTalents;
          } else {
            model.skeleton.talents = [];
          }
          model.persistentData = savegame;
          model.updatePersistentData();
          model.level = model.persistentData.levelUnlocked;
          model.creatureFactory.spawnedSavedCreatures = false;
          model.setupLevel();
        } else {
          alert("Error loading save game");
        }
      };
      reader.readAsText(file);
    }
  }

  toggleFullscreen(): void {
    if (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    ) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    } else {
      const i = document.body;
      if (i.requestFullscreen) {
        i.requestFullscreen();
      } else if (i.webkitRequestFullscreen) {
        i.webkitRequestFullscreen();
      } else if (i.mozRequestFullScreen) {
        i.mozRequestFullScreen();
      } else if (i.msRequestFullscreen) {
        i.msRequestFullscreen();
      }
    }
  }

  prestigePointsForLevel(level: number): number {
    if (this.persistentData.levelsCompleted.indexOf(level) > -1) {
      return 0;
    } else {
      return level;
    }
  }

  bossCompleted(level: number): boolean {
    const bossLevel = Math.floor((level - 1) / 50) * 50;

    if (bossLevel < 50) return true;

    return this.persistentData.levelsCompleted.indexOf(bossLevel) > -1;
  }

  levelLocked(level: number): boolean {
    return (
      level > this.persistentData.allTimeHighestLevel + 1 ||
      !this.bossCompleted(level)
    );
  }

  isBossStage(level: number): boolean {
    return level > 0 && level % 50 == 0;
  }

  levelInfo(level: number): {
    level: number;
    bossStage: boolean;
    completed: boolean;
    locked: boolean;
    trophy: boolean;
  } {
    return {
      level: level,
      bossStage: this.isBossStage(level),
      completed: this.persistentData.levelsCompleted.indexOf(level) > -1,
      locked: this.levelLocked(level),
      trophy: this.trophies.doesLevelHaveTrophy(level),
    };
  }
}
