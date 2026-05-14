export type Position = {
    x: number;
    y: number;
    width?: number;
    height?: number;
}

export class Wall extends PIXI.TilingSprite {
    collisionX = 0;
    collisionY = 0;
    collisionWidth = 0;
    collisionHeight = 0;
    constructor(texture: PIXI.Texture) {
        super(texture);
    }
}

export class Building {
    id = 0;
    x = 0;
    y = 0;
    width = 0;
    height = 0;
    entrance = null;
    container: PIXI.Container;
    floorSprite: PIXI.TilingSprite;
    walls: Wall[];
    corners: Position[];
    constructor(id: number, x: number, y: number, width: number, height: number) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

export class CharacterTimers {
    attack = 0;
    scan = 0;
    smoke = 0;
    burnTick = 0;
    ability = 0;
    dogStun = 0;
    target = 0;
}

export class CharacterFlags {
    burning = false;
    infected = false;
    dead = false;
}

export class CharacterObject extends PIXI.AnimatedSprite {
    xSpeed = 0;
    ySpeed = 0;
    health = 0;
    maxHealth = 0;
    zombie = false;
    targetVector = { x: 0, y: 0 };
    burnDamage = 0;
    currentPoi : Building;
    hasIcon = false;
    flags = new CharacterFlags();
    timer = new CharacterTimers();
    constructor(textures: PIXI.Texture[]) {
        super(textures);
    }
    /**
     * Resets speed, alpha, visibility, burnDamage, currentPoi, dead flag, burning flag, infected flag
     */
    reset() : void {
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.alpha = 1;
        this.visible = true;
        this.burnDamage = 0;
        this.currentPoi = null;
        this.flags.dead = false;
        this.flags.burning = false;
        this.flags.infected = false;
    }
}

export class GameObject extends PIXI.Sprite {
    xSpeed = 0;
    ySpeed = 0;
    constructor(texture: PIXI.Texture) {
        super(texture);
    }
}

export class SpritePool<T extends PIXI.Sprite> {
    sprites: T[] = [];
    discardedSprites: T[] = [];
    container: PIXI.Container;
    texture: PIXI.Texture;
    create: (texture: PIXI.Texture) => T;

    setup(container: PIXI.Container, texture: PIXI.Texture): void {
        this.container = container;
        this.texture = texture;
    }

    discardSprite(gameObject: T): void {
        gameObject.visible = false;
        this.discardedSprites.push(gameObject);
    }

    getSprite(): T {
        if (this.discardedSprites.length > 0) {
            const gameObject = this.discardedSprites.pop();
            gameObject.visible = true;
            return gameObject;
        }
        const gameObject = this.create(this.texture);
        this.container.addChild(gameObject);
        this.sprites.push(gameObject);
        return gameObject;
    }

}