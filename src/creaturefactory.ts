import { Creatures, GameModel } from './internal';

export class CreatureFactory {

  private static instance : CreatureFactory;
  constructor() {
    if (CreatureFactory.instance)
      return CreatureFactory.instance;
    CreatureFactory.instance = this;
  }

  gameModel = GameModel.getInstance();
  // creature = new Creatures();

  spawnedSavedCreatures = false;

  types = {
    earthGolem:1,
    airGolem:2,
    fireGolem:3,
    waterGolem:4
  };

  creatures = [
    new Creature(1, this.types.earthGolem, "Earth Golem", 3000, 75, 30, 800, "A golem born from rocks and mud, able to take a lot of punishment and taunt enemies to attack it"),
    new Creature(2, this.types.airGolem, "Air Golem", 1200, 110, 45, 900, "A fast moving golem able to cover large distances and chase targets down"),
    new Creature(3, this.types.fireGolem, "Fire Golem", 1200, 130, 32, 1000, "A fireball spewing golem that ignites everything it touches"),
    new Creature(4, this.types.waterGolem, "Water Golem", 1500, 90, 30, 1100, "A calming golem that restores health to nearby units")
  ];

  creatureScaling = 1.75;
  creatureCostScaling = 2;

  update(timeDiff : number) : void {
    const creatures = new Creatures();
    const creatureCount = creatures.creatureCount;
    for (let i = 0; i < this.creatures.length; i++) {
      if (this.creatures[i].building) {
        this.creatures[i].timeLeft -= timeDiff;
        if (this.creatures[i].timeLeft < 0) {
          this.spawnCreature(this.creatures[i]);
          this.creatures[i].building = false;
        }
      } else {
        if (typeof creatureCount[this.creatures[i].type] !== 'undefined' && creatureCount[this.creatures[i].type] < this.creatures[i].autobuild) {
          this.startBuilding(this.creatures[i]);
        }
      }
      if (this.gameModel.persistentData.creatureLevels[this.creatures[i].id])
        this.creatures[i].level = this.gameModel.persistentData.creatureLevels[this.creatures[i].id];
    }
  }

  purchasePrice(creature : Creature) : number {
    return creature.baseCost * Math.pow(this.creatureCostScaling, creature.level - 1);
  }

  levelPrice(creature : Creature) : number {
    return creature.baseCost * Math.pow(this.creatureCostScaling, creature.level) * 5;
  }

  levelCreature(creature : Creature) : void {
    if (this.levelPrice(creature) < this.gameModel.persistentData.parts) {
      this.gameModel.persistentData.parts -= this.levelPrice(creature);
      creature.level++;
      this.gameModel.persistentData.creatureLevels[creature.id] = creature.level;
    }
  }

  canAffordCreature(creature : Creature) : boolean {
    return this.purchasePrice(creature) < this.gameModel.persistentData.parts;
  }

  creaturesBuildingCount() : number {
    let count = 0;
    for (let i = 0; i < this.creatures.length; i++) {
      if (this.creatures[i].building) {
        count++;
      }
    }
    return count;
  }

  startBuilding(creature : Creature) : void {
    if (creature.building) {
      return;
    }
    if (!this.canAffordCreature(creature)) {
      return;
    }
    if (this.creaturesBuildingCount() + this.gameModel.creatureCount >= this.gameModel.creatureLimit) {
      return;
    }
    creature.building = true;
    creature.timeLeft = creature.time;
    this.gameModel.persistentData.parts -= this.purchasePrice(creature);
  }

  creatureAutoBuildNumber(creature : Creature, number : number) : void {
    if (creature.autobuild + number >= 0) {
      creature.autobuild += number;
      this.gameModel.persistentData.creatureAutobuild[creature.id] = creature.autobuild;
    }
  }

  updateAutoBuild() : void {
    for (let i = 0; i < this.creatures.length; i++) {
      this.creatures[i].autobuild = this.gameModel.persistentData.creatureAutobuild[this.creatures[i].id] || 0;
    }
  }

  resetLevels() : void {
    for (let i = 0; i < this.creatures.length; i++) {
      this.creatures[i].level = 1;
    }
  }

  spawnCreature(creature : Creature) : void {
    const creatures = new Creatures();
    const health = creature.baseHealth * Math.pow(this.creatureScaling, creature.level - 1) * this.gameModel.golemHealthPCMod;
    const damage = creature.baseDamage * Math.pow(this.creatureScaling, creature.level - 1) * this.gameModel.golemDamagePCMod;
    creatures.spawnCreature(health, damage, creature.speed, creature.type, creature.level);
  }

  spawnSavedCreatures() : void {
    if (!this.spawnedSavedCreatures) {
      let creaturesSpawned = 0;
      for (let i=0; i < this.gameModel.persistentData.savedCreatures.length; i++) {
        creaturesSpawned++
        if (creaturesSpawned <= this.gameModel.creatureLimit) {
          const savedCreature = this.gameModel.persistentData.savedCreatures[i];
          const creature = this.creatures.filter(c => c.type == savedCreature.t)[0];
          creature.level = savedCreature.l;
          this.spawnCreature(creature);
        }
      }
      this.spawnedSavedCreatures = true;
    }
  }

  creatureStats(creature : Creature) : {thisLevel:CreatureStats,nextLevel:CreatureStats} {
    return {
      thisLevel : {
        level : creature.level,
        health : creature.baseHealth * Math.pow(this.creatureScaling, creature.level - 1) * this.gameModel.golemHealthPCMod,
        damage : creature.baseDamage * Math.pow(this.creatureScaling, creature.level - 1) * this.gameModel.golemDamagePCMod,
        cost : creature.baseCost * Math.pow(this.creatureCostScaling, creature.level - 1)
      },
      nextLevel : {
        level : creature.level + 1,
        health : creature.baseHealth * Math.pow(this.creatureScaling, creature.level) * this.gameModel.golemHealthPCMod,
        damage : creature.baseDamage * Math.pow(this.creatureScaling, creature.level) * this.gameModel.golemDamagePCMod,
        cost : creature.baseCost * Math.pow(this.creatureCostScaling, creature.level)
      }
    }
  } 
}

type CreatureStats = {
  level:number, health:number, damage:number, cost:number
}

class Creature {
  id : number;
  type : number;
  name : string;
  baseHealth : number;
  baseDamage : number;
  speed : number;
  baseCost : number;
  description : string;
  time : number;
  building : boolean;
  timeLeft : number;
  autobuild : number;
  level : number;
  constructor(id : number, type : number, name : string, baseHealth : number, baseDamage : number, speed : number, baseCost : number, 
      description : string) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.baseHealth = baseHealth;
    this.baseDamage = baseDamage;
    this.speed = speed;
    this.baseCost = baseCost;
    this.description = description;
    this.time = 3;
    this.building = false;
    this.timeLeft = 10;
    this.autobuild = 0;
    this.level = 1;
  }
}