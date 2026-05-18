import { Human } from "./classes/humanclasses";
import {
  foregroundContainer,
  gameFieldSize,
  characterContainer,
  backgroundContainer,
  ZmMap,
  Blood,
  Bones,
  Smoke,
  GameModel,
  Zombies,
  Humans,
  Tanks,
  fastDistance,
  RotateVector2d,
  getRandomElementFromArray,
} from "./internal";

export class GraveyardSprite extends PIXI.Sprite {
  graveyard = true;
}

export class Graveyard {
  private static instance: Graveyard;

  constructor() {
    if (Graveyard.instance) return Graveyard.instance;
    Graveyard.instance = this;
  }
  spikeTexture: PIXI.Texture;
  boneCollectors: BoneCollectors;
  bones: Bones;
  gameModel: GameModel;
  zmMap: ZmMap;
  zombies: Zombies;
  smoke: Smoke;
  harpies: Harpies;
  blood: Blood;
  humans: Humans;

  sprite: GraveyardSprite;
  fortSprite: PIXI.Sprite;
  spikeSprites = [];
  level = 1;
  spikeTimer = 5;
  fenceRadius = 50;
  fastDistance = fastDistance;

  graveyardHealth = 0;
  graveyardMaxHealth = 0;
  target = {
    graveyard: true,
    x: 0,
    y: 0,
  };

  healthBar = null;

  initialize(): void {
    this.boneCollectors = new BoneCollectors();
    this.zmMap = new ZmMap();
    this.zombies = new Zombies();
    this.bones = new Bones();
    this.gameModel = GameModel.getInstance();
    this.smoke = new Smoke();
    this.harpies = new Harpies();
    this.blood = new Blood();
    this.humans = new Humans();
    if (typeof this.gameModel.persistentData.graveyardZombies == "undefined") {
      this.gameModel.persistentData.graveyardZombies = 1;
    }

    this.drawGraveyard();
    this.drawFence();
    this.drawHealthBar();
    this.bones.initialize();
    this.boneCollectors.populate();
    this.harpies.populate();
  }

  damageGraveyard(damage: number): void {
    if (this.gameModel.isBossStage(this.gameModel.level)) {
      this.graveyardHealth -= damage;
      if (this.graveyardHealth < 0) {
        this.gameModel.currentState = this.gameModel.states.failed;
        this.gameModel.startTimer = 3;
      }
    }
  }

  drawHealthBar(): void {
    if (this.gameModel.isBossStage(this.gameModel.level)) {
      this.gameModel.sendMessage("Defend the Graveyard!");
      this.graveyardHealth = this.graveyardMaxHealth =
        this.gameModel.zombieHealth * 100 * this.gameModel.graveyardHealthMod;
      if (!this.healthBar) {
        this.healthBar = {
          container: new PIXI.Container(),
          background: new PIXI.Graphics(),
          foreground: new PIXI.Graphics(),
          percentage: 100,
        };
        this.healthBar.container.addChild(this.healthBar.background);
        this.healthBar.container.addChild(this.healthBar.foreground);
        foregroundContainer.addChild(this.healthBar.container);
      }

      this.target.x = gameFieldSize.x / 2;
      this.target.y = gameFieldSize.y / 2;

      this.healthBar.container.visible = true;
      this.healthBar.container.x = this.target.x - 50;
      this.healthBar.container.y = this.target.y - 100;

      this.healthBar.background.clear();
      this.healthBar.background.lineStyle(12, 0x333333);
      this.healthBar.background.moveTo(-2, 0);
      this.healthBar.background.lineTo(102, 0);

      this.healthBar.foreground.clear();
      this.healthBar.foreground.lineStyle(8, 0xfd5252);
      this.healthBar.foreground.moveTo(0, 0);
      this.healthBar.foreground.lineTo(100, 0);
    } else {
      if (this.healthBar) {
        this.healthBar.background.clear();
        this.healthBar.foreground.clear();
        this.healthBar.container.visible = false;
      }
    }
  }

  updateHealthBar(): void {
    const percentage = Math.max(
      Math.round((this.graveyardHealth / this.graveyardMaxHealth) * 100),
      0,
    );
    if (percentage != this.healthBar.percentage) {
      this.healthBar.foreground.clear();
      if (percentage > 0) {
        this.healthBar.foreground.lineStyle(8, 0xfd5252);
        this.healthBar.foreground.moveTo(0, 0);
        this.healthBar.foreground.lineTo(percentage, 0);
      }
      this.healthBar.percentage = percentage;
    }
  }

  drawGraveyard(): void {
    if (!this.spikeTexture) {
      this.spikeTexture = PIXI.Texture.from("spikes.png");
    }
    if (this.sprite) {
      backgroundContainer.removeChild(this.sprite);
    }
    if (this.fortSprite) {
      characterContainer.removeChild(this.fortSprite);
      this.fortSprite = null;
    }
    this.level = 1;
    let textureName = "graveyard1.png";
    let fortTexture = "";
    if (this.gameModel.constructions.crypt) {
      this.level = 2;
      textureName = "graveyard2.png";
    }
    if (this.gameModel.constructions.fort) {
      this.level = 3;
      textureName = "sprites/megagraveyard.png";
      fortTexture = "fort1.png";
    }
    if (this.gameModel.constructions.fortress) {
      this.level = 4;
      textureName = "sprites/megagraveyard.png";
      fortTexture = "fort2.png";
    }
    if (this.gameModel.constructions.citadel) {
      this.level = 5;
      textureName = "sprites/megagraveyard.png";
      fortTexture = "fort3.png";
    }
    if (this.sprite) {
      this.sprite.texture = PIXI.Texture.from(textureName);
    } else {
      this.sprite = new GraveyardSprite(PIXI.Texture.from(textureName));
    }
    const graveyardPosition = this.zmMap.graveYardLocation;
    this.sprite.width = 32;
    this.sprite.height = 32;
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.scale.set(2, 2);
    this.sprite.visible = false;
    backgroundContainer.addChild(this.sprite);
    this.sprite.x = graveyardPosition.x;
    this.sprite.y = graveyardPosition.y;

    this.zmMap.graveyardCollision = false;

    if (fortTexture) {
      if (this.fortSprite) {
        this.fortSprite.texture = PIXI.Texture.from(fortTexture);
      } else {
        this.fortSprite = new PIXI.Sprite(PIXI.Texture.from(fortTexture));
      }

      this.fortSprite.anchor.set(0.5, 1);
      this.fortSprite.scale.set(2, 2);
      this.fortSprite.x = graveyardPosition.x;
      this.fortSprite.zIndex = this.fortSprite.y = graveyardPosition.y + 2;
      this.fortSprite.visible = false;
      characterContainer.addChild(this.fortSprite);
    }
  }

  fence: PIXI.Container = null;
  fencePosts: PIXI.Sprite[] = [];
  fenceTextures: PIXI.Texture[] = null;

  drawFence(): void {
    if (!this.fence) {
      this.fence = new PIXI.Container();
      backgroundContainer.addChild(this.fence);
    }

    this.fenceRadius = this.gameModel.fenceRadius;

    if (!this.fenceTextures) {
      this.fenceTextures = [];
      for (let i = 0; i < 4; i++) {
        this.fenceTextures.push(PIXI.Texture.from(`fencepost${i + 1}.png`));
      }
    }

    this.fencePosts.forEach((post) => (post.visible = false));

    this.fence.cacheAsBitmap = false;
    const numPosts = Math.round(0.4 * this.fenceRadius);
    const radiansPerFencePosts = (2 * Math.PI) / numPosts;
    for (let i = 0; i < numPosts; i++) {
      let fencePost;

      if (this.fencePosts[i]) {
        fencePost = this.fencePosts[i];
        fencePost.visible = true;
      } else {
        fencePost = new PIXI.Sprite(
          getRandomElementFromArray(this.fenceTextures, Math.random()),
        );
        this.fencePosts.push(fencePost);
        this.fence.addChild(fencePost);
      }

      fencePost.anchor.set(0.5, 1);
      fencePost.scale.x = Math.random() > 0.5 ? 1 : -1;
      const positionWobble = 10 * Math.random() - 5;

      const radius = this.fenceRadius + positionWobble;
      const angle = radiansPerFencePosts * i;

      const pos = {
        x: radius * Math.sin(angle),
        y: radius * Math.cos(angle),
      };

      fencePost.position.set(pos.x, pos.y);
    }
    this.fence.cacheAsBitmap = true;
    const graveyardPosition = this.zmMap.graveYardLocation;
    this.fence.x = graveyardPosition.x;
    this.fence.y = graveyardPosition.y;
  }

  update(timeDiff: number): void {
    this.boneCollectors.addAndRemoveBoneCollectors();
    this.harpies.addAndRemoveHarpies();

    if (this.gameModel.isBossStage(this.gameModel.level)) {
      this.updateHealthBar();
    }

    if (
      !this.gameModel.constructions.graveyard ||
      this.gameModel.currentState != this.gameModel.states.playingLevel
    ) {
      this.sprite.visible = false;
      return void (this.fence.visible = false);
    }

    if (
      (this.level < 2 && this.gameModel.constructions.crypt) ||
      (this.level < 3 && this.gameModel.constructions.fort) ||
      (this.level < 4 && this.gameModel.constructions.fortress) ||
      (this.level < 5 && this.gameModel.constructions.citadel)
    ) {
      this.drawGraveyard();
    }

    this.sprite.visible = true;

    if (this.fortSprite) {
      this.fortSprite.visible = true;
    }

    if (this.level == 5 && Math.random() > 0.9) {
      if (Math.random() > 0.5) {
        this.smoke.newFireSmoke(this.sprite.x - 20, this.sprite.y - 113);
      } else {
        this.smoke.newFireSmoke(this.sprite.x + 20, this.sprite.y - 113);
      }
    }

    if (
      this.gameModel.energy >= this.gameModel.energyMax &&
      !this.gameModel.hidden
    ) {
      for (let e = 0; e < this.gameModel.persistentData.graveyardZombies; e++) {
        this.zombies.spawnZombie(
          this.sprite.x,
          this.sprite.y + (this.level > 2 ? 8 : 0),
        );
      }
    }

    this.bones.update(timeDiff);
    this.boneCollectors.update(timeDiff);
    this.harpies.update(timeDiff);

    if (
      this.gameModel.constructions.fence &&
      this.gameModel.currentState == this.gameModel.states.playingLevel
    ) {
      if (this.fenceRadius !== this.gameModel.fenceRadius) {
        this.drawFence();
      }
      this.fence.visible = true;
    } else {
      this.fence.visible = false;
    }

    this.updatePlagueSpikes(timeDiff);
    this.updateSpikeSprites(timeDiff);
  }

  updatePlagueSpikes(timeDiff: number): void {
    if (this.gameModel.constructions.plagueSpikes) {
      this.spikeTimer -= timeDiff;
      if (this.spikeTimer < 0) {
        this.spikeTimer = this.gameModel.spikeDelay;
        const aliveHumans = this.humans.aliveHumans;
        for (let i = 0; i < aliveHumans.length; i++) {
          if (Math.abs(aliveHumans[i].x - this.sprite.x) < this.fenceRadius) {
            if (Math.abs(aliveHumans[i].y - this.sprite.y) < this.fenceRadius) {
              if (
                this.fastDistance(
                  this.sprite.x,
                  this.sprite.y,
                  aliveHumans[i].x,
                  aliveHumans[i].y,
                ) < this.fenceRadius
              ) {
                this.zombies.inflictPlague(aliveHumans[i]);
                this.humans.damageHuman(
                  aliveHumans[i],
                  this.gameModel.zombieDamage,
                );
                this.blood.newPlagueSplatter(
                  aliveHumans[i].x,
                  aliveHumans[i].y,
                );
                this.addSpikeSprite(aliveHumans[i]);
              }
            }
          }
        }
      }
    }
  }

  addSpikeSprite(human: PIXI.AnimatedSprite): void {
    let sprite = null as PIXI.Sprite;
    for (let i = 0; i < this.spikeSprites.length; i++) {
      if (!this.spikeSprites[i].visible) {
        sprite = this.spikeSprites[i];
        break;
      }
    }
    if (!sprite) {
      sprite = new PIXI.Sprite(this.spikeTexture);
      this.spikeSprites.push(sprite);
      characterContainer.addChild(sprite);
      sprite.anchor.set(0.5, 1);
    }
    sprite.visible = true;
    sprite.alpha = 1;
    sprite.x = human.x;
    sprite.y = human.y + 2;
    sprite.zIndex = sprite.y;
    sprite.scale.y = 2;
    sprite.scale.x = Math.random() > 0.5 ? 1.5 : -1.5;
  }

  updateSpikeSprites(timeDiff: number): void {
    for (let i = 0; i < this.spikeSprites.length; i++) {
      if (this.spikeSprites[i].visible) {
        this.spikeSprites[i].alpha -= timeDiff * 0.4;
        if (this.spikeSprites[i].alpha <= 0) {
          this.spikeSprites[i].visible = false;
        }
      }
    }
  }

  isWithinFence(position: { x: number; y: number }): boolean {
    if (
      !this.gameModel.constructions.fence ||
      this.gameModel.currentState != this.gameModel.states.playingLevel
    ) {
      return false;
    }
    if (
      position.x > this.fence.x - this.fenceRadius &&
      position.x < this.fence.x + this.fenceRadius &&
      position.y > this.fence.y - this.fenceRadius &&
      position.y < this.fence.y + this.fenceRadius
    ) {
      return (
        this.fastDistance(position.x, position.y, this.fence.x, this.fence.y) <=
        this.fenceRadius
      );
    }
    return false;
  }
}

class BoneCollector extends PIXI.AnimatedSprite {
  xSpeed = 0;
  ySpeed = 0;
  bones = 0;
  speedFactor = 0;
  boneList = [];
  target = null;
  state: BoneCollectorState;
  constructor(textures: PIXI.Texture[]) {
    super(textures);
    this.animationSpeed = 0.2;
  }
}

enum BoneCollectorState {
  collecting,
  returning,
  waiting,
}

export class BoneCollectors {
  private static instance: BoneCollectors;
  constructor() {
    if (BoneCollectors.instance) return BoneCollectors.instance;
    BoneCollectors.instance = this;
  }

  sprites: BoneCollector[] = [];
  maxSpeed = 125;
  texture: PIXI.Texture[];
  scaling = 2;
  collectDistance = 10;
  fastDistance = fastDistance;
  bones: Bones;
  gameModel: GameModel;
  graveyard: Graveyard;

  populate(): void {
    this.graveyard = new Graveyard();
    this.gameModel = GameModel.getInstance();
    this.bones = new Bones();
    if (!this.texture) {
      this.texture = [];
      for (let i = 0; i < 2; i++) {
        this.texture.push(
          PIXI.Texture.from("bonecollector" + (i + 1) + ".png"),
        );
      }
    }
    for (let i = 0; i < this.sprites.length; i++) {
      this.sprites[i].boneList = [];
      this.sprites[i].target = false;
      this.sprites[i].position.set(
        this.graveyard.sprite.x,
        this.graveyard.sprite.y,
      );
      this.sprites[i].state = BoneCollectorState.collecting;
    }
  }

  addAndRemoveBoneCollectors(): void {
    if (this.sprites.length > this.gameModel.persistentData.boneCollectors) {
      const boneCollector = this.sprites.pop();
      if (boneCollector.boneList) {
        for (let i = 0; i < boneCollector.boneList.length; i++) {
          boneCollector.boneList[i].collector = false;
        }
      }
      this.gameModel.addBones(boneCollector.bones);
      characterContainer.removeChild(boneCollector);
    }
    if (this.sprites.length < this.gameModel.persistentData.boneCollectors) {
      const sprite = new BoneCollector(this.texture);
      sprite.animationSpeed = 0.2;
      sprite.anchor.set(0.5, 1);
      sprite.position.set(this.graveyard.sprite.x, this.graveyard.sprite.y);
      sprite.zIndex = sprite.position.y;
      sprite.visible = true;
      sprite.scale.set(
        Math.random() > 0.5 ? this.scaling : -1 * this.scaling,
        this.scaling,
      );
      sprite.xSpeed = 0;
      sprite.ySpeed = 0;
      sprite.bones = 0;
      sprite.speedFactor = 0;
      sprite.state = BoneCollectorState.collecting;
      sprite.play();
      sprite.boneList = [];
      this.sprites.push(sprite);
      characterContainer.addChild(sprite);
    }
  }

  update(timeDiff: number): void {
    for (let i = 0; i < this.sprites.length; i++) {
      this.updateBoneCollector(this.sprites[i], timeDiff);
    }
  }

  findNearestBone(boneCollector: BoneCollector): void {
    if (!boneCollector.boneList) {
      boneCollector.boneList = [];
    }

    if (boneCollector.boneList.length == 0) {
      let x = boneCollector.x;
      let y = boneCollector.y;
      for (let j = 0; j < 3; j++) {
        let nearestBone = null;
        let distanceToNearest = 2000;
        for (let i = 0; i < this.bones.uncollected.length; i++) {
          if (
            this.bones.uncollected[i].value > 0 &&
            !this.bones.uncollected[i].collector
          ) {
            const distance = this.fastDistance(
              x,
              y,
              this.bones.uncollected[i].x,
              this.bones.uncollected[i].y,
            );
            if (distance < distanceToNearest) {
              distanceToNearest = distance;
              nearestBone = this.bones.uncollected[i];
            }
          }
        }
        if (nearestBone) {
          boneCollector.boneList.push(nearestBone);
          nearestBone.collector = true;
          x = nearestBone.x;
          y = nearestBone.y;
        } else {
          break;
        }
      }
    }

    if (boneCollector.boneList.length > 0) {
      boneCollector.target = boneCollector.boneList.shift();
    } else {
      boneCollector.target = false;
    }
  }

  updateBoneCollector(boneCollector: BoneCollector, timeDiff: number): void {
    if (
      boneCollector.target &&
      !(
        boneCollector.target.graveyard &&
        boneCollector.state == BoneCollectorState.collecting
      )
    )
      this.updateSpeed(boneCollector, timeDiff);

    switch (boneCollector.state) {
      case BoneCollectorState.collecting:
        if (
          !boneCollector.target ||
          !boneCollector.target.value ||
          !boneCollector.target.visible
        ) {
          this.findNearestBone(boneCollector);
        }
        if (boneCollector.target && boneCollector.target.value > 0) {
          if (
            this.fastDistance(
              boneCollector.position.x,
              boneCollector.position.y,
              boneCollector.target.x,
              boneCollector.target.y,
            ) < this.collectDistance
          ) {
            boneCollector.bones += boneCollector.target.value;
            boneCollector.target.value = 0;
            boneCollector.speedFactor = 0;
          }
        }
        if (
          boneCollector.bones >= this.gameModel.boneCollectorCapacity ||
          !boneCollector.target
        ) {
          boneCollector.state = BoneCollectorState.returning;
          boneCollector.target = this.graveyard.sprite;
          return;
        }
        break;

      case BoneCollectorState.returning:
        if (!boneCollector.target) {
          boneCollector.target = this.graveyard.sprite;
        }
        if (
          this.fastDistance(
            boneCollector.position.x,
            boneCollector.position.y,
            boneCollector.target.x,
            boneCollector.target.y,
          ) < this.collectDistance
        ) {
          boneCollector.target = false;
          this.gameModel.addBones(boneCollector.bones);
          boneCollector.bones = 0;
          boneCollector.state = BoneCollectorState.collecting;
          boneCollector.speedFactor = 0;
        }
        break;
    }
  }

  updateSpeed(boneCollector: BoneCollector, timeDiff: number): void {
    boneCollector.speedFactor = Math.min(
      1,
      (boneCollector.speedFactor += timeDiff * 3),
    );

    const xVector = boneCollector.target.x - boneCollector.x;
    const yVector = boneCollector.target.y - boneCollector.y;
    const ax = Math.abs(xVector);
    const ay = Math.abs(yVector);
    if (Math.max(ax, ay) == 0) return;
    let ratio = 1 / Math.max(ax, ay);
    ratio = ratio * (1.29289 - (ax + ay) * ratio * 0.29289);

    boneCollector.xSpeed =
      xVector * ratio * this.maxSpeed * boneCollector.speedFactor;
    boneCollector.ySpeed =
      yVector * ratio * this.maxSpeed * boneCollector.speedFactor;

    boneCollector.position.x += boneCollector.xSpeed * timeDiff;
    boneCollector.position.y += boneCollector.ySpeed * timeDiff;
    boneCollector.zIndex = boneCollector.position.y;
  }
}

enum HarpyStates {
  bombing,
  returning,
}

class Harpy extends PIXI.AnimatedSprite {
  bomb: Bomb;
  target = null;
  state: HarpyStates;
  xSpeed = 0;
  ySpeed = 0;
  bombs = 0;
  speedFactor = 0;
  constructor(textures: PIXI.Texture[]) {
    super(textures);
    this.animationSpeed = 0.2;
    this.anchor.set(0.5, 1);
    this.visible = true;
  }
}

class Bomb extends PIXI.Sprite {
  dropped = false;
  floor = 0;
  rotSpeed = 0;
  target: Human;
  xSpeed = 0;
  ySpeed = 0;
  harpy: Harpy;
  fire = false;
  constructor(texture: PIXI.Texture) {
    super(texture);
    this.anchor.set(0.5, 0.5);
  }
}

export class Harpies {
  private static instance: Harpies;
  constructor() {
    if (Harpies.instance) return Harpies.instance;
    Harpies.instance = this;
  }

  model: GameModel;
  graveyard: Graveyard;
  zombies: Zombies;
  humans: Humans;
  tanks: Tanks;
  sprites: Harpy[] = [];
  discardedSprites: Harpy[] = [];
  bombSprites: Bomb[] = [];
  discardedBombSprites: Bomb[] = [];
  bombHeight = 100;
  textures: PIXI.Texture[];
  bombTexture: PIXI.Texture;
  scaling = 2.5;
  fastDistance = fastDistance;

  populate(): void {
    this.model = GameModel.getInstance();
    this.graveyard = new Graveyard();
    this.zombies = new Zombies();
    this.humans = new Humans();
    this.tanks = new Tanks();
    if (!this.textures) {
      this.textures = [];
      for (let i = 0; i < 2; i++) {
        this.textures.push(PIXI.Texture.from("harpy" + (i + 1) + ".png"));
      }
      this.bombTexture = PIXI.Texture.from("harpybomb.png");
    }
    if (typeof this.model.persistentData.harpies === "undefined") {
      this.model.persistentData.harpies = 0;
    }

    for (let i = 0; i < this.sprites.length; i++) {
      this.sprites[i].target = false;
      this.sprites[i].position.set(
        this.graveyard.sprite.x,
        this.graveyard.sprite.y - this.bombHeight,
      );
      this.sprites[i].state = HarpyStates.returning;
    }

    for (let i = 0; i < this.bombSprites.length; i++) {
      this.bombSprites[i].visible = false;
    }
  }

  addAndRemoveHarpies(): void {
    if (this.sprites.length > this.model.persistentData.harpies) {
      const harpy = this.sprites.pop()!;
      harpy.target = false;
      if (harpy.bomb) {
        harpy.bomb.dropped = true;
        harpy.bomb.floor = harpy.bomb.y + this.bombHeight;
      }
      foregroundContainer.removeChild(harpy);
      this.discardedSprites.push(harpy);
    }
    if (this.sprites.length < this.model.persistentData.harpies) {
      const sprite =
        this.discardedSprites.length > 0
          ? this.discardedSprites.pop()!
          : new Harpy(this.textures);
      sprite.position.set(
        this.graveyard.sprite.x,
        this.graveyard.sprite.y - this.bombHeight,
      );
      sprite.zIndex = sprite.position.y;
      sprite.scale.set(
        Math.random() > 0.5 ? this.scaling : -1 * this.scaling,
        this.scaling,
      );
      sprite.state = HarpyStates.returning;
      sprite.play();
      this.sprites.push(sprite);
      foregroundContainer.addChild(sprite);
    }
  }

  update(timeDiff: number): void {
    for (let i = 0; i < this.sprites.length; i++) {
      this.updateHarpy(this.sprites[i], timeDiff);
    }
    for (let i = 0; i < this.bombSprites.length; i++) {
      if (this.bombSprites[i].visible)
        this.updateBomb(this.bombSprites[i], timeDiff);
    }
  }

  updateBomb(bomb: Bomb, timeDiff: number): void {
    if (bomb.dropped) {
      bomb.rotation += timeDiff * bomb.rotSpeed;
      bomb.ySpeed += timeDiff * 50;
      bomb.scale.x = bomb.scale.y -= timeDiff * 0.2;
      bomb.y += bomb.ySpeed * timeDiff;
      if (bomb.y >= bomb.floor - 2) {
        bomb.visible = false;
        this.discardedBombSprites.push(bomb);
        if (bomb.fire) {
          this.humans.burnHuman(bomb.target, this.model.zombieHealth * 0.1);
        }
        this.zombies.causePlagueExplosion(
          bomb,
          this.model.zombieHealth * 0.2,
          false,
        );
      }
    } else {
      bomb.x = bomb.harpy.x;
      bomb.y = bomb.harpy.y;
    }
  }

  updateHarpy(harpy: Harpy, timeDiff: number): void {
    switch (harpy.state) {
      case HarpyStates.bombing:
        if (!harpy.target || harpy.target.graveyard || harpy.target.dead) {
          if (
            this.model.tankBuster &&
            this.model.isBossStage(this.model.level) &&
            this.tanks.aliveTanks.length > 0
          ) {
            harpy.target = getRandomElementFromArray(
              this.tanks.aliveTanks,
              Math.random(),
            );
            harpy.bomb.fire = true;
          } else {
            for (let i = 0; i < 8; i++) {
              harpy.target = getRandomElementFromArray(
                this.humans.aliveHumans,
                Math.random(),
              );
              if (
                !harpy.target ||
                this.fastDistance(
                  harpy.x,
                  harpy.y,
                  harpy.target.x,
                  harpy.target.y - this.bombHeight,
                ) < 500
              ) {
                break;
              }
            }

            harpy.bomb.fire = false;
          }
        }

        if (!harpy.target) {
          harpy.state = HarpyStates.returning;
          return;
        }

        if (
          this.fastDistance(
            harpy.x,
            harpy.y,
            harpy.target.x,
            harpy.target.y - this.bombHeight,
          ) < 10
        ) {
          harpy.bombs--;
          harpy.bomb.dropped = true;
          harpy.bomb.floor = harpy.target.y;
          harpy.bomb.target = harpy.target;
          harpy.bomb = null;
          harpy.speedFactor = 0;
          harpy.target = false;
          if (harpy.bombs <= 0) {
            harpy.state = HarpyStates.returning;
          } else {
            this.getBomb(harpy);
          }
        } else {
          this.updateHarpySpeed(harpy, timeDiff);
        }

        break;
      case HarpyStates.returning:
        if (!harpy.target) {
          harpy.target = this.graveyard.sprite;
        }

        if (
          this.fastDistance(
            harpy.x,
            harpy.y,
            harpy.target.x,
            harpy.target.y - this.bombHeight,
          ) < 10
        ) {
          harpy.bombs = this.model.harpyBombs;
          this.getBomb(harpy);
          harpy.state = HarpyStates.bombing;
          harpy.speedFactor = 0;
        } else {
          this.updateHarpySpeed(harpy, timeDiff);
        }

        break;
    }
  }

  getBomb(harpy: Harpy): void {
    let bomb: Bomb;
    if (this.discardedBombSprites.length > 0) {
      bomb = this.discardedBombSprites.pop();
    } else {
      bomb = new Bomb(this.bombTexture);
      this.bombSprites.push(bomb);
      foregroundContainer.addChild(bomb);
    }
    bomb.scale.x = bomb.scale.y = 2;
    bomb.rotation = 0;
    bomb.rotSpeed = Math.random() > 0.5 ? 4 : -4;
    bomb.ySpeed = 0;
    bomb.visible = true;
    bomb.dropped = false;
    bomb.harpy = harpy;
    harpy.bomb = bomb;
  }

  updateHarpySpeed(harpy: Harpy, timeDiff: number): void {
    harpy.speedFactor = Math.min(1, (harpy.speedFactor += timeDiff * 2));

    const xVector = harpy.target.x - harpy.x;
    const yVector = harpy.target.y - this.bombHeight - harpy.y;
    const ax = Math.abs(xVector);
    const ay = Math.abs(yVector);
    if (Math.max(ax, ay) == 0) return;
    let ratio = 1 / Math.max(ax, ay);
    ratio = ratio * (1.29289 - (ax + ay) * ratio * 0.29289);

    harpy.xSpeed = xVector * ratio * this.model.harpySpeed * harpy.speedFactor;
    harpy.ySpeed = yVector * ratio * this.model.harpySpeed * harpy.speedFactor;

    harpy.position.x += harpy.xSpeed * timeDiff;
    harpy.position.y += harpy.ySpeed * timeDiff;
    harpy.scale.x = harpy.xSpeed > 0 ? this.scaling : -1 * this.scaling;
  }
}
