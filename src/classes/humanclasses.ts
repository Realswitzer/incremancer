import { Creature } from "./creatureclasses";
import {
  type Building,
  CharacterFlags,
  CharacterObject,
  CharacterTimers,
  type Position,
} from "./gameobject";

export enum HumanState {
  standing,
  walking,
  attacking,
  fleeing,
  escaping,
}

export class VIPText extends PIXI.Text {
  human: null | Human = null;
  yOffset = 0;
}

export class HumanTimers extends CharacterTimers {
  flee = 0;
  standing = 0;
  target = 0;
  plagueTick = 0;
  healTick = 0;
}

export class HumanFlags extends CharacterFlags {
  dog = false;
  doctor = false;
  tank = false;
  vip = false;
  torchBearer = false;
}

export class Human extends CharacterObject {
  maxSpeed = 0;
  deadTexture!: PIXI.Texture[];
  flags = new HumanFlags();
  target: null | false | Human | Position | undefined | Creature = null; // TODO: refactor game to remove the inconsistencies heree
  speedMod = 0;
  human = true;
  plagueTicks = 0;
  plagueDamage = 0;
  visionDistance = 0;
  lastKnownBuilding: Building | null | undefined = null; // unused?
  zombieTarget: Creature | null | undefined = null;
  state!: HumanState;
  timer = new HumanTimers();
}
