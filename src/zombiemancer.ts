import {
  GameModel,
  Particles,
  Creatures,
  Graveyard,
  Humans,
  Skeleton,
  Zombies,
  distanceBetweenPoints,
} from "./internal";

let gameContainer: PIXI.Container,
  backgroundContainer: PIXI.Container,
  backgroundSpriteContainer: PIXI.Container;
let characterContainer: PIXI.Container,
  uiContainer: PIXI.Container,
  foregroundContainer: PIXI.Container;
let vipTexture: PIXI.RenderTexture;
let vipSprite: PIXI.Sprite;
let grass: PIXI.TilingSprite;
let canvasSize = { x: 800, y: 600, defaultScale: 1 };
let gameFieldSize = { x: 600, y: 600 };

let gameModel: GameModel,
  particles: Particles,
  graveyard: Graveyard,
  creatures: Creatures,
  skeleton: Skeleton,
  zombies: Zombies,
  humans: Humans;

function setupClasses() {
  gameModel = GameModel.getInstance();
  particles = new Particles();
  graveyard = new Graveyard();
  creatures = new Creatures();
  skeleton = new Skeleton();
  zombies = new Zombies();
  humans = new Humans();
}

function onDragStart(event) {
  this.data = event.data;
  this.dragging = true;
  this.dragOffset = this.data.getLocalPosition(this);
  this.dragOffset.x *= this.scale.x;
  this.dragOffset.y *= this.scale.y;
  this.dragStartX = this.x;
  this.dragStartY = this.y;
  lastDiff = 0;
}

function onDragEnd() {
  this.dragging = false;
  this.data = null;
  lastDiff = 0;
}

let lastDiff = 0;
let lastPinchZoom = 0;

function pinchZoom(event) {
  const curDiff = Math.abs(
    event.data.originalEvent.touches[0].clientX -
      event.data.originalEvent.touches[1].clientX
  );
  if (lastDiff) {
    if (lastPinchZoom + 50 < Date.now() && Math.abs(curDiff - lastDiff) > 10) {
      if (curDiff > lastDiff) {
        zoom(1, null);
      } else {
        zoom(-1, null);
      }
      lastPinchZoom = Date.now();
      lastDiff = curDiff;
    }
  } else {
    lastDiff = curDiff;
  }
}

function onDragMove(event) {
  if (zombies.zombieCursor) {
    zombies.zombieCursor.position = event.data.getLocalPosition(this.parent);
    // TODO: rename variable when i figure out what getLocalPosition even does
    const grassPos = event.data.getLocalPosition(grass);
    zombies.mouseOutOfBounds =
      grassPos.x < 0 ||
      grassPos.y < 0 ||
      grassPos.x > grass.width ||
      grassPos.y > grass.height;
  }
  if (
    event.data.originalEvent.touches &&
    event.data.originalEvent.touches.length > 1
  ) {
    pinchZoom(event);
  } else if (this.dragging) {
    const newPosition = this.data.getLocalPosition(this.parent);
    this.x = newPosition.x - this.dragOffset.x;
    this.y = newPosition.y - this.dragOffset.y;
    preventGameContainerLeavingBounds(this);
    if (
      distanceBetweenPoints(this.dragStartX, this.dragStartY, this.x, this.y) >
      5
    ) {
      this.hasMoved = true;
    }
  }
}

function preventGameContainerLeavingBounds(gc) {
  const gcWidth = gameFieldSize.x * gc.scale.x;
  const gcHeight = gameFieldSize.y * gc.scale.y;
  if (gc.x > canvasSize.x * 0.5) gc.x = canvasSize.x * 0.5;
  if (gc.x + gcWidth < canvasSize.x * 0.5) gc.x = canvasSize.x * 0.5 - gcWidth;
  if (gc.y > canvasSize.y * 0.5) gc.y = canvasSize.y * 0.5;
  if (gc.y + gcHeight < canvasSize.y * 0.5)
    gc.y = canvasSize.y * 0.5 - gcHeight;
}

function onClickTap(event) {
  if (
    !this.hasMoved &&
    gameModel.currentState == gameModel.states.playingLevel
  ) {
    if (KeysPressed.shift) {
      zombies.spawnAllZombies(
        event.data.getLocalPosition(this).x,
        event.data.getLocalPosition(this).y
      );
    } else {
      zombies.spawnZombie(
        event.data.getLocalPosition(this).x,
        event.data.getLocalPosition(this).y
      );
    }
  }
  this.hasMoved = false;
}

function zoom(change: number, coords: { x: number; y: number }): void {
  if (lastPinchZoom + 50 > Date.now()) {
    return;
  }
  lastPinchZoom = Date.now();
  const gc = gameContainer;

  if (!coords) {
    coords = { x: canvasSize.x * 0.5, y: canvasSize.y * 0.5 };
  }

  const gcWidth = gameFieldSize.x * gc.scale.x;
  const gcHeight = gameFieldSize.y * gc.scale.y;

  if (coords.x > gc.x + gcWidth) coords.x = gc.x + gcWidth;
  if (coords.x < gc.x) coords.x = gc.x;
  if (coords.y < gc.y) coords.y = gc.y;
  if (coords.y > gc.y + gcHeight) coords.y = gc.y + gcHeight;

  const centerPosition = {
    x: (coords.x - gc.x) / gc.scale.x,
    y: (coords.y - gc.y) / gc.scale.y,
  };

  if (change > 0) {
    if (gc.scale.x < 10) {
      gc.scale.x = gc.scale.y = gc.scale.x * 1.1;
      if (zombies.zombieCursor && zombies.zombieCursor.scale)
        // .scale is undefined sometimes, don't know why yet
        zombies.zombieCursor.scale.x = zombies.zombieCursor.scale.y =
          zombies.zombieCursor.scale.x * 1.1;
    }
  } else {
    if (
      Math.max(gcWidth, gcHeight) >
      Math.min(canvasSize.y, canvasSize.x) * 0.8
    ) {
      gc.scale.x = gc.scale.y = gc.scale.x * 0.9;
      if (zombies.zombieCursor && zombies.zombieCursor.scale)
        // .scale is undefined sometimes, don't know why yet
        zombies.zombieCursor.scale.x = zombies.zombieCursor.scale.y =
          zombies.zombieCursor.scale.x * 0.9;
    }
  }

  gc.x = coords.x - centerPosition.x * gc.scale.x;
  gc.y = coords.y - centerPosition.y * gc.scale.y;
  preventGameContainerLeavingBounds(gc);
}

function onWheel(event) {
  event.preventDefault();
  const coords = {
    x: event.clientX * (canvasSize.x / document.body.clientWidth),
    y: event.clientY * (canvasSize.y / document.body.clientHeight),
  };

  if (event.deltaY < 0 || event.deltaX < 0) zoom(+1, coords);
  else zoom(-1, coords);
}

function setupContainers(app) {
  gameContainer = new PIXI.Container();
  backgroundContainer = new PIXI.Container();
  backgroundSpriteContainer = new PIXI.Container();
  characterContainer = new PIXI.Container();
  characterContainer.sortableChildren = true;
  foregroundContainer = new PIXI.Container();
  uiContainer = new PIXI.Container();
  vipTexture = PIXI.RenderTexture.create({ width: 300, height: 300 });
  vipSprite = new PIXI.Sprite(vipTexture);
  vipSprite.visible = false;
  vipSprite.alpha = 0;
  uiContainer.addChild(vipSprite);

  gameContainer.addChild(backgroundContainer);
  gameContainer.addChild(backgroundSpriteContainer);
  gameContainer.addChild(characterContainer);
  gameContainer.addChild(foregroundContainer);

  app.stage.addChild(gameContainer);
  app.stage.addChild(uiContainer);

  gameContainer.interactive = true;
  gameContainer.interactiveChildren = false;

  gameContainer.on("pointerdown", onDragStart);
  gameContainer.on("pointerup", onDragEnd);
  gameContainer.on("pointerupoutside", onDragEnd);
  gameContainer.on("pointermove", onDragMove);
  gameContainer.on("click", onClickTap);
  gameContainer.on("tap", onClickTap);
  document.getElementsByTagName("canvas")[0].onwheel = onWheel;
  document.getElementsByTagName("canvas")[0].oncontextmenu = function (event) {
    event.preventDefault();
  };
}

function centerGameContainer(resetZoom = false): void {
  if (resetZoom) {
    gameContainer.scale.x = canvasSize.defaultScale;
    gameContainer.scale.y = canvasSize.defaultScale;
    if (zombies.zombieCursor)
      zombies.zombieCursor.scale.x = zombies.zombieCursor.scale.y =
        zombies.zombieCursorScale * canvasSize.defaultScale;
  }

  gameContainer.x =
    (canvasSize.x - gameFieldSize.x * gameContainer.scale.x) / 2;
  gameContainer.y =
    (canvasSize.y - gameFieldSize.y * gameContainer.scale.y) / 2;
}

function scrollGameContainer(timeDiff) {
  const keys = KeysPressed;
  let moved = false;
  const gc = gameContainer;
  if (keys.w) {
    gc.y += keys.scrollSpeed * timeDiff;
    moved = true;
  }
  if (keys.a) {
    gc.x += keys.scrollSpeed * timeDiff;
    moved = true;
  }
  if (keys.s) {
    gc.y -= keys.scrollSpeed * timeDiff;
    moved = true;
  }
  if (keys.d) {
    gc.x -= keys.scrollSpeed * timeDiff;
    moved = true;
  }
  if (moved) preventGameContainerLeavingBounds(gc);
}

const viewableArea = {
  x: 0,
  y: 0,
  width: 1000,
  height: 1000,
  hideParticle(x: number, y: number): boolean {
    if (x < this.x) {
      return true;
    }
    if (y < this.y) {
      return true;
    }
    if (x > this.x + this.width) {
      return true;
    }
    if (y > this.y + this.height) {
      return true;
    }
    return false;
  },
  update(): void {
    this.x = -gameContainer.x / gameContainer.scale.x;
    this.y = -gameContainer.y / gameContainer.scale.y;
    this.width = canvasSize.x / gameContainer.scale.x;
    this.height = canvasSize.y / gameContainer.scale.y;
  },
};
const vipMatrix = new PIXI.Matrix();

function renderVipEscape(app: PIXI.Application) {
  vipSprite.x = 5;
  vipSprite.y = canvasSize.y - 305;
  const scaleX = gameContainer.scale.x;
  const scaleY = gameContainer.scale.y;
  const posX = gameContainer.x;
  const posY = gameContainer.y;
  gameContainer.position.set(0, 0);
  if (humans.vip) {
    vipMatrix.tx = humans.vip.x * -2 + 150;
    vipMatrix.ty = humans.vip.y * -2 + 150;
  }
  gameContainer.scale.set(2, 2);
  app.renderer.render(gameContainer, vipTexture, undefined, vipMatrix);
  gameContainer.scale.set(scaleX, scaleY);
  gameContainer.position.set(posX, posY);
}
let frameCount = 0;
let timeSinceLastFrameCount = 1;

function update(timeDiff: number, app: PIXI.Application): void {
  scrollGameContainer(timeDiff);
  viewableArea.update();

  timeDiff *= gameModel.gameSpeed;

  graveyard.update(timeDiff);
  humans.update(timeDiff);
  zombies.update(timeDiff);
  creatures.update(timeDiff);
  skeleton.update(timeDiff);
  particles.update(timeDiff);
  vipSprite.visible = humans.vipEscaping && typeof humans.vip !== "undefined";
  if (vipSprite.visible) {
    renderVipEscape(app);
  }
}

function setGameFieldSizeForLevel(): void {
  const size = Math.min(500 + gameModel.level * 50, 1500);
  const shift = (Math.random() * size) / 3;

  gameFieldSize = {
    x: size + shift,
    y: size - shift,
  };

  if (grass) {
    grass.width = gameFieldSize.x;
    grass.height = gameFieldSize.y;
  }
  gameContainer.hitArea = new PIXI.Rectangle(
    0,
    0,
    gameFieldSize.x,
    gameFieldSize.y
  );
}

function startGame() {
  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

  const app = new PIXI.Application({
    width: canvasSize.x,
    height: canvasSize.y,
    backgroundColor: 0x104510,
    resolution: gameModel.persistentData.resolution || 1,
    antialias: false,
    resizeTo: window,
  });
  document.body.appendChild(app.view);
  if (!PIXI.utils.isWebGLSupported()) {
    console.error(
      "Warning: WebGL support not detected. Game performance may be slower."
    );
  }

  setupContainers(app);

  app.loader
    .add("sprites/ground.json")
    .add("sprites/megagraveyard.png")
    .add("sprites/graveyard.json")
    .add("sprites/buildings.json")
    .add("sprites/humans.json")
    .add("sprites/cop.json")
    .add("sprites/dogs.json")
    .add("sprites/army.json")
    .add("sprites/doctor.json")
    .add("sprites/zombie.json")
    .add("sprites/golem.json")
    .add("sprites/bonecollector.json")
    .add("sprites/harpy.json")
    .add("sprites/objects2.json")
    .add("sprites/fenceposts.json")
    .add("sprites/trees2.json")
    .add("sprites/fortress.json")
    .add("sprites/tank.json")
    .add("sprites/skeleton.json")
    .load(function () {
      gameModel.app = app;

      setGameFieldSizeForLevel();

      grass = new PIXI.TilingSprite(PIXI.Texture.from("grass.png"));
      grass.texture.baseTexture.mipmap = PIXI.MIPMAP_MODES.OFF;
      grass.width = gameFieldSize.x;
      grass.height = gameFieldSize.y;
      backgroundContainer.addChild(grass);

      gameModel.setupLevel();

      setTimeout(function () {
        centerGameContainer(true);
      });

      // Listen for animate update
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      app.ticker.add((_delta: number) => {
        update(app.ticker.deltaMS / 1000, app);
        gameModel.frameRate = app.ticker.FPS;
      });
    });
}

function setSizes(): void {
  const x = document.body.clientWidth;
  const y = document.body.clientHeight;
  canvasSize = {
    x: x,
    y: y,
    defaultScale: Math.max(x, y) / 1000,
  };
  KeysPressed.scrollSpeed = Math.max(x, y) / 4;
}
new Map();
window.onload = function () {
  setupClasses();
  gameModel.loadData();
  gameModel.onReady();
  setSizes();
  startGame();

  document.addEventListener(
    "visibilitychange",
    function () {
      if (document.visibilityState == "hidden") {
        gameModel.hidden = true;
      } else {
        gameModel.hidden = false;
      }
    },
    false
  );
};

window.onresize = function () {
  setSizes();
};

const KeysPressed = {
  scrollSpeed: 200,
  w: false,
  a: false,
  s: false,
  d: false,
  shift: false,
};

window.onblur = function () {
  KeysPressed.w = KeysPressed.a = KeysPressed.s = KeysPressed.d = false;
  KeysPressed.shift = false;
};

window.onkeydown = function (e) {
  switch (e.keyCode) {
    case 16:
    case 17:
      KeysPressed.shift = true;
      break;
    case 87:
    case 38:
      KeysPressed.w = true;
      break;
    case 65:
    case 37:
      KeysPressed.a = true;
      break;
    case 83:
    case 40:
      KeysPressed.s = true;
      break;
    case 68:
    case 39:
      KeysPressed.d = true;
      break;
    default:
      return true;
  }
  return false;
};
window.onkeyup = function (e) {
  switch (e.keyCode) {
    case 16:
    case 17:
      KeysPressed.shift = false;
      break;
    case 87:
    case 38:
      KeysPressed.w = false;
      break;
    case 65:
    case 37:
      KeysPressed.a = false;
      break;
    case 83:
    case 40:
      KeysPressed.s = false;
      break;
    case 68:
    case 39:
      KeysPressed.d = false;
      break;
    default:
      return true;
  }
  return false;
};

export {
  foregroundContainer,
  gameContainer,
  viewableArea,
  backgroundContainer,
  backgroundSpriteContainer,
  uiContainer,
  KeysPressed,
  characterContainer,
  zoom,
  centerGameContainer,
  update,
  setGameFieldSizeForLevel,
  gameFieldSize,
};
