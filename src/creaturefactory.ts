import { Creatures } from "./creatures";
import { GameModel } from "./gamemodel";

export let spawnedSavedCreatures: false;

export enum types {
  earthGolem = 1,
  airGolem,
  fireGolem,
  waterGolem,
}

export const creatureScaling = 1.75;
export const creatureCostScaling = 2;

export function update(timeDiff) {
  var creatureCount = Creatures.creatureCount;
  for (var i = 0; i < this.creatures.length; i++) {
    if (this.creatures[i].building) {
      this.creatures[i].timeLeft -= timeDiff;
      if (this.creatures[i].timeLeft < 0) {
        this.spawnCreature(this.creatures[i]);
        this.creatures[i].building = false;
      }
    } else {
      if (
        typeof creatureCount[this.creatures[i].type] !== "undefined" &&
        creatureCount[this.creatures[i].type] < this.creatures[i].autobuild
      ) {
        this.startBuilding(this.creatures[i]);
      }
    }
    if (GameModel.persistentData.creatureLevels[this.creatures[i].id])
      this.creatures[i].level =
        GameModel.persistentData.creatureLevels[this.creatures[i].id];
  }
}

export function purchasePrice(creature) {
  return (
    creature.baseCost * Math.pow(this.creatureCostScaling, creature.level - 1)
  );
}

export function levelPrice(creature) {
  return (
    creature.baseCost * Math.pow(this.creatureCostScaling, creature.level) * 5
  );
}

export function levelCreature(creature) {
  if (this.levelPrice(creature) < GameModel.persistentData.parts) {
    GameModel.persistentData.parts -= this.levelPrice(creature);
    creature.level++;
    GameModel.persistentData.creatureLevels[creature.id] = creature.level;
  }
}

export function canAffordCreature(creature) {
  return this.purchasePrice(creature) < GameModel.persistentData.parts;
}

export function creaturesBuildingCount() {
  var count = 0;
  for (var i = 0; i < creatures.length; i++) {
    if (creatures[i].building) {
      count++;
    }
  }
  return count;
}

export function startBuilding(creature) {
  if (creature.building) {
    return;
  }
  if (!this.canAffordCreature(creature)) {
    return;
  }
  if (
    this.creaturesBuildingCount() + GameModel.creatureCount >=
    GameModel.creatureLimit
  ) {
    return;
  }
  creature.building = true;
  creature.timeLeft = creature.time;
  GameModel.persistentData.parts -= this.purchasePrice(creature);
}

export function creatureAutoBuildNumber(creature, number) {
  if (creature.autobuild + number >= 0) {
    creature.autobuild += number;
    GameModel.persistentData.creatureAutobuild[creature.id] =
      creature.autobuild;
  }
}

export function updateAutoBuild() {
  for (var i = 0; i < this.creatures.length; i++) {
    this.creatures[i].autobuild =
      GameModel.persistentData.creatureAutobuild[this.creatures[i].id] || 0;
  }
}

export function resetLevels() {
  for (var i = 0; i < this.creatures.length; i++) {
    this.creatures[i].level = 1;
  }
}

export function spawnCreature(creature) {
  var health =
    creature.baseHealth *
    Math.pow(this.creatureScaling, creature.level - 1) *
    GameModel.golemHealthPCMod;
  var damage =
    creature.baseDamage *
    Math.pow(this.creatureScaling, creature.level - 1) *
    GameModel.golemDamagePCMod;
  Creatures.spawnCreature(
    health,
    damage,
    creature.speed,
    creature.type,
    creature.level
  );
}

export function spawnSavedCreatures() {
  if (!this.spawnedSavedCreatures) {
    var creaturesSpawned = 0;
    for (var i = 0; i < GameModel.persistentData.savedCreatures.length; i++) {
      creaturesSpawned++;
      if (creaturesSpawned <= GameModel.creatureLimit) {
        var savedCreature = GameModel.persistentData.savedCreatures[i];
        var creature = this.creatures.filter(
          (c) => c.type == savedCreature.t
        )[0];
        creature.level = savedCreature.l;
        this.spawnCreature(creature);
      }
    }
    this.spawnedSavedCreatures = true;
  }
}

export function creatureStats(creature) {
  return {
    thisLevel: {
      level: creature.level,
      health:
        creature.baseHealth *
        Math.pow(this.creatureScaling, creature.level - 1) *
        GameModel.golemHealthPCMod,
      damage:
        creature.baseDamage *
        Math.pow(this.creatureScaling, creature.level - 1) *
        GameModel.golemDamagePCMod,
      cost:
        creature.baseCost *
        Math.pow(this.creatureCostScaling, creature.level - 1),
    },
    nextLevel: {
      level: creature.level + 1,
      health:
        creature.baseHealth *
        Math.pow(this.creatureScaling, creature.level) *
        GameModel.golemHealthPCMod,
      damage:
        creature.baseDamage *
        Math.pow(this.creatureScaling, creature.level) *
        GameModel.golemDamagePCMod,
      cost:
        creature.baseCost * Math.pow(this.creatureCostScaling, creature.level),
    },
  };
}

export function Creature(
  id,
  type,
  name,
  baseHealth,
  baseDamage,
  speed,
  baseCost,
  description
) {
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

const creatures = [
  new Creature(
    1,
    types.earthGolem,
    "Earth Golem",
    3000,
    75,
    30,
    800,
    "A golem born from rocks and mud, able to take a lot of punishment and taunt enemies to attack it"
  ),
  new Creature(
    2,
    types.airGolem,
    "Air Golem",
    1200,
    110,
    45,
    900,
    "A fast moving golem able to cover large distances and chase targets down"
  ),
  new Creature(
    3,
    types.fireGolem,
    "Fire Golem",
    1200,
    130,
    32,
    1000,
    "A fireball spewing golem that ignites everything it touches"
  ),
  new Creature(
    4,
    types.waterGolem,
    "Water Golem",
    1500,
    90,
    30,
    1100,
    "A calming golem that restores health to nearby units"
  ),
];
