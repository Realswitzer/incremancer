import { GameObject, SpritePool } from './classes/gameobject';
import { GameModel, Graveyard, Army, Humans, ZmMap, Zombies, foregroundContainer, gameContainer, viewableArea, 
  backgroundSpriteContainer, characterContainer, fastDistance } from './internal';

export class Particles {

  private static instance : Particles;
  blood = new Blood();
  smoke = new Smoke();
  prestigePoints = new PrestigePoints();
  bullets = new Bullets();
  exclamations = new Exclamations();
  blasts = new Blasts();
  fragments = new Fragments();

  constructor() {
    if (Particles.instance)
      return Particles.instance;
    Particles.instance = this;
  }

  initialize() : void {
    this.blood.initialize();
    this.bullets.initialize();
    this.exclamations.initialize();
    this.blasts.initialize();
    this.smoke.initialize();
    this.fragments.initialize();
    this.prestigePoints.initialize();
  }

  update(timeDiff : number) : void {
    this.blood.update(timeDiff);
    this.bullets.update(timeDiff);
    this.exclamations.update(timeDiff);
    this.blasts.update(timeDiff);
    this.smoke.update(timeDiff);
    this.fragments.update(timeDiff);
    this.prestigePoints.update(timeDiff);
  }
}

export class PrestigePoints extends SpritePool<GameObject> {
  private static instance : PrestigePoints;
  constructor() {
    super();
    if (PrestigePoints.instance)
      return PrestigePoints.instance;
    PrestigePoints.instance = this;
    this.create = (tex) => new GameObject(tex);
  }
  zmMap = new ZmMap();
  gameModel : GameModel;
  speed = 20;
  targetElement : HTMLElement;
  animElement : HTMLElement;

	initialize() : void {
    this.gameModel = GameModel.getInstance();
    if (!this.container) {
      this.setup(new PIXI.Container(), PIXI.Texture.from("pp.png"));
      foregroundContainer.addChild(this.container);      
    }
    this.targetElement = document.getElementById("prestige-button");
    this.animElement = document.getElementById("prestige-bg");
  }
  
	update(timeDiff : number) : void {
    if (!this.gameModel.persistentData.particles) {
      this.container.visible = false;
      return;
    } else {
      this.container.visible = true;
    }
    let target = {x:0, y:0};
    if (this.targetElement != null) {
      const rect  = this.targetElement.getBoundingClientRect();
      target = {x : rect.x + rect.width / 2, y : rect.y + rect.height / 2};
      target.x -= gameContainer.x;
      target.y -= gameContainer.y;
      target.x = target.x / gameContainer.scale.x;
      target.y = target.y / gameContainer.scale.y;
      
    }
		for (let i = 0; i < this.sprites.length; i++) {
      if (this.sprites[i].visible) {
        this.updatePart(this.sprites[i], timeDiff, target);
      }
		}
  }

  updatePart(sprite : GameObject, timeDiff : number, target : {x:number, y:number}) : void {
    const vector = this.zmMap.normalizeVector({x : target.x - sprite.x, y: target.y - sprite.y});
    const xDiff = (vector.x * 300) - sprite.xSpeed;
    const yDiff = (vector.y * 300) - sprite.ySpeed;
    sprite.xSpeed += xDiff * timeDiff;
    sprite.ySpeed += yDiff * timeDiff;
    sprite.x += sprite.xSpeed * timeDiff;
    sprite.y += sprite.ySpeed * timeDiff;
    if (fastDistance(sprite.x, sprite.y, target.x, target.y) < 30) {
      sprite.visible = false;
      sprite.x = 100;
      sprite.y = 100;
      if (this.animElement) {
        const prestigeBg = this.animElement;
        prestigeBg.classList.toggle("levelup");
        setTimeout(function() {
          prestigeBg.classList.toggle("levelup");
        }, 3000);
      }
    }
  }

  newPart(x : number,y : number) : void {
    if (!this.container.visible) {
      return;
    }
    const sprite = this.getSprite();
    sprite.x = x;
    sprite.y = y - 10;
    sprite.visible = true;
    sprite.scale.set(2, 2);
    sprite.xSpeed = 0;
    sprite.ySpeed = -100;
  }
}


export class Blood {
  private static instance : Blood;
  constructor() {
    if (Blood.instance)
      return Blood.instance;
    Blood.instance = this;
  }
  maxParts = 500;
  partCounter = 0;
  partsPerSplatter = 6;
  ecoPartsPerSplatter = 3;
  container = null;
  sprites : Fragment[] = [];
  gravity = 100;
  spraySpeed = 20;
  fadeSpeed = 0.7;
  visibleParts = 0;
  viewableArea = null;
  gameModel : GameModel;
  texture : PIXI.Texture;
  plagueTexture : PIXI.Texture;

	getTexture(color : string) : PIXI.Texture {
		const blast = document.createElement('canvas');
		blast.width = 1;
		blast.height = 1;
		const blastCtx = blast.getContext('2d');

		// draw shape
		blastCtx.fillStyle = color;
		blastCtx.fillRect(0, 0, 1, 1);
		return PIXI.Texture.from(blast);
  }
  
	initialize() : void {
    this.gameModel = GameModel.getInstance();
    this.viewableArea = viewableArea;
    if (!this.container) {
      this.container = new PIXI.Container();
      backgroundSpriteContainer.addChild(this.container);

      this.texture = this.getTexture("#ff0000");
      this.plagueTexture = this.getTexture("#00ff00");
    }

    if (this.sprites.length < this.maxParts) {
      for (let i = 0; i < this.maxParts; i++) {
        const sprite = new Fragment(this.texture);
        this.sprites.push(sprite);
        sprite.visible = false;
        if (Math.random() > 0.5)
          sprite.scale.set(2,2);
        this.container.addChild(sprite);
      }
    }
  }
  
	update(timeDiff : number) : void {
    if (!this.gameModel.persistentData.particles) {
      this.container.visible = false;
      return;
    } else {
      this.container.visible = true;
    }
    this.visibleParts = 0;
		for (let i = 0; i < this.sprites.length; i++) {
      if (this.sprites[i].visible) {
        this.updatePart(this.sprites[i], timeDiff);
        this.visibleParts++;
      }
		}
  }

  updatePart(sprite : Fragment, timeDiff : number) : void {
    if (sprite.hitFloor) {
      sprite.alpha -= this.fadeSpeed * timeDiff;
      if (sprite.alpha <= 0) {
        sprite.visible = false;
      }
    } else {
      sprite.ySpeed += this.gravity * timeDiff;
      sprite.x += sprite.xSpeed * timeDiff;
      sprite.y += sprite.ySpeed * timeDiff;
      if (sprite.y >= sprite.floor) {
        sprite.hitFloor = true;
      }
    }  
  }

  newPart(x : number, y : number, plague : boolean) : void {

    if (this.viewableArea.hideParticle(x,y)) {
      return;
    }
    const sprite = this.sprites[this.partCounter++];
    if (this.partCounter >= this.maxParts) {
      this.partCounter = 0;
    }
    if (plague) {
      sprite.texture = this.plagueTexture;
    } else {
      sprite.texture = this.texture; 
    }
    sprite.x = x;
    sprite.y = y - (8 + Math.random() * 10);
    sprite.floor = y;
    sprite.hitFloor = false;
    sprite.visible = true;
    sprite.alpha = 1;
    sprite.scale.set(1,1);
    if (Math.random() > 0.5)
      sprite.scale.set(2, 2);
    const xSpeed = Math.random() * (plague ? this.spraySpeed * 1.5 : this.spraySpeed);
    sprite.xSpeed = Math.random() > 0.5 ? -1 * xSpeed : xSpeed;
    sprite.ySpeed = -1 * (plague ? this.spraySpeed * 1.5 : this.spraySpeed);
  }

  newSplatter(x : number , y : number) : void {
    if (!this.container.visible) {
      return;
    }
    if (this.visibleParts < 0.9 * this.maxParts) {
      for (let i=0; i<this.partsPerSplatter; i++) {
        this.newPart(x, y, false);
      }
    } else {
      for (let i=0; i<this.ecoPartsPerSplatter; i++) {
        this.newPart(x, y, false);
      }
    }
  }

  newPlagueSplatter(x : number, y : number) : void {
    if (!this.container.visible) {
      return;
    }
    for (let i=0; i < this.partsPerSplatter; i++) {
      this.newPart(x, y, true);
    }
  }
}

class Bone extends GameObject {
  fadeTime  = 0;
  floor = 0;
  rotSpeed = 0;
  collector = null;
  hitFloor = false;
  collected = false;
}

export class Bones {

  private static instance : Bones;
  constructor() {
    if (Bones.instance)
      return Bones.instance;
    Bones.instance = this;
  }

  maxParts = 100;
  partsPerSplatter = 3;
  container = null;
  sprites : Bone[] = [];
  discardedSprites : Bone[] = [];
  uncollected : Bone[] = [];
  gravity = 100;
  spraySpeed = 20;
  fadeTime = 40;
  fadeSpeed = 0.2;
  fadeBones = false;
  texture = null as PIXI.Texture;
  gameModel = null;

	getTexture() : PIXI.Texture {
		const blast = document.createElement('canvas');
		blast.width = 4;
		blast.height = 1;
		const blastCtx = blast.getContext('2d');

		// draw shape
		blastCtx.fillStyle = "#dddddd";
		blastCtx.fillRect(0, 0, 4, 1);
		return PIXI.Texture.from(blast);
  }
  
	initialize() : void {
    this.gameModel = GameModel.getInstance();
    if (!this.container) {
      this.container = new PIXI.Container();
      backgroundSpriteContainer.addChild(this.container);
      this.texture = this.getTexture();
    }

    for (let i = 0; i < this.sprites.length; i++) {
      this.sprites[i].collected = true;
      this.sprites[i].visible = false;
      this.container.removeChild(this.sprites[i]);
    }

    if (this.sprites.length < this.maxParts) {
      for (let i = 0; i < this.maxParts; i++) {
        const sprite = new Bone(this.texture);
        sprite.visible=false;
        this.sprites.push(sprite);
      }
    }
    this.discardedSprites = this.sprites.slice();
  }
  
	update(timeDiff : number) : void {
    const uncollectedBones = [];
		for (let i = 0; i < this.sprites.length; i++) {
      if (this.sprites[i].visible) {
        this.updatePart(this.sprites[i], timeDiff);
        uncollectedBones.push(this.sprites[i]);
      }
    }
    this.uncollected = uncollectedBones;
    this.fadeBones = uncollectedBones.length > 200;
  }

  updatePart(sprite : Bone, timeDiff : number) : void {
    if (sprite.collected) {
      sprite.visible = false;
      this.discardedSprites.push(sprite);
      this.container.removeChild(sprite);
      return;
    }
    if (sprite.hitFloor) {
      
      if (this.fadeBones)
        sprite.fadeTime -= timeDiff;

      if (sprite.fadeTime < 0 && !sprite.collector) {
        sprite.alpha -= this.fadeSpeed * timeDiff;
        if (sprite.alpha <= 0) {
          sprite.visible = false;
          this.discardedSprites.push(sprite);
          this.container.removeChild(sprite);
        }
      }
      
    } else {
      sprite.ySpeed += this.gravity * timeDiff;
      sprite.rotation += sprite.rotSpeed * timeDiff;
      sprite.x += sprite.xSpeed * timeDiff;
      sprite.y += sprite.ySpeed * timeDiff;
      if (sprite.y >= sprite.floor) {
        sprite.hitFloor = true;
      }
    } 
  }

  newPart(x : number, y : number) : void {
    let sprite = null;
    if (this.discardedSprites.length > 0) {
      sprite = this.discardedSprites.pop();
    } else {
      sprite = new PIXI.Sprite(this.texture);
      this.sprites.push(sprite);
    }
    this.container.addChild(sprite);
    sprite.x = x;
    sprite.y = y - (8 + Math.random() * 10);
    sprite.fadeTime = Math.random() * this.fadeTime;
    sprite.rotation = Math.random() * 5
    sprite.rotSpeed =  -2 + Math.random() * 4;
    sprite.floor = y;
    sprite.hitFloor = false;
    sprite.collected = false;
    sprite.collector = false;
    sprite.visible = true;
    sprite.alpha = 1;
    sprite.scale = {x:1,y:1};
    if (Math.random() > 0.5)
      sprite.scale = {x:1.5,y:1.5};
    const xSpeed = Math.random() * this.spraySpeed;
    sprite.xSpeed = Math.random() > 0.5 ? -1 * xSpeed : xSpeed;
    sprite.ySpeed = -1 * this.spraySpeed;
  }

  newBones(x : number, y : number) : void {
    if (!this.gameModel.constructions.graveyard)
      return;
    for (let i=0; i<this.partsPerSplatter; i++) {
      this.newPart(x,y);
    }
  }
}

class Exclamation extends PIXI.Sprite {
  time = 0;
  target = null;
}

export class Exclamations {
  private static instance : Exclamations;
  constructor() {
    if (Exclamations.instance)
      return Exclamations.instance;
    Exclamations.instance = this;
  }
  sprites : Exclamation[] = [];
  discardedSprites : Exclamation[] = [];
  maxSprites = 10;
  container : PIXI.Container;
  height = 20;
  fadeSpeed = 4;
  healTexture : PIXI.Texture;
  exclamationTexture : PIXI.Texture;
  radioTexture : PIXI.Texture;
  fireTexture : PIXI.Texture
  shieldTexture : PIXI.Texture;
  poisonTexture : PIXI.Texture;

  initialize() : void {
    if (!this.container) {
      this.container = new PIXI.Container();
      foregroundContainer.addChild(this.container);
  
      this.healTexture = PIXI.Texture.from("healing.png");
      this.exclamationTexture = PIXI.Texture.from("exclamation.png");
      this.radioTexture = PIXI.Texture.from("radio.png");
      this.fireTexture = PIXI.Texture.from("fire.png");
      this.shieldTexture = PIXI.Texture.from("shield.png");
      this.poisonTexture = PIXI.Texture.from("poison.png");
    }
    
    for (let i = 0; i < this.sprites.length; i++) {
      this.container.removeChild(this.sprites[i]);
    }

    if (this.sprites.length < this.maxSprites) {
      for (let i = 0; i < this.maxSprites; i++) {
        const sprite = new Exclamation(this.exclamationTexture);
        sprite.anchor.set(0.5, 1);
        this.sprites.push(sprite);
        sprite.visible = false;
      }
    }
		
    this.discardedSprites = this.sprites.slice();
  }

  newIcon(target : {x: number, y: number, hasIcon: boolean}, texture : PIXI.Texture, displayTime : number) : void {
    if (target.hasIcon)
      return;
    let sprite : Exclamation;
    if (this.discardedSprites.length > 0) {
      sprite = this.discardedSprites.pop();
    } else {
      sprite = new Exclamation(this.exclamationTexture);
      sprite.anchor.set(0.5, 1);
      this.sprites.push(sprite);
    }
    this.container.addChild(sprite);
    sprite.texture = texture;
    sprite.target = target;
    sprite.target.hasIcon = true;
    sprite.x = target.x;
    sprite.y = target.y - this.height;
    sprite.visible = true;
    sprite.time = displayTime;
    sprite.alpha = 1;
    sprite.scale.set(1.5, 1.5);
  }

  newHealing(target : {x: number, y: number, hasIcon: boolean}) : void {
    this.newIcon(target, this.healTexture, 1);
  }

  newExclamation(target : {x: number, y: number, hasIcon: boolean}) : void {
    this.newIcon(target, this.exclamationTexture, 2);
  }

  newRadio(target : {x: number, y: number, hasIcon: boolean}) : void {
    this.newIcon(target, this.radioTexture, 3);
  }

  newFire(target : {x: number, y: number, hasIcon: boolean}) : void {
    this.newIcon(target, this.fireTexture, 1);
  }

  newShield(target : {x: number, y: number, hasIcon: boolean}) : void {
    this.newIcon(target, this.shieldTexture, 1);
  }

  newPoison(target : {x: number, y: number, hasIcon: boolean}) : void {
    this.newIcon(target, this.poisonTexture, 1);
  }

  update(timeDiff : number) : void {
    for (let i=0; i < this.sprites.length; i++) {
      if (this.sprites[i].visible) {
        this.updateSprite(this.sprites[i], timeDiff);
      }
    }
  }

  updateSprite(sprite : Exclamation, timeDiff : number) : void {
    sprite.x = sprite.target.x;
    sprite.y = sprite.target.y - this.height;
    sprite.time -= timeDiff;
    if (sprite.time < 0) {
      sprite.alpha -= timeDiff * this.fadeSpeed;
      if (sprite.alpha < 0) {
        sprite.visible = false;
        sprite.target.hasIcon = false;
        this.discardedSprites.push(sprite);
      }
    }
  }
}

class Bullet extends GameObject {
  plague = false;
  rocket = false;
  fireball = false;
  target = null;
  source = null;
  hitbox = 0;
  damage = 0;
}

export class Bullets {
  private static instance : Bullets;
  constructor() {
    if (Bullets.instance)
      return Bullets.instance;
    Bullets.instance = this;
  }
  zombies = new Zombies();
  humans = new Humans();
  graveyard = new Graveyard();
  army = new Army();
  maxParts = 20;
  speed = 150;
  hitbox = 12;
  sprites : Bullet[] = [];
  discardedSprites : Bullet[] = [];
  fadeSpeed = 0.2;
  texture : PIXI.Texture;
  fireballTexture : PIXI.Texture;
  container : PIXI.Container;

	getTexture() : PIXI.Texture {
		const blast = document.createElement('canvas');
		blast.width = 1;
		blast.height = 1;
		const blastCtx = blast.getContext('2d');

		// draw shape
		blastCtx.fillStyle = "#ffffff";
		blastCtx.fillRect(0, 0, 1, 1);
		return PIXI.Texture.from(blast);
  }

  getFireballTexture() : PIXI.Texture {
		const blast = document.createElement('canvas');
		blast.width = 8;
		blast.height = 8;
		const blastCtx = blast.getContext('2d');

		const radgrad = blastCtx.createRadialGradient(4, 4, 0, 4, 4, 4);
		radgrad.addColorStop(0, 'rgba(255,255,0,1)');
		radgrad.addColorStop(0.8, 'rgba(255,0,0,0.2)');
		radgrad.addColorStop(1, 'rgba(255,0,0,0)');

		// draw shape
		blastCtx.fillStyle = radgrad;
		blastCtx.fillRect(0, 0, 8, 8);

		return PIXI.Texture.from(blast);
  }
  
	initialize() : void {

    if (!this.texture) {
      this.texture = this.getTexture();
      this.fireballTexture = this.getFireballTexture();
    }
    for (let i = 0; i < this.sprites.length; i++) {
      characterContainer.removeChild(this.sprites[i]);
    }

    if (this.sprites.length < this.maxParts) {
      for (let i = 0; i < this.maxParts; i++) {
        const sprite = new Bullet(this.texture);
        sprite.scale.x = sprite.scale.y = 2;
        sprite.visible = false;
        this.sprites.push(sprite);
      }
    }
		
    this.discardedSprites = this.sprites.slice();
  }
  
	update(timeDiff : number) : void {
		for (let i = 0; i < this.sprites.length; i++) {
      if (this.sprites[i].visible) {
        this.updatePart(this.sprites[i], timeDiff);
      }
		}
  }

  updatePart(sprite : Bullet, timeDiff : number) : void {
    if (fastDistance(sprite.x, sprite.y + 8, sprite.target.x, sprite.target.y) < sprite.hitbox) {
      if (sprite.plague) {
        this.zombies.inflictPlague(sprite.target);
        this.humans.damageHuman(sprite.target, sprite.damage);
      } else if (sprite.fireball) {
        this.humans.burnHuman(sprite.target, sprite.damage);
        this.humans.damageHuman(sprite.target, sprite.damage);
      } else {
        if (!sprite.rocket && sprite.target.bulletReflect && Math.random() < sprite.target.bulletReflect) {
          this.newBullet(sprite.target, sprite.source, sprite.damage, false, false, false);
        } else {
          if (sprite.rocket) {
            if (sprite.target.graveyard) this.graveyard.damageGraveyard(sprite.damage);
            this.army.droneExplosion(sprite.target.x, sprite.target.y, null, sprite.damage);
          } else {
            if (sprite.target.zombie) this.zombies.damageZombie(sprite.target, sprite.damage, sprite.source);
            if (sprite.target.human) this.humans.damageHuman(sprite.target, sprite.damage);
          }
        }
      }
      
      sprite.visible = false;
      this.discardedSprites.push(sprite);
      characterContainer.removeChild(sprite);
    } else {
      sprite.x += sprite.xSpeed * timeDiff;
      sprite.y += sprite.ySpeed * timeDiff;
      sprite.zIndex = sprite.y;
    }
    sprite.alpha -= this.fadeSpeed * timeDiff;
    if (sprite.alpha < 0) {
      sprite.visible = false;
      this.discardedSprites.push(sprite);
      characterContainer.removeChild(sprite);
    }
  }

  newBullet(source : {x:number, y:number}, target : {x:number, y: number}, damage : number, plague = false, rocket = false, fireball = false) : void {
    let sprite : Bullet;
    if (this.discardedSprites.length > 0) {
     sprite = this.discardedSprites.pop();
    } else {
      sprite = new Bullet(this.texture);
      sprite.scale.x = sprite.scale.y = 2;
      this.sprites.push(sprite);
    }
    characterContainer.addChild(sprite);
    sprite.texture = fireball ? this.fireballTexture : this.texture;
    sprite.source = source;
    sprite.x = source.x;
    sprite.y = source.y - 8;
    if (plague) {
      sprite.y = source.y - 12;
    }
    sprite.target = target;
    sprite.damage = damage;
    sprite.visible = true;
    sprite.alpha = 1;

    sprite.hitbox = rocket ? this.hitbox * 1.5 : this.hitbox;

    sprite.plague = plague;
    sprite.rocket = rocket;
    sprite.fireball = fireball;
    sprite.tint = plague ? 0x00FF00 : rocket ? 0xFFEC00 : 0xFFFFFF;
    sprite.scale.x = sprite.scale.y = rocket ? 2.5 : 2;
    if (fireball) {
      sprite.scale.x = sprite.scale.y = 1.5;
    }

    const xVector = target.x - sprite.x;
    const yVector = (target.y - 8) - sprite.y;
    const ax = Math.abs(xVector);
    const ay = Math.abs(yVector);
    let ratio = 1 / Math.max(ax, ay);
    ratio = ratio * (1.29289 - (ax + ay) * ratio * 0.29289);
    
    sprite.xSpeed = xVector * ratio * this.speed;
    sprite.ySpeed = yVector * ratio * this.speed;

    sprite.rotation = Math.atan2(sprite.ySpeed, sprite.xSpeed);
  }
}

export class Blasts extends SpritePool<GameObject> {
  private static instance : Blasts;
  constructor() {
    super();
    if (Blasts.instance)
      return Blasts.instance;
    Blasts.instance = this;
    this.create = (texture) => new GameObject(texture);
  }
  viewableArea = null;

	getTexture() : PIXI.Texture {
		const blast = document.createElement('canvas');
		blast.width = 32;
		blast.height = 32;
		const blastCtx = blast.getContext('2d');

		const radgrad = blastCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
		radgrad.addColorStop(0, 'rgba(255,255,255,1)');
		radgrad.addColorStop(0.8, 'rgba(255,255,128,0.2)');
		radgrad.addColorStop(1, 'rgba(255,180,0,0)');

		// draw shape
		blastCtx.fillStyle = radgrad;
		blastCtx.fillRect(0, 0, 32, 32);

		return PIXI.Texture.from(blast);
  }
  
	initialize() : void {
    this.viewableArea = viewableArea;
    if (!this.texture) {
      this.texture = this.getTexture();
      this.container = new PIXI.Container();
      foregroundContainer.addChild(this.container);
      this.setup(this.container, this.texture);
    }
	}
	update(timeDiff : number) : void {
		for (let i = 0; i < this.sprites.length; i++) {
      if (this.sprites[i].visible) {
        this.updatePart(this.sprites[i], timeDiff);
      }
		}
  }
  updatePart(sprite : GameObject, timeDiff : number) : void {
    if (sprite.visible) {
      sprite.scale.y -= (10 * timeDiff);
      sprite.scale.x = sprite.scale.y;
      if (sprite.scale.x <= 0) {
        this.discardSprite(sprite);
      }
    }
  }
	newBlast(x : number, y : number) : void {
    if (this.viewableArea.hideParticle(x,y)) {
      return;
    }
    const sprite = this.getSprite();
    sprite.anchor.set(0.5,0.5);
    sprite.scale.x = sprite.scale.y = 2;
		sprite.x = x;
    sprite.y = y;
    new Smoke().newCloud(x, y);
  }

  newDroneBlast(x : number, y : number) : void {
    const sprite = this.getSprite();
    sprite.scale.x = sprite.scale.y = 2;
		sprite.x = x;
    sprite.y = y;
    new Smoke().newDroneCloud(x, y);
	}
}


export class Smoke extends SpritePool<GameObject> {
  private static instance : Smoke;
  constructor(){
    super();
    if (Smoke.instance)
      return Smoke.instance;
    Smoke.instance = this;
    this.create = (texture) => new GameObject(texture);
  }
  tint = 0xFFFFFF;
  viewableArea = null;
  allowTint = false;
  gameModel = null;

	getTexture() : PIXI.Texture {
		const size = 8;
    const blast = document.createElement('canvas');
    blast.width = size + 4;
    blast.height = size + 4;
    const blastCtx = blast.getContext('2d');
    blastCtx.shadowBlur = 5;
    blastCtx.shadowColor = "white";
    const radgrad = blastCtx.createRadialGradient(size / 2 + 2, size / 2 + 2, 0, size / 2 + 2, size / 2 + 2, size / 2);
    radgrad.addColorStop(0, 'rgba(255,255,255,0.05)');
    radgrad.addColorStop(0.5, 'rgba(255,255,255,0.1)');
    radgrad.addColorStop(1, 'rgba(255,255,255,0)');
    blastCtx.fillStyle = radgrad;
    blastCtx.fillRect(0, 0, size + 4, size + 4);
    return PIXI.Texture.from(blast);
  }
  
	initialize() : void {
    this.gameModel = GameModel.getInstance();
    this.viewableArea = viewableArea;
    this.allowTint = this.gameModel.app && this.gameModel.app.renderer && this.gameModel.app.renderer.type == 1;

    if (!this.texture) {
      this.setup(new PIXI.Container(), this.getTexture());
      foregroundContainer.addChild(this.container);
    }
  }
  
	update(timeDiff : number) : void {
    if (!this.gameModel.persistentData.particles) {
      this.container.visible = false;
      return;
    } else {
      this.container.visible = true;
    }
		for (let i = 0; i < this.sprites.length; i++) {
      if (this.sprites[i].visible) {
        this.updatePart(this.sprites[i], timeDiff);
      }
		}
  }

  updatePart(gameObject : GameObject, timeDiff : number) : void {
    gameObject.scale.y -= (1.5 * timeDiff);
    gameObject.scale.x = gameObject.scale.y;
    gameObject.y += gameObject.ySpeed;
    if (gameObject.scale.x <= 0) {
      this.discardSprite(gameObject);
    }
  }

  sizeVariance = 0.2;

	newSmoke(x : number, y : number, variance = 0) : void {
    if (this.viewableArea.hideParticle(x,y)) {
      return;
    }
    const gameObject = this.getSprite();
    
    if (this.allowTint) {
      gameObject.tint = this.tint;
    }

    gameObject.ySpeed = -0.5;
    gameObject.anchor.set(0.5, 0.5);
    gameObject.scale.x = gameObject.scale.y = 1.6 - this.sizeVariance + (Math.random() * this.sizeVariance * 2);
		gameObject.visible = true;
		gameObject.x = x - variance + (Math.random() * variance * 2);
    gameObject.y = y - variance + (Math.random() * variance * 2);
  }

  newFireSmoke(x : number, y : number) : void {
    if (!this.container.visible) {
      return;
    }
    this.tint = 0xFFFFFF;
    this.newSmoke(x, y, 3);
  }

  newCloud(x : number, y : number) : void {
    if (!this.container.visible) {
      return;
    }
    this.tint = 0x00FF00;
    for (let i = 0; i < 10; i++) {
      this.newSmoke(x, y, 16);
    }
  }

  newDroneCloud(x : number, y : number) : void {
    if (!this.container.visible) {
      return;
    }
    this.tint = 0xFFFFFF;
    for (let i = 0; i < 10; i++) {
      this.newSmoke(x, y, 24);
    }
  }

  newZombieSpawnCloud(x : number, y : number) : void {
    if (!this.container.visible) {
      return;
    }
    this.tint = 0x00FF00;
    for (let i = 0; i < 5; i++) {
      this.newSmoke(x, y, 6);
    }
  }
}

class Fragment extends GameObject {
  hitFloor = false;
  floor : number;
  rotSpeed : number;
}

export class Fragments extends SpritePool<Fragment> {
  private static instance : Fragments;
  constructor() {
    super();
    if (Fragments.instance)
      return Fragments.instance;
    Fragments.instance = this;
    this.create = (texture) => new Fragment(texture);
  }
  partsPerSplatter = 15;
  gravity = 100;
  spraySpeed = 50;
  fadeSpeed = 0.7;
  texture : PIXI.Texture;
  viewableArea = viewableArea;
  gameModel : GameModel;
	getTexture() : PIXI.Texture {
		const blast = document.createElement('canvas');
		blast.width = 5;
		blast.height = 1;
		const blastCtx = blast.getContext('2d');

		// draw shape
		blastCtx.fillStyle = "#FFFFFF";
		blastCtx.fillRect(0, 0, 5, 1);
		return PIXI.Texture.from(blast);
	}
	initialize() : void {
    this.gameModel = GameModel.getInstance();
    this.viewableArea = viewableArea;
    if (!this.container) {
      this.container = new PIXI.Container();
      backgroundSpriteContainer.addChild(this.container);
      this.texture = this.getTexture();
      this.setup(this.container, this.texture);
    }
	}
	update(timeDiff : number) : void {
    if (!this.gameModel.persistentData.particles) {
      this.container.visible = false;
      return;
    } else {
      this.container.visible = true;
    }
		for (let i = 0; i < this.sprites.length; i++) {
      if (this.sprites[i].visible) {
        this.updatePart(this.sprites[i], timeDiff);
      }
		}
  }
  updatePart(sprite : Fragment, timeDiff : number) : void {
    if (sprite.hitFloor) {
      sprite.alpha -= this.fadeSpeed * timeDiff;
      if (sprite.alpha <= 0) {
        this.discardSprite(sprite);
      }
    } else {
      sprite.ySpeed += this.gravity * timeDiff;
      sprite.x += sprite.xSpeed * timeDiff;
      sprite.y += sprite.ySpeed * timeDiff;
      if (sprite.y >= sprite.floor) {
        sprite.hitFloor = true;
      }
      sprite.rotation += sprite.rotSpeed * timeDiff;
    }    
  }
  newPart(x : number, y : number, tint : number) : void {
    if (!this.container.visible) {
      return;
    }
    if (this.viewableArea.hideParticle(x,y)) {
      return;
    }
    const sprite = this.getSprite();
    sprite.tint = tint;
    sprite.x = x;
    sprite.y = y - (8 + Math.random() * 10);
    sprite.floor = y;
    sprite.hitFloor = false;
    sprite.rotation = Math.random() * 5
    sprite.rotSpeed =  -2 + Math.random() * 4;
    sprite.alpha = 1;
    sprite.scale.set(2, 2);
    const xSpeed = Math.random() * this.spraySpeed;
    sprite.xSpeed = Math.random() > 0.5 ? -1 * xSpeed : xSpeed;
    sprite.ySpeed = -1 * (10 + (Math.random() * this.spraySpeed));
  }
  newFragmentExplosion(x : number, y : number, tint : number) : void {
    if (!this.container.visible) {
      return;
    }
    for (let i=0; i < this.partsPerSplatter; i++) {
      this.newPart(x, y, tint);
    }
  }
}