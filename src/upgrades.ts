import {
  GameModel,
  PartFactory,
  Skeleton,
  Spells,
  Trophies,
  getCostForUpgrades,
  getMaxUpgrades,
  formatWhole,
  format2Places,
} from "./internal";

const million = 1000000;

export class Upgrades {
  private static instance: Upgrades;
  constructor() {
    if (Upgrades.instance) return Upgrades.instance;
    Upgrades.instance = this;
  }

  gameModel = GameModel.getInstance();
  spells = new Spells();
  skeleton = new Skeleton();
  // trophies = new Trophies();
  partFactory = new PartFactory();

  types = {
    energyRate: "energyRate",
    energyCap: "energyCap",
    damage: "damage",
    health: "health",
    speed: "speed",
    brainsRate: "brainsRate",
    bonesRate: "bonesRate",
    bloodCap: "bloodCap",
    brainsCap: "brainsCap",
    brainRecoverChance: "brainRecoverChance",
    riseFromTheDeadChance: "riseFromTheDeadChance",
    boneCollectorCapacity: "boneCollectorCapacity",
    construction: "construction",
    infectedBite: "infectedBite",
    infectedBlast: "infectedBlast",
    plagueDamage: "plagueDamage",
    plagueTicks: "plagueTicks",
    burningSpeedPC: "burningSpeedPC",
    unlockSpell: "unlockSpell",
    spitDistance: "spitDistance",
    blastHealing: "blastHealing",
    plagueArmor: "plagueArmor",
    monsterLimit: "monsterLimit",
    runicSyphon: "runicSyphon",
    gigazombies: "gigazombies",
    bulletproof: "bulletproof",
    harpySpeed: "harpySpeed",
    tankBuster: "tankBuster",
    harpyBombs: "harpyBombs",
    spikeDelay: "spikeDelay",
    // prestige items
    bloodGainPC: "bloodGainPC",
    bloodStoragePC: "bloodStoragePC",
    brainsGainPC: "brainsGainPC",
    brainsStoragePC: "brainsStoragePC",
    bonesGainPC: "bonesGainPC",
    partsGainPC: "partsGainPC",
    zombieDmgPC: "zombieDmgPC",
    zombieHealthPC: "zombieHealthPC",
    HstrengthDmgPC: "HstrengthDmgPC",
    HshellHealthPC: "HshellHealthPC",
    CyroVatPC: "CyroVatPC",
    PlagueVatPC: "PlagueVatPC",
    CloningRepPC: "CloningRepPC",
    BloodSynPC: "BloodSynPC",
    SynBonePC: "SynBonePC",
    SmolPartsPC: "SmolPartsPC",
    golemHealthPC: "golemHealthPC",
    golemDamagePC: "golemDamagePC",
    startingPC: "startingPC",
    energyCost: "energyCost",
    autoconstruction: "autoconstruction",
    autoshop: "autoshop",
    graveyardHealth: "graveyardHealth",
    talentPoint: "talentPoint",
  };

  costs = {
    energy: "energy",
    blood: "blood",
    brains: "brains",
    bones: "bones",
    prestigePoints: "prestigePoints",
    parts: "parts",
  };

  hasRequirement(upgrade: Upgrade): boolean {
    if (
      upgrade.requires &&
      this.gameModel.persistentData.constructions.filter(
        (built) => built.id == upgrade.requires
      ).length == 0
    ) {
      return false;
    }
    return true;
  }

  getUpgrades(type: string): Upgrade[] {
    switch (type) {
      case this.costs.blood:
      case this.costs.brains:
      case this.costs.bones:
      case this.costs.parts:
        return this.upgrades.filter(
          (upgrade) =>
            upgrade.costType == type &&
            (upgrade.cap == 0 || this.currentRank(upgrade) < upgrade.cap) &&
            this.hasRequirement(upgrade)
        );
      case "completed":
        return this.upgrades.filter(
          (upgrade) =>
            upgrade.cap > 0 && this.currentRank(upgrade) >= upgrade.cap
        );
    }
  }

  applyUpgrades(): void {
    this.gameModel.resetToBaseStats();
    this.spells.lockAllSpells();
    for (let i = 0; i < this.gameModel.persistentData.upgrades.length; i++) {
      let upgrade = this.upgrades.filter(
        (up) => up.id == this.gameModel.persistentData.upgrades[i].id
      )[0];
      if (!upgrade) {
        upgrade = this.prestigeUpgrades.filter(
          (up) => up.id == this.gameModel.persistentData.upgrades[i].id
        )[0];
      }
      if (upgrade) {
        this.applyUpgrade(
          upgrade,
          this.gameModel.persistentData.upgrades[i].rank
        );
      }
    }
    for (
      let i = 0;
      i < this.gameModel.persistentData.constructions.length;
      i++
    ) {
      this.applyConstructionUpgrade(
        this.gameModel.persistentData.constructions[i]
      );
    }
    const trophies = new Trophies().getAquiredTrophyList();
    for (let i = 0; i < trophies.length; i++) {
      this.applyUpgrade(trophies[i], trophies[i].rank);
    }
    this.skeleton.applyUpgrades();
    this.gameModel.bloodMax *= this.gameModel.bloodStorePCMod;
    this.gameModel.brainsMax *= this.gameModel.brainsStorePCMod;
    this.gameModel.zombieDamage *= this.gameModel.zombieDamagePCMod;
    this.gameModel.zombieHealth *= this.gameModel.zombieHealthPCMod;
    if (this.gameModel.persistentData.runeshatter) {
      this.gameModel.zombieDamage *= this.shatterEffect();
      this.gameModel.zombieHealth *= this.shatterEffect();
      this.gameModel.zombieCost += this.gameModel.persistentData.runeshatter;
    }
    // if (this.gameModel.persistentData.gigazombiesOn) {
    //   this.gameModel.zombieCost *= 5;
    // }
  }

  applyUpgrade(upgrade: UpgradeEffect, rank: number): void {
    switch (upgrade.type) {
      case this.types.energyRate:
        this.gameModel.energyRate += upgrade.effect * rank;
        return;
      case this.types.brainsRate:
        this.gameModel.brainsRate += upgrade.effect * rank;
        return;
      case this.types.bonesRate:
        this.gameModel.bonesRate += upgrade.effect * rank;
        return;
      case this.types.energyCap:
        this.gameModel.energyMax += upgrade.effect * rank;
        return;
      case this.types.bloodCap:
        this.gameModel.bloodMax += upgrade.effect * rank;
        return;
      case this.types.brainsCap:
        this.gameModel.brainsMax += upgrade.effect * rank;
        return;
      case this.types.damage:
        this.gameModel.zombieDamage += upgrade.effect * rank;
        return;
      case this.types.speed:
        this.gameModel.zombieSpeed += upgrade.effect * rank;
        return;
      case this.types.health:
        this.gameModel.zombieHealth += upgrade.effect * rank;
        return;
      case this.types.brainRecoverChance:
        this.gameModel.brainRecoverChance += upgrade.effect * rank;
        return;
      case this.types.riseFromTheDeadChance:
        this.gameModel.riseFromTheDeadChance += upgrade.effect * rank;
        return;
      case this.types.infectedBite:
        this.gameModel.infectedBiteChance += upgrade.effect * rank;
        return;
      case this.types.infectedBlast:
        this.gameModel.infectedBlastChance += upgrade.effect * rank;
        return;
      case this.types.plagueDamage:
        this.gameModel.plagueDamageMod += upgrade.effect * rank;
        return;
      case this.types.plagueTicks:
        this.gameModel.plagueticks += upgrade.effect;
        return;
      case this.types.burningSpeedPC:
        this.gameModel.burningSpeedMod += upgrade.effect * rank;
        return;
      case this.types.construction:
        this.gameModel.construction = 1;
        return;
      case this.types.boneCollectorCapacity:
        this.gameModel.boneCollectorCapacity += upgrade.effect * rank;
        return;
      case this.types.unlockSpell:
        this.spells.unlockSpell(upgrade.effect);
        return;
      case this.types.spitDistance:
        this.gameModel.spitDistance = 30 + upgrade.effect * rank;
        return;
      case this.types.blastHealing:
        this.gameModel.blastHealing += upgrade.effect * rank;
        return;
      case this.types.plagueArmor:
        this.gameModel.plagueDmgReduction -= upgrade.effect * rank;
        return;
      case this.types.monsterLimit:
        this.gameModel.creatureLimit += upgrade.effect * rank;
        return;
      case this.types.runicSyphon:
        this.gameModel.runicSyphon.percentage += upgrade.effect * rank;
        return;
      // case this.types.gigazombies:
      //   this.gameModel.gigazombies = true;
      //   return;
      case this.types.bulletproof:
        this.gameModel.bulletproofChance += upgrade.effect * rank;
        return;
      case this.types.harpySpeed:
        this.gameModel.harpySpeed += upgrade.effect * rank;
        return;
      case this.types.tankBuster:
        this.gameModel.tankBuster = true;
        return;
      case this.types.harpyBombs:
        this.gameModel.harpyBombs += upgrade.effect * rank;
        return;
      case this.types.spikeDelay:
        this.gameModel.spikeDelay -= upgrade.effect * rank;
        return;
      // prestige items
      case this.types.bonesGainPC:
        this.gameModel.bonesPCMod *= Math.pow(1 + upgrade.effect, rank);
        return;
      case this.types.partsGainPC:
        this.gameModel.partsPCMod *= Math.pow(1 + upgrade.effect, rank);
        return;
      case this.types.bloodGainPC:
        this.gameModel.bloodPCMod *= Math.pow(1 + upgrade.effect, rank);
        return;
      case this.types.bloodStoragePC:
        this.gameModel.bloodStorePCMod *= Math.pow(1 + upgrade.effect, rank);
        return;
      case this.types.brainsGainPC:
        this.gameModel.brainsPCMod *= Math.pow(1 + upgrade.effect, rank);
        return;
      case this.types.brainsStoragePC:
        this.gameModel.brainsStorePCMod *= Math.pow(1 + upgrade.effect, rank);
        return;
      case this.types.zombieDmgPC:
        this.gameModel.zombieDamagePCMod *= Math.pow(1 + upgrade.effect, rank);
        return;
      case this.types.zombieHealthPC:
        this.gameModel.zombieHealthPCMod *= Math.pow(1 + upgrade.effect, rank);
        return;
      case this.types.HstrengthDmgPC:
        this.gameModel.zombieDamagePCMod *= Math.pow(1 + upgrade.effect, rank);
        this.gameModel.HstrengthDmgPCMod *= Math.pow(1 + upgrade.effect, rank);
        return;
      case this.types.HshellHealthPC:
        this.gameModel.zombieHealthPCMod *= Math.pow(1 + upgrade.effect, rank);
        this.gameModel.HshellHealthPCMod *= Math.pow(1 + upgrade.effect, rank);
        return;
      case this.types.CyroVatPC:
        this.gameModel.brainsMax *= Math.pow(1 + upgrade.effect, rank);
        this.gameModel.CyroVatPCMod *= Math.pow(1 + upgrade.effect, rank);
        return;
      case this.types.PlagueVatPC:
        this.gameModel.plagueDamageMod *= Math.pow(1 + upgrade.effect, rank);
        this.gameModel.PlagueVatPCMod *= Math.pow(1 + upgrade.effect, rank);
      case this.types.CloningRepPC:
        this.gameModel.brainsPCMod *= Math.pow(1 + upgrade.effect, rank);
        this.gameModel.CloningRepPCMod *= Math.pow(1 + upgrade.effect, rank);
        return;
      case this.types.BloodSynPC:
        this.gameModel.bloodPCMod *= Math.pow(1 + upgrade.effect, rank);
        this.gameModel.BloodSynPCMod *= Math.pow(1 + upgrade.effect, rank);
        return;
      case this.types.SynBonePC:
        this.gameModel.bonesPCMod *= Math.pow(1 + upgrade.effect, rank);
        this.gameModel.SynBonePCMod *= Math.pow(1 + upgrade.effect, rank);
        return;
      case this.types.SmolPartsPC:
        this.gameModel.partsPCMod *= Math.pow(1 + upgrade.effect, rank);
        this.gameModel.SmolPartsPCMod *= Math.pow(1 + upgrade.effect, rank);
        return;
      case this.types.golemDamagePC:
        this.gameModel.golemDamagePCMod *= Math.pow(1 + upgrade.effect, rank);
        return;
      case this.types.golemHealthPC:
        this.gameModel.golemHealthPCMod *= Math.pow(1 + upgrade.effect, rank);
        return;
      case this.types.startingPC:
        this.gameModel.startingResources += upgrade.effect * rank;
        return;
      case this.types.energyCost:
        this.gameModel.zombieCost -= upgrade.effect * rank;
        return;
      case this.types.autoconstruction:
        this.gameModel.autoconstructionUnlocked = true;
        return;
      case this.types.autoshop:
        this.gameModel.autoUpgrades = true;
        return;
      case this.types.graveyardHealth:
        this.gameModel.graveyardHealthMod *= Math.pow(1 + upgrade.effect, rank);
        return;
      case this.types.talentPoint:
        this.skeleton.talentPoints = rank;
        return;
    }
  }

  applyConstructionUpgrade(upgrade: Upgrade): void {
    switch (upgrade.type) {
      case this.constructionTypes.graveyard:
        this.gameModel.constructions.graveyard = 1;
        return;
      case this.constructionTypes.crypt:
        this.gameModel.constructions.crypt = 1;
        // this.gameModel.brainsStorePCMod += 0.5;
        // this.gameModel.bloodStorePCMod += 0.5;
        this.gameModel.brainsStorePCMod *= 1.5;
        this.gameModel.bloodStorePCMod *= 1.5;
        return;
      case this.constructionTypes.fort:
        this.gameModel.constructions.fort = 1;
        // this.gameModel.brainsStorePCMod += 0.6;
        // this.gameModel.bloodStorePCMod += 0.6;
        this.gameModel.brainsStorePCMod *= 1.6;
        this.gameModel.bloodStorePCMod *= 1.6;
        return;
      case this.constructionTypes.fortress:
        this.gameModel.constructions.fortress = 1;
        // this.gameModel.brainsStorePCMod += 0.7;
        // this.gameModel.bloodStorePCMod += 0.7;
        this.gameModel.brainsStorePCMod *= 1.7;
        this.gameModel.bloodStorePCMod *= 1.7;
        return;
      case this.constructionTypes.citadel:
        this.gameModel.constructions.citadel = 1;
        // this.gameModel.brainsStorePCMod += 0.8;
        // this.gameModel.bloodStorePCMod += 0.8;
        this.gameModel.brainsStorePCMod *= 1.8;
        this.gameModel.bloodStorePCMod *= 1.8;
        return;
      case this.constructionTypes.plagueSpikes:
        this.gameModel.constructions.plagueSpikes = 1;
        return;
      case this.constructionTypes.fence:
        this.gameModel.constructions.fence = 1;
        return;
      case this.constructionTypes.fenceSize:
        this.gameModel.fenceRadius += upgrade.effect * upgrade.rank;
        return;
      case this.constructionTypes.pit:
        this.gameModel.bloodMax += 1000000 * upgrade.rank;
        this.gameModel.brainsMax += 100000 * upgrade.rank;
        return;
      case this.constructionTypes.runesmith:
        this.gameModel.constructions.runesmith = 1;
        if (!this.gameModel.persistentData.runes) {
          this.gameModel.persistentData.runes = {
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
        }
        return;
      case this.constructionTypes.aviary:
        this.gameModel.constructions.aviary = 1;
        return;
      case this.constructionTypes.zombieCage:
        this.gameModel.zombieCages += upgrade.effect * upgrade.rank;
        return;
      case this.constructionTypes.partFactory:
        this.gameModel.constructions.partFactory = true;
        this.gameModel.constructions.factory = true;
        return;
      case this.constructionTypes.monsterFactory:
        this.gameModel.constructions.monsterFactory = true;
        this.gameModel.constructions.factory = true;
        return;
      case this.constructionTypes.HybridLab:
        this.gameModel.constructions.HybridLab = true;
        this.gameModel.brainsStorePCMod *= 2;
        this.gameModel.bloodStorePCMod *= 2;
        return;
      case this.constructionTypes.AdvHybridLab:
        this.gameModel.constructions.AdvHybridLab = true;
        this.gameModel.brainsStorePCMod *= 2;
        this.gameModel.bloodStorePCMod *= 2;
        return;
      case this.constructionTypes.MiniAssembLine:
        this.gameModel.constructions.MiniAssembLine = true;
        this.gameModel.brainsStorePCMod *= 2;
        this.gameModel.bloodStorePCMod *= 2;
        return;
      case this.constructionTypes.TechThinkTank:
        this.gameModel.constructions.TechThinkTank = true;
        this.gameModel.brainsStorePCMod *= 2;
        this.gameModel.bloodStorePCMod *= 2;
        return;
    }
  }

  displayStatValue(upgrade: Upgrade): string {
    switch (upgrade.type) {
      case this.types.energyRate:
        return (
          "Energy rate: " +
          format2Places(this.gameModel.energyRate) +
          " per second"
        );
      case this.types.energyCap:
        return "Maximum energy: " + formatWhole(this.gameModel.energyMax);
      case this.types.bloodCap:
        return "Maximum blood: " + formatWhole(this.gameModel.bloodMax);
      case this.types.brainsCap:
        return "Maximum brains: " + formatWhole(this.gameModel.brainsMax);
      case this.types.damage:
        return "Zombie damage: " + formatWhole(this.gameModel.zombieDamage);
      case this.types.speed:
        return "Zombie speed: " + formatWhole(this.gameModel.zombieSpeed);
      case this.types.health:
        return (
          "Zombie maximum health: " + formatWhole(this.gameModel.zombieHealth)
        );
      case this.types.brainRecoverChance:
        return (
          Math.round(this.gameModel.brainRecoverChance * 100) +
          "% chance to recover brain"
        );
      case this.types.riseFromTheDeadChance:
        return (
          Math.round(this.gameModel.riseFromTheDeadChance * 100) +
          "% chance for human corpses to turn into zombies"
        );
      case this.types.infectedBite:
        return (
          Math.round(this.gameModel.infectedBiteChance * 100) +
          "% chance for zombies to infect their targets"
        );
      case this.types.infectedBlast:
        return (
          Math.round(this.gameModel.infectedBlastChance * 100) +
          "% chance for zombies to explode on death"
        );
      case this.types.bulletproof:
        return (
          Math.round(this.gameModel.bulletproofChance * 100) +
          "% chance for earth golems to reflect bullets"
        );
      case this.types.construction:
        return this.gameModel.construction > 0
          ? "You have unlocked Unholy Construction"
          : "You have yet to unlock Unholy Construction";
      case this.types.boneCollectorCapacity:
        return (
          "Bone collector capacity: " +
          formatWhole(this.gameModel.boneCollectorCapacity)
        );
      case this.types.bonesGainPC:
        return (
          "Bones: " +
          formatWhole(Math.round(this.gameModel.bonesPCMod * 100)) +
          "%"
        );
      case this.types.partsGainPC:
        return (
          "Parts: " +
          formatWhole(Math.round(this.gameModel.partsPCMod * 100)) +
          "%"
        );
      case this.types.bloodGainPC:
        return (
          "Blood: " +
          formatWhole(Math.round(this.gameModel.bloodPCMod * 100)) +
          "%"
        );
      case this.types.bloodStoragePC:
        return (
          "Blood Storage: " +
          formatWhole(this.gameModel.bloodStorePCMod * 100) +
          "%"
        );
      case this.types.brainsGainPC:
        return (
          "Brains: " +
          formatWhole(Math.round(this.gameModel.brainsPCMod * 100)) +
          "%"
        );
      case this.types.brainsStoragePC:
        return (
          "Brains Storage: " +
          formatWhole(this.gameModel.brainsStorePCMod * 100) +
          "%"
        );
      case this.types.zombieDmgPC:
        return (
          "Zombie Damage: " +
          Math.round(this.gameModel.zombieDamagePCMod * 100) +
          "%"
        );
      case this.types.zombieHealthPC:
        return (
          "Zombie Health: " +
          Math.round(this.gameModel.zombieHealthPCMod * 100) +
          "%"
        );
      case this.types.HstrengthDmgPC:
        return (
          "Zombie Damage: " +
          Math.round(100 * this.gameModel.HstrengthDmgPCMod) +
          "%"
        );
      case this.types.HshellHealthPC:
        return (
          "Zombie Health: " +
          Math.round(100 * this.gameModel.HshellHealthPCMod) +
          "%"
        );
      case this.types.CyroVatPC:
        return (
          "Brains Storage: " +
          Math.round(100 * this.gameModel.CyroVatPCMod) +
          "%"
        );
      case this.types.PlagueVatPC:
        return (
          "Plague Damage: " +
          Math.round(100 * this.gameModel.PlagueVatPCMod) +
          "%"
        );
      case this.types.CloningRepPC:
        return (
          "Additional Brain Income: " +
          Math.round(100 * this.gameModel.CloningRepPCMod) +
          "%"
        );
      case this.types.BloodSynPC:
        return (
          "Additional Blood Income: " +
          Math.round(100 * this.gameModel.BloodSynPCMod) +
          "%"
        );
      case this.types.SynBonePC:
        return (
          "Additional Bone Income: " +
          Math.round(100 * this.gameModel.SynBonePCMod) +
          "%"
        );
      case this.types.SmolPartsPC:
        return (
          "Additional Parts Income: " +
          Math.round(100 * this.gameModel.SmolPartsPCMod) +
          "%"
        );
      case this.types.golemDamagePC:
        return (
          "Golem Damage: " +
          Math.round(this.gameModel.golemDamagePCMod * 100) +
          "%"
        );
      case this.types.golemHealthPC:
        return (
          "Golem Health: " +
          Math.round(this.gameModel.golemHealthPCMod * 100) +
          "%"
        );
      case this.types.startingPC:
        return (
          Math.round(this.gameModel.startingResources * 500) +
          " blood, " +
          Math.round(this.gameModel.startingResources * 50) +
          " brains, " +
          Math.round(this.gameModel.startingResources * 200) +
          " bones"
        );
      case this.types.unlockSpell:
        return this.currentRank(upgrade) > 0
          ? "You have learned this spell"
          : "You have yet to learn this spell";
      case this.types.energyCost:
        return "Zombie Cost: " + this.gameModel.zombieCost + " energy";
      case this.types.burningSpeedPC:
        return (
          "Burning zombie speed: " +
          Math.round(this.gameModel.burningSpeedMod * 100) +
          "%"
        );
      case this.types.blastHealing:
        return (
          "Plague heal: " + Math.round(this.gameModel.blastHealing * 100) + "%"
        );
      case this.types.spitDistance:
        return "Zombie spit distance: " + this.gameModel.spitDistance;
      case this.types.plagueArmor:
        return (
          "Infected damage reduction: " +
          Math.round(100 - this.gameModel.plagueDmgReduction * 100) +
          "%"
        );
      case this.types.monsterLimit:
        return "Creature limit: " + this.gameModel.creatureLimit;
      case this.types.runicSyphon:
        return (
          "Syphon amount: " +
          Math.round(this.gameModel.runicSyphon.percentage * 100) +
          "%"
        );
      case this.types.autoconstruction:
        return this.currentRank(upgrade) > 0
          ? "You have unlocked automatic construction"
          : "You have yet to unlock automatic construction";
      case this.types.autoshop:
        return this.currentRank(upgrade) > 0
          ? "You have unlocked automatic shop purchases"
          : "You have yet to unlock automatic shop purchases";
      case this.types.graveyardHealth:
        return (
          "Graveyard health: " +
          Math.round(this.gameModel.graveyardHealthMod * 100) +
          "%"
        );
      // case this.types.gigazombies:
      // return this.currentRank(upgrade) > 0 ? "You have unlocked more gigazombies" : "You have yet to unlock more gigazombies";
      case this.types.harpySpeed:
        return "Harpy speed: " + formatWhole(this.gameModel.harpySpeed);
      case this.types.harpyBombs:
        return "Harpy bombs: " + formatWhole(this.gameModel.harpyBombs);
      case this.types.tankBuster:
        return this.currentRank(upgrade) > 0
          ? "You have unlocked tank buster"
          : "You have yet to unlock tank buster";
      case this.types.spikeDelay:
        return (
          "Current spike delay: " + (5 - this.currentRank(upgrade)) + " seconds"
        );
    }
  }

  currentRank(upgrade: Upgrade): number {
    for (let i = 0; i < this.gameModel.persistentData.upgrades.length; i++) {
      const ownedUpgrade = this.gameModel.persistentData.upgrades[i];
      if (upgrade.id == ownedUpgrade.id) {
        return ownedUpgrade.rank;
      }
    }
    return 0;
  }

  currentRankConstruction(upgrade: Construction): number {
    if (this.gameModel.persistentData.constructions)
      for (
        let i = 0;
        i < this.gameModel.persistentData.constructions.length;
        i++
      ) {
        const ownedUpgrade = this.gameModel.persistentData.constructions[i];
        if (upgrade.id == ownedUpgrade.id) {
          return ownedUpgrade.rank;
        }
      }
    return 0;
  }

  upgradePrice(upgrade: Upgrade): number {
    return Math.round(
      upgrade.basePrice *
        Math.pow(upgrade.multiplier, this.currentRank(upgrade))
    );
  }

  upgradeMaxAffordable(upgrade: Upgrade): number {
    const currentRank = this.currentRank(upgrade);
    let maxAffordable = 0;
    switch (upgrade.costType) {
      case this.costs.blood:
        maxAffordable = getMaxUpgrades(
          upgrade.basePrice,
          upgrade.multiplier,
          currentRank,
          this.gameModel.persistentData.blood
        );
        break;
      case this.costs.brains:
        maxAffordable = getMaxUpgrades(
          upgrade.basePrice,
          upgrade.multiplier,
          currentRank,
          this.gameModel.persistentData.brains
        );
        break;
      case this.costs.bones:
        maxAffordable = getMaxUpgrades(
          upgrade.basePrice,
          upgrade.multiplier,
          currentRank,
          this.gameModel.persistentData.bones
        );
        break;
      case this.costs.parts:
        maxAffordable = getMaxUpgrades(
          upgrade.basePrice,
          upgrade.multiplier,
          currentRank,
          this.gameModel.persistentData.parts
        );
        break;
      case this.costs.prestigePoints:
        maxAffordable = getMaxUpgrades(
          upgrade.basePrice,
          upgrade.multiplier,
          currentRank,
          this.gameModel.persistentData.prestigePointsToSpend
        );
        break;
    }
    if (upgrade.cap != 0) {
      return Math.min(maxAffordable, upgrade.cap - currentRank);
    }
    return maxAffordable;
  }

  upgradeMaxPrice(upgrade: Upgrade, number: number): number {
    return getCostForUpgrades(
      upgrade.basePrice,
      upgrade.multiplier,
      this.currentRank(upgrade),
      number
    );
  }

  canAffordUpgrade(upgrade: Upgrade): boolean {
    if (upgrade.cap > 0 && this.currentRank(upgrade) >= upgrade.cap) {
      upgrade.auto = false;
      return false;
    }
    switch (upgrade.costType) {
      case this.costs.energy:
        return this.gameModel.energy >= this.upgradePrice(upgrade);
      case this.costs.blood:
        return (
          this.gameModel.persistentData.blood >= this.upgradePrice(upgrade)
        );
      case this.costs.brains:
        return (
          this.gameModel.persistentData.brains >= this.upgradePrice(upgrade)
        );
      case this.costs.bones:
        return (
          this.gameModel.persistentData.bones >= this.upgradePrice(upgrade)
        );
      case this.costs.parts:
        return (
          this.gameModel.persistentData.parts >= this.upgradePrice(upgrade)
        );
      case this.costs.prestigePoints:
        return (
          this.gameModel.persistentData.prestigePointsToSpend >=
          this.upgradePrice(upgrade)
        );
    }
    return false;
  }

  constructionLeadsTo(construction: Construction): string {
    let text = this.constructionUpgrades
      .filter((upgrade) => upgrade.requires == construction.id)
      .map((upgrade) => upgrade.name)
      .join(", ");
    text += this.upgrades
      .filter((upgrade) => upgrade.requires == construction.id)
      .map((upgrade) => upgrade.name)
      .join(", ");
    return text;
  }

  purchaseMaxUpgrades(upgrade: Upgrade): void {
    const amount = this.upgradeMaxAffordable(upgrade);
    for (let i = 0; i < amount; i++) {
      this.purchaseUpgrade(upgrade, false);
    }
    this.gameModel.saveData();
  }

  purchaseUpgrade(upgrade: Upgrade, save = true): void {
    if (this.canAffordUpgrade(upgrade)) {
      let prestige = false;
      switch (upgrade.costType) {
        case this.costs.energy:
          this.gameModel.energy -= this.upgradePrice(upgrade);
          break;
        case this.costs.blood:
          this.gameModel.persistentData.blood -= this.upgradePrice(upgrade);
          break;
        case this.costs.brains:
          this.gameModel.persistentData.brains -= this.upgradePrice(upgrade);
          break;
        case this.costs.bones:
          this.gameModel.persistentData.bones -= this.upgradePrice(upgrade);
          break;
        case this.costs.prestigePoints:
          prestige = true;
          this.gameModel.persistentData.prestigePointsToSpend -=
            this.upgradePrice(upgrade);
          break;
        case this.costs.parts:
          this.gameModel.persistentData.parts -= this.upgradePrice(upgrade);
          break;
      }
      let ownedUpgrade;
      for (let i = 0; i < this.gameModel.persistentData.upgrades.length; i++) {
        if (upgrade.id == this.gameModel.persistentData.upgrades[i].id) {
          ownedUpgrade = true;
          this.gameModel.persistentData.upgrades[i] = {
            id: upgrade.id,
            rank: this.gameModel.persistentData.upgrades[i].rank + 1,
          };
          if (prestige) {
            this.gameModel.persistentData.upgrades[i].costType =
              this.costs.prestigePoints;
          }
          break;
        }
      }
      if (!ownedUpgrade) {
        const persistUpgrade = {
          id: upgrade.id,
          rank: 1,
          costType: null,
        };
        if (prestige) {
          persistUpgrade.costType = this.costs.prestigePoints;
        }
        this.gameModel.persistentData.upgrades.push(persistUpgrade);
      }

      if (save) this.gameModel.saveData();

      this.applyUpgrades();
      if (upgrade.purchaseMessage) {
        this.gameModel.sendMessage(upgrade.purchaseMessage);
      }
    }
  }

  constructionStates = {
    building: "building",
    paused: "paused",
    autoPaused: "autoPaused",
  };

  constructionTickTimer = 1;

  removeUpgrade(upgrade: Upgrade) {
    for (let i = 0; i < this.gameModel.persistentData.upgrades.length; i++)
      if (upgrade.id == this.gameModel.persistentData.upgrades[i].id) {
        this.gameModel.persistentData.upgrades[i] = { id: upgrade.id, rank: 0 };
        break;
      }
    this.applyUpgrades();
  }

  consumeResources(costPerTick: {
    blood: number;
    brains: number;
    bones: number;
    parts: number;
    energy: number;
  }): boolean {
    // check for full availablity first
    let hasEnough = true;
    this.gameModel.persistentData.currentConstruction.shortfall = {};
    if (costPerTick.energy && costPerTick.energy > this.gameModel.energy) {
      hasEnough = false;
      this.gameModel.persistentData.currentConstruction.shortfall.energy = true;
    }
    if (
      costPerTick.blood &&
      costPerTick.blood > this.gameModel.persistentData.blood
    ) {
      hasEnough = false;
      this.gameModel.persistentData.currentConstruction.shortfall.blood = true;
    }
    if (
      costPerTick.brains &&
      costPerTick.brains > this.gameModel.persistentData.brains
    ) {
      hasEnough = false;
      this.gameModel.persistentData.currentConstruction.shortfall.brains = true;
    }
    if (
      costPerTick.bones &&
      costPerTick.bones > this.gameModel.persistentData.bones
    ) {
      hasEnough = false;
      this.gameModel.persistentData.currentConstruction.shortfall.bones = true;
    }
    if (
      costPerTick.parts &&
      costPerTick.parts > this.gameModel.persistentData.parts
    ) {
      hasEnough = false;
      this.gameModel.persistentData.currentConstruction.shortfall.parts = true;
    }
    if (!hasEnough) return false;

    this.gameModel.persistentData.currentConstruction.shortfall = false;
    // then consume
    if (costPerTick.energy) this.gameModel.energy -= costPerTick.energy;
    if (costPerTick.blood)
      this.gameModel.persistentData.blood -= costPerTick.blood;
    if (costPerTick.brains)
      this.gameModel.persistentData.brains -= costPerTick.brains;
    if (costPerTick.bones)
      this.gameModel.persistentData.bones -= costPerTick.bones;
    if (costPerTick.parts)
      this.gameModel.persistentData.parts -= costPerTick.parts;
    return true;
  }

  angularModel = null;

  completeConstruction(): void {
    const upgrade = this.constructionUpgrades.filter(
      (upgrade) =>
        upgrade.id == this.gameModel.persistentData.currentConstruction.id
    )[0];
    let ownedUpgrade;
    for (
      let i = 0;
      i < this.gameModel.persistentData.constructions.length;
      i++
    ) {
      if (upgrade.id == this.gameModel.persistentData.constructions[i].id) {
        ownedUpgrade = this.gameModel.persistentData.constructions[i];
        ownedUpgrade.effect = upgrade.effect;
        ownedUpgrade.rank++;
      }
    }
    if (!ownedUpgrade)
      this.gameModel.persistentData.constructions.push({
        id: upgrade.id,
        name: upgrade.name,
        rank: 1,
        type: upgrade.type,
        effect: upgrade.effect,
      });
    this.gameModel.persistentData.currentConstruction = false;
    this.gameModel.saveData();
    this.applyUpgrades();
    this.angularModel.updateConstructionUpgrades();
    this.gameModel.sendMessage(
      "Construction of " + upgrade.name + " complete!"
    );
    if (upgrade.completeMessage) {
      this.gameModel.sendMessage(upgrade.completeMessage);
    }
  }

  updateAutoUpgrades(): void {
    if (this.gameModel.autoUpgrades) {
      for (let i = 0; i < this.upgrades.length; i++) {
        if (this.upgrades[i].auto) {
          this.purchaseUpgrade(this.upgrades[i], false);
        }
      }
      if (this.gameModel.constructions.factory) {
        for (let i = 0; i < this.partFactory.generators.length; i++) {
          if (this.partFactory.generators[i].auto) {
            this.partFactory.purchaseGenerator(
              this.partFactory.generators[i],
              false
            );
          }
        }
      }
    }
    if (this.gameModel.autoShatter) {
      this.doShatter();
    }
  }

  updateConstruction(timeDiff: number): void {
    if (
      (!this.gameModel.persistentData.currentConstruction &&
        !this.gameModel.autoconstruction) ||
      this.gameModel.persistentData.currentConstruction.state ==
        this.constructionStates.paused
    )
      return;

    if (this.gameModel.persistentData.currentConstruction) {
      this.constructionTickTimer -= timeDiff;
      if (this.constructionTickTimer < 0) {
        this.constructionTickTimer = 1;
        if (
          this.consumeResources(
            this.gameModel.persistentData.currentConstruction.costPerTick
          )
        ) {
          this.gameModel.persistentData.currentConstruction.state =
            this.constructionStates.building;
          this.gameModel.persistentData.currentConstruction.timeRemaining -= 1;
          if (
            this.gameModel.persistentData.currentConstruction.timeRemaining <= 0
          ) {
            this.completeConstruction();
          }
        } else {
          this.gameModel.persistentData.currentConstruction.state =
            this.constructionStates.autoPaused;
        }
      }
    } else if (this.gameModel.autoconstruction) {
      const upgrades = this.getAvailableConstructions();
      if (!upgrades || upgrades.length == 0) {
        this.gameModel.autoconstruction = false;
        return;
      }
      let cheapestUpgrade = null;
      let lowestCost = 0;
      for (let i = 0; i < upgrades.length; i++) {
        const cost =
          (upgrades[i].costs.energy || 0) +
          (upgrades[i].costs.blood || 0) +
          (upgrades[i].costs.brains || 0) +
          (upgrades[i].costs.bones || 0) +
          (upgrades[i].costs.parts || 0) * 100;
        if (cost < lowestCost || !cheapestUpgrade) {
          lowestCost = cost;
          cheapestUpgrade = upgrades[i];
        }
      }
      if (cheapestUpgrade) {
        setTimeout(() => this.startConstruction(cheapestUpgrade));
      }
    }
  }

  startConstruction(upgrade: Construction): void {
    if (this.gameModel.persistentData.currentConstruction) return;

    const fastMode =
      this.gameModel.persistentData.blood >= (upgrade.costs.blood || 0) &&
      this.gameModel.persistentData.brains >= (upgrade.costs.brains || 0) &&
      this.gameModel.persistentData.bones >= (upgrade.costs.bones || 0) &&
      this.gameModel.persistentData.parts >= (upgrade.costs.parts || 0) &&
      this.gameModel.energy >= (upgrade.costs.energy || 0);

    const costPerTick = {
      energy: 0,
      blood: 0,
      brains: 0,
      bones: 0,
      parts: 0,
    };
    if (upgrade.costs.energy)
      costPerTick.energy = upgrade.costs.energy / (fastMode ? 5 : upgrade.time);
    if (upgrade.costs.blood)
      costPerTick.blood = upgrade.costs.blood / (fastMode ? 5 : upgrade.time);
    if (upgrade.costs.brains)
      costPerTick.brains = upgrade.costs.brains / (fastMode ? 5 : upgrade.time);
    if (upgrade.costs.bones)
      costPerTick.bones = upgrade.costs.bones / (fastMode ? 5 : upgrade.time);
    if (upgrade.costs.parts)
      costPerTick.parts = upgrade.costs.parts / (fastMode ? 5 : upgrade.time);

    this.gameModel.persistentData.currentConstruction = {
      state: this.constructionStates.building,
      name: upgrade.name,
      id: upgrade.id,
      timeRemaining: fastMode ? 5 : upgrade.time,
      time: fastMode ? 5 : upgrade.time,
      costPerTick: costPerTick,
    };
  }

  playPauseConstruction(): void {
    if (!this.gameModel.persistentData.currentConstruction) return;

    if (
      this.gameModel.persistentData.currentConstruction.state ==
      this.constructionStates.paused
    ) {
      this.gameModel.persistentData.currentConstruction.state =
        this.constructionStates.building;
    } else {
      this.gameModel.persistentData.currentConstruction.state =
        this.constructionStates.paused;
    }
  }

  cancelConstruction(): void {
    this.gameModel.persistentData.currentConstruction = false;
  }

  constructionAvailable(construction: Construction): boolean {
    if (
      this.gameModel.persistentData.currentConstruction &&
      this.gameModel.persistentData.currentConstruction.id == construction.id
    )
      return false;

    if (this.currentRankConstruction(construction) >= construction.cap)
      return false;

    if (
      construction.requires &&
      this.gameModel.persistentData.constructions.filter(
        (built) => built.id == construction.requires
      ).length == 0
    )
      return false;

    return true;
  }

  constructionComplete(construction: Construction): boolean {
    return this.currentRankConstruction(construction) >= construction.cap;
  }

  getAvailableConstructions(): Construction[] {
    return this.constructionUpgrades.filter((construction) =>
      this.constructionAvailable(construction)
    );
  }

  getCompletedConstructions(): Construction[] {
    return this.constructionUpgrades.filter((construction) =>
      this.constructionComplete(construction)
    );
  }

  upgradeIdCheck(): void {
    const ids = [];
    this.upgrades.forEach(function (upgrade) {
      if (ids[upgrade.id]) {
        console.error("ID " + upgrade.id + " already used");
      }
      ids[upgrade.id] = true;
    });
    this.prestigeUpgrades.forEach(function (upgrade) {
      if (ids[upgrade.id]) {
        console.error("ID " + upgrade.id + " already used");
      }
      ids[upgrade.id] = true;
    });
    this.constructionUpgrades.forEach(function (upgrade) {
      if (ids[upgrade.id]) {
        console.error("ID " + upgrade.id + " already used");
      }
      ids[upgrade.id] = true;
    });
  }

  runeCalculations = [
    {
      rune: "death",
      effect: "attackSpeed",
      cost: "blood",
      logBase: 1.1,
      adjustment: -70,
      subtract: false,
      cap: 0,
    },
    {
      rune: "death",
      effect: "critChance",
      cost: "brains",
      logBase: 1.3,
      adjustment: -20,
      cap: 0.8,
    },
    {
      rune: "death",
      effect: "critDamage",
      cost: "bones",
      logBase: 1.05,
      adjustment: -100,
      cap: 0,
    },
    {
      rune: "life",
      effect: "damageReduction",
      cost: "blood",
      logBase: 1.5,
      adjustment: -15,
      subtract: true,
      cap: 0.8,
    },
    {
      rune: "life",
      effect: "healthRegen",
      cost: "brains",
      logBase: 2.9,
      adjustment: -5.5,
      cap: 0.5,
    },
    {
      rune: "life",
      effect: "damageReflection",
      cost: "bones",
      logBase: 1.24,
      adjustment: -30,
      cap: 1,
    },
  ];

  updateRunicSyphon(runicSyphon: {
    blood: number;
    brains: number;
    bones: number;
    percentage: number;
  }): void {
    if (runicSyphon.percentage > 0) {
      this.gameModel.persistentData.runes.life.blood += runicSyphon.blood / 2;
      this.gameModel.persistentData.runes.death.blood += runicSyphon.blood / 2;
      this.gameModel.persistentData.runes.life.brains += runicSyphon.brains / 2;
      this.gameModel.persistentData.runes.death.brains +=
        runicSyphon.brains / 2;
      this.gameModel.persistentData.runes.life.bones += runicSyphon.bones / 2;
      this.gameModel.persistentData.runes.death.bones += runicSyphon.bones / 2;
      runicSyphon.blood = 0;
      runicSyphon.brains = 0;
      runicSyphon.bones = 0;
      this.updateRuneEffects();
    }
  }

  shatterPercent(rune: Rune): number {
    const amountRequired =
      100000000 * Math.pow(1.5, this.gameModel.persistentData.runeshatter);
    return Math.floor(Math.min(1, rune.blood / amountRequired) * 100);
  }

  shatterBloodCost(rune: Rune): number {
    return Math.max(
      0,
      100000000 * Math.pow(1.5, this.gameModel.persistentData.runeshatter) -
        rune.blood
    );
  }

  shatterEffect(): number {
    return Math.pow(1.1, this.gameModel.persistentData.runeshatter);
  }

  canShatter(): boolean {
    if (!this.gameModel.persistentData.runes) return false;
    return (
      this.shatterPercent(this.gameModel.persistentData.runes.life) +
        this.shatterPercent(this.gameModel.persistentData.runes.death) ==
      200
    );
  }

  doShatter(): void {
    if (this.canShatter()) {
      this.gameModel.persistentData.runeshatter++;
      this.gameModel.persistentData.runes.life.blood = 0;
      this.gameModel.persistentData.runes.death.blood = 0;
      this.gameModel.persistentData.runes.life.brains = 0;
      this.gameModel.persistentData.runes.death.brains = 0;
      this.gameModel.persistentData.runes.life.bones = 0;
      this.gameModel.persistentData.runes.death.bones = 0;
      this.updateRuneEffects();
      this.applyUpgrades();
    }
  }

  infuseRune(runeType: string, costType: string, amount: number): void {
    const rune =
      runeType == "life"
        ? this.gameModel.persistentData.runes.life
        : this.gameModel.persistentData.runes.death;
    switch (costType) {
      case "blood":
        if (this.gameModel.persistentData.blood >= amount) {
          rune.blood += amount;
          this.gameModel.persistentData.blood -= amount;
        }
        break;
      case "brains":
        if (this.gameModel.persistentData.brains >= amount) {
          rune.brains += amount;
          this.gameModel.persistentData.brains -= amount;
        }
        break;
      case "bones":
        if (this.gameModel.persistentData.bones >= amount) {
          rune.bones += amount;
          this.gameModel.persistentData.bones -= amount;
        }
        break;
    }
    this.updateRuneEffects();
  }

  updateRuneEffects(): void {
    if (!this.gameModel.persistentData.runes) return;

    const runeEffects = {
      attackSpeed: 1,
      critChance: 0,
      critDamage: 1,
      damageReduction: 1,
      healthRegen: 0,
      damageReflection: 0,
    };

    for (let i = 0; i < this.runeCalculations.length; i++) {
      const calculation = this.runeCalculations[i];
      const infusionAmount =
        this.gameModel.persistentData.runes[calculation.rune][calculation.cost];
      if (infusionAmount > 0) {
        let result =
          (Math.log(infusionAmount) / Math.log(calculation.logBase) +
            calculation.adjustment) /
          100;
        if (result > 0) {
          if (calculation.cap && result > calculation.cap) {
            result = calculation.cap;
          }
          if (calculation.subtract) {
            runeEffects[calculation.effect] -= result;
          } else {
            runeEffects[calculation.effect] += result;
          }
        }
      }
    }
    this.gameModel.runeEffects = runeEffects;
  }

  constructionTypes = {
    graveyard: "graveyard",
    crypt: "crypt",
    fort: "fort",
    fortress: "fortress",
    citadel: "citadel",
    fence: "fence",
    fenceSize: "fenceSize",
    plagueWorkshop: "plagueWorkshop",
    plagueLaboratory: "plagueLaboratory",
    plagueSpikes: "plagueSpikes",
    spellTower: "spellTower",
    runesmith: "runesmith",
    aviary: "aviary",
    zombieCage: "zombieCage",
    partFactory: "partFactory",
    monsterFactory: "monsterFactory",
    pit: "pit",
    harpy: "harpy",
    HybridLab: "HybridLab",
    AdvHybridLab: "AdvHybridLab",
    MiniAssembLine: "MiniAssembLine",
    TechThinkTank: "TechThinkTank",
  };

  constructionUpgrades = [
    new Construction(
      201,
      "Cursed Graveyard",
      this.constructionTypes.graveyard,
      { blood: 1800 },
      30,
      1,
      1,
      1,
      null,
      "Construct a Cursed Graveyard in the town that will automatically spawn zombies when your energy is at its maximum!",
      "Graveyard menu now available!"
    ),
    new Construction(
      205,
      "Crypt",
      this.constructionTypes.crypt,
      { blood: 21000, bones: 2220 },
      60,
      1,
      1,
      1,
      201,
      "Construct a Crypt in your graveyard. This will give you a nice dark and quiet place to think. The additional space will also allow you to store 50% more blood and brains!",
      null
    ),
    new Construction(
      206,
      "Bone Fort",
      this.constructionTypes.fort,
      { blood: 60000, bones: 6000, energy: 60 },
      60,
      1,
      1,
      1,
      205,
      "Turn your crypt into a fort. The additional space will also allow you to store 60% more blood and brains.",
      "New upgrades are available in the shop!"
    ),
    new Construction(
      207,
      "Bone Fortress",
      this.constructionTypes.fortress,
      { blood: 100000, bones: 9000, energy: 90 },
      60,
      1,
      1,
      1,
      206,
      "Turn your fort into a fortress. The additional space will also allow you to store 70% more blood and brains.",
      null
    ),
    new Construction(
      211,
      "Bone Citadel",
      this.constructionTypes.citadel,
      { blood: 200000, bones: 12000, energy: 120 },
      60,
      1,
      1,
      1,
      207,
      "Turn your fortress into a towering citadel that looms over the town. The additional space will also allow you to store 80% more blood and brains.",
      "New upgrades are available in the shop!"
    ),
    new Construction(
      202,
      "Perimeter Fence",
      this.constructionTypes.fence,
      { bones: 880, energy: 22 },
      44,
      1,
      1,
      1,
      201,
      "Build a protective fence around the graveyard that will reduce damage taken by zombies inside by 50%.",
      null
    ),
    new Construction(
      203,
      "Bigger Fence",
      this.constructionTypes.fenceSize,
      { bones: 880, energy: 22 },
      44,
      1,
      10,
      4,
      202,
      "Enlarge the fence so a greater area is protected.",
      null
    ),
    new Construction(
      204,
      "Plague Workshop",
      this.constructionTypes.plagueWorkshop,
      { blood: 10200, brains: 600 },
      60,
      1,
      1,
      1,
      205,
      "Build a laboratory to study the effects of plague. This will unlock new upgrades in the shop.",
      "Plague upgrades now available!"
    ),
    new Construction(
      208,
      "Plague Spikes",
      this.constructionTypes.plagueSpikes,
      { brains: 3000, bones: 1000 },
      30,
      1,
      1,
      1,
      204,
      "Booby trap the area around your graveyard with cruel spikes that infect trespassing humans with the plague.",
      null
    ),
    new Construction(
      209,
      "Spell Tower",
      this.constructionTypes.spellTower,
      { brains: 3000, blood: 30000 },
      30,
      1,
      1,
      1,
      206,
      "Dedicate one tower of your fort to the study of spellcraft. Perhaps you can learn some new spells?",
      "Spells now available in the shop!"
    ),
    new Construction(
      210,
      "Runesmith",
      this.constructionTypes.runesmith,
      { bones: 3000, blood: 120000, brains: 1000 },
      30,
      1,
      1,
      1,
      207,
      "Build a runesmith's workshop in order to fortify your zombies with powerful runes.",
      null
    ),
    new Construction(
      212,
      "Accursed Aviary",
      this.constructionTypes.aviary,
      { bones: 6000, blood: 220000, brains: 2000 },
      60,
      1,
      1,
      1,
      211,
      "Construct an aviary on top of your citadel so you can release wicked harpies to bomb the townspeople.",
      "Harpies available for hire in the graveyard menu"
    ),
    new Construction(
      213,
      "Zombie Cage",
      this.constructionTypes.zombieCage,
      { bones: 600, blood: 900 },
      30,
      1,
      5,
      1,
      201,
      "Build a cage to contain surplus zombies once a town is defeated.",
      null
    ),
    new Construction(
      214,
      "Second Zombie Cage",
      this.constructionTypes.zombieCage,
      { bones: 1200, blood: 1800 },
      30,
      1,
      10,
      1,
      205,
      "Build an additional cage to contain surplus zombies once a town is defeated.",
      null
    ),
    new Construction(
      215,
      "Third Zombie Cage",
      this.constructionTypes.zombieCage,
      { bones: 1800, blood: 2700 },
      30,
      1,
      10,
      1,
      206,
      "Build an additional cage to contain surplus zombies once a town is defeated.",
      null
    ),
    new Construction(
      216,
      "Fourth Zombie Cage",
      this.constructionTypes.zombieCage,
      { bones: 2400, blood: 3600 },
      30,
      1,
      10,
      1,
      207,
      "Build an additional cage to contain surplus zombies once a town is defeated.",
      null
    ),
    new Construction(
      217,
      "Fifth Zombie Cage",
      this.constructionTypes.zombieCage,
      { bones: 3000, blood: 4500 },
      30,
      1,
      15,
      1,
      211,
      "Build an additional cage to contain surplus zombies once a town is defeated.",
      null
    ),
    new Construction(
      218,
      "Plague Laboratory",
      this.constructionTypes.plagueLaboratory,
      { brains: 25000, blood: million },
      50,
      1,
      1,
      1,
      211,
      "Expand the plague workshop into a well equipped laboratory in order to unlock additional plague upgrades.",
      null
    ),
    new Construction(
      219,
      "Part Factory",
      this.constructionTypes.partFactory,
      { brains: 35000, blood: 15 * million },
      50,
      1,
      1,
      1,
      218,
      "Build a factory to create parts that can be used to construct more powerful beings for your army.",
      "Factory menu now available!"
    ),
    new Construction(
      220,
      "Creature Factory",
      this.constructionTypes.monsterFactory,
      { brains: 45000, blood: 40 * million },
      50,
      1,
      1,
      1,
      219,
      "Build a factory to turn creature parts into living entities of destruction",
      "Creatures now available in factory menu!"
    ),
    new Construction(
      221,
      "Bottomless Pit",
      this.constructionTypes.pit,
      { bones: 75000, parts: 5 * million },
      50,
      1,
      1,
      10,
      219,
      "A bottomless pit with walls made from creature parts. Drastically increases your capacity to store blood and brains.",
      null
    ),
    new Construction(
      222,
      "Harpy Outfitter",
      this.constructionTypes.harpy,
      { bones: 75000, brains: 75000, blood: 80 * million },
      50,
      1,
      1,
      1,
      220,
      "Build an outfitter to upgrade the abilities of your harpies.",
      "Harpy upgrades now available in the shop!"
    ),
    new Construction(
      301,
      "Hybrid Laboratory",
      this.constructionTypes.HybridLab,
      {
        bones: 75e6,
        parts: 9e12,
      },
      240,
      1,
      1,
      1,
      222,
      "Build a new laboratory to unlock the potential of Zombie-Golem Hybrids.  Deep storage tanks for Blood and Brains are needed for research, doubling storage",
      "New upgrades are available in the shop!"
    ),
    new Construction(
      302,
      "Advanced Hybrid Laboratory",
      this.constructionTypes.AdvHybridLab,
      {
        bones: 75e8,
        parts: 7e13,
      },
      240,
      1,
      1,
      1,
      301,
      "Build a new way to create everything faster!  How deep can these storage tanks go? Doubles storage",
      "New upgrades are available in the shop!"
    ),
    new Construction(
      303,
      "Miniturized Assembly Lines",
      this.constructionTypes.MiniAssembLine,
      {
        bones: 75e10,
        parts: 4e16,
      },
      240,
      1,
      1,
      1,
      302,
      "Using all these stored brains allows us to harness their raw computational power for even more innovations!  Even deeper storage tanks for Blood and Brains are needed for research. Doubles storage",
      "New upgrades are available in the shop!"
    ),
    new Construction(
      304,
      "Technical Think Tank",
      this.constructionTypes.TechThinkTank,
      {
        bones: 75e12,
        parts: 1e18,
      },
      240,
      1,
      1,
      1,
      303,
      "Build an advanced laboratory to further unlock the secrets of Zombie-Golem Hybridization.  Storage tanks resting on bedrock is as far as we can go, doubling storage",
      "New upgrades are available in the shop!"
    ),
  ];

  upgrades = [
    // blood upgrades
    new Upgrade(
      1,
      "Bloodthirst",
      this.types.damage,
      this.costs.blood,
      50,
      1.2,
      1,
      40,
      "Your zombies thirst for blood and do +1 damage for each rank of Bloodthirst.",
      null,
      null
    ),
    new Upgrade(
      9,
      "Sharpened Teeth",
      this.types.damage,
      this.costs.blood,
      3000,
      1.23,
      3,
      50,
      "Your zombies bites do +3 damage with each rank of Sharpened Teeth.",
      null,
      206
    ),
    new Upgrade(
      11,
      "Razor Claws",
      this.types.damage,
      this.costs.blood,
      28000,
      1.25,
      5,
      0,
      "Your zombies attacks do +5 damage with each rank of Razor Claws.",
      null,
      211
    ),
    new Upgrade(
      16,
      "Killer Instinct",
      this.types.damage,
      this.costs.blood,
      1000000,
      1.27,
      8,
      0,
      "Your zombies attacks do +8 damage with each rank of Killer Instinct.",
      null,
      220
    ),
    new Upgrade(
      2,
      "Like Leather",
      this.types.health,
      this.costs.blood,
      100,
      1.2,
      10,
      40,
      "Your zombies gain tougher skin and +10 health with each rank.",
      null,
      null
    ),
    new Upgrade(
      10,
      "Thick Skull",
      this.types.health,
      this.costs.blood,
      5000,
      1.23,
      25,
      50,
      "Your zombies gain +25 health with each rank.",
      null,
      206
    ),
    new Upgrade(
      12,
      "Battle Hardened",
      this.types.health,
      this.costs.blood,
      32000,
      1.25,
      40,
      0,
      "Your zombies gain +40 health with each rank of Battle Hardened.",
      null,
      211
    ),
    new Upgrade(
      17,
      "Tough as Nails",
      this.types.health,
      this.costs.blood,
      1000000,
      1.27,
      100,
      0,
      "Your zombies gain +100 health with each rank of Tough as Nails.",
      null,
      220
    ),
    new Upgrade(
      3,
      "Cold Storage",
      this.types.brainsCap,
      this.costs.blood,
      150,
      1.2,
      50,
      20,
      "Turns out you can use all of your spare blood to store brains and keep them fresh. Each rank increases your maximum brain capacity by 50.",
      null,
      null
    ),
    new Upgrade(
      4,
      "Recycling is Cool",
      this.types.brainRecoverChance,
      this.costs.blood,
      1000,
      1.2,
      0.1,
      10,
      "Why are we wasting so many good brains on this project? Each rank increases your chance to get a brain back from a dead zombie by 10%",
      null,
      null
    ),
    new Upgrade(
      5,
      "Your Soul is Mine!",
      this.types.riseFromTheDeadChance,
      this.costs.blood,
      1500,
      1.4,
      0.1,
      10,
      "Using your most powerful blood magic you command the bodies of the dead to rise as your servants! Each rank grants 10% chance that dead humans will turn into zombies.",
      null,
      null
    ),
    new Upgrade(
      6,
      "Infected Bite",
      this.types.infectedBite,
      this.costs.blood,
      3500,
      1.4,
      0.1,
      10,
      "Your zombies are now infected with plague and could infect their victims too. Each rank adds 10% chance to inflict damage over time when a zombie attacks a target.",
      null,
      204
    ),
    new Upgrade(
      7,
      "Detonate",
      this.types.unlockSpell,
      this.costs.blood,
      25000,
      1,
      3,
      1,
      "Learn the Detonate spell which can explode all of your zombies into a cloud of plague. Not exactly sure how useful that will be.",
      "New spell learned, Detonate!",
      209
    ),
    new Upgrade(
      8,
      "Gigazombies?",
      this.types.unlockSpell,
      this.costs.blood,
      50000,
      1,
      5,
      1,
      "Learn the Gigazombies spell which will turn some of your zombies into hulking monstrosities with increased health and damage.",
      "New spell learned, Gigazombies!",
      209
    ),
    new Upgrade(
      13,
      "Blazing Speed",
      this.types.burningSpeedPC,
      this.costs.blood,
      30000,
      1.25,
      0.05,
      10,
      "The humans are using torches to set your zombies on fire. Perhaps we can turn the tables on them? Each rank increases the movement and attack speed of burning zombies by 5%",
      null,
      207
    ),
    new Upgrade(
      14,
      "Spit it Out",
      this.types.spitDistance,
      this.costs.blood,
      500000,
      1.6,
      5,
      10,
      "The first rank gives your zombies the ability to spit plague at enemies beyond normal attack range. Spit attacks do 50% zombie damage and infect the victim with plague. Subsequent ranks will increase the range of spit attacks.",
      null,
      218
    ),
    new Upgrade(
      15,
      "Runic Syphon",
      this.types.runicSyphon,
      this.costs.blood,
      34000,
      1.9,
      0.01,
      10,
      "Infuse your runes for free! Each rank gives your Runesmith the ability to infuse 1% of your resource income, without consuming it. Additionally when blood and brains reach their storage limit, any additional resources will be infused automatically.",
      null,
      210
    ),
    // new Upgrades.Upgrade(18, "More Gigazombies", this.types.gigazombies, this.costs.blood, 100000000, 1.27, 1, 1, "We need more gigazombies! This will unlock the ability for all zombies to be gigazombies. They gain health and damage but the energy cost also increases. This can be toggled in the graveyard.", false, 220),
    new Upgrade(
      19,
      "Faster Harpies",
      this.types.harpySpeed,
      this.costs.blood,
      100 * million,
      1.07,
      2,
      20,
      "These harpies are way too slow! We have to make them faster. Each rank increases harpy speed by 2",
      null,
      222
    ),

    // brain upgrades
    new Upgrade(
      20,
      "Energy Rush",
      this.types.energyRate,
      this.costs.brains,
      20,
      1.8,
      0.5,
      20,
      "Melting brains down in your cauldron to make smoothies can be beneficial for your health. It also increases your energy rate by 0.5 per second for each rank.",
      null,
      null
    ),
    new Upgrade(
      21,
      "Master Summoner",
      this.types.energyCap,
      this.costs.brains,
      10,
      1.5,
      5,
      20,
      "All the brains you harvested have proved fruitful in your experiments. Each rank raises your maximum energy by 5.",
      null,
      null
    ),
    new Upgrade(
      22,
      "Primal Reflexes",
      this.types.speed,
      this.costs.brains,
      5,
      1.6,
      1,
      20,
      "The zombies retain more of their human agility increasing run speed by 1 for each rank.",
      null,
      null
    ),
    new Upgrade(
      23,
      "Blood Harvest",
      this.types.bloodStoragePC,
      this.costs.brains,
      50,
      1.12,
      0.1,
      0,
      "All this brain power has enabled you to devise some superior blood storage methods. Each rank increases your maximum blood by 10%.",
      null,
      null
    ),
    new Upgrade(
      24,
      "Unholy Construction",
      this.types.construction,
      this.costs.brains,
      25,
      1,
      1,
      1,
      "Learn the art of Unholy Construction in order to build structures that will solidify your foothold on the town.",
      "Construction menu now available!",
      null
    ),
    new Upgrade(
      25,
      "Infected Corpse",
      this.types.infectedBlast,
      this.costs.brains,
      500,
      1.4,
      0.1,
      10,
      "Fill your zombies with so much plague they are ready to explode! Each rank adds 10% chance for a zombie to explode into a cloud of plague upon death.",
      null,
      204
    ),
    new Upgrade(
      26,
      "Energy Charge",
      this.types.unlockSpell,
      this.costs.brains,
      2000,
      1,
      2,
      1,
      "Learn the Energy Charge spell which can drastically increase your energy rate for a short time.",
      "New spell learned, Energy Charge!",
      209
    ),
    new Upgrade(
      27,
      "What Doesn't Kill You",
      this.types.blastHealing,
      this.costs.brains,
      10000,
      1.3,
      0.1,
      20,
      "Plague explosions from zombies and harpies will also heal nearby zombies for 10% of the explosion damage with each rank.",
      null,
      218
    ),
    new Upgrade(
      28,
      "One is Never Enough",
      this.types.monsterLimit,
      this.costs.brains,
      20000,
      1.2,
      1,
      15,
      "We're definitely going to need more than one golem to finish the job. Each rank increases your creature limit by 1",
      null,
      220
    ),
    new Upgrade(
      29,
      "Tank Buster",
      this.types.tankBuster,
      this.costs.brains,
      400000,
      1.2,
      1,
      1,
      "Teach your harpies some new tricks. Once bought this upgrade will make your harpies drop fire bombs on tanks during boss stages.",
      null,
      222
    ),
    new Upgrade(
      30,
      "Improved Spikes",
      this.types.spikeDelay,
      this.costs.brains,
      800,
      1.2,
      1,
      4,
      "Each rank reduces the delay between plague spike activation by 20%",
      null,
      208
    ),

    // bone upgrades
    new Upgrade(
      40,
      "Bone Throne",
      this.types.energyCap,
      this.costs.bones,
      50,
      1.55,
      10,
      15,
      "Sitting atop your throne of bones you can finally think clearly. Each rank increases maximum energy by 10.",
      null,
      null
    ),
    new Upgrade(
      41,
      "Crown of Bones",
      this.types.energyRate,
      this.costs.bones,
      200,
      1.5,
      0.2,
      25,
      "Not just dapper, these spikes help channel your energy. Each rank increases energy rate by 0.2 per second.",
      null,
      null
    ),
    new Upgrade(
      42,
      "Bonebarrows",
      this.types.boneCollectorCapacity,
      this.costs.bones,
      300,
      1.2,
      5,
      20,
      "Your bone collectors are struggling to carry all these bones. Maybe it's time we gave them an upgrade? Each rank increases their carrying capacity by 5.",
      null,
      null
    ),
    new Upgrade(
      43,
      "Bone Reinforced Tanks",
      this.types.bloodCap,
      this.costs.bones,
      500,
      1.07,
      2000,
      0,
      "Finally! Now that we have a solid construction material we can get to work building better storage for our other resources. Each rank increases blood storage by 2000.",
      null,
      null
    ),
    new Upgrade(
      44,
      "Brain Cage",
      this.types.brainsCap,
      this.costs.bones,
      650,
      1.07,
      500,
      0,
      "There's nothing I love more than a mind enslaved. Now we can put these brains where they belong. In cages! Each rank increases brain storage by 500.",
      null,
      null
    ),
    new Upgrade(
      45,
      "Earth Freeze",
      this.types.unlockSpell,
      this.costs.bones,
      5000,
      1,
      4,
      1,
      "Learn the Earth Freeze spell which can freeze all humans in place for a short time.",
      "New spell learned, Earth Freeze!",
      209
    ),
    new Upgrade(
      46,
      "Plague Armor",
      this.types.plagueArmor,
      this.costs.bones,
      15000,
      1.6,
      0.02,
      10,
      "The best defense is a good offense? True in the case of Plague Armor which reduces the damage done by infected humans by 2% per rank.",
      null,
      218
    ),
    new Upgrade(
      47,
      "Bulletproof",
      this.types.bulletproof,
      this.costs.bones,
      60000,
      1.6,
      0.05,
      5,
      "Craft your earth golems from much harder stone. Each rank gives them 5% chance to reflect bullets back to their source.",
      null,
      220
    ),
    new Upgrade(
      48,
      "Bombs Away",
      this.types.harpyBombs,
      this.costs.bones,
      500000,
      1.6,
      1,
      3,
      "Upgrade your harpies so they can carry more than just one bomb at a time.",
      null,
      222
    ),

    // parts upgrades
    new Upgrade(
      60,
      "Extra Limbs",
      this.types.golemDamagePC,
      this.costs.parts,
      900,
      1.3,
      0.02,
      0,
      "Your golems gain +2% damage with each rank of Extra Limbs.",
      null,
      220
    ),
    new Upgrade(
      61,
      "Big Boned",
      this.types.golemHealthPC,
      this.costs.parts,
      1000,
      1.31,
      0.02,
      0,
      "Your golems gain +2% health with each rank of Big Boned.",
      null,
      220
    ),
    new Upgrade(
      62,
      "Hybrid Strength",
      this.types.HstrengthDmgPC,
      this.costs.parts,
      1000,
      1.3,
      0.01,
      0,
      "Animating Golem parts fused with zombie flesh creates a terrifyingly strong Hybrid. Your zombies gain +1% damage with each rank of Hybrid Strength.",
      null,
      301
    ),
    new Upgrade(
      63,
      "Hybrid Shell",
      this.types.HshellHealthPC,
      this.costs.parts,
      1e3,
      1.31,
      0.01,
      0,
      "Golem armor shell provides extra protection for your fleshy zombies. Your zombies gain +1% health with each rank of Hybrid Shell.",
      null,
      301
    ),
    new Upgrade(
      64,
      "Advanced Cyrogenic Vats",
      this.types.CyroVatPC,
      this.costs.parts,
      1e3,
      1.4,
      0.1,
      0,
      "Cooling these Brains further makes them last much longer. Your brain storage increases +10% with each rank of Advanced Cyrogenic Vats.",
      null,
      302
    ),
    new Upgrade(
      65,
      "Golem Part Plague Vats",
      this.types.PlagueVatPC,
      this.costs.parts,
      1e3,
      1.5,
      0.01,
      0,
      "Using specialized Golem Parts allows for advancements in plague research. Plague Damage increases +1% with each rank of Golem Part Plague Vats.",
      null,
      302
    ),
    new Upgrade(
      66,
      "Cloning Replicator",
      this.types.CloningRepPC,
      this.costs.parts,
      1e12,
      1.25,
      0.05,
      0,
      "Mass produced Cloning Replicators allows for much greater use out of each Brain obtained. Brain Income increases +5% with each rank of Cloning Replicator.",
      null,
      303
    ),
    new Upgrade(
      67,
      "Blood Synthezizer",
      this.types.BloodSynPC,
      this.costs.parts,
      1e12,
      1.25,
      0.05,
      0,
      "Artificial Blood can augment what we already get allowing for more of everything. Blood Income increases +5% with each rank of Blood Synthesizer.",
      null,
      303
    ),
    new Upgrade(
      68,
      "Synthetic Bone Fabricator",
      this.types.SynBonePC,
      this.costs.parts,
      1e12,
      1.25,
      0.05,
      0,
      "Synthetic Bones made from Golem Parts?  Genius! Bone Income increases +5% with each rank of Synthetic Bone Fabricator.",
      null,
      303
    ),
    new Upgrade(
      69,
      "Insectoid Parts Assemblers",
      this.types.SmolPartsPC,
      this.costs.parts,
      1e12,
      1.25,
      0.05,
      0,
      "Insect sized and shaped assemblers are far more efficient at maufacturing Golem parts. Parts Income increases +5% with each rank of Insectoid Parts Assemblers.",
      null,
      303
    ),
  ];

  prestigeUpgrades = [
    new Upgrade(
      108,
      "A Small Investment",
      this.types.startingPC,
      this.costs.prestigePoints,
      10,
      1.25,
      1,
      0,
      "Each rank gives you an additional 500 blood, 50 brains, and 200 bones when starting a new level.",
      null,
      null
    ),
    new Upgrade(
      109,
      "Time Warp",
      this.types.unlockSpell,
      this.costs.prestigePoints,
      50,
      1,
      1,
      1,
      "Unlock the Time Warp spell in order to speed up the flow of time.",
      null,
      null
    ),
    new Upgrade(
      110,
      "Master of Death",
      this.types.energyCost,
      this.costs.prestigePoints,
      1000,
      1,
      1,
      5,
      "Each rank reduces the energy cost of summoning a zombie by 1",
      null,
      null
    ),
    new Upgrade(
      101,
      "Blood Storage",
      this.types.bloodStoragePC,
      this.costs.prestigePoints,
      10,
      1.25,
      0.2,
      0,
      "Additional 20% blood storage for each rank.",
      null,
      null
    ),
    new Upgrade(
      102,
      "Blood Rate",
      this.types.bloodGainPC,
      this.costs.prestigePoints,
      10,
      1.25,
      0.2,
      0,
      "Additional 20% blood income rate for each rank.",
      null,
      null
    ),
    new Upgrade(
      103,
      "Brain Storage",
      this.types.brainsStoragePC,
      this.costs.prestigePoints,
      10,
      1.25,
      0.2,
      0,
      "Additional 20% brain storage for each rank.",
      null,
      null
    ),
    new Upgrade(
      104,
      "Brain Rate",
      this.types.brainsGainPC,
      this.costs.prestigePoints,
      10,
      1.25,
      0.2,
      0,
      "Additional 20% brain income rate for each rank.",
      null,
      null
    ),
    new Upgrade(
      105,
      "Bone Rate",
      this.types.bonesGainPC,
      this.costs.prestigePoints,
      10,
      1.25,
      0.2,
      0,
      "Additional 20% bones income rate for each rank.",
      null,
      null
    ),
    // new Upgrades.Upgrade(106, "Zombie Health", this.types.zombieHealthPC, this.costs.prestigePoints, 10, 1.25, 0.2, 0, "Additional 20% zombie health for each rank"),
    // new Upgrades.Upgrade(107, "Zombie Damage", this.types.zombieDmgPC, this.costs.prestigePoints, 10, 1.25, 0.2, 0, "Additional 20% zombie damage for each rank")
    new Upgrade(
      111,
      "Parts Rate",
      this.types.partsGainPC,
      this.costs.prestigePoints,
      10,
      1.25,
      0.2,
      0,
      "Additional 20% creature parts income rate for each rank.",
      null,
      null
    ),
    new Upgrade(
      112,
      "Auto Construction",
      this.types.autoconstruction,
      this.costs.prestigePoints,
      250,
      1,
      1,
      1,
      "Unlock the ability to automatically start construction of the cheapest available building option.",
      null,
      null
    ),
    new Upgrade(
      114,
      "Auto Shop",
      this.types.autoshop,
      this.costs.prestigePoints,
      250,
      1,
      1,
      1,
      "Unlock the ability to automatically purchase items from the shop.",
      null,
      null
    ),
    new Upgrade(
      113,
      "Graveyard Health",
      this.types.graveyardHealth,
      this.costs.prestigePoints,
      10,
      1.25,
      0.1,
      0,
      "Additional 10% graveyard health during boss levels with each rank.",
      null,
      null
    ),
    new Upgrade(
      115,
      "Talent Point",
      this.types.talentPoint,
      this.costs.prestigePoints,
      100,
      1.2,
      1,
      0,
      "Additional skeleton talent point",
      null,
      null
    ),
  ];
}

type ConstructionCost = {
  blood?: number;
  brains?: number;
  bones?: number;
  parts?: number;
  energy?: number;
};

class Construction {
  id: number;
  name: string;
  type: string;
  costs: ConstructionCost;
  time: number;
  multiplier: number;
  effect: number;
  cap: number;
  requires: number;
  description: string;
  completeMessage: string;
  auto: boolean;

  constructor(
    id: number,
    name: string,
    type: string,
    costs: ConstructionCost,
    time: number,
    multiplier: number,
    effect: number,
    cap: number,
    requires: number,
    description: string,
    completeMessage: string
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.costs = costs;
    this.time = time;
    this.multiplier = multiplier;
    this.effect = effect;
    this.cap = cap;
    this.requires = requires;
    this.description = description;
    this.completeMessage = completeMessage;
  }
}

type Rune = {
  blood: number;
  brains: number;
  bones: number;
};

class Upgrade {
  id: number;
  name: string;
  type: string;
  costType: string;
  basePrice: number;
  multiplier: number;
  effect: number;
  cap: number;
  description: string;
  rank: number;
  purchaseMessage: string;
  requires: number;
  auto: boolean;

  constructor(
    id: number,
    name: string,
    type: string,
    costType: string,
    basePrice: number,
    multiplier: number,
    effect,
    cap: number,
    description: string,
    purchaseMessage: string,
    requires
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.costType = costType;
    this.basePrice = basePrice;
    this.multiplier = multiplier;
    this.effect = effect;
    this.cap = cap;
    this.description = description;
    this.rank = 1;
    this.purchaseMessage = purchaseMessage;
    this.requires = requires;
  }
}

type UpgradeEffect = {
  type: string;
  effect: number;
};
