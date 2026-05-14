import { Position, Wall, Building } from "./classes/gameobject";
import {
  gameFieldSize,
  characterContainer,
  backgroundContainer,
  GameModel,
  Humans,
  getRandomElementFromArray,
  fastDistance,
  rgbToHex,
} from "./internal";
import { distanceBetweenPoints } from "./utilsfunctions";

export class ZmMap {
  private static instance: ZmMap;
  constructor() {
    if (ZmMap.instance) return ZmMap.instance;
    ZmMap.instance = this;
  }

  gameModel = GameModel.getInstance();
  humans = new Humans();

  buildings: Building[] = [];
  buildingsByPopularity: Building[] = [];
  buildingMap: Building[] = [];
  mapCols: number;
  mapRows: number;
  buildingTextures: PIXI.Texture[];
  roadSprite = null as PIXI.TilingSprite;
  roadTexture = null as PIXI.Texture;
  entranceWidth = 16;
  entranceDepth = 16;
  cornerDistance = 16;
  minBuildings = 3;
  wallWidth = 4;
  graveyardCollision = null;
  graveYardLocation = { x: 0, y: 0 };
  graveYardPosition = null;

  getRandomBuilding(): Building {
    return getRandomElementFromArray(this.buildingsByPopularity, Math.random());
  }

  roomNoOverlap(position1: Position, position2: Position): boolean {
    const buffer = 50;
    if (
      position1.x > position2.x + position2.width + buffer ||
      position1.x + position1.width + buffer < position2.x
    )
      return true;
    if (
      position1.y > position2.y + position2.height + buffer ||
      position1.y + position1.height + buffer < position2.y
    )
      return true;
  }

  isValidPosition(position: Position): boolean {
    if (!this.roomNoOverlap(position, this.graveYardPosition)) return false;

    for (let i = 0; i < this.buildings.length; i++) {
      if (!this.roomNoOverlap(position, this.buildings[i])) return false;
    }

    if (
      this.gameModel.level % 5 == 0 &&
      !this.gameModel.isBossStage(this.gameModel.level) &&
      position.y < this.roadSprite.y + this.roadSprite.height / 2 &&
      position.y + position.height >
        this.roadSprite.y - this.roadSprite.height / 2
    ) {
      return false;
    }

    return true;
  }

  makeHorizontalWall(
    walls: Wall[],
    texture: PIXI.Texture,
    hasEntrance: boolean,
    x: number,
    y: number,
    width: number,
  ): void {
    if (hasEntrance) {
      const wall1 = new Wall(texture);
      wall1.x = x;
      wall1.y = y;
      wall1.width = width / 2 - this.entranceWidth;
      wall1.height = 4;
      walls.push(wall1);

      const wall2 = new Wall(texture);
      wall2.x = x + width / 2 + this.entranceWidth;
      wall2.y = y;
      wall2.width = width / 2 - this.entranceWidth;
      wall2.height = 4;
      walls.push(wall2);
    } else {
      const wall = new Wall(texture);
      wall.x = x;
      wall.y = y;
      wall.width = width;
      wall.height = 4;
      walls.push(wall);
    }
  }

  makeVerticalWall(
    walls: Wall[],
    texture: PIXI.Texture,
    hasEntrance: boolean,
    x: number,
    y: number,
    height: number,
  ): void {
    if (hasEntrance) {
      const wall1 = new Wall(texture);
      wall1.x = x;
      wall1.y = y;
      wall1.width = 4;
      wall1.height = height / 2 - this.entranceWidth;
      walls.push(wall1);

      const wall2 = new Wall(texture);
      wall2.x = x;
      wall2.y = y + height / 2 + this.entranceWidth;
      wall2.width = 4;
      wall2.height = height / 2 - this.entranceWidth;
      walls.push(wall2);
    } else {
      const wall = new Wall(texture);
      wall.x = x;
      wall.y = y;
      wall.width = 4;
      wall.height = height;
      walls.push(wall);
    }
  }

  addBuilding(poi: Building): void {
    poi.container = new PIXI.Container();
    poi.floorSprite = new PIXI.TilingSprite(PIXI.Texture.WHITE);
    poi.floorSprite.tint = rgbToHex(
      10 + Math.round(Math.random() * 50),
      10 + Math.round(Math.random() * 50),
      10 + Math.round(Math.random() * 50),
    );
    poi.floorSprite.alpha = 0.2;
    // poi.floorSprite.x = poi.x;
    // poi.floorSprite.y = poi.y;
    poi.container.x = poi.x;
    poi.container.y = poi.y;
    poi.floorSprite.width = poi.width;
    poi.floorSprite.height = poi.height;
    // backgroundContainer.addChild(poi.floorSprite);
    poi.container.addChild(poi.floorSprite);

    const possibleEntrances = [
      {
        x: poi.x + poi.width / 2,
        y: poi.y,
        north: true,
        inside: {
          x: poi.x + poi.width / 2,
          y: poi.y + this.entranceDepth,
          entrance: true,
        },
        outside: {
          x: poi.x + poi.width / 2,
          y: poi.y - this.entranceDepth,
          entrance: true,
        },
      },
      {
        x: poi.x + poi.width / 2,
        y: poi.y + poi.height,
        south: true,
        inside: {
          x: poi.x + poi.width / 2,
          y: poi.y + poi.height - this.entranceDepth,
          entrance: true,
        },
        outside: {
          x: poi.x + poi.width / 2,
          y: poi.y + poi.height + this.entranceDepth,
          entrance: true,
        },
      },
      {
        x: poi.x,
        y: poi.y + poi.height / 2,
        west: true,
        inside: {
          x: poi.x + this.entranceDepth,
          y: poi.y + poi.height / 2,
          entrance: true,
        },
        outside: {
          x: poi.x - this.entranceDepth,
          y: poi.y + poi.height / 2,
          entrance: true,
        },
      },
      {
        x: poi.x + poi.width,
        y: poi.y + poi.height / 2,
        east: true,
        inside: {
          x: poi.x + poi.width - this.entranceDepth,
          y: poi.y + poi.height / 2,
          entrance: true,
        },
        outside: {
          x: poi.x + poi.width + this.entranceDepth,
          y: poi.y + poi.height / 2,
          entrance: true,
        },
      },
    ];
    let closestEntrance;
    const center = { x: gameFieldSize.x / 2, y: gameFieldSize.y / 2 };
    let closestDistance = 2000;
    for (let i = 0; i < possibleEntrances.length; i++) {
      const distance = fastDistance(
        possibleEntrances[i].x,
        possibleEntrances[i].y,
        center.x,
        center.y,
      );
      if (distance < closestDistance) {
        closestDistance = distance;
        closestEntrance = possibleEntrances[i];
      }
    }
    poi.entrance = closestEntrance;

    if (this.gameModel.level % 5 == 0) {
      if (poi.y < gameFieldSize.y / 2) {
        poi.entrance = possibleEntrances.filter((e) => e.south)[0];
      } else {
        poi.entrance = possibleEntrances.filter((e) => e.north)[0];
      }
    }

    poi.walls = [];
    const wallTexture = getRandomElementFromArray(
      this.buildingTextures,
      Math.random(),
    );

    this.makeHorizontalWall(
      poi.walls,
      wallTexture,
      poi.entrance.north,
      -4,
      -4,
      poi.width + 8,
    );
    this.makeHorizontalWall(
      poi.walls,
      wallTexture,
      poi.entrance.south,
      -4,
      poi.height,
      poi.width + 8,
    );
    this.makeVerticalWall(
      poi.walls,
      wallTexture,
      poi.entrance.west,
      -4,
      -4,
      poi.height + 8,
    );
    this.makeVerticalWall(
      poi.walls,
      wallTexture,
      poi.entrance.east,
      poi.width,
      -4,
      poi.height + 8,
    );

    for (let i = 0; i < poi.walls.length; i++) {
      poi.container.addChild(poi.walls[i]);
    }
    poi.container.cacheAsBitmap = true;
    backgroundContainer.addChild(poi.container);

    for (let i = 0; i < poi.walls.length; i++) {
      poi.walls[i].collisionX = poi.x + poi.walls[i].x;
      poi.walls[i].collisionY = poi.y + poi.walls[i].y;
      poi.walls[i].collisionWidth = poi.walls[i].width;
      poi.walls[i].collisionHeight = poi.walls[i].height;
    }
  }

  addCorners(building: Building): void {
    building.corners = [];
    building.corners.push({
      // top left
      x: building.x - this.cornerDistance,
      y: building.y - this.cornerDistance,
    });
    building.corners.push({
      // top right
      x: building.x + building.width + this.cornerDistance,
      y: building.y - this.cornerDistance,
    });
    building.corners.push({
      // bottom left
      x: building.x - this.cornerDistance,
      y: building.y + building.height + this.cornerDistance,
    });
    building.corners.push({
      // bottom right
      x: building.x + building.width + this.cornerDistance,
      y: building.y + building.height + this.cornerDistance,
    });
  }

  setGraveyardPosition(): void {
    if (
      this.gameModel.level % 5 == 0 &&
      !this.gameModel.isBossStage(this.gameModel.level)
    ) {
      this.graveYardPosition = {
        x: Math.random() * gameFieldSize.x * 0.8 - 50 + gameFieldSize.x * 0.1,
        y:
          (Math.random() > 0.5
            ? gameFieldSize.y * 0.25
            : gameFieldSize.y * 0.75) - 50,
        width: 100,
        height: 100,
      };
    } else {
      this.graveYardPosition = {
        x: gameFieldSize.x / 2 - 50,
        y: gameFieldSize.y / 2 - 50,
        width: 100,
        height: 100,
      };
    }
    this.graveYardLocation = {
      x: this.graveYardPosition.x + 50,
      y: this.graveYardPosition.y + 50,
    };
  }

  populatePois(): void {
    this.setGraveyardPosition();

    if (!this.buildingTextures) {
      this.buildingTextures = [];
      for (let i = 0; i < 2; i++) {
        this.buildingTextures.push(
          PIXI.Texture.from("floor" + (i + 1) + ".png"),
        );
      }
      for (let i = 0; i < 2; i++) {
        this.buildingTextures.push(
          PIXI.Texture.from("wall" + (i + 1) + ".png"),
        );
      }
      this.roadSprite = new PIXI.TilingSprite(PIXI.Texture.from("road.png"));
      this.roadSprite.width = gameFieldSize.x;
      this.roadSprite.tileScale.set(3, 3);
      this.roadSprite.height = 96;
      backgroundContainer.addChild(this.roadSprite);
      this.roadSprite.visible = false;
      this.roadSprite.anchor.set(0.5, 0.5);
    }

    if (this.buildings.length > 0) {
      for (let i = 0; i < this.buildings.length; i++) {
        backgroundContainer.removeChild(this.buildings[i].container);
        this.buildings[i].container.destroy();
        // backgroundContainer.removeChild(this.buildings[i].floorSprite);
        for (let j = 0; j < this.buildings[i].walls.length; j++) {
          // backgroundContainer.removeChild(this.buildings[i].walls[j]);
        }
      }
    }

    let buildingId = 1;

    this.buildingsByPopularity = [];
    this.buildings = [];
    let minBuildings = this.minBuildings;
    let spaceToCreate = this.humans.getMaxHumans();
    const areaPerPerson = 500;
    const maxRoomSize = Math.max(
      Math.min(50, Math.round(spaceToCreate / 3)),
      10,
    );
    const minRoomSize = 5;
    this.roadSprite.visible = false;
    if (this.gameModel.isBossStage(this.gameModel.level)) {
      spaceToCreate = 0;
      minBuildings = 0;
    } else if (this.gameModel.level % 5 == 0) {
      this.roadSprite.visible = true;
      this.roadSprite.width = gameFieldSize.x;
      this.roadSprite.x = gameFieldSize.x / 2;
      this.roadSprite.y = gameFieldSize.y / 2;
    }

    while (spaceToCreate > 0 || minBuildings > 0) {
      minBuildings--;
      const personSize = Math.round(
        minRoomSize + Math.random() * (maxRoomSize - minRoomSize),
      );
      const roomSize = Math.sqrt(personSize * areaPerPerson);
      spaceToCreate -= personSize;
      let foundPosition = false;
      let testPosition;

      let counter = 1000;
      const spaceFromEdges = 10;
      while (!foundPosition && counter > 0) {
        counter--;
        if (this.gameModel.level % 5 == 0) {
          if (Math.random() > 0.7) {
            testPosition = {
              x:
                spaceFromEdges +
                Math.random() *
                  (gameFieldSize.x - (2 * spaceFromEdges + roomSize)),
              y:
                spaceFromEdges +
                Math.random() *
                  (gameFieldSize.y - (2 * spaceFromEdges + roomSize)),
              width: roomSize,
              height: roomSize,
            };
          } else {
            testPosition = {
              x:
                spaceFromEdges +
                Math.random() *
                  (gameFieldSize.x - (2 * spaceFromEdges + roomSize)),
              y:
                Math.random() > 0.5
                  ? gameFieldSize.y / 2 + this.roadSprite.height / 2 + 8
                  : gameFieldSize.y / 2 -
                    this.roadSprite.height / 2 -
                    8 -
                    roomSize,
              width: roomSize,
              height: roomSize,
            };
          }
        } else {
          testPosition = {
            x:
              spaceFromEdges +
              Math.random() *
                (gameFieldSize.x - (2 * spaceFromEdges + roomSize)),
            y:
              spaceFromEdges +
              Math.random() *
                (gameFieldSize.y - (2 * spaceFromEdges + roomSize)),
            width: roomSize,
            height: roomSize,
          };
        }
        foundPosition = this.isValidPosition(testPosition);
      }

      if (foundPosition) {
        const poi = new Building(
          buildingId++,
          testPosition.x,
          testPosition.y,
          roomSize,
          roomSize,
        );
        this.addBuilding(poi);
        const popularity = Math.max(Math.round(roomSize / 10), 1);
        for (let j = 0; j < popularity; j++) {
          this.buildingsByPopularity.push(poi);
        }
        this.buildings.push(poi);
        this.addCorners(poi);
      }
    }
    this.populateBuildingMap();
    this.populateTrees();
  }

  populateBuildingMap(): void {
    this.buildingMap = [];
    this.mapCols = Math.ceil(gameFieldSize.x / 10);
    this.mapRows = Math.ceil(gameFieldSize.y / 10);

    if (this.buildings.length == 0) return;

    for (let i = 0; i < this.mapRows; i++) {
      const y = i * 10;
      for (let j = 0; j < this.mapCols; j++) {
        const x = j * 10;
        let smallestDistance = 10000;
        let closestBuilding: Building;
        for (let k = 0; k < this.buildings.length; k++) {
          const build = this.buildings[k];
          const distance =
            distanceBetweenPoints(
              x,
              y,
              build.x + build.width / 2,
              build.y + build.height / 2,
            ) -
            build.width / 2;
          if (distance < smallestDistance) {
            smallestDistance = distance;
            closestBuilding = build;
          }
        }
        this.buildingMap[i * this.mapCols + j] = closestBuilding;
      }
    }
  }

  getBuildingFromMap(x: number, y: number): Building {
    return this.buildingMap[
      Math.round(y / 10) * this.mapCols + Math.round(x / 10)
    ];
  }

  randomPositionInBuilding(building: Building): Position {
    if (!building) {
      const xMod = Math.random() > 0.5 ? -1 : 1;
      const yMod = Math.random() > 0.5 ? -1 : 1;
      const x25 = gameFieldSize.x / 4;
      const y25 = gameFieldSize.y / 4;

      if (Math.random() > 0.5) {
        return {
          x: Math.random() * gameFieldSize.x,
          y: gameFieldSize.y / 2 + yMod * y25 + Math.random() * yMod * y25,
        };
      }
      return {
        x: gameFieldSize.x / 2 + xMod * x25 + Math.random() * xMod * x25,
        y: Math.random() * gameFieldSize.y,
      };
    }
    const wallBuffer = 5;
    return {
      x:
        building.x +
        wallBuffer +
        Math.random() * (building.width - wallBuffer * 2),
      y:
        building.y +
        wallBuffer +
        Math.random() * (building.height - wallBuffer * 2),
    };
  }

  isInsidePoi(x: number, y: number, poi: Building, wall = 0): boolean {
    return (
      x > poi.x - wall &&
      x < poi.x + poi.width + wall &&
      y > poi.y - wall &&
      y < poi.y + poi.height + wall
    );
  }

  wallCollisionBuffer = 3;

  checkWall(
    wall: Wall,
    start: Position,
    end: Position,
    collision: Collision,
  ): void {
    if (
      start.y > wall.collisionY &&
      start.y < wall.collisionY + wall.collisionHeight
    ) {
      if (
        start.x < wall.collisionX - this.wallCollisionBuffer &&
        end.x > wall.collisionX - this.wallCollisionBuffer
      ) {
        collision.x = true;
        collision.validX = wall.collisionX - this.wallCollisionBuffer - 1;
      }
      if (
        start.x >
          wall.collisionX + wall.collisionWidth + this.wallCollisionBuffer &&
        end.x < wall.collisionX + wall.collisionWidth + this.wallCollisionBuffer
      ) {
        collision.x = true;
        collision.validX =
          wall.collisionX + wall.collisionWidth + this.wallCollisionBuffer + 1;
      }
    }

    if (
      start.x > wall.collisionX &&
      start.x < wall.collisionX + wall.collisionWidth
    ) {
      if (
        start.y < wall.collisionY - this.wallCollisionBuffer &&
        end.y > wall.collisionY - this.wallCollisionBuffer
      ) {
        collision.y = true;
        collision.validY = wall.collisionY - this.wallCollisionBuffer - 1;
      }
      if (
        start.y >
          wall.collisionY + wall.collisionHeight + this.wallCollisionBuffer &&
        end.y <
          wall.collisionY + wall.collisionHeight + this.wallCollisionBuffer
      ) {
        collision.y = true;
        collision.validY =
          wall.collisionY + wall.collisionHeight + this.wallCollisionBuffer + 1;
      }
    }
  }

  checkGraveyard(start: Position, end: Position): Collision {
    const collision = new Collision();
    if (this.graveyardCollision) {
      this.checkWall(this.graveyardCollision, start, end, collision);
    }
    if (collision.x || collision.y) return collision;

    return null;
  }

  checkCollisions(start: Position, end: Position): Collision {
    const closeBuilding = this.findBuilding(start);

    if (!closeBuilding) {
      return this.checkGraveyard(start, end);
    }

    const collision = new Collision();

    for (let i = 0; i < closeBuilding.walls.length; i++) {
      this.checkWall(closeBuilding.walls[i], start, end, collision);
    }

    return collision;
  }

  fastDistance = fastDistance;

  pathFindStepSize = 5;

  pathStepCalc(start: Position, end: Position): Position {
    const xVector = end.x - start.x;
    const yVector = end.y - start.y;
    const ax = Math.abs(xVector);
    const ay = Math.abs(yVector);
    if (Math.max(ax, ay) == 0) return;
    let ratio = 1 / Math.max(ax, ay);
    ratio = ratio * (1.29289 - (ax + ay) * ratio * 0.29289);

    return {
      x: xVector * ratio * this.pathFindStepSize,
      y: yVector * ratio * this.pathFindStepSize,
    };
  }

  isBuildingClose(position: Position, building: Building): boolean {
    return (
      position.x > building.x - this.cornerDistance &&
      position.x < building.x + building.width + this.cornerDistance &&
      position.y > building.y - this.cornerDistance &&
      position.y < building.y + building.height + this.cornerDistance
    );
  }

  findBuilding(position: Position): Building {
    return this.getBuildingFromMap(position.x, position.y);
  }

  normalizeVector(vector: Position): Position {
    if (vector.x == 0 && vector.y == 0) {
      return vector;
    }

    const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    vector.x /= magnitude;
    vector.y /= magnitude;
    return vector;
  }

  modifyVectorForCollision(
    vector: Position,
    building: Building,
    position: Position,
  ): Position {
    // no building = no collision
    if (!building && !this.graveyardCollision) {
      return this.normalizeVector(vector);
    }

    // check 5 distance from position
    const collision = new Collision();
    const collisionDistance = 1;

    const end = {
      x: position.x + (vector.x > 0 ? collisionDistance : -collisionDistance),
      y: position.y + (vector.y > 0 ? collisionDistance : -collisionDistance),
    };

    // check all the walls
    if (building) {
      for (let i = 0; i < building.walls.length; i++) {
        this.checkWall(building.walls[i], position, end, collision);
      }
    }

    if (this.graveyardCollision) {
      this.checkWall(this.graveyardCollision, position, end, collision);
    }

    if (collision.x) {
      vector.x = 0;
    }
    if (collision.y) {
      vector.y = 0;
    }
    return this.normalizeVector(vector);
  }

  dx = 0;
  dy = 0;
  step: Position;
  stepsToTake = 10;
  hasHit = false;
  testPosition: Position;

  willVectorHitBuilding(
    start: Position,
    end: Position,
    building: Building,
  ): boolean {
    this.dx = end.x - start.x;
    this.dy = end.y - start.y;

    if (this.dx < 0 && start.x < building.x - 4) return false;
    if (this.dx > 0 && start.x > building.x + building.width + 4) return false;
    if (this.dy < 0 && start.y < building.y - 4) return false;
    if (this.dy > 0 && start.y > building.y + building.width + 4) return false;

    this.step = this.pathStepCalc(start, end);
    this.stepsToTake = 10;
    this.hasHit = false;
    this.testPosition = { x: start.x, y: start.y };
    while (!this.hasHit && this.stepsToTake > 0) {
      this.stepsToTake--;
      this.testPosition.x += this.step.x;
      this.testPosition.y += this.step.y;
      if (
        this.isInsidePoi(this.testPosition.x, this.testPosition.y, building, 4)
      ) {
        this.hasHit = true;
      }
    }
    return this.hasHit;
  }

  findNearestCorner(position: Position, corners: Position[]): Position {
    let closestCorner = null;
    let closestDistance = 10000;
    for (let i = 0; i < corners.length; i++) {
      const distance = this.fastDistance(
        position.x,
        position.y,
        corners[i].x,
        corners[i].y,
      );
      if (distance < closestDistance) {
        closestDistance = distance;
        closestCorner = corners[i];
      }
    }
    return closestCorner;
  }

  findAdjacentCorners(corner: Position, building: Building): Position[] {
    const corners = [];
    for (let i = 0; i < building.corners.length; i++) {
      if (
        building.corners[i].x == corner.x ||
        building.corners[i].y == corner.y
      ) {
        corners.push(building.corners[i]);
      }
    }
    return corners;
  }

  vector = null;
  corner = null;
  hitbuilding = false;

  navigateAroundBuilding(
    position: Position,
    target: Position,
    building: Building,
    distanceToTarget: number,
  ): Position {
    // if no building return vector
    this.vector = {
      x: target.x - position.x,
      y: target.y - position.y,
      distance: distanceToTarget,
    };
    if (!building) {
      return this.normalizeVector(this.vector);
    }

    // am I going to hit this building
    this.hitbuilding = this.willVectorHitBuilding(position, target, building);

    // if not return straight to target
    if (!this.hitbuilding) {
      return this.modifyVectorForCollision(this.vector, building, position);
    }

    // if I am then find path around
    // check closest corner to target
    this.corner = this.findNearestCorner(target, building.corners);
    this.hitbuilding = this.willVectorHitBuilding(
      position,
      this.corner,
      building,
    );
    if (!this.hitbuilding) {
      this.vector.x = this.corner.x - position.x;
      this.vector.y = this.corner.y - position.y;
      return this.modifyVectorForCollision(this.vector, building, position);
    }

    // if still hit building then go to my closest adjacent corner
    this.corner = this.findNearestCorner(
      position,
      this.findAdjacentCorners(this.corner, building),
    );
    this.vector.x = this.corner.x - position.x;
    this.vector.y = this.corner.y - position.y;
    return this.modifyVectorForCollision(this.vector, building, position);
  }

  distanceToTarget: number;
  closeBuilding: Building;
  insideBuilding = false;

  howDoIGetToMyTarget(
    currentPosition: Position,
    targetPosition: Position,
  ): Position {
    this.distanceToTarget = this.fastDistance(
      currentPosition.x,
      currentPosition.y,
      targetPosition.x,
      targetPosition.y,
    );
    this.closeBuilding = this.findBuilding(currentPosition);
    this.insideBuilding = false;

    if (this.closeBuilding) {
      this.insideBuilding = this.isInsidePoi(
        currentPosition.x,
        currentPosition.y,
        this.closeBuilding,
        0,
      );

      if (this.insideBuilding) {
        if (
          this.isInsidePoi(
            targetPosition.x,
            targetPosition.y,
            this.closeBuilding,
            0,
          )
        ) {
          // target in same building as me, just return direction
          return this.modifyVectorForCollision(
            {
              x: targetPosition.x - currentPosition.x,
              y: targetPosition.y - currentPosition.y,
            },
            this.closeBuilding,
            currentPosition,
          );
        } else {
          // I need to go outside
          return this.modifyVectorForCollision(
            {
              x: this.closeBuilding.entrance.outside.x - currentPosition.x,
              y: this.closeBuilding.entrance.outside.y - currentPosition.y,
            },
            this.closeBuilding,
            currentPosition,
          );
        }
      }
    }

    const targetCloseBuilding = this.findBuilding(targetPosition);

    if (targetCloseBuilding) {
      this.insideBuilding = this.isInsidePoi(
        targetPosition.x,
        targetPosition.y,
        targetCloseBuilding,
        0,
      );

      if (this.insideBuilding) {
        // I need to go inside
        const distanceToEntrance = this.fastDistance(
          currentPosition.x,
          currentPosition.y,
          targetCloseBuilding.entrance.outside.x,
          targetCloseBuilding.entrance.outside.y,
        );
        if (distanceToEntrance < 30) {
          return this.modifyVectorForCollision(
            {
              x: targetCloseBuilding.entrance.inside.x - currentPosition.x,
              y: targetCloseBuilding.entrance.inside.y - currentPosition.y,
            },
            this.closeBuilding,
            currentPosition,
          );
        }
        // navigate to entrance
        return this.navigateAroundBuilding(
          currentPosition,
          targetCloseBuilding.entrance.outside,
          this.closeBuilding,
          this.distanceToTarget,
        );
      }
    }

    if (this.distanceToTarget < 20) {
      // no need to navigate this close, just return direction
      return this.modifyVectorForCollision(
        {
          x: targetPosition.x - currentPosition.x,
          y: targetPosition.y - currentPosition.y,
        },
        this.closeBuilding,
        currentPosition,
      );
    }

    // navigate to target
    return this.navigateAroundBuilding(
      currentPosition,
      targetPosition,
      this.closeBuilding,
      this.distanceToTarget,
    );
  }

  treeSprites = [];
  treeTextures = [];
  armyTextures = [];

  isValidTreePosition(position: Position): boolean {
    if (!this.isValidPosition(position)) return false;
    for (let i = 0; i < this.treeSprites.length; i++) {
      if (
        this.fastDistance(
          position.x,
          position.y,
          this.treeSprites[i].x,
          this.treeSprites[i].y,
        ) < 25
      )
        return false;
    }
    return true;
  }

  populateTrees(): void {
    if (this.treeSprites.length > 0) {
      for (let i = 0; i < this.treeSprites.length; i++) {
        characterContainer.removeChild(this.treeSprites[i]);
      }
      this.treeSprites = [];
    }

    if (this.treeTextures.length == 0) {
      for (let i = 0; i < 6; i++) {
        this.treeTextures.push(PIXI.Texture.from("tree" + i + ".png"));
      }
      this.armyTextures.push(PIXI.Texture.from("hedgehog.png"));
      this.armyTextures.push(PIXI.Texture.from("sandbags.png"));
    }

    let treesToCreate = Math.round(gameFieldSize.x / 50);
    if (this.gameModel.isBossStage(this.gameModel.level)) {
      treesToCreate = Math.round(treesToCreate * 1.5);
    }

    while (treesToCreate > 0) {
      let foundPosition = false;
      let testPosition;
      let counter = 1000;
      const spaceFromEdges = 8;
      const roomSize = 2;

      while (!foundPosition && counter > 0) {
        counter--;
        testPosition = {
          x:
            spaceFromEdges +
            Math.random() * (gameFieldSize.x - 2 * spaceFromEdges),
          y:
            spaceFromEdges +
            Math.random() * (gameFieldSize.y - 2 * spaceFromEdges),
          width: roomSize,
          height: roomSize,
        };
        foundPosition = this.isValidTreePosition(testPosition);
      }

      if (foundPosition) {
        let alivePercent = 0.4 + Math.random() * 0.6;
        if (this.gameModel.constructions.graveyard) {
          alivePercent = Math.min(
            (this.fastDistance(
              testPosition.x,
              testPosition.y,
              this.graveYardLocation.x,
              this.graveYardLocation.y,
            ) -
              90) /
              400,
            1,
          );
        }
        let texture =
          this.treeTextures[
            this.treeTextures.length -
              1 -
              Math.round((this.treeTextures.length - 1) * alivePercent)
          ];
        if (
          this.gameModel.isBossStage(this.gameModel.level) &&
          Math.random() > 0.7
        ) {
          texture = getRandomElementFromArray(this.armyTextures, Math.random());
        }
        const treeSprite = new PIXI.Sprite(texture);
        treeSprite.anchor.set(0.5, 1);
        treeSprite.x = testPosition.x;
        treeSprite.y = testPosition.y;
        treeSprite.zIndex = treeSprite.y;
        treeSprite.scale.x = treeSprite.scale.y = 2;
        treeSprite.scale.x =
          Math.random() > 0.5 ? treeSprite.scale.x : -1 * treeSprite.scale.x;
        this.treeSprites.push(treeSprite);
        characterContainer.addChild(treeSprite);
      }
      treesToCreate--;
    }
  }
}

class Collision {
  x = false;
  y = false;
  validX = 0;
  validY = 0;
}
