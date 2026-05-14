import { CharacterObject } from "./gameobject";
import { Human } from "./humanclasses";

export class Creature extends CharacterObject {
  currentDirection = 0;
  bulletReflect = 0;
  zombieId = 0;
  target: Human;
  state: CreatureState;
  lastKnownBuilding = null;
  maxSpeed = 0;
  graveyard = false;
  regenTimer = 0;
  level = 0;
  creatureType = 0;
  scaling = 0;
  attackDamage = 0;
  speedMultiplier = 1;
  immuneToBurns = false;
  zombie = true;
  deadTexture: PIXI.Texture[];
  textureSet = {
    set: false,
    down: [],
    up: [],
    left: [],
    right: [],
    dead: [],
  };
}

export enum CreatureState {
  lookingForTarget,
  movingToTarget,
  attackingTarget,
}
