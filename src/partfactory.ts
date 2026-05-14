import { GameModel, getCostForUpgrades, getMaxUpgrades } from "./internal";

export class PartFactory {
  private static instance: PartFactory;
  constructor() {
    if (PartFactory.instance) return PartFactory.instance;
    PartFactory.instance = this;
  }
  gameModel = GameModel.getInstance();
  costs = {
    blood: "blood",
    parts: "parts",
  };
  generatorsApplied = [];

  factoryStats(): { machines: number; partsPerSec: number } {
    let machines = 0;
    let partsPerSec = 0;
    for (let i = 0; i < this.generatorsApplied.length; i++) {
      machines += this.generatorsApplied[i].rank;
      partsPerSec +=
        this.generatorsApplied[i].total / this.generatorsApplied[i].time;
    }
    return {
      machines: machines,
      partsPerSec: partsPerSec * this.gameModel.partsPCMod,
    };
  }

  update(timeDiff: number): void {
    for (let i = 0; i < this.generatorsApplied.length; i++) {
      this.generatorsApplied[i].timeLeft -= timeDiff;
      if (this.generatorsApplied[i].timeLeft < 0) {
        this.generatorsApplied[i].timeLeft = this.generatorsApplied[i].time;
        this.gameModel.persistentData.parts +=
          this.generatorsApplied[i].total * this.gameModel.partsPCMod;
      }
    }
  }

  updateLongTime(timeDiff: number): number {
    let partsCreated = 0;
    for (let i = 0; i < this.generatorsApplied.length; i++) {
      partsCreated +=
        this.generatorsApplied[i].total *
        (timeDiff / this.generatorsApplied[i].time);
    }
    return partsCreated * this.gameModel.partsPCMod;
  }

  currentRank(generator: Generator): number {
    for (let i = 0; i < this.gameModel.persistentData.generators.length; i++) {
      const owned = this.gameModel.persistentData.generators[i];
      if (generator.id == owned.id) {
        return owned.rank;
      }
    }
    return 0;
  }

  purchasePrice(generator: Generator): number {
    return Math.round(
      generator.basePrice *
        Math.pow(generator.multi, this.currentRank(generator)),
    );
  }

  upgradeMaxAffordable(upgrade: Generator): number {
    const currentRank = this.currentRank(upgrade);
    let maxAffordable = 0;
    switch (upgrade.costType) {
      case this.costs.blood:
        maxAffordable = getMaxUpgrades(
          upgrade.basePrice,
          upgrade.multi,
          currentRank,
          this.gameModel.persistentData.blood,
        );
        break;
      case this.costs.parts:
        maxAffordable = getMaxUpgrades(
          upgrade.basePrice,
          upgrade.multi,
          currentRank,
          this.gameModel.persistentData.parts,
        );
        break;
    }
    if (upgrade.cap != 0) {
      return Math.min(maxAffordable, upgrade.cap - currentRank);
    }
    return maxAffordable;
  }

  upgradeMaxPrice(upgrade: Generator, number: number): number {
    return getCostForUpgrades(
      upgrade.basePrice,
      upgrade.multi,
      this.currentRank(upgrade),
      number,
    );
  }

  canAffordGenerator(generator: Generator): boolean {
    switch (generator.costType) {
      case this.costs.blood:
        return (
          this.gameModel.persistentData.blood >= this.purchasePrice(generator)
        );
      case this.costs.parts:
        return (
          this.gameModel.persistentData.parts >= this.purchasePrice(generator)
        );
    }
    return false;
  }

  purchaseMaxGenerators(generator: Generator): void {
    const amount = this.upgradeMaxAffordable(generator);
    for (let i = 0; i < amount; i++) {
      this.purchaseGenerator(generator, false);
    }
    this.gameModel.saveData();
  }

  purchaseGenerator(generator: Generator, save = true): void {
    if (this.canAffordGenerator(generator)) {
      switch (generator.costType) {
        case this.costs.blood:
          this.gameModel.persistentData.blood -= this.purchasePrice(generator);
          break;
        case this.costs.parts:
          this.gameModel.persistentData.parts -= this.purchasePrice(generator);
          break;
      }
      let owned;
      for (
        let i = 0;
        i < this.gameModel.persistentData.generators.length;
        i++
      ) {
        if (generator.id == this.gameModel.persistentData.generators[i].id) {
          owned = this.gameModel.persistentData.generators[i];
          owned.rank++;
        }
      }
      if (!owned)
        this.gameModel.persistentData.generators.push({
          id: generator.id,
          rank: 1,
        });
      if (save) {
        this.gameModel.saveData();
      }
      this.applyGenerators();
    }
  }

  applyGenerator(generator: Generator, rank: number): void {
    let owned = false;
    for (let i = 0; i < this.generatorsApplied.length; i++) {
      if (this.generatorsApplied[i].id == generator.id) {
        owned = true;
        this.generatorsApplied[i].rank = rank;
        this.generatorsApplied[i].total =
          this.generatorsApplied[i].produces * this.generatorsApplied[i].rank;
      }
    }
    if (!owned) {
      this.generatorsApplied.push({
        id: generator.id,
        produces: generator.produces,
        total: generator.produces * rank,
        rank: rank,
        time: generator.time,
        timeLeft: generator.time,
      });
    }
  }

  applyGenerators(): void {
    for (let i = 0; i < this.generators.length; i++) {
      const currRank = this.currentRank(this.generators[i]);
      if (currRank > 0) {
        this.applyGenerator(this.generators[i], currRank);
      }
    }
  }

  generators = [
    new Generator(
      1,
      "Simple Machine",
      this.costs.blood,
      1000000,
      1.08,
      1,
      2,
      "A simple device that produces 1 part every 2 seconds",
    ),
    new Generator(
      2,
      "Part Duplicator",
      this.costs.parts,
      100,
      1.09,
      4,
      3,
      "A more advanced device that produces 4 parts every 3 seconds",
    ),
    new Generator(
      3,
      "Stamp Press",
      this.costs.parts,
      1000,
      1.1,
      16,
      5,
      "An industrial press that produces 16 parts every 5 seconds",
    ),
    new Generator(
      4,
      "Conveyor",
      this.costs.parts,
      10000,
      1.11,
      64,
      8,
      "A fantastic new invention that produces 64 parts every 8 seconds",
    ),
    new Generator(
      5,
      "Splitter Combiner",
      this.costs.parts,
      100000,
      1.12,
      192,
      10,
      "A wondrous machine that produces 192 parts every 10 seconds",
    ),
    new Generator(
      6,
      "Batch Converter",
      this.costs.parts,
      500000,
      1.13,
      512,
      12,
      "An astounding contraption that produces 512 parts every 12 seconds",
    ),
  ];
}

class Generator {
  id: number;
  name: string;
  costType: string;
  basePrice: number;
  multi: number;
  produces: number;
  time: number;
  description: string;
  cap: number;
  auto: boolean;
  constructor(
    id,
    name,
    costType,
    basePrice,
    multi,
    produces,
    time,
    description,
  ) {
    this.id = id;
    this.name = name;
    this.costType = costType;
    this.basePrice = basePrice;
    this.multi = multi;
    this.produces = produces;
    this.time = time;
    this.description = description;
    this.cap = 0;
  }
}
