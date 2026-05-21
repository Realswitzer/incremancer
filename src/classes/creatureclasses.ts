import { foregroundContainer, format2Places, GameModel } from "../internal";
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
  bloodbornTimer = 0;
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

export class CritText extends PIXI.Text {
  speed = 30;
  fadeTime = 0.5;

  updateCritText(timeDiff: number) {
    if (this.visible) {
      this.y -= this.speed * timeDiff;
      this.fadeTime -= timeDiff;

      if (this.fadeTime < 0) {
        this.alpha -= 2 * timeDiff;

        if (this.alpha < 0) {
          this.visible = false;
          discardedCritTexts.push(this);
        }
      }
    }
  }
  reset() {
    this.fadeTime = 0.5;
    this.alpha = 1;
    this.visible = true;
  }
}

const CritTextStyle = new PIXI.TextStyle({
  fill: "#ef0",
  fontSize: 64,
});

export const critTexts: CritText[] = [];
const discardedCritTexts: CritText[] = [];

export function spawnCritText(x: number, y: number, damage: number): void {
  if (GameModel.getInstance().persistentData.particles) {
    if (discardedCritTexts.length > 0) {
      const crit = discardedCritTexts.pop()!;
      crit.reset();
      crit.text = format2Places(damage);
      crit.position.set(x, y);
    } else {
      const crit = new CritText(format2Places(damage), CritTextStyle);
      foregroundContainer.addChild(crit);
      crit.position.set(x, y);
      crit.anchor.set(0.5, 1);
      crit.scale.set(0.2, 0.2);
      critTexts.push(crit);
    }
  }
}
