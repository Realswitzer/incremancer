(() => {
  // src/deobf.ts
  var Incremancer;
  (() => {
    var e = {};
    function pythag(a, b2) {
      return Math.sqrt(a * a + b2 * b2);
    }
    function distance(x1, y1, x2, y2) {
      return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }
    function weighted_hybrid_distance(x1, y1, x2, y2) {
      const p2 = Math.abs(x1 - x2), q = Math.abs(y1 - y2);
      return 0.4 * (p2 + q) + 0.56 * Math.max(p2, q);
    }
    function sample(array) {
      return array[Math.floor(Math.random() * array.length)];
    }
    function formatDecimal(number) {
      return formatSuffix(number, 2);
    }
    function formatWhole(number) {
      return formatSuffix(number, number > 1e3 ? 2 : 0);
    }
    function formatSuffix(number, places) {
      return number || (number = 0), number >= 1e15 ? number.toExponential(places).replace("+", "") : number >= 1e12 ? (number / 1e12).toFixed(places) + "T" : number >= 1e9 ? (number / 1e9).toFixed(places) + "B" : number >= 1e6 ? (number / 1e6).toFixed(places) + "M" : number >= 1e3 ? (number / 1e3).toFixed(places) + "K" : number.toFixed(places);
    }
    function h(price, multiplier, s, i) {
      return 1 == multiplier ? Math.floor(i / price) : Math.floor(
        Math.log(
          i * (multiplier - 1) / (price * Math.pow(multiplier, s)) + 1
        ) / Math.log(multiplier)
      );
    }
    function l(basePrice, multiplier, currentRank, maxAffordableUpgrades) {
      return multiplier == 1 ? basePrice * maxAffordableUpgrades : basePrice * (multiplier ** currentRank * (multiplier ** maxAffordableUpgrades - 1) / (multiplier - 1));
    }
    function d(e2, t2) {
      const champHoldRect = document.getElementById("champ-hold").getBoundingClientRect();
      let i = e2.clientX - champHoldRect.x;
      const a = e2.clientY - champHoldRect.y;
      if (i > champHoldRect.width / 2) {
        i -= t2.getElementsByClassName("tooltip")[0].getBoundingClientRect().width;
        t2.getElementsByClassName("tooltip")[0].style.top = `${a + 20}px`;
        t2.getElementsByClassName("tooltip")[0].style.left = `${i + 20}px`;
      }
    }
    let c, u, p, g, m, b, f, y, x;
    ((e2) => {
      "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e2, Symbol.toStringTag, {
        value: "Module"
      }), Object.defineProperty(e2, "__esModule", {
        value: true
      });
    })(e);
    let v;
    let S;
    let M;
    let k;
    let w;
    let T;
    let C;
    let D = {
      x: 800,
      y: 600,
      defaultScale: 1
    };
    let P = {
      x: 600,
      y: 600
    };
    function z(e2) {
      this.data = e2.data;
      this.dragging = true;
      this.dragOffset = this.data.getLocalPosition(this);
      this.dragOffset.x *= this.scale.x;
      this.dragOffset.y *= this.scale.y;
      this.dragStartX = this.x;
      this.dragStartY = this.y;
      B = 0;
    }
    function I() {
      this.dragging = false;
      this.data = null;
      B = 0;
    }
    let B = 0;
    let R = 0;
    function H(e2) {
      if (T.zombieCursor) {
        T.zombieCursor.position = e2.data.getLocalPosition(this.parent);
        const t2 = e2.data.getLocalPosition(x);
        T.mouseOutOfBounds = t2.x < 0 || t2.y < 0 || t2.x > x.width || t2.y > x.height;
      }
      if (e2.data.originalEvent.touches && e2.data.originalEvent.touches.length > 1) {
        ((e3) => {
          const t2 = Math.abs(
            e3.data.originalEvent.touches[0].clientX - e3.data.originalEvent.touches[1].clientX
          );
          if (B) {
            if (R + 50 < Date.now() && Math.abs(t2 - B) > 10) {
              zoom(t2 > B ? 1 : -1, null);
              R = Date.now();
              B = t2;
            }
          } else {
            B = t2;
          }
        })(e2);
      } else if (this.dragging) {
        const e3 = this.data.getLocalPosition(this.parent);
        this.x = e3.x - this.dragOffset.x;
        this.y = e3.y - this.dragOffset.y;
        F(this);
        if (distance(this.dragStartX, this.dragStartY, this.x, this.y) > 5) {
          this.hasMoved = true;
        }
      }
    }
    function F(e2) {
      const t2 = P.x * e2.scale.x;
      const s = P.y * e2.scale.y;
      if (e2.x > 0.5 * D.x) {
        e2.x = 0.5 * D.x;
      }
      if (e2.x + t2 < 0.5 * D.x) {
        e2.x = 0.5 * D.x - t2;
      }
      if (e2.y > 0.5 * D.y) {
        e2.y = 0.5 * D.y;
      }
      if (e2.y + s < 0.5 * D.y) {
        e2.y = 0.5 * D.y - s;
      }
    }
    function E(e2) {
      if (!this.hasMoved && v.currentState == v.states.playingLevel) {
        if (Y.shift) {
          T.spawnAllZombies(
            e2.data.getLocalPosition(this).x,
            e2.data.getLocalPosition(this).y
          );
        } else {
          T.spawnZombie(
            e2.data.getLocalPosition(this).x,
            e2.data.getLocalPosition(this).y
          );
        }
      }
      this.hasMoved = false;
    }
    function zoom(e2, t2) {
      if (R + 50 > Date.now()) {
        return;
      }
      R = Date.now();
      const s = c;
      if (!t2) {
        t2 = {
          x: 0.5 * D.x,
          y: 0.5 * D.y
        };
      }
      const i = P.x * s.scale.x;
      const a = P.y * s.scale.y;
      if (t2.x > s.x + i) {
        t2.x = s.x + i;
      }
      if (t2.x < s.x) {
        t2.x = s.x;
      }
      if (t2.y < s.y) {
        t2.y = s.y;
      }
      if (t2.y > s.y + a) {
        t2.y = s.y + a;
      }
      const r = (t2.x - s.x) / s.scale.x;
      const n = (t2.y - s.y) / s.scale.y;
      if (e2 > 0) {
        if (s.scale.x < 10) {
          s.scale.x = s.scale.y = 1.1 * s.scale.x;
          if (T.zombieCursor && T.zombieCursor.scale) {
            T.zombieCursor.scale.x = T.zombieCursor.scale.y = 1.1 * T.zombieCursor.scale.x;
          }
        }
      } else if (Math.max(i, a) > 0.8 * Math.min(D.y, D.x)) {
        s.scale.x = s.scale.y = 0.9 * s.scale.x;
        if (T.zombieCursor && T.zombieCursor.scale) {
          T.zombieCursor.scale.x = T.zombieCursor.scale.y = 0.9 * T.zombieCursor.scale.x;
        }
      }
      s.x = t2.x - r * s.scale.x;
      s.y = t2.y - n * s.scale.y;
      F(s);
    }
    function L(e2) {
      e2.preventDefault();
      const t2 = {
        x: e2.clientX * (D.x / document.body.clientWidth),
        y: e2.clientY * (D.y / document.body.clientHeight)
      };
      if (e2.deltaY < 0 || e2.deltaX < 0) {
        zoom(1, t2);
      } else {
        zoom(-1, t2);
      }
    }
    function centerGameContainer(e2 = false) {
      if (e2) {
        c.scale.x = D.defaultScale;
        c.scale.y = D.defaultScale;
        if (T.zombieCursor) {
          T.zombieCursor.scale.x = T.zombieCursor.scale.y = T.zombieCursorScale * D.defaultScale;
        }
      }
      c.x = (D.x - P.x * c.scale.x) / 2;
      c.y = (D.y - P.y * c.scale.y) / 2;
    }
    const G = {
      x: 0,
      y: 0,
      width: 1e3,
      height: 1e3,
      hideParticle(e2, t2) {
        return e2 < this.x || t2 < this.y || e2 > this.x + this.width || t2 > this.y + this.height;
      },
      update() {
        this.x = -c.x / c.scale.x;
        this.y = -c.y / c.scale.y;
        this.width = D.x / c.scale.x;
        this.height = D.y / c.scale.y;
      }
    }, X = new PIXI.Matrix();
    function U(e2, t2) {
      {
        const t3 = Y;
        let s = false;
        const i = c;
        if (t3.w) {
          i.y += t3.scrollSpeed * e2;
          s = true;
        }
        if (t3.a) {
          i.x += t3.scrollSpeed * e2;
          s = true;
        }
        if (t3.s) {
          i.y -= t3.scrollSpeed * e2;
          s = true;
        }
        if (t3.d) {
          i.x -= t3.scrollSpeed * e2;
          s = true;
        }
        if (s) {
          F(i);
        }
      }
      G.update();
      e2 *= v.gameSpeed;
      M.update(e2);
      C.update(e2);
      T.update(e2);
      k.update(e2);
      w.update(e2);
      S.update(e2);
      (function(e3, t3) {
        if (C.vipEscaping && void 0 !== C.vip ? y.alpha += e3 : (y.alpha -= e3, y.alpha < 0 && (y.alpha = 0)), y.alpha > 0) {
          y.alpha > 1 && (y.alpha = 1), y.visible = true, y.x = 5, y.y = D.y - 305;
          const e4 = c.scale.x, s = c.scale.y, i = c.x, a = c.y;
          c.position.set(0, 0), C.vip && (X.tx = -2 * C.vip.x + 150, X.ty = -2 * C.vip.y + 150), c.scale.set(2, 2), t3.renderer.render(c, f, void 0, X), c.scale.set(e4, s), c.position.set(i, a);
        } else y.visible = false;
      })(e2, t2);
    }
    function N() {
      const e2 = Math.min(500 + 50 * v.level, 1500);
      const t2 = Math.random() * e2 / 3;
      P = {
        x: e2 + t2,
        y: e2 - t2
      };
      if (x) {
        x.width = P.x, x.height = P.y;
      }
      c.hitArea = new PIXI.Rectangle(0, 0, P.x, P.y);
    }
    function O() {
      const e2 = document.body.clientWidth;
      const t2 = document.body.clientHeight;
      D = {
        x: e2,
        y: t2,
        defaultScale: Math.max(e2, t2) / 1e3
      };
      Y.scrollSpeed = Math.max(e2, t2) / 4;
    }
    /* @__PURE__ */ new Map(), window.onload = function() {
      v = GameModel.getInstance(), S = new Particles(), M = new Graveyard(), k = new Creatures(), w = new Skeleton(), T = new Zombies(), C = new Humans(), v.loadData(), v.onReady(), O(), (function() {
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        const e2 = new PIXI.Application({
          width: D.x,
          height: D.y,
          backgroundColor: 1066256,
          resolution: v.persistentData.resolution || 1,
          antialias: false,
          resizeTo: window
        });
        document.body.appendChild(e2.view), PIXI.utils.isWebGLSupported() || console.error(
          "Warning: WebGL support not detected. Game performance may be slower."
        ), (function(e3) {
          c = new PIXI.Container(), u = new PIXI.Container(), p = new PIXI.Container(), g = new PIXI.Container(), g.sortableChildren = true, b = new PIXI.Container(), m = new PIXI.Container(), f = PIXI.RenderTexture.create({
            width: 300,
            height: 300
          }), y = new PIXI.Sprite(f), y.visible = false, y.alpha = 0, m.addChild(y), c.addChild(u), c.addChild(p), c.addChild(g), c.addChild(b), e3.stage.addChild(c), e3.stage.addChild(m), c.interactive = true, c.interactiveChildren = false, c.on("pointerdown", z), c.on("pointerup", I), c.on("pointerupoutside", I), c.on("pointermove", H), c.on("click", E), c.on("tap", E), document.getElementsByTagName("canvas")[0].onwheel = L, document.getElementsByTagName("canvas")[0].oncontextmenu = function(e4) {
            e4.preventDefault();
          };
        })(e2), e2.loader.add("sprites/ground.json").add("sprites/megagraveyard.png").add("sprites/graveyard.json").add("sprites/buildings.json").add("sprites/humans.json").add("sprites/cop.json").add("sprites/dogs.json").add("sprites/army.json").add("sprites/doctor.json").add("sprites/zombie.json").add("sprites/golem.json").add("sprites/bonecollector.json").add("sprites/harpy.json").add("sprites/objects2.json").add("sprites/fenceposts.json").add("sprites/trees2.json").add("sprites/fortress.json").add("sprites/tank.json").add("sprites/skeleton.json").load(function() {
          v.app = e2, N(), x = new PIXI.TilingSprite(PIXI.Texture.from("grass.png")), x.texture.baseTexture.mipmap = PIXI.MIPMAP_MODES.OFF, x.width = P.x, x.height = P.y, u.addChild(x), v.setupLevel(), setTimeout(function() {
            centerGameContainer(true);
          }), e2.ticker.add((t2) => {
            U(e2.ticker.deltaMS / 1e3, e2), v.frameRate = e2.ticker.FPS;
          });
        });
      })(), window.self !== window.top && ("" != document.referrer && -1 == document.referrer.indexOf("kongregate.com") && -1 == document.referrer.indexOf("konggames.com") && -1 == document.referrer.indexOf("gti.nz") ? window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ" : -1 === document.referrer.indexOf("kongregate.com") && -1 === document.referrer.indexOf("konggames.com") || kongregateAPI.loadAPI(function() {
        window.kongregate = kongregateAPI.getAPI(), v.kongregate = true, v.loginInUsingPlayFab();
      })), document.addEventListener(
        "visibilitychange",
        function() {
          "hidden" == document.visibilityState ? v.hidden = true : v.hidden = false;
        },
        false
      );
    }, window.onresize = function() {
      O();
    };
    const Y = {
      scrollSpeed: 200,
      w: false,
      a: false,
      s: false,
      d: false,
      shift: false,
      canType: false
    };
    window.onblur = function() {
      Y.w = Y.a = Y.s = Y.d = false;
      Y.shift = false;
    };
    window.onkeydown = function(e2) {
      if (Y.canType) return true;
      switch (e2.keyCode) {
        case 16:
        case 17:
          Y.shift = true;
          break;
        case 87:
        case 38:
          Y.w = true;
          break;
        case 65:
        case 37:
          Y.a = true;
          break;
        case 83:
        case 40:
          Y.s = true;
          break;
        case 68:
        case 39:
          Y.d = true;
          break;
        default:
          return true;
      }
      return false;
    };
    window.onkeyup = function(e2) {
      if (Y.canType) return true;
      switch (e2.keyCode) {
        case 16:
        case 17:
          Y.shift = false;
          break;
        case 87:
        case 38:
          Y.w = false;
          break;
        case 65:
        case 37:
          Y.a = false;
          break;
        case 83:
        case 40:
          Y.s = false;
          break;
        case 68:
        case 39:
          Y.d = false;
          break;
        default:
          return true;
      }
      return false;
    };
    class Spell {
      id;
      name;
      tooltip;
      itemText;
      cooldown;
      duration;
      energyCost;
      start;
      end;
      timer;
      onCooldown;
      active;
      constructor(id, name, tooltip, itemText, cooldown, duration, energyCost, start, end) {
        this.id = id;
        this.name = name;
        this.tooltip = tooltip;
        this.itemText = itemText;
        this.cooldown = cooldown;
        this.duration = duration;
        this.energyCost = energyCost;
        this.start = start;
        this.end = end;
        this.timer = 0;
        this.onCooldown = false;
        this.active = false;
        this.cooldown = 0;
      }
    }
    class Spells {
      spells;
      constructor() {
        this.cooldownReduction = 0;
        this.timeExtension = 0;
        this.costReduction = 0;
        this.skeleton = new Skeleton();
        this.zombies = new Zombies();
        this.humans = new Humans();
        this.spellMap = /* @__PURE__ */ new Map();
        this.spells = [
          new Spell(
            1,
            "Time Warp",
            "Speed up the flow of time for 30 seconds",
            "",
            90,
            30,
            0,
            function() {
              GameModel.getInstance().gameSpeed = 2;
            },
            function() {
              GameModel.getInstance().gameSpeed = 1;
            }
          ),
          new Spell(
            2,
            "Energy Charge",
            "5x Energy rate for 20 seconds, cost 50 energy",
            "",
            160,
            20,
            50,
            function() {
              GameModel.getInstance().energySpellMultiplier = 5;
              if (GameModel.getInstance().persistentData.autoMaxHarpies && GameModel.getInstance().constructions.aviary) {
                GameModel.getInstance().setMaxHarpies();
              }
            },
            function() {
              GameModel.getInstance().energySpellMultiplier = 1;
              if (GameModel.getInstance().persistentData.autoMaxHarpies && GameModel.getInstance().constructions.aviary) {
                GameModel.getInstance().setMaxHarpies();
              }
            }
          ),
          new Spell(
            3,
            "Detonate",
            "Turns your zombies into fast moving living bombs, cost 69 energy... nice",
            "",
            80,
            8,
            69,
            function() {
              new Spells().zombies.detonate = true;
            },
            function() {
              new Spells().zombies.detonate = false;
            }
          ),
          new Spell(
            4,
            "Earth Freeze",
            "Freeze all humans in place preventing them from moving for 15 seconds, cost 75 energy",
            "",
            50,
            15,
            75,
            function() {
              new Spells().humans.frozen = true;
            },
            function() {
              new Spells().humans.frozen = false;
            }
          ),
          new Spell(
            5,
            "Gigazombies",
            "For 5 seconds any zombies spawned will be giants with 10x health and attack damage, cost 100 energy",
            "",
            260,
            5,
            100,
            function() {
              new Spells().zombies.super = true;
            },
            function() {
              new Spells().zombies.super = false;
            }
          ),
          new Spell(
            6,
            "Incinerate",
            "Burns humans near the skeleton champion",
            "Has a chance to cast Incinerate when attacking, burning all humans within a large radius of the Skeleton",
            1,
            10,
            10,
            function() {
              new Spells().skeleton.incinerate(), this.timer = 1;
            },
            function() {
            }
          ),
          new Spell(
            7,
            "Pandemic",
            "Causes plague to spread",
            "Has a chance to cast Pandemic when attacking, causing infected humans to spread the plague to each other for 20 seconds",
            10,
            20,
            10,
            function() {
              new Spells().humans.pandemic = true;
            },
            function() {
              new Spells().humans.pandemic = false;
            }
          ),
          new Spell(
            8,
            "Part Storm",
            "Doubles parts",
            "Has a chance to cast Part Storm when attacking, doubling the parts production of your factory machines for 15 seconds",
            10,
            15,
            10,
            function() {
              new PartFactory().storm = true;
            },
            function() {
              new PartFactory().storm = false;
            }
          )
        ];
        if (Spells.instance) {
          return Spells.instance;
        }
        Spells.instance = this;
        this.spells.forEach((e2) => this.spellMap.set(e2.id, e2));
      }
      lockAllSpells() {
        for (let e2 = 0; e2 < this.spells.length; e2++)
          this.spells[e2].unlocked = false;
      }
      unlockSpell(e2) {
        this.spellMap.get(e2).unlocked = true;
      }
      getSpell(e2) {
        return this.spellMap.get(e2);
      }
      getUnlockedSpells() {
        return this.spells.filter((e2) => e2.unlocked);
      }
      castSpell(spell) {
        const gameModel = GameModel.getInstance();
        if (spell.onCooldown || spell.active || !spell.unlocked || spell.energyCost - this.costReduction > gameModel.energy) {
          return;
        }
        gameModel.energy -= spell.energyCost - this.costReduction;
        spell.onCooldown = true;
        spell.cooldownLeft = spell.cooldown * this.cooldownReduction;
        spell.active = true;
        spell.timer = spell.duration + this.timeExtension;
        spell.start();
        gameModel.sendMessage(spell.name);
      }
      castSpellNoMana(e2) {
        const t2 = this.spellMap.get(e2);
        if (t2 && !t2.active) {
          t2.active = true;
          t2.timer = t2.duration + this.timeExtension;
          t2.start();
          GameModel.getInstance().sendMessage(t2.name);
        }
      }
      updateSpells(e2) {
        for (let t2 = 0; t2 < this.spells.length; t2++) {
          const s = this.spells[t2];
          if (s.onCooldown && !s.active) {
            s.cooldownLeft -= e2;
            if (s.cooldownLeft <= 0) {
              s.onCooldown = false;
            }
          }
          if (s.active) {
            s.timer -= e2;
            if (s.timer <= 0) {
              s.active = false, s.end();
            }
          }
        }
      }
    }
    class V extends PIXI.TilingSprite {
      constructor(e2) {
        super(e2);
        this.collisionX = 0;
        this.collisionY = 0;
        this.collisionWidth = 0;
        this.collisionHeight = 0;
      }
    }
    class j {
      constructor(e2, t2, s, i, a) {
        this.id = 0;
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.entrance = null;
        this.id = e2;
        this.x = t2;
        this.y = s;
        this.width = i;
        this.height = a;
      }
    }
    class $ {
      constructor() {
        this.attack = 0;
        this.scan = 0;
        this.smoke = 0;
        this.burnTick = 0;
        this.ability = 0;
        this.dogStun = 0;
        this.target = 0;
      }
    }
    class K {
      constructor() {
        this.burning = false;
        this.infected = false;
        this.dead = false;
        this.golem = false;
      }
    }
    class Q extends PIXI.AnimatedSprite {
      constructor(e2) {
        super(e2);
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.health = 0;
        this.maxHealth = 0;
        this.zombie = false;
        this.targetVector = {
          x: 0,
          y: 0
        };
        this.burnDamage = 0;
        this.hasIcon = false;
        this.flags = new K();
        this.timer = new $();
      }
      reset() {
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
    class J extends PIXI.Sprite {
      xSpeed;
      ySpeed;
      constructor(e2) {
        super(e2);
        this.xSpeed = 0;
        this.ySpeed = 0;
      }
    }
    class _ {
      constructor() {
        this.sprites = [];
        this.discardedSprites = [];
      }
      setup(e2, t2) {
        this.container = e2;
        this.texture = t2;
      }
      discardSprite(e2) {
        e2.visible = false;
        this.discardedSprites.push(e2);
      }
      getSprite() {
        if (this.discardedSprites.length > 0) {
          const e3 = this.discardedSprites.pop();
          e3.visible = true;
          return e3;
        }
        const e2 = this.create(this.texture);
        this.container.addChild(e2);
        this.sprites.push(e2);
        return e2;
      }
    }
    class ee {
      instance;
      constructor() {
        this.gameModel = GameModel.getInstance();
        this.humans = new Humans();
        this.discardedWalls = [];
        this.discardedContainers = [];
        this.discardedFloorSprites = [];
        this.buildings = [];
        this.buildingsByPopularity = [];
        this.buildingMap = [];
        this.roadSprite = null;
        this.roadTexture = null;
        this.entranceWidth = 16;
        this.entranceDepth = 16;
        this.cornerDistance = 16;
        this.minBuildings = 3;
        this.wallWidth = 4;
        this.graveyardCollision = null;
        this.graveYardLocation = {
          x: 0,
          y: 0
        };
        this.graveYardPosition = null;
        this.wallCollisionBuffer = 3;
        this.fastDistance = weighted_hybrid_distance;
        this.pathFindStepSize = 5;
        this.dx = 0;
        this.dy = 0;
        this.stepsToTake = 10;
        this.hasHit = false;
        this.vector = null;
        this.corner = null;
        this.hitbuilding = false;
        this.insideBuilding = false;
        this.treeSprites = [];
        this.treeTextures = [];
        this.armyTextures = [];
        if (ee.instance) {
          return ee.instance;
        }
        ee.instance = this;
      }
      getRandomBuilding() {
        return sample(this.buildingsByPopularity);
      }
      roomNoOverlap(e2, t2) {
        return e2.x > t2.x + t2.width + 50 || e2.x + e2.width + 50 < t2.x || e2.y > t2.y + t2.height + 50 || e2.y + e2.height + 50 < t2.y || void 0;
      }
      isValidPosition(e2) {
        if (!this.roomNoOverlap(e2, this.graveYardPosition)) return false;
        for (let t2 = 0; t2 < this.buildings.length; t2++)
          if (!this.roomNoOverlap(e2, this.buildings[t2])) return false;
        return !(this.gameModel.level % 5 === 0 && !this.gameModel.isBossStage(this.gameModel.level) && e2.y < this.roadSprite.y + this.roadSprite.height && e2.y + e2.height > this.roadSprite.y);
      }
      getWall(e2) {
        if (this.discardedWalls.length > 0) {
          const t2 = this.discardedWalls.pop();
          t2.texture = e2;
          return t2;
        }
        return new V(e2);
      }
      makeHorizontalWall(e2, t2, s, i, a, r) {
        if (s) {
          const s2 = this.getWall(t2);
          s2.x = i;
          s2.y = a;
          s2.width = r / 2 - this.entranceWidth;
          s2.height = 4;
          e2.push(s2);
          const n = this.getWall(t2);
          n.x = i + r / 2 + this.entranceWidth;
          n.y = a;
          n.width = r / 2 - this.entranceWidth;
          n.height = 4;
          e2.push(n);
        } else {
          const s2 = this.getWall(t2);
          s2.x = i;
          s2.y = a;
          s2.width = r;
          s2.height = 4;
          e2.push(s2);
        }
      }
      makeVerticalWall(e2, t2, s, i, a, r) {
        if (s) {
          const s2 = this.getWall(t2);
          s2.x = i;
          s2.y = a;
          s2.width = 4;
          s2.height = r / 2 - this.entranceWidth;
          e2.push(s2);
          const n = this.getWall(t2);
          n.x = i;
          n.y = a + r / 2 + this.entranceWidth;
          n.width = 4;
          n.height = r / 2 - this.entranceWidth;
          e2.push(n);
        } else {
          const s2 = this.getWall(t2);
          s2.x = i;
          s2.y = a;
          s2.width = 4;
          s2.height = r;
          e2.push(s2);
        }
      }
      getContainer() {
        return this.discardedContainers.length > 0 ? this.discardedContainers.pop() : new PIXI.Container();
      }
      getFloorSprite() {
        return this.discardedFloorSprites.length > 0 ? this.discardedFloorSprites.pop() : new PIXI.TilingSprite(PIXI.Texture.WHITE);
      }
      addBuilding(e2) {
        var t2;
        let s;
        e2.container = this.getContainer();
        e2.container.cacheAsBitmap = false;
        e2.floorSprite = this.getFloorSprite();
        e2.floorSprite.tint = (t2 = 10 + Math.round(50 * Math.random()), s = 10 + Math.round(50 * Math.random()), 10 + Math.round(50 * Math.random()) | s << 8 | t2 << 16);
        e2.floorSprite.alpha = 0.2;
        e2.container.x = e2.x;
        e2.container.y = e2.y;
        e2.floorSprite.width = e2.width;
        e2.floorSprite.height = e2.height;
        e2.container.addChild(e2.floorSprite);
        const r = [
          {
            x: e2.x + e2.width / 2,
            y: e2.y,
            north: true,
            inside: {
              x: e2.x + e2.width / 2,
              y: e2.y + this.entranceDepth,
              entrance: true
            },
            outside: {
              x: e2.x + e2.width / 2,
              y: e2.y - this.entranceDepth,
              entrance: true
            }
          },
          {
            x: e2.x + e2.width / 2,
            y: e2.y + e2.height,
            south: true,
            inside: {
              x: e2.x + e2.width / 2,
              y: e2.y + e2.height - this.entranceDepth,
              entrance: true
            },
            outside: {
              x: e2.x + e2.width / 2,
              y: e2.y + e2.height + this.entranceDepth,
              entrance: true
            }
          },
          {
            x: e2.x,
            y: e2.y + e2.height / 2,
            west: true,
            inside: {
              x: e2.x + this.entranceDepth,
              y: e2.y + e2.height / 2,
              entrance: true
            },
            outside: {
              x: e2.x - this.entranceDepth,
              y: e2.y + e2.height / 2,
              entrance: true
            }
          },
          {
            x: e2.x + e2.width,
            y: e2.y + e2.height / 2,
            east: true,
            inside: {
              x: e2.x + e2.width - this.entranceDepth,
              y: e2.y + e2.height / 2,
              entrance: true
            },
            outside: {
              x: e2.x + e2.width + this.entranceDepth,
              y: e2.y + e2.height / 2,
              entrance: true
            }
          }
        ];
        let n;
        const o = {
          x: P.x / 2,
          y: P.y / 2
        };
        let h2 = 2e3;
        for (let e3 = 0; e3 < r.length; e3++) {
          const t3 = weighted_hybrid_distance(r[e3].x, r[e3].y, o.x, o.y);
          if (t3 < h2) {
            h2 = t3;
            n = r[e3];
          }
        }
        e2.entrance = n;
        if (this.gameModel.level % 5 == 0) {
          if (e2.y < P.y / 2) {
            e2.entrance = r.filter((e3) => e3.south)[0];
          } else {
            e2.entrance = r.filter((e3) => e3.north)[0];
          }
        }
        e2.walls = [];
        const l2 = sample(this.buildingTextures);
        this.makeHorizontalWall(
          e2.walls,
          l2,
          e2.entrance.north,
          -4,
          -4,
          e2.width + 8
        );
        this.makeHorizontalWall(
          e2.walls,
          l2,
          e2.entrance.south,
          -4,
          e2.height,
          e2.width + 8
        );
        this.makeVerticalWall(e2.walls, l2, e2.entrance.west, -4, -4, e2.height + 8);
        this.makeVerticalWall(
          e2.walls,
          l2,
          e2.entrance.east,
          e2.width,
          -4,
          e2.height + 8
        );
        for (let t3 = 0; t3 < e2.walls.length; t3++) {
          e2.container.addChild(e2.walls[t3]);
        }
        e2.container.cacheAsBitmap = true;
        u.addChild(e2.container);
        for (let t3 = 0; t3 < e2.walls.length; t3++) {
          e2.walls[t3].collisionX = e2.x + e2.walls[t3].x;
        }
        e2.walls[t2].collisionY = e2.y + e2.walls[t2].y;
        e2.walls[t2].collisionWidth = e2.walls[t2].width;
        e2.walls[t2].collisionHeight = e2.walls[t2].height;
      }
      addCorners(e2) {
        e2.corners = [];
        e2.corners.push({
          x: e2.x - this.cornerDistance,
          y: e2.y - this.cornerDistance
        });
        e2.corners.push({
          x: e2.x + e2.width + this.cornerDistance,
          y: e2.y - this.cornerDistance
        });
        e2.corners.push({
          x: e2.x - this.cornerDistance,
          y: e2.y + e2.height + this.cornerDistance
        });
        e2.corners.push({
          x: e2.x + e2.width + this.cornerDistance,
          y: e2.y + e2.height + this.cornerDistance
        });
      }
      setGraveyardPosition() {
        if (this.gameModel.level % 5 !== 0 || this.gameModel.isBossStage(this.gameModel.level)) {
          this.graveYardPosition = {
            x: P.x / 2 - 50,
            y: P.y / 2 - 50,
            width: 100,
            height: 100
          };
        } else {
          this.graveYardPosition = {
            x: Math.random() * P.x * 0.8 - 50 + 0.1 * P.x,
            y: (Math.random() > 0.5 ? 0.25 * P.y : 0.75 * P.y) - 50,
            width: 100,
            height: 100
          };
        }
        this.graveYardLocation = {
          x: this.graveYardPosition.x + 50,
          y: this.graveYardPosition.y + 50
        };
      }
      populatePois() {
        this.setGraveyardPosition();
        if (!this.buildingTextures) {
          this.buildingTextures = [];
          for (let e3 = 0; e3 < 2; e3++) {
            this.buildingTextures.push(PIXI.Texture.from(`floor${e3 + 1}.png`));
          }
          for (let e3 = 0; e3 < 2; e3++) {
            this.buildingTextures.push(PIXI.Texture.from(`wall${e3 + 1}.png`));
          }
          this.roadSprite = new PIXI.TilingSprite(PIXI.Texture.from("road.png"));
          this.roadSprite.texture.baseTexture.mipmap = PIXI.MIPMAP_MODES.OFF;
          this.roadSprite.width = P.x;
          this.roadSprite.tileScale.set(3, 3);
          this.roadSprite.height = 96;
          u.addChild(this.roadSprite);
          this.roadSprite.visible = false;
          this.roadSprite.anchor.set(0, 0);
        }
        if (this.buildings.length > 0) {
          for (let e3 = 0; e3 < this.buildings.length; e3++) {
            u.removeChild(this.buildings[e3].container);
            this.buildings[e3].walls.forEach((t3) => {
              this.discardedWalls.push(t3);
              this.buildings[e3].container.removeChild(t3);
            });
            this.buildings[e3].container.removeChild(
              this.buildings[e3].floorSprite
            );
            this.discardedFloorSprites.push(this.buildings[e3].floorSprite);
            this.discardedContainers.push(this.buildings[e3].container);
          }
        }
        let e2 = 1;
        this.buildingsByPopularity = [];
        this.buildings = [];
        let t2 = this.minBuildings;
        let s = this.humans.getMaxHumans();
        const i = Math.max(Math.min(50, Math.round(s / 3)), 10);
        this.roadSprite.visible = false;
        if (this.gameModel.isBossStage(this.gameModel.level)) {
          s = 0;
          t2 = 0;
        } else if (this.gameModel.level % 5 == 0) {
          this.roadSprite.visible = true;
          this.roadSprite.width = P.x;
          this.roadSprite.x = 0;
          this.roadSprite.y = P.y / 2 - 48;
        }
        while (s > 0 || t2 > 0) {
          t2--;
          const a = Math.round(5 + Math.random() * (i - 5));
          const r = Math.sqrt(500 * a);
          s -= a;
          let n;
          let o = false;
          let h2 = 1e3;
          const l2 = 10;
          while (!o && h2 > 0) {
            h2--;
            n = this.gameModel.level % 5 == 0 ? Math.random() > 0.7 ? {
              x: l2 + Math.random() * (P.x - (2 * l2 + r)),
              y: l2 + Math.random() * (P.y - (2 * l2 + r)),
              width: r,
              height: r
            } : {
              x: l2 + Math.random() * (P.x - (2 * l2 + r)),
              y: Math.random() > 0.5 ? P.y / 2 + this.roadSprite.height / 2 + 8 : P.y / 2 - this.roadSprite.height / 2 - 8 - r,
              width: r,
              height: r
            } : {
              x: l2 + Math.random() * (P.x - (2 * l2 + r)),
              y: l2 + Math.random() * (P.y - (2 * l2 + r)),
              width: r,
              height: r
            };
            o = this.isValidPosition(n);
          }
          if (o) {
            const t3 = new j(e2++, n.x, n.y, r, r);
            this.addBuilding(t3);
            const s2 = Math.max(Math.round(r / 10), 1);
            for (let e3 = 0; e3 < s2; e3++) {
              this.buildingsByPopularity.push(t3);
            }
            this.buildings.push(t3);
            this.addCorners(t3);
          }
        }
        this.populateBuildingMap();
        this.populateTrees();
      }
      populateBuildingMap() {
        this.buildingMap = [];
        this.mapCols = Math.ceil(P.x / 10);
        this.mapRows = Math.ceil(P.y / 10);
        if (this.buildings.length != 0) {
          for (let e2 = 0; e2 < this.mapRows; e2++) {
            const t2 = 10 * e2;
            for (let i = 0; i < this.mapCols; i++) {
              const a = 10 * i;
              let r;
              let n = 1e4;
              for (const i2 of this.buildings) {
                const o = distance(a, t2, i2.x + i2.width / 2, i2.y + i2.height / 2) - i2.width / 2;
                if (o < n) {
                  n = o;
                  r = i2;
                }
              }
              this.buildingMap[e2 * this.mapCols + i] = r;
            }
          }
        }
      }
      getBuildingFromMap(e2, t2) {
        return this.buildingMap[Math.round(t2 / 10) * this.mapCols + Math.round(e2 / 10)];
      }
      randomPositionInBuilding(e2) {
        if (!e2) {
          const e3 = Math.random() > 0.5 ? -1 : 1, t2 = Math.random() > 0.5 ? -1 : 1, s = P.x / 4, i = P.y / 4;
          return Math.random() > 0.5 ? {
            x: Math.random() * P.x,
            y: P.y / 2 + t2 * i + Math.random() * t2 * i
          } : {
            x: P.x / 2 + e3 * s + Math.random() * e3 * s,
            y: Math.random() * P.y
          };
        }
        return {
          x: e2.x + 5 + Math.random() * (e2.width - 10),
          y: e2.y + 5 + Math.random() * (e2.height - 10)
        };
      }
      isInsidePoi(e2, t2, s, i = 0) {
        return e2 > s.x - i && e2 < s.x + s.width + i && t2 > s.y - i && t2 < s.y + s.height + i;
      }
      checkWall(e2, t2, s, i) {
        if (t2.y > e2.collisionY && t2.y < e2.collisionY + e2.collisionHeight) {
          if (t2.x < e2.collisionX - this.wallCollisionBuffer && s.x > e2.collisionX - this.wallCollisionBuffer) {
            i.x = true;
            i.validX = e2.collisionX - this.wallCollisionBuffer - 1;
          }
          if (t2.x > e2.collisionX + e2.collisionWidth + this.wallCollisionBuffer && s.x < e2.collisionX + e2.collisionWidth + this.wallCollisionBuffer) {
            i.x = true;
            i.validX = e2.collisionX + e2.collisionWidth + this.wallCollisionBuffer + 1;
          }
        }
        if (t2.x > e2.collisionX && t2.x < e2.collisionX + e2.collisionWidth) {
          if (t2.y < e2.collisionY - this.wallCollisionBuffer && s.y > e2.collisionY - this.wallCollisionBuffer) {
            i.y = true;
            i.validY = e2.collisionY - this.wallCollisionBuffer - 1;
          }
          if (t2.y > e2.collisionY + e2.collisionHeight + this.wallCollisionBuffer && s.y < e2.collisionY + e2.collisionHeight + this.wallCollisionBuffer) {
            i.y = true;
            i.validY = e2.collisionY + e2.collisionHeight + this.wallCollisionBuffer + 1;
          }
        }
      }
      checkGraveyard(e2, t2) {
        const s = new te();
        if (this.graveyardCollision) {
          this.checkWall(this.graveyardCollision, e2, t2, s);
        }
        return s.x || s.y ? s : null;
      }
      checkCollisions(e2, t2) {
        const s = this.findBuilding(e2);
        if (!s) {
          return this.checkGraveyard(e2, t2);
        }
        const i = new te();
        for (let a = 0; a < s.walls.length; a++) {
          this.checkWall(s.walls[a], e2, t2, i);
        }
        return i;
      }
      pathStepCalc(e2, t2) {
        const s = t2.x - e2.x;
        const i = t2.y - e2.y;
        const a = Math.abs(s);
        const r = Math.abs(i);
        if (Math.max(a, r) == 0) {
          return;
        }
        let n = 1 / Math.max(a, r);
        n *= 1.29289 - (a + r) * n * 0.29289;
        return {
          x: s * n * this.pathFindStepSize,
          y: i * n * this.pathFindStepSize
        };
      }
      findBuilding(e2) {
        return this.getBuildingFromMap(e2.x, e2.y);
      }
      normalizeVector(e2) {
        if (e2.x == 0 && e2.y == 0) {
          return e2;
        }
        const t2 = Math.sqrt(e2.x * e2.x + e2.y * e2.y);
        e2.x /= t2;
        e2.y /= t2;
        return e2;
      }
      modifyVectorForCollision(e2, t2, s) {
        if (!t2 && !this.graveyardCollision) {
          return this.normalizeVector(e2);
        }
        const i = new te();
        const a = {
          x: s.x + (e2.x > 0 ? 1 : -1),
          y: s.y + (e2.y > 0 ? 1 : -1)
        };
        if (t2) {
          for (let e3 = 0; e3 < t2.walls.length; e3++) {
            this.checkWall(t2.walls[e3], s, a, i);
          }
        }
        if (this.graveyardCollision) {
          this.checkWall(this.graveyardCollision, s, a, i);
        }
        if (i.x) {
          e2.x = 0;
        }
        if (i.y) {
          e2.y = 0;
        }
        return this.normalizeVector(e2);
      }
      willVectorHitBuilding(e2, t2, s, i) {
        this.dx = t2.x - e2.x;
        this.dy = t2.y - e2.y;
        if (this.dx < 0 && e2.x < s.x - 4) {
          return false;
        }
        if (this.dx > 0 && e2.x > s.x + s.width + 4) {
          return false;
        }
        if (this.dy < 0 && e2.y < s.y - 4) {
          return false;
        }
        if (this.dy > 0 && e2.y > s.y + s.width + 4) {
          return false;
        }
        this.step = this.pathStepCalc(e2, t2);
        this.stepsToTake = Math.min(
          i / this.pathFindStepSize - this.pathFindStepSize,
          30
        );
        this.hasHit = false;
        for (this.testPosition = {
          x: e2.x,
          y: e2.y
        }; !this.hasHit && this.stepsToTake > 0; ) {
          this.stepsToTake--;
          this.testPosition.x += this.step.x;
          this.testPosition.y += this.step.y;
          if (this.isInsidePoi(this.testPosition.x, this.testPosition.y, s, 4)) {
            this.hasHit = true;
          }
        }
        return this.hasHit;
      }
      findNearestCorner(e2, t2) {
        let s = null;
        let i = 1e4;
        for (let a = 0; a < t2.length; a++) {
          const r = this.fastDistance(e2.x, e2.y, t2[a].x, t2[a].y);
          if (r < i) {
            i = r;
            s = t2[a];
          }
        }
        return s;
      }
      findAdjacentCorners(e2, t2) {
        const s = [];
        for (let i = 0; i < t2.corners.length; i++) {
          if (t2.corners[i].x == e2.x || t2.corners[i].y == e2.y) {
            s.push(t2.corners[i]);
          }
        }
        return s;
      }
      navigateAroundBuilding(e2, t2, s, i) {
        this.vector = {
          x: t2.x - e2.x,
          y: t2.y - e2.y,
          distance: i
        };
        return s ? (this.hitbuilding = this.willVectorHitBuilding(e2, t2, s, i), this.hitbuilding ? (this.corner = this.findNearestCorner(t2, s.corners), this.hitbuilding = this.willVectorHitBuilding(
          e2,
          this.corner,
          s,
          i
        ), this.hitbuilding ? (this.corner = this.findNearestCorner(
          e2,
          this.findAdjacentCorners(this.corner, s)
        ), this.vector.x = this.corner.x - e2.x, this.vector.y = this.corner.y - e2.y, this.modifyVectorForCollision(this.vector, s, e2)) : (this.vector.x = this.corner.x - e2.x, this.vector.y = this.corner.y - e2.y, this.modifyVectorForCollision(this.vector, s, e2))) : this.modifyVectorForCollision(this.vector, s, e2)) : this.normalizeVector(this.vector);
      }
      howDoIGetToMyTarget(e2, t2) {
        this.distanceToTarget = this.fastDistance(e2.x, e2.y, t2.x, t2.y);
        this.closeBuilding = this.findBuilding(e2);
        this.insideBuilding = false;
        if (this.closeBuilding && (this.insideBuilding = this.isInsidePoi(
          e2.x,
          e2.y,
          this.closeBuilding,
          0
        ), this.insideBuilding)) {
          return this.isInsidePoi(t2.x, t2.y, this.closeBuilding, 0) ? this.modifyVectorForCollision(
            {
              x: t2.x - e2.x,
              y: t2.y - e2.y
            },
            this.closeBuilding,
            e2
          ) : this.modifyVectorForCollision(
            {
              x: this.closeBuilding.entrance.outside.x - e2.x,
              y: this.closeBuilding.entrance.outside.y - e2.y
            },
            this.closeBuilding,
            e2
          );
        }
        const s = this.findBuilding(t2);
        if (s && (this.insideBuilding = this.isInsidePoi(t2.x, t2.y, s, 0), this.insideBuilding)) {
          if (this.fastDistance(
            e2.x,
            e2.y,
            s.entrance.outside.x,
            s.entrance.outside.y
          ) < 30) {
            return this.modifyVectorForCollision(
              {
                x: s.entrance.inside.x - e2.x,
                y: s.entrance.inside.y - e2.y
              },
              this.closeBuilding,
              e2
            );
          }
          return this.navigateAroundBuilding(
            e2,
            s.entrance.outside,
            this.closeBuilding,
            this.distanceToTarget
          );
        }
        if (this.distanceToTarget < 20) {
          return this.modifyVectorForCollision(
            {
              x: t2.x - e2.x,
              y: t2.y - e2.y
            },
            this.closeBuilding,
            e2
          );
        }
        return this.navigateAroundBuilding(
          e2,
          t2,
          this.closeBuilding,
          this.distanceToTarget
        );
      }
      isValidTreePosition(e2) {
        if (!this.isValidPosition(e2)) {
          return false;
        }
        for (let t2 = 0; t2 < this.treeSprites.length; t2++) {
          if (this.fastDistance(
            e2.x,
            e2.y,
            this.treeSprites[t2].x,
            this.treeSprites[t2].y
          ) < 25) {
            return false;
          }
        }
        return true;
      }
      populateTrees() {
        if (this.treeSprites.length > 0) {
          for (let e3 = 0; e3 < this.treeSprites.length; e3++) {
            this.treeSprites[e3].visible = false;
          }
        }
        if (this.treeTextures.length == 0) {
          for (let e3 = 0; e3 < 6; e3++) {
            this.treeTextures.push(PIXI.Texture.from(`tree${e3}.png`));
          }
          this.armyTextures.push(PIXI.Texture.from("hedgehog.png"));
          this.armyTextures.push(PIXI.Texture.from("sandbags.png"));
        }
        let e2 = Math.round(P.x / 50);
        if (this.gameModel.isBossStage(this.gameModel.level)) {
          e2 = Math.round(1.5 * e2);
        }
        let t2 = 0;
        while (e2 > 0) {
          let s;
          let i = false;
          let r = 1e3;
          const n = 8;
          const o = 2;
          while (!i && r > 0) {
            r--;
            s = {
              x: n + Math.random() * (P.x - 2 * n),
              y: n + Math.random() * (P.y - 2 * n),
              width: o,
              height: o
            };
            i = this.isValidTreePosition(s);
          }
          if (i) {
            let e3 = 0.4 + 0.6 * Math.random();
            if (this.gameModel.constructions.graveyard) {
              e3 = Math.min(
                (this.fastDistance(
                  s.x,
                  s.y,
                  this.graveYardLocation.x,
                  this.graveYardLocation.y
                ) - 90) / 400,
                1
              );
            }
            let i2;
            let r2 = this.treeTextures[this.treeTextures.length - 1 - Math.round((this.treeTextures.length - 1) * e3)];
            if (this.gameModel.isBossStage(this.gameModel.level) && Math.random() > 0.7) {
              r2 = sample(this.armyTextures);
            }
            if (this.treeSprites.length > t2) {
              i2 = this.treeSprites[t2];
              i2.texture = r2;
              i2.visible = true;
            } else {
              i2 = new PIXI.Sprite(r2);
              this.treeSprites.push(i2);
              g.addChild(i2);
            }
            t2++;
            i2.anchor.set(0.5, 1);
            i2.x = s.x;
            i2.y = s.y;
            i2.zIndex = i2.y;
            i2.scale.x = 2;
            i2.scale.y = 2;
            i2.scale.x = Math.random() > 0.5 ? i2.scale.x : -1 * i2.scale.x;
          }
          e2--;
        }
      }
    }
    class te {
      constructor() {
        this.x = false;
        this.y = false;
        this.validX = 0;
        this.validY = 0;
      }
    }
    class PartFactory {
      constructor() {
        this.storm = false;
        this.gameModel = GameModel.getInstance();
        this.costs = {
          blood: "blood",
          parts: "parts"
        };
        this.generatorsApplied = [];
        this.generators = [
          new ie(
            1,
            "Simple Machine",
            this.costs.blood,
            1e6,
            1.08,
            1,
            2,
            "A simple device that produces 1 part every 2 seconds"
          ),
          new ie(
            2,
            "Part Duplicator",
            this.costs.parts,
            100,
            1.09,
            4,
            3,
            "A more advanced device that produces 4 parts every 3 seconds"
          ),
          new ie(
            3,
            "Stamp Press",
            this.costs.parts,
            1e3,
            1.1,
            16,
            5,
            "An industrial press that produces 16 parts every 5 seconds"
          ),
          new ie(
            4,
            "Conveyor",
            this.costs.parts,
            1e4,
            1.11,
            64,
            8,
            "A fantastic new invention that produces 64 parts every 8 seconds"
          ),
          new ie(
            5,
            "Splitter Combiner",
            this.costs.parts,
            1e5,
            1.12,
            192,
            10,
            "A wondrous machine that produces 192 parts every 10 seconds"
          ),
          new ie(
            6,
            "Batch Converter",
            this.costs.parts,
            5e5,
            1.13,
            512,
            12,
            "An astounding contraption that produces 512 parts every 12 seconds"
          )
        ];
        if (PartFactory.instance) {
          return PartFactory.instance;
        }
        PartFactory.instance = this;
      }
      factoryStats() {
        let e2 = 0;
        let t2 = 0;
        for (let s = 0; s < this.generatorsApplied.length; s++) {
          e2 += this.generatorsApplied[s].rank;
          t2 += this.generatorsApplied[s].total / this.generatorsApplied[s].time;
        }
        return {
          machines: e2,
          partsPerSec: (this.storm ? 2 : 1) * t2 * this.gameModel.partsPCMod
        };
      }
      update(e2) {
        for (let t2 = 0; t2 < this.generatorsApplied.length; t2++) {
          this.generatorsApplied[t2].timeLeft -= e2;
          if (this.generatorsApplied[t2].timeLeft <= 0) {
            this.generatorsApplied[t2].timeLeft = this.generatorsApplied[t2].time;
            this.gameModel.persistentData.parts += this.generatorsApplied[t2].total * this.gameModel.partsPCMod * (this.storm ? 2 : 1);
          }
        }
      }
      updateLongTime(e2) {
        let t2 = 0;
        for (let s = 0; s < this.generatorsApplied.length; s++) {
          t2 += this.generatorsApplied[s].total * (e2 / this.generatorsApplied[s].time);
        }
        return t2 * this.gameModel.partsPCMod;
      }
      currentRank(e2) {
        for (const s of this.gameModel.persistentData.generators) {
          if (e2.id == s.id) {
            return s.rank;
          }
        }
        return 0;
      }
      purchasePrice(e2) {
        return Math.round(e2.basePrice * e2.multi ** this.currentRank(e2));
      }
      upgradeMaxAffordable(e2) {
        const t2 = this.currentRank(e2);
        let s = 0;
        switch (e2.costType) {
          case this.costs.blood: {
            s = h(e2.basePrice, e2.multi, t2, this.gameModel.persistentData.blood);
            break;
          }
          case this.costs.parts: {
            s = h(e2.basePrice, e2.multi, t2, this.gameModel.persistentData.parts);
          }
        }
        return e2.cap != 0 ? Math.min(s, e2.cap - t2) : s;
      }
      upgradeMaxPrice(e2, t2) {
        return l(e2.basePrice, e2.multi, this.currentRank(e2), t2);
      }
      canAffordGenerator(e2) {
        switch (e2.costType) {
          case this.costs.blood: {
            return this.gameModel.persistentData.blood >= this.purchasePrice(e2);
          }
          case this.costs.parts: {
            return this.gameModel.persistentData.parts >= this.purchasePrice(e2);
          }
        }
        return false;
      }
      purchaseMaxGenerators(e2) {
        const t2 = this.upgradeMaxAffordable(e2);
        for (let s = 0; s < t2; s++) {
          this.purchaseGenerator(e2, false);
        }
        this.gameModel.saveData();
      }
      purchaseGenerator(e2, t2 = true) {
        if (this.canAffordGenerator(e2)) {
          switch (e2.costType) {
            case this.costs.blood: {
              this.gameModel.persistentData.blood -= this.purchasePrice(e2);
              break;
            }
            case this.costs.parts: {
              this.gameModel.persistentData.parts -= this.purchasePrice(e2);
            }
          }
          let s;
          for (let t3 = 0; t3 < this.gameModel.persistentData.generators.length; t3++) {
            if (e2.id == this.gameModel.persistentData.generators[t3].id) {
              s = this.gameModel.persistentData.generators[t3];
              s.rank++;
            }
          }
          if (!s) {
            this.gameModel.persistentData.generators.push({
              id: e2.id,
              rank: 1
            });
          }
          if (t2) {
            this.gameModel.saveData();
          }
          this.applyGenerators();
        }
      }
      applyGenerator(e2, t2) {
        let s = false;
        for (let i = 0; i < this.generatorsApplied.length; i++) {
          if (this.generatorsApplied[i].id == e2.id) {
            s = true;
            this.generatorsApplied[i].rank = t2;
            this.generatorsApplied[i].total = this.generatorsApplied[i].produces * this.generatorsApplied[i].rank;
          }
        }
        if (!s) {
          this.generatorsApplied.push({
            id: e2.id,
            produces: e2.produces,
            total: e2.produces * t2,
            rank: t2,
            time: e2.time,
            timeLeft: e2.time
          });
        }
      }
      applyGenerators() {
        for (let e2 = 0; e2 < this.generators.length; e2++) {
          const t2 = this.currentRank(this.generators[e2]);
          if (t2 > 0) {
            this.applyGenerator(this.generators[e2], t2);
          }
        }
      }
    }
    class ie {
      constructor(e2, t2, s, i, a, r, n, o) {
        this.id = e2;
        this.name = t2;
        this.costType = s;
        this.basePrice = i;
        this.multi = a;
        this.produces = r;
        this.time = n;
        this.description = o;
        this.cap = 0;
      }
    }
    class CreatureFactory {
      constructor() {
        this.gameModel = GameModel.getInstance();
        this.spawnedSavedCreatures = false;
        this.types = {
          earthGolem: 1,
          airGolem: 2,
          fireGolem: 3,
          waterGolem: 4
        };
        this.creatures = [
          new Golem(
            1,
            this.types.earthGolem,
            "Earth Golem",
            3e3,
            75,
            30,
            800,
            "A golem born from rocks and mud, able to take a lot of punishment and taunt enemies to attack it"
          ),
          new Golem(
            2,
            this.types.airGolem,
            "Air Golem",
            1200,
            110,
            45,
            900,
            "A fast moving golem able to cover large distances and chase targets down"
          ),
          new Golem(
            3,
            this.types.fireGolem,
            "Fire Golem",
            1200,
            130,
            32,
            1e3,
            "A fireball spewing golem that ignites everything it touches"
          ),
          new Golem(
            4,
            this.types.waterGolem,
            "Water Golem",
            1500,
            90,
            30,
            1100,
            "A calming golem that restores health to nearby units"
          )
        ];
        this.creatureScaling = 1.75;
        this.creatureCostScaling = 1.9;
        this.creatureCostReduction = 1;
        if (CreatureFactory.instance) {
          return CreatureFactory.instance;
        }
        CreatureFactory.instance = this;
      }
      update(e2) {
        const t2 = new Creatures().creatureCount;
        for (let s = 0; s < this.creatures.length; s++) {
          if (this.creatures[s].building) {
            this.creatures[s].timeLeft -= e2;
            if (this.creatures[s].timeLeft < 0) {
              this.spawnCreature(this.creatures[s]), this.creatures[s].building = false;
            }
          } else if (t2[this.creatures[s].type] !== void 0 && t2[this.creatures[s].type] < this.creatures[s].autobuild) {
            this.startBuilding(this.creatures[s]);
          }
          if (this.gameModel.persistentData.creatureLevels[this.creatures[s].id]) {
            this.creatures[s].level = this.gameModel.persistentData.creatureLevels[this.creatures[s].id];
          }
        }
      }
      refundParts(e2, t2) {
        this.gameModel.persistentData.parts += e2.price * t2;
      }
      purchasePrice(e2) {
        return e2.baseCost * this.creatureCostScaling ** (e2.level - 1) * this.creatureCostReduction;
      }
      levelPrice(e2) {
        return e2.baseCost * this.creatureCostScaling ** e2.level * 5 * this.creatureCostReduction;
      }
      levelCreature(e2) {
        if (this.levelPrice(e2) < this.gameModel.persistentData.parts) {
          this.gameModel.persistentData.parts -= this.levelPrice(e2);
          e2.level++;
          this.gameModel.persistentData.creatureLevels[e2.id] = e2.level;
        }
      }
      canAffordCreature(e2) {
        return this.purchasePrice(e2) < this.gameModel.persistentData.parts;
      }
      creaturesBuildingCount() {
        let e2 = 0;
        for (let t2 = 0; t2 < this.creatures.length; t2++) {
          if (this.creatures[t2].building) {
            e2++;
          }
        }
        return e2;
      }
      startBuilding(e2) {
        if (!e2.building && this.canAffordCreature(e2) && this.creaturesBuildingCount() + this.gameModel.creatureCount < this.gameModel.creatureLimit) {
          e2.building = true;
          e2.timeLeft = e2.time;
          this.gameModel.persistentData.parts -= this.purchasePrice(e2);
        }
      }
      creatureAutoBuildNumber(e2, t2) {
        if (e2.autobuild + t2 >= 0) {
          e2.autobuild += t2;
          this.gameModel.persistentData.creatureAutobuild[e2.id] = e2.autobuild;
        }
      }
      updateAutoBuild() {
        for (let e2 = 0; e2 < this.creatures.length; e2++) {
          this.creatures[e2].autobuild = this.gameModel.persistentData.creatureAutobuild[this.creatures[e2].id] || 0;
        }
      }
      resetLevels() {
        for (let e2 = 0; e2 < this.creatures.length; e2++) {
          this.creatures[e2].level = 1;
        }
      }
      spawnCreature(e2) {
        const creatures = new Creatures();
        const health = e2.baseHealth * this.creatureScaling ** (e2.level - 1) * this.gameModel.golemHealthPCMod;
        const damage = e2.baseDamage * this.creatureScaling ** (e2.level - 1) * this.gameModel.golemDamagePCMod;
        creatures.spawnCreature(
          health,
          damage,
          e2.speed,
          e2.type,
          e2.level,
          this.purchasePrice(e2)
        );
      }
      spawnSavedCreatures() {
        if (!this.spawnedSavedCreatures) {
          let e2 = 0;
          for (let t2 = 0; t2 < this.gameModel.persistentData.savedCreatures.length; t2++) {
            e2++;
            if (e2 <= this.gameModel.creatureLimit) {
              const e3 = this.gameModel.persistentData.savedCreatures[t2];
              const s = this.creatures.filter((t3) => t3.type == e3.t)[0];
              s.level = e3.l;
              this.spawnCreature(s);
            }
          }
          this.spawnedSavedCreatures = true;
        }
      }
      creatureStats(e2) {
        return {
          thisLevel: {
            level: e2.level,
            health: e2.baseHealth * this.creatureScaling ** (e2.level - 1) * this.gameModel.golemHealthPCMod,
            damage: e2.baseDamage * this.creatureScaling ** (e2.level - 1) * this.gameModel.golemDamagePCMod,
            cost: e2.baseCost * this.creatureCostScaling ** (e2.level - 1)
          },
          nextLevel: {
            level: e2.level + 1,
            health: e2.baseHealth * this.creatureScaling ** e2.level * this.gameModel.golemHealthPCMod,
            damage: e2.baseDamage * this.creatureScaling ** e2.level * this.gameModel.golemDamagePCMod,
            cost: e2.baseCost * this.creatureCostScaling ** e2.level
          }
        };
      }
    }
    class Golem {
      id;
      /** {@link CreatureFactory.types} Enum*/
      type;
      name;
      baseHealth;
      baseDamage;
      speed;
      baseCost;
      description;
      constructor(id, type, name, baseHealth, baseDamage, speed, baseCost, description) {
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
    class GameModel {
      constructor() {
        this.storageName = "ZombieData";
        this.kongregate = null;
        this.playFabId = null;
        this.titleId = "772D8";
        this.hidden = false;
        this.autoShatter = false;
        this.energy = 0;
        this.energyMax = 10;
        this.energyRate = 1;
        this.brainsRate = 0;
        this.bonesRate = 0;
        this.endLevelBones = 0;
        this.energySpellMultiplier = 1;
        this.prestigePointsEarned = 0;
        this.zombieCost = 10;
        this.bonesPCMod = 1;
        this.partsPCMod = 1;
        this.bloodMax = 1e3;
        this.bloodPCMod = 1;
        this.bloodStorePCMod = 1;
        this.brainsMax = 50;
        this.brainsPCMod = 1;
        this.brainsStorePCMod = 1;
        this.zombieHealth = 100;
        this.zombieHealthPCMod = 1;
        this.HshellHealthPCMod = 1;
        this.CyroVatPCMod = 1;
        this.PlagueVatPCMod = 1;
        this.CloningRep1PCMod = 1;
        this.BloodSynPCMod = 1;
        this.SynBonePCMod = 1;
        this.SmolPartsPCMod = 1;
        this.AvionicsPCMod = 1;
        this.ShockPCMod = 1;
        this.EnergyCostMod = 0;
        this.zombieDamage = 10;
        this.zombieDamagePCMod = 1;
        this.HstrengthDmgPCMod = 1;
        this.zombieSpeed = 10;
        this.zombieCages = 0;
        this.zombiesInCages = 0;
        this.golemDamagePCMod = 1;
        this.golemHealthPCMod = 1;
        this.plagueDamageMod = 0;
        this.plagueticks = 2;
        this.graveyardHealthMod = 1;
        this.burningSpeedMod = 1;
        this.startingResources = 0;
        this.blastHealing = 0;
        this.plagueDmgReduction = 0;
        this.brainRecoverChance = 0;
        this.riseFromTheDeadChance = 0;
        this.infectedBiteChance = 0;
        this.infectedBlastChance = 0;
        this.spitDistance = 0;
        this.spikeDelay = 5;
        this.startTimer = 0;
        this.fenceRadius = 50;
        this.constructions = {};
        this.construction = 0;
        this.boneCollectorCapacity = 10;
        this.frameRate = 0;
        this.humanCount = 50;
        this.zombieCount = 0;
        this.creatureCount = 0;
        this.creatureLimit = 1;
        this.harpySpeed = 75;
        this.tankBuster = false;
        this.harpyBombs = 1;
        this.stats = null;
        this.runicSyphon = {
          percentage: 0,
          blood: 0,
          bones: 0,
          brains: 0
        };
        this.gigazombies = false;
        this.endLevelTimer = 3;
        this.endLevelDelay = 3;
        this.messageQueue = [];
        this.offlineMessage = "";
        this.runeEffects = {
          attackSpeed: 1,
          critChance: 0,
          critDamage: 0,
          damageReduction: 1,
          healthRegen: 0,
          damageReflection: 0
        };
        this.encodedContent = "";
        this.savefilename = "";
        this.autoUpgrades = false;
        this.autoconstruction = false;
        this.autoconstructionUnlocked = false;
        this.levelResourcesAdded = false;
        this.bulletproofChance = 0;
        this.gameSpeed = 1;
        this.level = 1;
        this.currentState = "startGame";
        this.states = {
          playingLevel: "playingLevel",
          levelCompleted: "levelCompleted",
          startGame: "startGame",
          prestiged: "prestiged",
          failed: "failed"
        };
        this.baseStats = {
          energyRate: 1,
          brainsRate: 0,
          bonesRate: 0,
          energyMax: 10,
          bloodMax: 1e3,
          brainsMax: 50,
          zombieCost: 10,
          zombieHealth: 100,
          zombieDamage: 10,
          zombieSpeed: 10,
          level: 1,
          graveyard: 0,
          construction: 0,
          boneCollectorCapacity: 10
        };
        this.zoom = zoom;
        this.centerGameContainer = centerGameContainer;
        this.lastSave = 0;
        this.lastPlayFabSave = Date.now() - 15e3;
        this.persistentData = {
          saveCreated: Date.now(),
          dateOfSave: Date.now(),
          autoStart: false,
          autoStartWait: true,
          autoSellGear: false,
          autoSellGearLegendary: false,
          levelUnlocked: 1,
          allTimeHighestLevel: 0,
          blood: 0,
          brains: 0,
          bones: 0,
          parts: 0,
          bonesTotal: 0,
          upgrades: [],
          constructions: [],
          prestigePointsEarned: 0,
          prestigePointsToSpend: 0,
          boneCollectors: 0,
          graveyardZombies: 1,
          harpies: 0,
          resolution: 1,
          zoomButtons: false,
          particles: true,
          generators: [],
          currentConstruction: null,
          creatureLevels: [],
          creatures: [],
          creatureAutobuild: [],
          savedCreatures: [],
          levelsCompleted: [],
          showfps: false,
          runeshatter: 0,
          runes: {
            life: {
              blood: 0,
              brains: 0,
              bones: 0
            },
            death: {
              blood: 0,
              brains: 0,
              bones: 0
            }
          },
          trophies: [],
          vipEscaped: [],
          autoRelease: false,
          autoMaxHarpies: false,
          skeleton: null,
          skeletonTalents: []
        };
      }
      static getInstance() {
        if (!GameModel.instance) {
          GameModel.instance = new GameModel();
          GameModel.instance.particles = new Particles();
          GameModel.instance.trophies = new Trophies();
          GameModel.instance.bones = new Bones();
          GameModel.instance.creatureFactory = new CreatureFactory();
          GameModel.instance.creatures = new Creatures();
          GameModel.instance.boneCollectors = new BoneCollectors();
          GameModel.instance.graveyard = new Graveyard();
          GameModel.instance.spells = new Spells();
          GameModel.instance.partFactory = new PartFactory();
          GameModel.instance.skeleton = new Skeleton();
          GameModel.instance.upgrades = new Upgrades();
          GameModel.instance.zombies = new Zombies();
          GameModel.instance.humans = new Humans();
          GameModel.instance.police = new Police();
          GameModel.instance.army = new Army();
        }
        return GameModel.instance;
      }
      resetToBaseStats() {
        this.energyRate = this.baseStats.energyRate;
        this.brainsRate = this.baseStats.brainsRate;
        this.bonesRate = this.baseStats.bonesRate;
        this.energyMax = this.baseStats.energyMax;
        this.bloodMax = this.baseStats.bloodMax;
        this.brainsMax = this.baseStats.brainsMax;
        this.zombieHealth = this.baseStats.zombieHealth;
        this.zombieDamage = this.baseStats.zombieDamage;
        this.zombieSpeed = this.baseStats.zombieSpeed;
        this.zombieCost = this.baseStats.zombieCost;
        this.zombieCages = 0;
        this.brainRecoverChance = 0;
        this.riseFromTheDeadChance = 0;
        this.infectedBiteChance = 0;
        this.infectedBlastChance = 0;
        this.construction = this.baseStats.construction;
        this.constructions = {};
        this.boneCollectorCapacity = this.baseStats.boneCollectorCapacity;
        this.bonesPCMod = 1;
        this.partsPCMod = 1;
        this.bloodPCMod = 1;
        this.bloodStorePCMod = 1;
        this.brainsPCMod = 1;
        this.brainsStorePCMod = 1;
        this.zombieHealthPCMod = 1;
        this.zombieDamagePCMod = 1;
        this.HshellHealthPCMod = 1;
        this.HstrengthDmgPCMod = 1;
        this.CyroVatPCMod = 1;
        this.PlagueVatPCMod = 1;
        this.CloningRep1PCMod = 1;
        this.BloodSynPCMod = 1;
        this.SynBonePCMod = 1;
        this.SmolPartsPCMod = 1;
        this.AvionicsPCMod = 1;
        this.ShockPCMod = 1;
        this.EnergyCostMod = 0;
        this.golemHealthPCMod = 1;
        this.golemDamagePCMod = 1;
        this.prest_multPCMod = 1;
        this.plagueDamageMod = 0;
        this.plagueticks = 2;
        this.burningSpeedMod = 1;
        this.startingResources = 0;
        this.fenceRadius = 50;
        this.SkeleMoveMod = 0;
        this.spitDistance = 0;
        this.spikeDelay = 5;
        this.blastHealing = 0;
        this.plagueDmgReduction = 1;
        this.creatureLimit = 1;
        this.runicSyphon.percentage = 0;
        this.autoconstructionUnlocked = false;
        this.autoUpgrades = false;
        this.graveyardHealthMod = 1;
        this.bulletproofChance = 0;
        this.gigazombies = false;
        this.harpySpeed = 75;
        this.tankBuster = false;
        this.harpyBombs = 1;
      }
      addEnergy(e2) {
        this.energy += e2;
        if (this.energy > this.energyMax) {
          this.energy = this.energyMax;
        }
      }
      addBlood(e2) {
        if (isNaN(this.persistentData.blood)) {
          this.persistentData.blood = 0;
        }
        if (!isNaN(e2)) {
          this.persistentData.blood += e2 * this.bloodPCMod;
          if (this.persistentData.blood > this.bloodMax) {
            this.persistentData.blood = this.bloodMax;
            if (this.constructions.runesmith && this.runicSyphon.percentage > 0) {
              this.runicSyphon.blood += e2 * this.bloodPCMod;
            }
          }
          if (this.runicSyphon.percentage > 0) {
            this.runicSyphon.blood += e2 * this.bloodPCMod * this.runicSyphon.percentage;
          }
        }
      }
      addBrains(e2) {
        if (isNaN(this.persistentData.brains)) {
          this.persistentData.brains = 0;
        }
        if (!isNaN(e2)) {
          this.persistentData.brains += e2 * this.brainsPCMod;
          if (this.persistentData.brains > this.brainsMax) {
            this.persistentData.brains = this.brainsMax, this.constructions.runesmith && this.runicSyphon.percentage > 0 && (this.runicSyphon.brains += e2 * this.brainsPCMod);
          }
          if (this.runicSyphon.percentage > 0) {
            this.runicSyphon.brains += e2 * this.brainsPCMod * this.runicSyphon.percentage;
          }
        }
      }
      addBones(e2) {
        if (isNaN(this.persistentData.bones)) {
          this.persistentData.bones = 0;
        }
        if (!isNaN(e2)) {
          this.persistentData.bones += e2 * this.bonesPCMod;
          this.persistentData.bonesTotal += e2 * this.bonesPCMod;
          if (this.runicSyphon.percentage > 0) {
            this.runicSyphon.bones += e2 * this.bonesPCMod * this.runicSyphon.percentage;
          }
        }
      }
      getHumanCount() {
        return this.humanCount;
      }
      getEnergyRate() {
        return this.energySpellMultiplier * this.energyRate - (this.persistentData.boneCollectors + this.persistentData.harpies);
      }
      update(e2, t2) {
        if (this.currentState != this.states.levelCompleted) {
          this.startTimer = 2;
        }
        if (this.persistentData.autoStartWait == false && this.currentState != this.states.levelCompleted) {
          this.startTimer = 0;
        }
        this.spells.updateSpells(e2);
        e2 *= this.gameSpeed;
        if (this.hidden) {
          U(e2, this.app);
        }
        this.partFactory.update(e2);
        this.autoRemoveCollectorsHarpies();
        this.addEnergy(this.getEnergyRate() * e2);
        if (this.currentState == this.states.playingLevel) {
          this.addBones(this.bonesRate * e2);
          this.addBrains(this.brainsRate * e2);
          this.upgrades.updateRunicSyphon(this.runicSyphon);
          if (this.lastSave + 3e4 < t2) {
            this.saveData();
            this.lastSave = t2;
          }
          if (this.lastPlayFabSave + 12e5 < t2) {
            this.saveToPlayFab();
          }
          if (this.getHumanCount() <= 0) {
            if (this.endLevelTimer < 0) {
              if (this.isBossStage(this.level) && this.trophies.doesLevelHaveTrophy(this.level)) {
                this.trophies.trophyAquired(this.level);
              }
              this.prestigePointsEarned = this.prestigePointsForLevel(this.level);
              this.currentState = this.states.levelCompleted;
              this.levelResourcesAdded = false;
              this.calculateEndLevelBones();
              this.calculateEndLevelZombieCages();
              if (!this.persistentData.levelsCompleted.includes(this.level)) {
                this.addPrestigePoints(this.prestigePointsForLevel(this.level));
                this.persistentData.levelsCompleted.push(this.level);
              }
              this.persistentData.levelUnlocked = this.level + 1;
              if (!this.persistentData.allTimeHighestLevel || this.level > this.persistentData.allTimeHighestLevel) {
                this.persistentData.allTimeHighestLevel = this.level;
                if (window.kongregate) {
                  window.kongregate.stats.submit(
                    "level",
                    this.persistentData.allTimeHighestLevel
                  );
                }
              }
            } else {
              this.endLevelTimer -= e2;
            }
          }
          this.upgrades.updateConstruction(e2);
          this.upgrades.updateAutoUpgrades();
          this.creatureFactory.update(e2);
        }
        if (this.currentState == this.states.levelCompleted) {
          this.startTimer -= e2;
        }
        if (this.startTimer < 0 && this.persistentData.autoStart) {
          this.startLevel(this.level);
        }
        if (this.currentState == this.states.levelCompleted && this.startTimer < 0) {
          this.nextLevel();
        }
        if (this.currentState == this.states.failed) {
          this.startTimer -= e2;
          if (this.startTimer < 0 && this.persistentData.autoStart) {
            this.startLevel(this.level);
          }
        }
        if (this.currentState == this.states.failed) {
          this.startTimer -= e2;
          if (this.startTimer < 0) {
            this.startLevel(this.level - 1);
          }
        }
        this.updateStats();
      }
      calculateEndLevelBones() {
        this.endLevelBones = 0;
        if (this.persistentData.boneCollectors > 0 && this.bones.uncollected) {
          this.endLevelBones = this.bones.uncollected.map((e2) => e2.value).reduce((e2, t2) => e2 + t2, 0), this.addBones(this.endLevelBones);
        }
      }
      calculateEndLevelZombieCages() {
        if (this.zombieCages > 0) {
          this.zombiesInCages += this.zombieCount;
          if (this.zombiesInCages > this.zombieCages) {
            this.zombiesInCages = this.zombieCages;
          }
        }
      }
      autoRemoveCollectorsHarpies() {
        if (this.getEnergyRate() < 0) {
          const e2 = this.getEnergyRate();
          if (this.persistentData.harpies > 0) {
            this.persistentData.harpies -= Math.ceil(Math.abs(e2));
            if (this.persistentData.harpies < 0) {
              this.persistentData.harpies = 0;
            }
          }
          if (this.getEnergyRate() < 0 && this.persistentData.boneCollectors > 0) {
            this.persistentData.boneCollectors--;
          }
        }
      }
      releaseCagedZombies() {
        if (this.currentState == this.states.playingLevel) {
          for (let e2 = 0; e2 < this.zombiesInCages; e2++)
            this.zombies.createZombie(
              this.graveyard.sprite.x,
              this.graveyard.sprite.y
            );
          this.zombiesInCages = 0;
        }
      }
      sacrificeCagedZombies() {
        this.addBlood(this.cagedZombieSacrificeValue().blood);
        this.addBrains(this.cagedZombieSacrificeValue().brains);
        this.addBones(this.cagedZombieSacrificeValue().bones);
        this.zombiesInCages = 0;
      }
      cagedZombieSacrificeValue() {
        return {
          blood: this.zombiesInCages * this.zombieHealth * 0.5,
          brains: this.zombiesInCages,
          bones: 3 * this.zombiesInCages
        };
      }
      setMaxHarpies() {
        let e2 = Math.floor(this.getEnergyRate() + this.persistentData.harpies);
        if (e2 >= 0 && e2 < this.persistentData.harpies || this.getEnergyRate() >= 1 && e2 > 0) {
          this.persistentData.harpies = e2;
        }
      }
      startLevel(e2) {
        this.level = e2;
        this.startGame();
      }
      startGame() {
        this.currentState = this.states.playingLevel;
        this.setupLevel();
        this.updatePlayingLevel();
        if (this.persistentData.autoRelease) {
          this.releaseCagedZombies();
        }
      }
      nextLevel() {
        this.level++;
        this.currentState = this.states.playingLevel;
        this.setupLevel();
        this.updatePlayingLevel();
        if (this.persistentData.autoRelease) {
          this.releaseCagedZombies();
        }
      }
      setupLevel() {
        this.endLevelTimer = this.endLevelDelay;
        N();
        this.particles.initialize();
        this.humans.populate();
        this.zombies.populate();
        this.graveyard.initialize();
        setTimeout(centerGameContainer, 10);
        this.upgrades.applyUpgrades();
        this.upgrades.updateRuneEffects();
        this.partFactory.applyGenerators();
        this.creatures.populate();
        this.skeleton.populate();
        this.addStartLevelResources();
        this.populateStats();
      }
      populateStats() {
        this.stats = {
          skeleton: {
            show: this.skeleton.persistent.skeletons > 0,
            health: 10 * this.zombieHealth,
            damage: 10 * this.zombieDamage,
            speed: this.skeleton.moveSpeed
          },
          zombie: {
            health: this.zombieHealth,
            damage: this.zombieDamage,
            speed: this.zombieSpeed
          },
          human: {
            health: this.humans.getMaxHealth(this.level),
            damage: this.humans.attackDamage,
            speed: this.humans.maxRunSpeed
          },
          police: {
            show: this.police.getMaxPolice() > 0,
            health: this.police.getMaxHealth(),
            damage: this.police.attackDamage,
            speed: this.police.maxRunSpeed
          },
          army: {
            show: this.army.getMaxArmy() > 0,
            health: this.army.getMaxHealth(),
            damage: this.army.attackDamage,
            speed: this.army.maxRunSpeed
          }
        };
      }
      updateStats() {
        if (this.stats) {
          this.stats.zombie.health = this.zombieHealth;
          this.stats.zombie.damage = this.zombieDamage;
          this.stats.zombie.speed = this.zombieSpeed;
          this.stats.zombie.count = this.zombieCount;
          this.stats.skeleton.health = 10 * this.zombieHealth;
          this.stats.skeleton.damage = 10 * this.zombieDamage;
          this.stats.skeleton.speed = this.skeleton.moveSpeed;
        }
      }
      vipEscaped() {
        if (!this.persistentData.vipEscaped) {
          this.persistentData.vipEscaped = [];
        }
        this.persistentData.vipEscaped.push(this.level);
        this.saveData();
      }
      updatePlayingLevel() {
        this.saveData();
      }
      addStartLevelResources() {
        this.energy = this.energyMax;
        if (!this.levelResourcesAdded) {
          this.persistentData.blood += 500 * this.startingResources;
          if (this.persistentData.blood > this.bloodMax) {
            this.persistentData.blood = this.bloodMax;
          }
          this.persistentData.brains += 50 * this.startingResources;
          if (this.persistentData.brains > this.brainsMax) {
            this.persistentData.brains = this.brainsMax;
          }
          this.persistentData.bones += 200 * this.startingResources;
          this.persistentData.bonesTotal += 200 * this.startingResources;
          this.levelResourcesAdded = true;
        }
      }
      onReady() {
        this.upgrades.upgradeIdCheck();
      }
      addPrestigePoints(e2) {
        if (this.persistentData.prestigePointsEarned === void 0) {
          this.persistentData.prestigePointsEarned = 0;
          this.persistentData.prestigePointsToSpend = 0;
        }
        this.persistentData.prestigePointsEarned += e2;
      }
      prestige() {
        if (this.persistentData.prestigePointsEarned > 0) {
          this.persistentData.levelUnlocked = 1;
          this.persistentData.autoUpgrades = [];
          this.persistentData.blood = 0;
          this.persistentData.brains = 0;
          this.persistentData.bones = 0;
          this.persistentData.parts = 0;
          this.persistentData.generators = [];
          this.persistentData.bonesTotal = 0;
          this.persistentData.upgrades = this.persistentData.upgrades.filter(
            (e2) => e2.costType == this.upgrades.costs.prestigePoints
          );
          this.persistentData.constructions = [];
          this.persistentData.boneCollectors = 0;
          this.persistentData.currentConstruction = false;
          this.persistentData.harpies = 0;
          this.persistentData.graveyardZombies = 1;
          this.persistentData.prestigePointsToSpend += this.persistentData.prestigePointsEarned;
          this.persistentData.prestigePointsEarned = 0;
          this.persistentData.runes = {
            life: { blood: 0, brains: 0, bones: 0 },
            death: { blood: 0, brains: 0, bones: 0 }
          };
          this.persistentData.vipEscaped = [];
          this.persistentData.creatureLevels = [];
          this.persistentData.creatureAutobuild = [];
          this.persistentData.levelsCompleted = [];
          this.persistentData.runeshatter = 0;
          this.zombiesInCages = 0;
          this.autoconstruction = false;
          this.levelResourcesAdded = false;
          this.gigazombies = false;
          this.runeEffects = {
            attackSpeed: 1,
            critChance: 0,
            critDamage: 0,
            damageReduction: 1,
            healthRegen: 0,
            damageReflection: 0
          };
          this.boneCollectors.update(0.1);
          this.partFactory.generatorsApplied = [];
          this.creatureFactory.updateAutoBuild();
          this.creatureFactory.resetLevels();
          this.level = 1;
          this.currentState = this.states.prestiged;
          this.skeleton.persistent.talentReset = true;
          this.setupLevel();
          this.saveData();
        }
      }
      saveData() {
        this.persistentData.dateOfSave = Date.now();
        try {
          localStorage.setItem(
            this.storageName,
            JSON.stringify(this.persistentData)
          ), localStorage.setItem(
            this.skeleton.storageName,
            JSON.stringify(this.skeleton.persistent)
          ), localStorage.setItem(
            this.skeleton.talentsStorageName,
            JSON.stringify(this.skeleton.talents)
          );
        } catch (e2) {
          console.log(e2);
        }
      }
      loadData() {
        try {
          if (localStorage.getItem(this.storageName) !== null) {
            this.persistentData = JSON.parse(
              localStorage.getItem(this.storageName)
            );
            this.level = this.persistentData.levelUnlocked;
            if (localStorage.getItem(this.skeleton.storageName) !== null) {
              this.skeleton.persistent = JSON.parse(
                localStorage.getItem(this.skeleton.storageName)
              );
              if (!("gearSetEquipped" in this.skeleton.persistent)) {
                this.skeleton.persistent.gearSetEquipped = -1;
              }
              if (!("gearSets" in this.skeleton.persistent)) {
                this.skeleton.persistent.gearSets = [];
              }
            } else {
              this.skeleton.persistent = {
                xpRate: 0,
                skeletons: 0,
                level: 1,
                xp: 0,
                items: [],
                gearSetEquipped: -1,
                gearSets: [],
                currItemId: 0,
                talentReset: false
              };
            }
            if (localStorage.getItem(this.skeleton.talentsStorageName) !== null) {
              this.skeleton.talents = JSON.parse(
                localStorage.getItem(this.skeleton.talentsStorageName)
              );
            } else {
              this.skeleton.talents = [];
            }
            this.updatePersistentData();
            this.calcOfflineProgress();
          }
        } catch (e2) {
          console.log(e2);
        }
      }
      calcOfflineProgress() {
        this.upgrades.applyUpgrades();
        this.upgrades.updateRuneEffects();
        this.partFactory.applyGenerators();
        if (this.constructions.partFactory) {
          const e2 = (Date.now() - this.persistentData.dateOfSave) / 1e3;
          const t2 = this.partFactory.updateLongTime(e2);
          if (t2 > 0) {
            this.offlineMessage = `Your factory has generated ${formatWhole(
              t2
            )} parts while you were away`;
            this.persistentData.parts += t2;
          }
        }
      }
      resetData() {
        try {
          localStorage.removeItem(this.storageName), localStorage.removeItem(this.skeleton.storageName), localStorage.removeItem(this.skeleton.talentsStorageName), this.saveToPlayFab(true);
        } catch (e2) {
          console.log(e2);
        }
      }
      updatePersistentData() {
        if (!this.persistentData.constructions) {
          this.persistentData.constructions = [];
        }
        if (!this.persistentData.generators) {
          this.persistentData.generators = [];
        }
        if (!this.persistentData.parts) {
          this.persistentData.parts = 0;
        }
        if (!this.persistentData.creatureLevels) {
          this.persistentData.creatureLevels = [];
        }
        if (!this.persistentData.creatureAutobuild) {
          this.persistentData.creatureAutobuild = [];
        }
        if (!this.persistentData.savedCreatures) {
          this.persistentData.savedCreatures = [];
        }
        if (!this.persistentData.levelsCompleted) {
          this.persistentData.levelsCompleted = [];
        }
        if (!this.persistentData.saveCreated) {
          this.persistentData.saveCreated = Date.now();
        }
        if (this.persistentData.particles === void 0) {
          this.persistentData.particles = true;
        }
        if (!this.persistentData.runeshatter) {
          this.persistentData.runeshatter = 0;
        }
        this.creatureFactory.updateAutoBuild();
      }
      sendMessage(e2) {
        if (!this.messageQueue.includes(e2)) {
          this.messageQueue.push(e2);
        }
      }
      setResolution(e2) {
        if (this.app) {
          this.app.renderer.resolution = e2;
          if (this.app.renderer.rootRenderTarget) {
            this.app.renderer.rootRenderTarget.resolution = e2;
          }
          this.app.renderer.plugins.interaction.resolution = e2;
          this.app.renderer.resize(
            document.body.clientWidth,
            document.body.clientHeight
          );
        }
      }
      downloadSaveGame() {
        this.persistentData.skeleton = this.skeleton.persistent;
        this.persistentData.skeletonTalents = this.skeleton.talents;
        this.blob = new Blob(
          [
            LZString.compressToEncodedURIComponent(
              JSON.stringify(this.persistentData)
            )
          ],
          {
            type: "octet/stream"
          }
        );
        delete this.persistentData.skeleton;
        this.encodedContent = window.URL.createObjectURL(this.blob);
        const e2 = (/* @__PURE__ */ new Date()).toISOString().replace(/:|T|Z|\./g, "");
        this.savefilename = `incremancer-${e2}.sav`;
      }
      importFile() {
        const e2 = document.getElementById("import-file").files;
        if (e2 && e2.length == 1) {
          const [t2] = e2;
          const s = new FileReader();
          const i = GameModel.getInstance();
          s.onload = (e3) => {
            const t3 = JSON.parse(
              LZString.decompressFromEncodedURIComponent(e3.target.result)
            );
            if (t3.dateOfSave) {
              if (t3.skeleton) {
                i.skeleton.persistent = t3.skeleton;
                delete t3.skeleton;
                if (!("gearSetEquipped" in i.skeleton.persistent)) {
                  i.skeleton.persistent.gearSetEquipped = -1;
                }
                if (!("gearSets" in i.skeleton.persistent)) {
                  i.skeleton.persistent.gearSets = [];
                }
              }
              if (t3.skeletonTalents) {
                i.skeleton.talents = t3.skeletonTalents;
                delete t3.skeletonTalents;
              } else {
                i.skeleton.talents = [];
              }
              i.persistentData = t3;
              i.updatePersistentData();
              i.saveToPlayFab();
              i.level = i.persistentData.levelUnlocked;
              i.creatureFactory.spawnedSavedCreatures = false;
              i.setupLevel();
            } else {
              alert("Error loading save game");
            }
          };
          s.readAsText(t2);
        }
      }
      toggleFullscreen() {
        if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
        } else {
          const document_body = document.body;
          if (document_body.requestFullscreen) {
            document_body.requestFullscreen();
          } else if (document_body.webkitRequestFullscreen) {
            document_body.webkitRequestFullscreen();
          } else if (document_body.mozRequestFullScreen) {
            document_body.mozRequestFullScreen();
          } else if (document_body.msRequestFullscreen) {
            document_body.msRequestFullscreen();
          }
        }
      }
      prestigePointsForLevel(e2) {
        return this.persistentData.levelsCompleted.includes(e2) ? 0 : e2;
      }
      bossCompleted(e2) {
        const t2 = 50 * Math.floor((e2 - 1) / 50);
        return t2 < 50 || this.persistentData.levelsCompleted.includes(t2);
      }
      levelLocked(e2) {
        return e2 > this.persistentData.allTimeHighestLevel + 1 || !this.bossCompleted(e2);
      }
      isBossStage(e2) {
        return e2 > 0 && e2 % 50 == 0;
      }
      levelInfo(e2) {
        return {
          level: e2,
          bossStage: this.isBossStage(e2),
          completed: this.persistentData.levelsCompleted.includes(e2),
          locked: this.levelLocked(e2),
          trophy: this.trophies.doesLevelHaveTrophy(e2)
        };
      }
      loginInUsingPlayFab() {
        if (window.kongregate) {
          try {
            PlayFab.settings.titleId = this.titleId;
            const e2 = {
              TitleId: PlayFab.settings.titleId,
              AuthTicket: window.kongregate.services.getGameAuthToken(),
              KongregateId: window.kongregate.services.getUserId(),
              CreateAccount: true
            };
            const t2 = this;
            PlayFabClientSDK.LoginWithKongregate(
              e2,
              (e3) => {
                if (e3 && e3.data && e3.data.PlayFabId) {
                  t2.playFabId = e3.data.PlayFabId;
                  t2.loadFromPlayFab();
                }
              },
              (e3) => {
                console.log(e3);
              }
            );
          } catch (e2) {
            console.error(e2);
          }
        }
      }
      saveToPlayFab(e2 = false) {
        this.lastPlayFabSave = Date.now();
        if (this.playFabId) {
          const t2 = this.persistentData.trophies;
          delete this.persistentData.trophies;
          const s = {
            TitleId: this.titleId,
            PlayFabId: this.playFabId,
            Data: {
              save: !e2 && LZString.compressToEncodedURIComponent(
                JSON.stringify(this.persistentData)
              ),
              trophies: !e2 && LZString.compressToEncodedURIComponent(JSON.stringify(t2)),
              skeleton: !e2 && LZString.compressToEncodedURIComponent(
                JSON.stringify(this.skeleton.persistent)
              ),
              talents: !e2 && LZString.compressToEncodedURIComponent(
                JSON.stringify(this.skeleton.talents)
              )
            }
          };
          this.persistentData.trophies = t2;
          try {
            const t3 = this;
            PlayFab.ClientApi.UpdateUserData(
              s,
              (s2) => {
                if (e2) {
                  t3.resetToBaseStats();
                  t3.setupLevel();
                  window.location.reload();
                } else {
                  t3.messageQueue.push("Game Saved to Cloud");
                }
              },
              (e3) => {
                console.log(e3);
              }
            );
          } catch (e3) {
            console.log(e3);
          }
        } else {
          if (e2) {
            this.resetToBaseStats();
            this.setupLevel();
            window.location.reload();
          }
        }
      }
      loadFromPlayFab(e2 = false) {
        if (this.playFabId) {
          const t2 = {
            TitleId: this.titleId,
            PlayFabId: this.playFabId,
            Keys: ["save", "trophies", "skeleton", "talents"]
          };
          try {
            const s = this;
            PlayFab.ClientApi.GetUserData(
              t2,
              (t3) => {
                if (t3.data.Data.save) {
                  const i = JSON.parse(
                    LZString.decompressFromEncodedURIComponent(
                      t3.data.Data.save.Value
                    )
                  );
                  if (e2 || i.saveCreated < s.persistentData.saveCreated || i.saveCreated == s.persistentData.saveCreated && i.dateOfSave > s.persistentData.dateOfSave) {
                    s.persistentData = i;
                    if (t3.data.Data.trophies) {
                      s.persistentData.trophies = JSON.parse(
                        LZString.decompressFromEncodedURIComponent(
                          t3.data.Data.trophies.Value
                        )
                      );
                    }
                    if (t3.data.Data.skeleton) {
                      s.skeleton.persistent = JSON.parse(
                        LZString.decompressFromEncodedURIComponent(
                          t3.data.Data.skeleton.Value
                        )
                      );
                    }
                    if (t3.data.Data.talents) {
                      s.skeleton.talents = JSON.parse(
                        LZString.decompressFromEncodedURIComponent(
                          t3.data.Data.talents.Value
                        )
                      );
                    } else {
                      s.skeleton.talents = [];
                    }
                    s.level = s.persistentData.levelUnlocked;
                    s.updatePersistentData();
                    s.calcOfflineProgress();
                    s.setupLevel();
                    s.messageQueue.push("Game Loaded from Cloud");
                  }
                }
              },
              (e3) => {
                console.log(e3);
              }
            );
          } catch (e3) {
            console.log(e3);
          }
        }
      }
      allowPlayFabAction() {
        return this.lastPlayFabSave + 15e3 < Date.now();
      }
    }
    class Upgrades {
      constructor() {
        this.gameModel = GameModel.getInstance();
        this.spells = new Spells();
        this.skeleton = new Skeleton();
        this.partFactory = new PartFactory();
        this.types = {
          energyRate: "energyRate",
          energyCap: "energyCap",
          damage: "damage",
          health: "health",
          speed: "speed",
          brainsRate: "brainsRate",
          bonesRate: "bonesRate",
          bloodCap: "bloodCap",
          brainsCap: "brainsCap",
          brainRecoverChance: "brainRecoverChance",
          riseFromTheDeadChance: "riseFromTheDeadChance",
          boneCollectorCapacity: "boneCollectorCapacity",
          construction: "construction",
          infectedBite: "infectedBite",
          infectedBlast: "infectedBlast",
          plagueDamage: "plagueDamage",
          plagueTicks: "plagueTicks",
          burningSpeedPC: "burningSpeedPC",
          unlockSpell: "unlockSpell",
          spitDistance: "spitDistance",
          blastHealing: "blastHealing",
          plagueArmor: "plagueArmor",
          monsterLimit: "monsterLimit",
          runicSyphon: "runicSyphon",
          gigazombies: "gigazombies",
          bulletproof: "bulletproof",
          harpySpeed: "harpySpeed",
          tankBuster: "tankBuster",
          harpyBombs: "harpyBombs",
          spikeDelay: "spikeDelay",
          bloodGainPC: "bloodGainPC",
          bloodStoragePC: "bloodStoragePC",
          brainsGainPC: "brainsGainPC",
          brainsStoragePC: "brainsStoragePC",
          bonesGainPC: "bonesGainPC",
          partsGainPC: "partsGainPC",
          zombieDmgPC: "zombieDmgPC",
          zombieHealthPC: "zombieHealthPC",
          HstrengthDmgPC: "HstrengthDmgPC",
          HshellHealthPC: "HshellHealthPC",
          CyroVatPC: "CyroVatPC",
          PlagueVatPC: "PlagueVatPC",
          CloningRep1PC: "CloningRep1PC",
          BloodSynPC: "BloodSynPC",
          SynBonePC: "SynBonePC",
          SmolPartsPC: "SmolPartsPC",
          AvionicsPC: "AvionicsPC",
          SkeleMove: "SkeleMove",
          ShockPC: "ShockPC",
          EnergyCost: "EnergyCost",
          golemHealthPC: "golemHealthPC",
          golemDamagePC: "golemDamagePC",
          prest_multPC: "prest_multPC",
          startingPC: "startingPC",
          energyCost: "energyCost",
          autoconstruction: "autoconstruction",
          autoshop: "autoshop",
          graveyardHealth: "graveyardHealth",
          talentPoint: "talentPoint"
        };
        this.costs = {
          energy: "energy",
          blood: "blood",
          brains: "brains",
          bones: "bones",
          prestigePoints: "prestigePoints",
          parts: "parts"
        };
        this.constructionStates = {
          building: "building",
          paused: "paused",
          autoPaused: "autoPaused"
        };
        this.constructionTickTimer = 1;
        this.angularModel = null;
        this.runeCalculations = [
          {
            rune: "death",
            effect: "attackSpeed",
            cost: "blood",
            logBase: 1.1,
            adjustment: -70,
            subtract: false,
            cap: 0
          },
          {
            rune: "death",
            effect: "critChance",
            cost: "brains",
            logBase: 1.3,
            adjustment: -20,
            cap: 0.8
          },
          {
            rune: "death",
            effect: "critDamage",
            cost: "bones",
            logBase: 1.05,
            adjustment: -100,
            cap: 0
          },
          {
            rune: "life",
            effect: "damageReduction",
            cost: "blood",
            logBase: 1.5,
            adjustment: -15,
            subtract: true,
            cap: 0.8
          },
          {
            rune: "life",
            effect: "healthRegen",
            cost: "brains",
            logBase: 2.9,
            adjustment: -5.5,
            cap: 0.5
          },
          {
            rune: "life",
            effect: "damageReflection",
            cost: "bones",
            logBase: 1.24,
            adjustment: -30,
            cap: 1
          }
        ];
        this.constructionTypes = {
          graveyard: "graveyard",
          crypt: "crypt",
          fort: "fort",
          fortress: "fortress",
          citadel: "citadel",
          fence: "fence",
          fenceSize: "fenceSize",
          plagueWorkshop: "plagueWorkshop",
          plagueLaboratory: "plagueLaboratory",
          plagueSpikes: "plagueSpikes",
          spellTower: "spellTower",
          runesmith: "runesmith",
          aviary: "aviary",
          zombieCage: "zombieCage",
          partFactory: "partFactory",
          monsterFactory: "monsterFactory",
          pit: "pit",
          harpy: "harpy",
          HybridLab: "HybridLab",
          AdvHybridLab: "AdvHybridLab",
          MiniAssembLine: "MiniAssembLine",
          TechThinkTank: "TechThinkTank"
        };
        this.constructionUpgrades = [
          new he(
            201,
            "Cursed Graveyard",
            this.constructionTypes.graveyard,
            {
              blood: 1800
            },
            30,
            1,
            1,
            1,
            null,
            "Construct a Cursed Graveyard in the town that will automatically spawn zombies when your energy is at its maximum!",
            "Graveyard menu now available!"
          ),
          new he(
            205,
            "Crypt",
            this.constructionTypes.crypt,
            {
              blood: 21e3,
              bones: 2220
            },
            60,
            1,
            1,
            1,
            201,
            "Construct a Crypt in your graveyard. This will give you a nice dark and quiet place to think. The additional space will also allow you to store 50% more blood and brains!",
            null
          ),
          new he(
            206,
            "Bone Fort",
            this.constructionTypes.fort,
            {
              blood: 6e4,
              bones: 6e3,
              energy: 60
            },
            60,
            1,
            1,
            1,
            205,
            "Turn your crypt into a fort. The additional space will also allow you to store 60% more blood and brains.",
            "New upgrades are available in the shop!"
          ),
          new he(
            207,
            "Bone Fortress",
            this.constructionTypes.fortress,
            {
              blood: 1e5,
              bones: 9e3,
              energy: 90
            },
            60,
            1,
            1,
            1,
            206,
            "Turn your fort into a fortress. The additional space will also allow you to store 70% more blood and brains.",
            null
          ),
          new he(
            211,
            "Bone Citadel",
            this.constructionTypes.citadel,
            {
              blood: 2e5,
              bones: 12e3,
              energy: 120
            },
            60,
            1,
            1,
            1,
            207,
            "Turn your fortress into a towering citadel that looms over the town. The additional space will also allow you to store 80% more blood and brains.",
            "New upgrades are available in the shop!"
          ),
          new he(
            202,
            "Perimeter Fence",
            this.constructionTypes.fence,
            {
              bones: 880,
              energy: 22
            },
            44,
            1,
            1,
            1,
            201,
            "Build a protective fence around the graveyard that will reduce damage taken by zombies inside by 50%.",
            null
          ),
          new he(
            203,
            "Bigger Fence",
            this.constructionTypes.fenceSize,
            {
              bones: 880,
              energy: 22
            },
            44,
            1,
            10,
            5,
            202,
            "Enlarge the fence so a greater area is protected.",
            null
          ),
          new he(
            204,
            "Plague Workshop",
            this.constructionTypes.plagueWorkshop,
            {
              blood: 10200,
              brains: 600
            },
            60,
            1,
            1,
            1,
            205,
            "Build a laboratory to study the effects of plague. This will unlock new upgrades in the shop.",
            "Plague upgrades now available!"
          ),
          new he(
            208,
            "Plague Spikes",
            this.constructionTypes.plagueSpikes,
            {
              brains: 3e3,
              bones: 1e3
            },
            30,
            1,
            1,
            1,
            204,
            "Booby trap the area around your graveyard with cruel spikes that infect trespassing humans with the plague.",
            null
          ),
          new he(
            209,
            "Spell Tower",
            this.constructionTypes.spellTower,
            {
              brains: 3e3,
              blood: 3e4
            },
            30,
            1,
            1,
            1,
            206,
            "Dedicate one tower of your fort to the study of spellcraft. Perhaps you can learn some new spells?",
            "Spells now available in the shop!"
          ),
          new he(
            210,
            "Runesmith",
            this.constructionTypes.runesmith,
            {
              bones: 3e3,
              blood: 12e4,
              brains: 1e3
            },
            30,
            1,
            1,
            1,
            207,
            "Build a runesmith's workshop in order to fortify your zombies with powerful runes.",
            null
          ),
          new he(
            212,
            "Accursed Aviary",
            this.constructionTypes.aviary,
            {
              bones: 6e3,
              blood: 22e4,
              brains: 2e3
            },
            60,
            1,
            1,
            1,
            211,
            "Construct an aviary on top of your citadel so you can release wicked harpies to bomb the townspeople.",
            "Harpies available for hire in the graveyard menu"
          ),
          new he(
            213,
            "Zombie Cage",
            this.constructionTypes.zombieCage,
            {
              bones: 600,
              blood: 900
            },
            30,
            1,
            5,
            1,
            201,
            "Build a cage to contain surplus zombies once a town is defeated.",
            null
          ),
          new he(
            214,
            "Second Zombie Cage",
            this.constructionTypes.zombieCage,
            {
              bones: 1200,
              blood: 1800
            },
            30,
            1,
            10,
            1,
            205,
            "Build an additional cage to contain surplus zombies once a town is defeated.",
            null
          ),
          new he(
            215,
            "Third Zombie Cage",
            this.constructionTypes.zombieCage,
            {
              bones: 1800,
              blood: 2700
            },
            30,
            1,
            10,
            1,
            206,
            "Build an additional cage to contain surplus zombies once a town is defeated.",
            null
          ),
          new he(
            216,
            "Fourth Zombie Cage",
            this.constructionTypes.zombieCage,
            {
              bones: 2400,
              blood: 3600
            },
            30,
            1,
            10,
            1,
            207,
            "Build an additional cage to contain surplus zombies once a town is defeated.",
            null
          ),
          new he(
            217,
            "Fifth Zombie Cage",
            this.constructionTypes.zombieCage,
            {
              bones: 3e3,
              blood: 4500
            },
            30,
            1,
            15,
            1,
            211,
            "Build an additional cage to contain surplus zombies once a town is defeated.",
            null
          ),
          new he(
            218,
            "Plague Laboratory",
            this.constructionTypes.plagueLaboratory,
            {
              brains: 25e3,
              blood: 1e6
            },
            50,
            1,
            1,
            1,
            211,
            "Expand the plague workshop into a well equipped laboratory in order to unlock additional plague upgrades.",
            null
          ),
          new he(
            219,
            "Part Factory",
            this.constructionTypes.partFactory,
            {
              brains: 35e3,
              blood: 15e6
            },
            50,
            1,
            1,
            1,
            218,
            "Build a factory to create parts that can be used to construct more powerful beings for your army.",
            "Factory menu now available!"
          ),
          new he(
            220,
            "Creature Factory",
            this.constructionTypes.monsterFactory,
            {
              brains: 45e3,
              blood: 4e7
            },
            50,
            1,
            1,
            1,
            219,
            "Build a factory to turn creature parts into living entities of destruction",
            "Creatures now available in factory menu!"
          ),
          new he(
            221,
            "Bottomless Pit",
            this.constructionTypes.pit,
            {
              bones: 75e3,
              parts: 5e6
            },
            50,
            1,
            1,
            10,
            219,
            "A bottomless pit with walls made from creature parts. Drastically increases your capacity to store blood and brains.",
            null
          ),
          new he(
            222,
            "Harpy Outfitter",
            this.constructionTypes.harpy,
            {
              bones: 75e3,
              brains: 75e3,
              blood: 8e7
            },
            50,
            1,
            1,
            1,
            220,
            "Build an outfitter to upgrade the abilities of your harpies.",
            "Harpy upgrades now available in the shop!"
          ),
          new he(
            301,
            "Hybrid Laboratory",
            this.constructionTypes.HybridLab,
            {
              bones: 75e6,
              parts: 9e12
            },
            240,
            1,
            1,
            1,
            222,
            "Build a new laboratory to unlock the potential of Zombie-Golem Hybrids.  Deep storage tanks for Blood and Brains are needed for research, doubling storage",
            "New upgrades are available in the shop!"
          ),
          new he(
            302,
            "Advanced Hybrid Laboratory",
            this.constructionTypes.AdvHybridLab,
            {
              bones: 75e8,
              parts: 7e13
            },
            240,
            1,
            1,
            1,
            301,
            "Build an advanced laboratory to further unlock the secrets of Zombie-Golem Hybridization. Even deeper storage tanks for Blood and Brains are needed for research. Doubles storage",
            "New upgrades are available in the shop!"
          ),
          new he(
            303,
            "Miniturized Assembly Lines",
            this.constructionTypes.MiniAssembLine,
            {
              bones: 75e10,
              parts: 4e16
            },
            240,
            1,
            1,
            1,
            302,
            "Build a new way to create everything faster!  How deep can these storage tanks go? Doubles storage.",
            "New upgrades are available in the shop!"
          ),
          new he(
            304,
            "Technical Think Tank",
            this.constructionTypes.TechThinkTank,
            {
              bones: 75e12,
              parts: 1e18
            },
            240,
            1,
            1,
            1,
            303,
            "Using all these stored brains allows us to harness their raw computational power for even more innovations!  Storage tanks resting on bedrock is as far as we can go, doubling storage",
            "New upgrades are available in the shop!"
          )
        ];
        this.upgrades = [
          new le(
            1,
            "Bloodthirst",
            this.types.damage,
            this.costs.blood,
            50,
            1.2,
            1,
            40,
            "Your zombies thirst for blood and do +1 damage for each rank of Bloodthirst.",
            null,
            null
          ),
          new le(
            9,
            "Sharpened Teeth",
            this.types.damage,
            this.costs.blood,
            3e3,
            1.23,
            3,
            50,
            "Your zombies bites do +3 damage with each rank of Sharpened Teeth.",
            null,
            206
          ),
          new le(
            11,
            "Razor Claws",
            this.types.damage,
            this.costs.blood,
            28e3,
            1.25,
            5,
            0,
            "Your zombies attacks do +5 damage with each rank of Razor Claws.",
            null,
            211
          ),
          new le(
            16,
            "Killer Instinct",
            this.types.damage,
            this.costs.blood,
            1e6,
            1.27,
            8,
            0,
            "Your zombies attacks do +8 damage with each rank of Killer Instinct.",
            null,
            220
          ),
          new le(
            2,
            "Like Leather",
            this.types.health,
            this.costs.blood,
            100,
            1.2,
            10,
            40,
            "Your zombies gain tougher skin and +10 health with each rank.",
            null,
            null
          ),
          new le(
            10,
            "Thick Skull",
            this.types.health,
            this.costs.blood,
            5e3,
            1.23,
            25,
            50,
            "Your zombies gain +25 health with each rank.",
            null,
            206
          ),
          new le(
            12,
            "Battle Hardened",
            this.types.health,
            this.costs.blood,
            32e3,
            1.25,
            40,
            0,
            "Your zombies gain +40 health with each rank of Battle Hardened.",
            null,
            211
          ),
          new le(
            17,
            "Tough as Nails",
            this.types.health,
            this.costs.blood,
            1e6,
            1.27,
            100,
            0,
            "Your zombies gain +100 health with each rank of Tough as Nails.",
            null,
            220
          ),
          new le(
            3,
            "Cold Storage",
            this.types.brainsCap,
            this.costs.blood,
            150,
            1.2,
            50,
            20,
            "Turns out you can use all of your spare blood to store brains and keep them fresh. Each rank increases your maximum brain capacity by 50.",
            null,
            null
          ),
          new le(
            4,
            "Recycling is Cool",
            this.types.brainRecoverChance,
            this.costs.blood,
            1e3,
            1.2,
            0.1,
            10,
            "Why are we wasting so many good brains on this project? Each rank increases your chance to get a brain back from a dead zombie by 10%",
            null,
            null
          ),
          new le(
            5,
            "Your Soul is Mine!",
            this.types.riseFromTheDeadChance,
            this.costs.blood,
            1500,
            1.4,
            0.1,
            10,
            "Using your most powerful blood magic you command the bodies of the dead to rise as your servants! Each rank grants 10% chance that dead humans will turn into zombies.",
            null,
            null
          ),
          new le(
            6,
            "Infected Bite",
            this.types.infectedBite,
            this.costs.blood,
            3500,
            1.4,
            0.1,
            10,
            "Your zombies are now infected with plague and could infect their victims too. Each rank adds 10% chance to inflict damage over time when a zombie attacks a target.",
            null,
            204
          ),
          new le(
            7,
            "Detonate",
            this.types.unlockSpell,
            this.costs.blood,
            25e3,
            1,
            3,
            1,
            "Learn the Detonate spell which can explode all of your zombies into a cloud of plague. Not exactly sure how useful that will be.",
            "New spell learned, Detonate!",
            209
          ),
          new le(
            8,
            "Gigazombies?",
            this.types.unlockSpell,
            this.costs.blood,
            5e4,
            1,
            5,
            1,
            "Learn the Gigazombies spell which will turn some of your zombies into hulking monstrosities with increased health and damage.",
            "New spell learned, Gigazombies!",
            209
          ),
          new le(
            13,
            "Blazing Speed",
            this.types.burningSpeedPC,
            this.costs.blood,
            3e4,
            1.25,
            0.05,
            10,
            "The humans are using torches to set your zombies on fire. Perhaps we can turn the tables on them? Each rank increases the movement and attack speed of burning zombies by 5%",
            null,
            207
          ),
          new le(
            14,
            "Spit it Out",
            this.types.spitDistance,
            this.costs.blood,
            5e5,
            1.8,
            5,
            15,
            "The first rank gives your zombies the ability to spit plague at enemies beyond normal attack range. Spit attacks do 50% zombie damage and infect the victim with plague. Subsequent ranks will increase the range of spit attacks.",
            null,
            218
          ),
          new le(
            15,
            "Runic Syphon",
            this.types.runicSyphon,
            this.costs.blood,
            34e3,
            1.9,
            0.01,
            10,
            "Infuse your runes for free! Each rank gives your Runesmith the ability to infuse 1% of your resource income, without consuming it. Additionally when blood and brains reach their storage limit, any additional resources will be infused automatically.",
            null,
            210
          ),
          new le(
            19,
            "Faster Harpies",
            this.types.harpySpeed,
            this.costs.blood,
            1e8,
            1.07,
            2,
            20,
            "These harpies are way too slow! We have to make them faster. Each rank increases harpy speed by 2",
            null,
            222
          ),
          new le(
            20,
            "Energy Rush",
            this.types.energyRate,
            this.costs.brains,
            20,
            1.8,
            0.5,
            20,
            "Melting brains down in your cauldron to make smoothies can be beneficial for your health. It also increases your energy rate by 0.5 per second for each rank.",
            null,
            null
          ),
          new le(
            21,
            "Master Summoner",
            this.types.energyCap,
            this.costs.brains,
            10,
            1.5,
            5,
            20,
            "All the brains you harvested have proved fruitful in your experiments. Each rank raises your maximum energy by 5.",
            null,
            null
          ),
          new le(
            22,
            "Primal Reflexes",
            this.types.speed,
            this.costs.brains,
            5,
            1.6,
            1,
            20,
            "The zombies retain more of their human agility increasing run speed by 1 for each rank.",
            null,
            null
          ),
          new le(
            23,
            "Blood Harvest",
            this.types.bloodStoragePC,
            this.costs.brains,
            50,
            1.12,
            0.1,
            0,
            "All this brain power has enabled you to devise some superior blood storage methods. Each rank increases your maximum blood by 10%.",
            null,
            null
          ),
          new le(
            24,
            "Unholy Construction",
            this.types.construction,
            this.costs.brains,
            25,
            1,
            1,
            1,
            "Learn the art of Unholy Construction in order to build structures that will solidify your foothold on the town.",
            "Construction menu now available!",
            null
          ),
          new le(
            25,
            "Infected Corpse",
            this.types.infectedBlast,
            this.costs.brains,
            500,
            1.4,
            0.1,
            10,
            "Fill your zombies with so much plague they are ready to explode! Each rank adds 10% chance for a zombie to explode into a cloud of plague upon death.",
            null,
            204
          ),
          new le(
            26,
            "Energy Charge",
            this.types.unlockSpell,
            this.costs.brains,
            2e3,
            1,
            2,
            1,
            "Learn the Energy Charge spell which can drastically increase your energy rate for a short time.",
            "New spell learned, Energy Charge!",
            209
          ),
          new le(
            27,
            "What Doesn't Kill You",
            this.types.blastHealing,
            this.costs.brains,
            1e4,
            1.3,
            0.1,
            20,
            "Plague explosions from zombies and harpies will also heal nearby zombies for 10% of the explosion damage with each rank.",
            null,
            218
          ),
          new le(
            28,
            "One is Never Enough",
            this.types.monsterLimit,
            this.costs.brains,
            2e4,
            1.2,
            1,
            15,
            "We're definitely going to need more than one golem to finish the job. Each rank increases your creature limit by 1",
            null,
            220
          ),
          new le(
            29,
            "Tank Buster",
            this.types.tankBuster,
            this.costs.brains,
            4e5,
            1.2,
            1,
            1,
            "Teach your harpies some new tricks. Once bought this upgrade will make your harpies drop fire bombs on tanks during boss stages.",
            null,
            222
          ),
          new le(
            30,
            "Improved Spikes",
            this.types.spikeDelay,
            this.costs.brains,
            800,
            1.2,
            1,
            4,
            "Each rank reduces the delay between plague spike activation by 20%",
            null,
            208
          ),
          new le(
            40,
            "Bone Throne",
            this.types.energyCap,
            this.costs.bones,
            50,
            1.55,
            10,
            15,
            "Sitting atop your throne of bones you can finally think clearly. Each rank increases maximum energy by 10.",
            null,
            null
          ),
          new le(
            41,
            "Crown of Bones",
            this.types.energyRate,
            this.costs.bones,
            200,
            1.5,
            0.2,
            25,
            "Not just dapper, these spikes help channel your energy. Each rank increases energy rate by 0.2 per second.",
            null,
            null
          ),
          new le(
            42,
            "Bonebarrows",
            this.types.boneCollectorCapacity,
            this.costs.bones,
            300,
            1.2,
            5,
            20,
            "Your bone collectors are struggling to carry all these bones. Maybe it's time we gave them an upgrade? Each rank increases their carrying capacity by 5.",
            null,
            null
          ),
          new le(
            43,
            "Bone Reinforced Tanks",
            this.types.bloodCap,
            this.costs.bones,
            500,
            1.07,
            2e3,
            0,
            "Finally! Now that we have a solid construction material we can get to work building better storage for our other resources. Each rank increases blood storage by 2000.",
            null,
            null
          ),
          new le(
            44,
            "Brain Cage",
            this.types.brainsCap,
            this.costs.bones,
            650,
            1.07,
            500,
            0,
            "There's nothing I love more than a mind enslaved. Now we can put these brains where they belong. In cages! Each rank increases brain storage by 500.",
            null,
            null
          ),
          new le(
            45,
            "Earth Freeze",
            this.types.unlockSpell,
            this.costs.bones,
            5e3,
            1,
            4,
            1,
            "Learn the Earth Freeze spell which can freeze all humans in place for a short time.",
            "New spell learned, Earth Freeze!",
            209
          ),
          new le(
            46,
            "Plague Armor",
            this.types.plagueArmor,
            this.costs.bones,
            15e3,
            1.6,
            0.02,
            10,
            "The best defense is a good offense? True in the case of Plague Armor which reduces the damage done by infected humans by 2% per rank.",
            null,
            218
          ),
          new le(
            47,
            "Bulletproof",
            this.types.bulletproof,
            this.costs.bones,
            6e4,
            1.6,
            0.05,
            15,
            "Craft your earth golems from much harder stone. Each rank gives them 5% chance to reflect bullets back to their source.",
            null,
            220
          ),
          new le(
            48,
            "Bombs Away",
            this.types.harpyBombs,
            this.costs.bones,
            5e5,
            1.6,
            1,
            3,
            "Upgrade your harpies so they can carry more than just one bomb at a time.",
            null,
            222
          ),
          new le(
            60,
            "Extra Limbs",
            this.types.golemDamagePC,
            this.costs.parts,
            900,
            1.3,
            0.02,
            0,
            "Your golems gain +2% damage with each rank of Extra Limbs.",
            null,
            220
          ),
          new le(
            61,
            "Big Boned",
            this.types.golemHealthPC,
            this.costs.parts,
            1e3,
            1.31,
            0.02,
            0,
            "Your golems gain +2% health with each rank of Big Boned.",
            null,
            220
          ),
          new le(
            62,
            "Hybrid Strength",
            this.types.HstrengthDmgPC,
            this.costs.parts,
            1e3,
            1.3,
            0.01,
            0,
            "Animating Golem parts fused with zombie flesh creates a terrifyingly strong Hybrid. Your zombies gain +1% damage with each rank of Hybrid Strength.",
            null,
            301
          ),
          new le(
            63,
            "Hybrid Shell",
            this.types.HshellHealthPC,
            this.costs.parts,
            1e3,
            1.31,
            0.01,
            0,
            "Golem armor shell provides extra protection for your fleshy zombies. Your zombies gain +1% health with each rank of Hybrid Shell.",
            null,
            301
          ),
          new le(
            64,
            "Advanced Cyrogenic Vats",
            this.types.CyroVatPC,
            this.costs.parts,
            1e3,
            1.4,
            0.1,
            0,
            "Cooling these Brains further makes them last much longer. Your brain storage increases +10% with each rank of Advanced Cyrogenic Vats.",
            null,
            302
          ),
          new le(
            65,
            "Golem Part Plague Vats",
            this.types.PlagueVatPC,
            this.costs.brains,
            1e3,
            1.35,
            0.01,
            0,
            "Using specialized Golem Parts allows for advancements in plague research. Plague Damage increases +1% with each rank of Golem Part Plague Vats.",
            null,
            302
          ),
          new le(
            66,
            "Cloning Replicator",
            this.types.CloningRep1PC,
            this.costs.parts,
            1e12,
            1.26,
            0.05,
            0,
            "Mass produced Cloning Replicators allows for much greater use out of each Brain obtained. Brain Income increases +5% with each rank of Cloning Replicator.",
            null,
            303
          ),
          new le(
            67,
            "Blood Synthezizer",
            this.types.BloodSynPC,
            this.costs.parts,
            2e12,
            1.25,
            0.05,
            0,
            "Artificial Blood can augment what we already get allowing for more of everything. Blood Income increases +5% with each rank of Blood Synthesizer.",
            null,
            303
          ),
          new le(
            68,
            "Synthetic Bone Fabricator",
            this.types.SynBonePC,
            this.costs.parts,
            3e12,
            1.24,
            0.05,
            0,
            "Synthetic Bones made from Golem Parts?  Genius! Bone Income increases +5% with each rank of Synthetic Bone Fabricator.",
            null,
            303
          ),
          new le(
            69,
            "Insectoid Parts Assemblers",
            this.types.SmolPartsPC,
            this.costs.parts,
            4e12,
            1.23,
            0.05,
            0,
            "Insect sized and shaped assemblers are far more efficient at maufacturing Golem parts. Parts Income increases +5% with each rank of Insectoid Parts Assemblers.",
            null,
            303
          ),
          new le(
            70,
            "Golem Avionic",
            this.types.AvionicsPC,
            this.costs.parts,
            2e17,
            1.2,
            2,
            50,
            "Building on the success of hybrid zombies, small golem parts can enhance Harpy-Golem Hybrids. Harpy Speed +2 with each rank of Golem Avionics.",
            null,
            304
          ),
          new le(
            71,
            "Electro-Shock Collars",
            this.types.ShockPC,
            this.costs.parts,
            3e14,
            1.2,
            25e-4,
            0,
            "Using shock collars tuned to the Hybrid Zombie's nervous system causes them to attack at blinding speeds! Attack Speed +0.25% with each rank of Electro-Shock Collars.",
            null,
            304
          ),
          new le(
            72,
            "Power Regulators",
            this.types.EnergyCost,
            this.costs.parts,
            1e18,
            1.2,
            1,
            30,
            "Golem parts assembled around the graveyard can help regulate and attune necrotic power. Reduces zombie summoning cost by 1 with each rank of Power Regulators.",
            null,
            304
          ),
          new le(
            73,
            "Sephirin's Reputation",
            this.types.prest_multPC,
            this.costs.blood,
            1e20,
            1.25,
            0.03,
            0,
            "Astounding levels of blood sacrificed can enhance your reputation with dark entities in the Void. +3% Zombie Heatlh and Damage per rank",
            null,
            304
          ),
          new le(
            74,
            "Strider's Mathemagics",
            this.types.SkeleMove,
            this.costs.parts,
            1e18,
            6,
            1,
            10,
            "Using Archane Mathemagics you imbue your Skeleton Champion with golem based ligaments. +1 Movement Speed per rank.(In testing)",
            null,
            304
          )
        ];
        this.prestigeUpgrades = [
          new le(
            108,
            "A Small Investment",
            this.types.startingPC,
            this.costs.prestigePoints,
            10,
            1.25,
            1,
            0,
            "Each rank gives you an additional 500 blood, 50 brains, and 200 bones when starting a new level.",
            null,
            null
          ),
          new le(
            109,
            "Time Warp",
            this.types.unlockSpell,
            this.costs.prestigePoints,
            50,
            1,
            1,
            1,
            "Unlock the Time Warp spell in order to speed up the flow of time.",
            null,
            null
          ),
          new le(
            110,
            "Master of Death",
            this.types.energyCost,
            this.costs.prestigePoints,
            1e3,
            1,
            1,
            5,
            "Each rank reduces the energy cost of summoning a zombie by 1",
            null,
            null
          ),
          new le(
            101,
            "Blood Storage",
            this.types.bloodStoragePC,
            this.costs.prestigePoints,
            10,
            1.25,
            0.2,
            0,
            "Additional 20% blood storage for each rank.",
            null,
            null
          ),
          new le(
            102,
            "Blood Rate",
            this.types.bloodGainPC,
            this.costs.prestigePoints,
            10,
            1.25,
            0.2,
            0,
            "Additional 20% blood income rate for each rank.",
            null,
            null
          ),
          new le(
            103,
            "Brain Storage",
            this.types.brainsStoragePC,
            this.costs.prestigePoints,
            10,
            1.25,
            0.2,
            0,
            "Additional 20% brain storage for each rank.",
            null,
            null
          ),
          new le(
            104,
            "Brain Rate",
            this.types.brainsGainPC,
            this.costs.prestigePoints,
            10,
            1.25,
            0.2,
            0,
            "Additional 20% brain income rate for each rank.",
            null,
            null
          ),
          new le(
            105,
            "Bone Rate",
            this.types.bonesGainPC,
            this.costs.prestigePoints,
            10,
            1.25,
            0.2,
            0,
            "Additional 20% bones income rate for each rank.",
            null,
            null
          ),
          new le(
            111,
            "Parts Rate",
            this.types.partsGainPC,
            this.costs.prestigePoints,
            10,
            1.25,
            0.2,
            0,
            "Additional 20% creature parts income rate for each rank.",
            null,
            null
          ),
          new le(
            112,
            "Auto Construction",
            this.types.autoconstruction,
            this.costs.prestigePoints,
            250,
            1,
            1,
            1,
            "Unlock the ability to automatically start construction of the cheapest available building option.",
            null,
            null
          ),
          new le(
            114,
            "Auto Shop",
            this.types.autoshop,
            this.costs.prestigePoints,
            250,
            1,
            1,
            1,
            "Unlock the ability to automatically purchase items from the shop.",
            null,
            null
          ),
          new le(
            113,
            "Graveyard Health",
            this.types.graveyardHealth,
            this.costs.prestigePoints,
            10,
            1.25,
            0.1,
            0,
            "Additional 10% graveyard health during boss levels with each rank.",
            null,
            null
          ),
          new le(
            115,
            "Talent Point",
            this.types.talentPoint,
            this.costs.prestigePoints,
            100,
            1.175,
            1,
            0,
            "Additional skeleton talent point",
            null,
            null
          )
        ];
        if (Upgrades.instance) {
          return Upgrades.instance;
        }
        Upgrades.instance = this;
      }
      hasRequirement(e2) {
        return !e2.requires || this.gameModel.persistentData.constructions.filter(
          (t2) => t2.id == e2.requires
        ).length != 0;
      }
      getUpgrades(e2) {
        switch (e2) {
          case this.costs.blood:
          case this.costs.brains:
          case this.costs.bones:
          case this.costs.parts: {
            return this.upgrades.filter(
              (t2) => t2.costType == e2 && (t2.cap == 0 || this.currentRank(t2) < t2.cap) && this.hasRequirement(t2)
            );
          }
          case "completed": {
            return this.upgrades.filter(
              (e3) => e3.cap > 0 && this.currentRank(e3) >= e3.cap
            );
          }
        }
      }
      applyUpgrades() {
        this.gameModel.resetToBaseStats();
        this.spells.lockAllSpells();
        for (let e3 = 0; e3 < this.gameModel.persistentData.upgrades.length; e3++) {
          if (!t) {
            t = this.prestigeUpgrades.filter(
              (t2) => t2.id == this.gameModel.persistentData.upgrades[e3].id
            )[0];
          }
          if (t) {
            this.applyUpgrade(t, this.gameModel.persistentData.upgrades[e3].rank);
          }
        }
        for (let e3 = 0; e3 < this.gameModel.persistentData.constructions.length; e3++) {
          this.applyConstructionUpgrade(
            this.gameModel.persistentData.constructions[e3]
          );
        }
        const e2 = new Trophies().getAquiredTrophyList();
        for (let t2 = 0; t2 < e2.length; t2++) {
          this.applyUpgrade(e2[t2], e2[t2].rank);
        }
        this.skeleton.applyUpgrades();
        this.gameModel.bloodMax *= this.gameModel.bloodStorePCMod;
        this.gameModel.brainsMax *= this.gameModel.brainsStorePCMod;
        this.gameModel.zombieDamage *= this.gameModel.zombieDamagePCMod;
        this.gameModel.zombieHealth *= this.gameModel.zombieHealthPCMod;
        if (this.gameModel.persistentData.runeshatter) {
          this.gameModel.zombieDamage *= this.shatterEffect();
          this.gameModel.zombieHealth *= this.shatterEffect();
          this.gameModel.zombieCost += this.gameModel.persistentData.runeshatter;
        }
      }
      applyUpgrade(e2, t2) {
        switch (e2.type) {
          case this.types.energyRate: {
            return void (this.gameModel.energyRate += e2.effect * t2);
          }
          case this.types.brainsRate: {
            return void (this.gameModel.brainsRate += e2.effect * t2);
          }
          case this.types.bonesRate: {
            return void (this.gameModel.bonesRate += e2.effect * t2);
          }
          case this.types.energyCap: {
            return void (this.gameModel.energyMax += e2.effect * t2);
          }
          case this.types.bloodCap: {
            return void (this.gameModel.bloodMax += e2.effect * t2);
          }
          case this.types.brainsCap: {
            return void (this.gameModel.brainsMax += e2.effect * t2);
          }
          case this.types.damage: {
            return void (this.gameModel.zombieDamage += e2.effect * t2);
          }
          case this.types.speed: {
            return void (this.gameModel.zombieSpeed += e2.effect * t2);
          }
          case this.types.health: {
            return void (this.gameModel.zombieHealth += e2.effect * t2);
          }
          case this.types.brainRecoverChance: {
            return void (this.gameModel.brainRecoverChance += e2.effect * t2);
          }
          case this.types.riseFromTheDeadChance: {
            return void (this.gameModel.riseFromTheDeadChance += e2.effect * t2);
          }
          case this.types.infectedBite: {
            return void (this.gameModel.infectedBiteChance += e2.effect * t2);
          }
          case this.types.infectedBlast: {
            return void (this.gameModel.infectedBlastChance += e2.effect * t2);
          }
          case this.types.plagueDamage: {
            return void (this.gameModel.plagueDamageMod += e2.effect);
          }
          case this.types.plagueTicks: {
            return void (this.gameModel.plagueticks += e2.effect);
          }
          case this.types.burningSpeedPC: {
            return void (this.gameModel.burningSpeedMod += e2.effect * t2);
          }
          case this.types.construction: {
            return void (this.gameModel.construction = 1);
          }
          case this.types.boneCollectorCapacity: {
            return void (this.gameModel.boneCollectorCapacity += e2.effect * t2);
          }
          case this.types.unlockSpell: {
            return void this.spells.unlockSpell(e2.effect);
          }
          case this.types.spitDistance: {
            return void (this.gameModel.spitDistance = 30 + e2.effect * t2);
          }
          case this.types.blastHealing: {
            return void (this.gameModel.blastHealing += e2.effect * t2);
          }
          case this.types.plagueArmor: {
            return void (this.gameModel.plagueDmgReduction -= e2.effect * t2);
          }
          case this.types.monsterLimit: {
            return void (this.gameModel.creatureLimit += e2.effect * t2);
          }
          case this.types.runicSyphon: {
            return void (this.gameModel.runicSyphon.percentage += e2.effect * t2);
          }
          case this.types.bulletproof: {
            return void (this.gameModel.bulletproofChance += e2.effect * t2);
          }
          case this.types.harpySpeed: {
            return void (this.gameModel.harpySpeed += e2.effect * t2);
          }
          case this.types.SkeleMove: {
            void (this.gameModel.SkeleMoveMod += e2.effect * t2);
            this.skeleton.moveSpeed += e2.effect * t2;
            return this.skeleton.moveSpeed;
          }
          case this.types.tankBuster: {
            return void (this.gameModel.tankBuster = true);
          }
          case this.types.harpyBombs: {
            return void (this.gameModel.harpyBombs += e2.effect * t2);
          }
          case this.types.spikeDelay: {
            return void (this.gameModel.spikeDelay -= e2.effect * t2);
          }
          case this.types.bonesGainPC: {
            return void (this.gameModel.bonesPCMod *= e2.costType == this.costs.prestigePoints ? this.calculateWithPrestigeRankBonus(e2, t2) : (1 + e2.effect) ** t2);
          }
          case this.types.partsGainPC: {
            return void (this.gameModel.partsPCMod *= e2.costType == this.costs.prestigePoints ? this.calculateWithPrestigeRankBonus(e2, t2) : (1 + e2.effect) ** t2);
          }
          case this.types.bloodGainPC: {
            return void (this.gameModel.bloodPCMod *= e2.costType == this.costs.prestigePoints ? this.calculateWithPrestigeRankBonus(e2, t2) : (1 + e2.effect) ** t2);
          }
          case this.types.bloodStoragePC: {
            return void (this.gameModel.bloodStorePCMod *= e2.costType == this.costs.prestigePoints ? this.calculateWithPrestigeRankBonus(e2, t2) : (1 + e2.effect) ** t2);
          }
          case this.types.brainsGainPC: {
            return void (this.gameModel.brainsPCMod *= t2 > e2.costType == this.costs.prestigePoints ? this.calculateWithPrestigeRankBonus(e2, t2) : (1 + e2.effect) ** t2);
          }
          case this.types.brainsStoragePC: {
            return void (this.gameModel.brainsStorePCMod *= e2.costType == this.costs.prestigePoints ? this.calculateWithPrestigeRankBonus(e2, t2) : (1 + e2.effect) ** t2);
          }
          case this.types.zombieDmgPC: {
            return void (this.gameModel.zombieDamagePCMod *= (1 + e2.effect) ** t2);
          }
          case this.types.zombieHealthPC: {
            return void (this.gameModel.zombieHealthPCMod *= (1 + e2.effect) ** t2);
          }
          case this.types.HstrengthDmgPC: {
            void (this.gameModel.zombieDamagePCMod *= (1 + e2.effect) ** t2);
            this.gameModel.HstrengthDmgPCMod *= (1 + e2.effect) ** t2;
            return this.gameModel.HstrengthDmgPCMod;
          }
          case this.types.HshellHealthPC: {
            void (this.gameModel.zombieHealthPCMod *= (1 + e2.effect) ** t2);
            this.gameModel.HshellHealthPCMod *= (1 + e2.effect) ** t2;
            return this.gameModel.HshellHealthPCMod;
          }
          case this.types.CyroVatPC: {
            void (this.gameModel.brainsMax *= (1 + e2.effect) ** t2);
            this.gameModel.CyroVatPCMod *= (1 + e2.effect) ** t2;
            return this.gameModel.CyroVatPCMod;
          }
          case this.types.PlagueVatPC: {
            return void (this.gameModel.PlagueVatPCMod *= (1 + e2.effect) ** t2);
          }
          case this.types.CloningRep1PC: {
            void (this.gameModel.brainsPCMod *= (1 + e2.effect) ** t2);
            this.gameModel.CloningRep1PCMod *= (1 + e2.effect) ** t2;
            return this.gameModel.CloningRep1PCMod;
          }
          case this.types.BloodSynPC: {
            void (this.gameModel.bloodPCMod *= (1 + e2.effect) ** t2);
            this.gameModel.BloodSynPCMod *= (1 + e2.effect) ** t2;
            return this.gameModel.BloodSynPCMod;
          }
          case this.types.SynBonePC: {
            void (this.gameModel.bonesPCMod *= (1 + e2.effect) ** t2);
            this.gameModel.SynBonePCMod *= (1 + e2.effect) ** t2;
            return this.gameModel.SynBonePCMod;
          }
          case this.types.SmolPartsPC: {
            void (this.gameModel.partsPCMod *= (1 + e2.effect) ** t2);
            this.gameModel.SmolPartsPCMod *= (1 + e2.effect) ** t2;
            return this.gameModel.SmolPartsPCMod;
          }
          case this.types.AvionicsPC: {
            void (this.gameModel.harpySpeed += e2.effect * t2);
            this.gameModel.AvionicsPCMod += e2.effect * t2;
            return this.gameModel.AvionicsPCMod;
          }
          case this.types.ShockPC: {
            void (this.attackSpeed *= (1 + e2.effect) ** t2);
            this.gameModel.ShockPCMod *= (1 + e2.effect) ** t2;
            return this.gameModel.ShockPCMod;
          }
          case this.types.EnergyCost: {
            void (this.gameModel.zombieCost -= e2.effect * t2);
            this.gameModel.EnergyCostMod -= e2.effect * t2;
            return this.gameModel.EnergyCostMod;
          }
          case this.types.prest_multPC: {
            void (this.gameModel.zombieDamagePCMod *= (1 + e2.effect) ** t2);
            this.gameModel.zombieHealthPCMod *= (1 + e2.effect) ** t2;
            this.gameModel.prest_multPCMod *= (1 + e2.effect) ** t2;
            return this.gameModel.prest_multPCMod;
          }
          case this.types.golemDamagePC: {
            return void (this.gameModel.golemDamagePCMod *= (1 + e2.effect) ** t2);
          }
          case this.types.golemHealthPC: {
            return void (this.gameModel.golemHealthPCMod *= (1 + e2.effect) ** t2);
          }
          case this.types.startingPC: {
            return void (this.gameModel.startingResources += e2.effect * t2);
          }
          case this.types.energyCost: {
            return void (this.gameModel.zombieCost -= e2.effect * t2);
          }
          case this.types.autoconstruction: {
            return void (this.gameModel.autoconstructionUnlocked = true);
          }
          case this.types.autoshop: {
            return void (this.gameModel.autoUpgrades = true);
          }
          case this.types.graveyardHealth: {
            return void (this.gameModel.graveyardHealthMod *= (1 + e2.effect) ** t2);
          }
          case this.types.talentPoint: {
            return void (this.skeleton.talentPoints = t2);
          }
        }
      }
      calculateWithPrestigeRankBonus(e2, t2) {
        if (t2 <= 60) {
          return (1 + e2.effect) ** t2;
        }
        let multiplier = (1 + e2.effect) ** 60;
        for (let i = 1; i <= t2 - 60; i++) {
          multiplier *= 1 + e2.effect * (1 + 0.05) ** i;
        }
        return multiplier;
      }
      applyConstructionUpgrade(e2) {
        switch (e2.type) {
          case this.constructionTypes.graveyard: {
            return void (this.gameModel.constructions.graveyard = 1);
          }
          case this.constructionTypes.crypt: {
            this.gameModel.constructions.crypt = 1;
            this.gameModel.brainsStorePCMod *= 1.5;
            return void (this.gameModel.bloodStorePCMod *= 1.5);
          }
          case this.constructionTypes.fort: {
            this.gameModel.constructions.fort = 1;
            this.gameModel.brainsStorePCMod *= 1.6;
            return void (this.gameModel.bloodStorePCMod *= 1.6);
          }
          case this.constructionTypes.fortress: {
            this.gameModel.constructions.fortress = 1;
            this.gameModel.brainsStorePCMod *= 1.7;
            return void (this.gameModel.bloodStorePCMod *= 1.7);
          }
          case this.constructionTypes.citadel: {
            this.gameModel.constructions.citadel = 1;
            this.gameModel.brainsStorePCMod *= 1.8;
            return void (this.gameModel.bloodStorePCMod *= 1.8);
          }
          case this.constructionTypes.plagueSpikes: {
            return void (this.gameModel.constructions.plagueSpikes = 1);
          }
          case this.constructionTypes.fence: {
            return void (this.gameModel.constructions.fence = 1);
          }
          case this.constructionTypes.fenceSize: {
            return void (this.gameModel.fenceRadius += e2.effect * e2.rank);
          }
          case this.constructionTypes.pit: {
            this.gameModel.bloodMax += 1e6 * e2.rank;
            return void (this.gameModel.brainsMax += 1e5 * e2.rank);
          }
          case this.constructionTypes.runesmith: {
            this.gameModel.constructions.runesmith = 1;
            return void (this.gameModel.persistentData.runes || (this.gameModel.persistentData.runes = {
              life: {
                blood: 0,
                brains: 0,
                bones: 0
              },
              death: {
                blood: 0,
                brains: 0,
                bones: 0
              }
            }));
          }
          case this.constructionTypes.aviary: {
            return void (this.gameModel.constructions.aviary = 1);
          }
          case this.constructionTypes.zombieCage: {
            return void (this.gameModel.zombieCages += e2.effect * e2.rank);
          }
          case this.constructionTypes.partFactory: {
            this.gameModel.constructions.partFactory = true;
            return void (this.gameModel.constructions.factory = true);
          }
          case this.constructionTypes.monsterFactory: {
            this.gameModel.constructions.monsterFactory = true;
            return void (this.gameModel.constructions.factory = true);
          }
          case this.constructionTypes.HybridLab: {
            this.gameModel.constructions.HybridLab = 1;
            this.gameModel.brainsStorePCMod *= 2;
            return void (this.gameModel.bloodStorePCMod *= 2);
          }
          case this.constructionTypes.AdvHybridLab: {
            this.gameModel.constructions.AdvHybridLab = 1;
            this.gameModel.brainsStorePCMod *= 2;
            return void (this.gameModel.bloodStorePCMod *= 2);
          }
          case this.constructionTypes.MiniAssembLine: {
            this.gameModel.constructions.MiniAssembLine = 1;
            this.gameModel.brainsStorePCMod *= 2;
            return void (this.gameModel.bloodStorePCMod *= 2);
          }
          case this.constructionTypes.AdvHybridLab: {
            this.gameModel.constructions.TechThinkTank = 1;
            this.gameModel.brainsStorePCMod *= 2;
            return void (this.gameModel.bloodStorePCMod *= 2);
          }
        }
      }
      displayStatValue(e2) {
        switch (e2.type) {
          case this.types.energyRate: {
            return `Energy rate: ${formatDecimal(
              this.gameModel.energyRate
            )} per second`;
          }
          case this.types.energyCap: {
            return `Maximum energy: ${formatWhole(this.gameModel.energyMax)}`;
          }
          case this.types.bloodCap: {
            return `Maximum blood: ${formatWhole(this.gameModel.bloodMax)}`;
          }
          case this.types.brainsCap: {
            return `Maximum brains: ${formatWhole(this.gameModel.brainsMax)}`;
          }
          case this.types.damage: {
            return `Zombie damage: ${formatWhole(this.gameModel.zombieDamage)}`;
          }
          case this.types.speed: {
            return `Zombie speed: ${formatWhole(this.gameModel.zombieSpeed)}`;
          }
          case this.types.health: {
            return `Zombie maximum health: ${formatWhole(
              this.gameModel.zombieHealth
            )}`;
          }
          case this.types.brainRecoverChance: {
            return `${Math.round(
              100 * this.gameModel.brainRecoverChance
            )}% chance to recover brain`;
          }
          case this.types.riseFromTheDeadChance: {
            return `${Math.round(
              100 * this.gameModel.riseFromTheDeadChance
            )}% chance for human corpses to turn into zombies`;
          }
          case this.types.infectedBite: {
            return `${Math.round(
              100 * this.gameModel.infectedBiteChance
            )}% chance for zombies to infect their targets`;
          }
          case this.types.infectedBlast: {
            return `${Math.round(
              100 * this.gameModel.infectedBlastChance
            )}% chance for zombies to explode on death`;
          }
          case this.types.bulletproof: {
            return `${Math.round(
              100 * this.gameModel.bulletproofChance
            )}% chance for earth golems to reflect bullets`;
          }
          case this.types.construction: {
            return this.gameModel.construction > 0 ? "You have unlocked Unholy Construction" : "You have yet to unlock Unholy Construction";
          }
          case this.types.boneCollectorCapacity: {
            return `Bone collector capacity: ${formatWhole(
              this.gameModel.boneCollectorCapacity
            )}`;
          }
          case this.types.bonesGainPC: {
            return `Bones: ${formatWhole(
              Math.round(100 * this.gameModel.bonesPCMod)
            )}%`;
          }
          case this.types.partsGainPC: {
            return `Parts: ${formatWhole(
              Math.round(100 * this.gameModel.partsPCMod)
            )}%`;
          }
          case this.types.bloodGainPC: {
            return `Blood: ${formatWhole(
              Math.round(100 * this.gameModel.bloodPCMod)
            )}%`;
          }
          case this.types.bloodStoragePC: {
            return `Blood Storage: ${formatWhole(
              100 * this.gameModel.bloodStorePCMod
            )}%`;
          }
          case this.types.brainsGainPC: {
            return `Brains: ${formatWhole(
              Math.round(100 * this.gameModel.brainsPCMod)
            )}%`;
          }
          case this.types.brainsStoragePC: {
            return `Brains Storage: ${formatWhole(
              100 * this.gameModel.brainsStorePCMod
            )}%`;
          }
          case this.types.zombieDmgPC: {
            return `Zombie Damage: ${Math.round(
              100 * this.gameModel.zombieDamagePCMod - 100
            )}%`;
          }
          case this.types.zombieHealthPC: {
            return `Zombie Health: ${Math.round(
              100 * this.gameModel.zombieHealthPCMod - 100
            )}%`;
          }
          case this.types.HstrengthDmgPC: {
            return `Zombie Damage: ${Math.round(
              100 * this.gameModel.HstrengthDmgPCMod - 100
            )}%`;
          }
          case this.types.HshellHealthPC: {
            return `Zombie Health: ${Math.round(
              100 * this.gameModel.HshellHealthPCMod - 100
            )}%`;
          }
          case this.types.CyroVatPC: {
            return `Brains Storage: ${Math.round(
              100 * this.gameModel.CyroVatPCMod - 100
            )}%`;
          }
          case this.types.PlagueVatPC: {
            return `Plague Damage: ${Math.round(
              100 * this.gameModel.PlagueVatPCMod - 100
            )}%`;
          }
          case this.types.CloningRep1PC: {
            return `Additional Brain Income: ${Math.round(
              100 * this.gameModel.CloningRep1PCMod - 100
            )}%`;
          }
          case this.types.BloodSynPC: {
            return `Additional Blood Income: ${Math.round(
              100 * this.gameModel.BloodSynPCMod - 100
            )}%`;
          }
          case this.types.SynBonePC: {
            return `Additional Bone Income: ${Math.round(
              100 * this.gameModel.SynBonePCMod - 100
            )}%`;
          }
          case this.types.SmolPartsPC: {
            return `Additional Parts Income: ${Math.round(
              100 * this.gameModel.SmolPartsPCMod - 100
            )}%`;
          }
          case this.types.EnergyCost: {
            return `Zombie Cost: ${this.gameModel.zombieCost} energy`;
          }
          case this.types.AvionicsPC: {
            return `Harpy speed: ${formatWhole(this.gameModel.harpySpeed)}`;
          }
          case this.types.SkeleMove: {
            return `Skeleton speed: ${formatWhole(this.gameModel.SkeleMoveMod)}`;
          }
          case this.types.ShockPC: {
            return `Attack Speed multiplier: ${Math.round(
              100 * this.gameModel.ShockPCMod - 100
            )}%`;
          }
          case this.types.prest_multPC: {
            return `Zombie Health and Damage: ${Math.round(
              100 * this.gameModel.prest_multPCMod
            )}%`;
          }
          case this.types.golemDamagePC: {
            return `Golem Damage: ${Math.round(
              100 * this.gameModel.golemDamagePCMod
            )}%`;
          }
          case this.types.golemHealthPC: {
            return `Golem Health: ${Math.round(
              100 * this.gameModel.golemHealthPCMod
            )}%`;
          }
          case this.types.startingPC: {
            return `${Math.round(
              500 * this.gameModel.startingResources
            )} blood, ${Math.round(
              50 * this.gameModel.startingResources
            )} brains, ${Math.round(
              200 * this.gameModel.startingResources
            )} bones`;
          }
          case this.types.unlockSpell: {
            return this.currentRank(e2) > 0 ? "You have learned this spell" : "You have yet to learn this spell";
          }
          case this.types.energyCost: {
            return `Zombie Cost: ${this.gameModel.zombieCost} energy`;
          }
          case this.types.burningSpeedPC: {
            return `Burning zombie speed: ${Math.round(
              100 * this.gameModel.burningSpeedMod
            )}%`;
          }
          case this.types.blastHealing: {
            return `Plague heal: ${Math.round(
              100 * this.gameModel.blastHealing
            )}%`;
          }
          case this.types.spitDistance: {
            return `Zombie spit distance: ${this.gameModel.spitDistance}`;
          }
          case this.types.plagueArmor: {
            return `Infected damage reduction: ${Math.round(
              100 - 100 * this.gameModel.plagueDmgReduction
            )}%`;
          }
          case this.types.monsterLimit: {
            return `Creature limit: ${this.gameModel.creatureLimit}`;
          }
          case this.types.runicSyphon: {
            return `Syphon amount: ${Math.round(
              100 * this.gameModel.runicSyphon.percentage
            )}%`;
          }
          case this.types.autoconstruction: {
            return this.currentRank(e2) > 0 ? "You have unlocked automatic construction" : "You have yet to unlock automatic construction";
          }
          case this.types.autoshop: {
            return this.currentRank(e2) > 0 ? "You have unlocked automatic shop purchases" : "You have yet to unlock automatic shop purchases";
          }
          case this.types.graveyardHealth: {
            return `Graveyard health: ${Math.round(
              100 * this.gameModel.graveyardHealthMod
            )}%`;
          }
          case this.types.harpySpeed: {
            return `Harpy speed: ${formatWhole(this.gameModel.harpySpeed)}`;
          }
          case this.types.harpyBombs: {
            return `Harpy bombs: ${formatWhole(this.gameModel.harpyBombs)}`;
          }
          case this.types.tankBuster: {
            return this.currentRank(e2) > 0 ? "You have unlocked tank buster" : "You have yet to unlock tank buster";
          }
          case this.types.spikeDelay: {
            return `Current spike delay: ${5 - this.currentRank(e2)} seconds`;
          }
        }
      }
      currentRank(e2) {
        for (const s of this.gameModel.persistentData.upgrades) {
          if (e2.id == s.id) {
            return s.rank;
          }
        }
        return 0;
      }
      currentRankConstruction(e2) {
        if (this.gameModel.persistentData.constructions) {
          for (const s of this.gameModel.persistentData.constructions) {
            if (e2.id == s.id) {
              return s.rank;
            }
          }
        }
        return 0;
      }
      upgradePrice(e2) {
        return Math.round(e2.basePrice * e2.multiplier ** this.currentRank(e2));
      }
      upgradeMaxAffordable(e2) {
        const t2 = this.currentRank(e2);
        let s = 0;
        switch (e2.costType) {
          case this.costs.blood: {
            s = h(
              e2.basePrice,
              e2.multiplier,
              t2,
              this.gameModel.persistentData.blood
            );
            break;
          }
          case this.costs.brains: {
            s = h(
              e2.basePrice,
              e2.multiplier,
              t2,
              this.gameModel.persistentData.brains
            );
            break;
          }
          case this.costs.bones: {
            s = h(
              e2.basePrice,
              e2.multiplier,
              t2,
              this.gameModel.persistentData.bones
            );
            break;
          }
          case this.costs.parts: {
            s = h(
              e2.basePrice,
              e2.multiplier,
              t2,
              this.gameModel.persistentData.parts
            );
            break;
          }
          case this.costs.prestigePoints: {
            s = h(
              e2.basePrice,
              e2.multiplier,
              t2,
              this.gameModel.persistentData.prestigePointsToSpend
            );
          }
        }
        return e2.cap != 0 ? Math.min(s, e2.cap - t2) : s;
      }
      upgradeMaxPrice(e2, maxAffordableUpgrades) {
        return l(
          e2.basePrice,
          e2.multiplier,
          this.currentRank(e2),
          maxAffordableUpgrades
        );
      }
      canAffordUpgrade(e2) {
        if (e2.cap > 0 && this.currentRank(e2) >= e2.cap) {
          e2.auto = false;
          return false;
        }
        switch (e2.costType) {
          case this.costs.energy: {
            return this.gameModel.energy >= this.upgradePrice(e2);
          }
          case this.costs.blood: {
            return this.gameModel.persistentData.blood >= this.upgradePrice(e2);
          }
          case this.costs.brains: {
            return this.gameModel.persistentData.brains >= this.upgradePrice(e2);
          }
          case this.costs.bones: {
            return this.gameModel.persistentData.bones >= this.upgradePrice(e2);
          }
          case this.costs.parts: {
            return this.gameModel.persistentData.parts >= this.upgradePrice(e2);
          }
          case this.costs.prestigePoints: {
            return this.gameModel.persistentData.prestigePointsToSpend >= this.upgradePrice(e2);
          }
        }
        return false;
      }
      constructionLeadsTo(e2) {
        let t2 = this.constructionUpgrades.filter((t3) => t3.requires == e2.id).map((e3) => e3.name).join(", ");
        t2 += this.upgrades.filter((t3) => t3.requires == e2.id).map((e3) => e3.name).join(", ");
        return t2;
      }
      purchaseMaxUpgrades(e2) {
        const t2 = this.upgradeMaxAffordable(e2);
        for (let s = 0; s < t2; s++) {
          this.purchaseUpgrade(e2, false);
        }
        this.gameModel.saveData();
      }
      purchaseUpgrade(e2, t2 = true) {
        if (this.canAffordUpgrade(e2)) {
          let s;
          let i = false;
          switch (e2.costType) {
            case this.costs.energy: {
              this.gameModel.energy -= this.upgradePrice(e2);
              break;
            }
            case this.costs.blood: {
              this.gameModel.persistentData.blood -= this.upgradePrice(e2);
              break;
            }
            case this.costs.brains: {
              this.gameModel.persistentData.brains -= this.upgradePrice(e2);
              break;
            }
            case this.costs.bones: {
              this.gameModel.persistentData.bones -= this.upgradePrice(e2);
              break;
            }
            case this.costs.prestigePoints: {
              i = true;
              this.gameModel.persistentData.prestigePointsToSpend -= this.upgradePrice(e2);
              break;
            }
            case this.costs.parts: {
              this.gameModel.persistentData.parts -= this.upgradePrice(e2);
            }
          }
          for (let t3 = 0; t3 < this.gameModel.persistentData.upgrades.length; t3++) {
            if (e2.id == this.gameModel.persistentData.upgrades[t3].id) {
              s = true;
              this.gameModel.persistentData.upgrades[t3] = {
                id: e2.id,
                rank: this.gameModel.persistentData.upgrades[t3].rank + 1
              };
              if (i) {
                this.gameModel.persistentData.upgrades[t3].costType = this.costs.prestigePoints;
              }
              break;
            }
          }
          if (!s) {
            const t3 = {
              id: e2.id,
              rank: 1,
              costType: null
            };
            if (i) {
              t3.costType = this.costs.prestigePoints;
            }
            this.gameModel.persistentData.upgrades.push(t3);
          }
          if (t2) {
            this.gameModel.saveData();
          }
          this.applyUpgrades();
          if (e2.purchaseMessage) {
            this.gameModel.sendMessage(e2.purchaseMessage);
          }
        }
      }
      removeUpgrade(e2) {
        for (let t2 = 0; t2 < this.gameModel.persistentData.upgrades.length; t2++) {
          if (e2.id == this.gameModel.persistentData.upgrades[t2].id) {
            this.gameModel.persistentData.upgrades[t2] = {
              id: e2.id,
              rank: 0
            };
            break;
          }
        }
        this.applyUpgrades();
      }
      consumeResources(e2) {
        let t2 = true;
        this.gameModel.persistentData.currentConstruction.shortfall = {};
        if (e2.energy && e2.energy > this.gameModel.energy) {
          t2 = false;
          this.gameModel.persistentData.currentConstruction.shortfall.energy = true;
        }
        if (e2.blood && e2.blood > this.gameModel.persistentData.blood) {
          t2 = false;
          this.gameModel.persistentData.currentConstruction.shortfall.blood = true;
        }
        if (e2.brains && e2.brains > this.gameModel.persistentData.brains) {
          t2 = false;
          this.gameModel.persistentData.currentConstruction.shortfall.brains = true;
        }
        if (e2.bones && e2.bones > this.gameModel.persistentData.bones) {
          t2 = false;
          this.gameModel.persistentData.currentConstruction.shortfall.bones = true;
        }
        if (e2.parts && e2.parts > this.gameModel.persistentData.parts) {
          t2 = false;
          this.gameModel.persistentData.currentConstruction.shortfall.parts = true;
        }
        return !!t2 && (this.gameModel.persistentData.currentConstruction.shortfall = false, e2.energy && (this.gameModel.energy -= e2.energy), e2.blood && (this.gameModel.persistentData.blood -= e2.blood), e2.brains && (this.gameModel.persistentData.brains -= e2.brains), e2.bones && (this.gameModel.persistentData.bones -= e2.bones), e2.parts && (this.gameModel.persistentData.parts -= e2.parts), true);
      }
      completeConstruction() {
        const e2 = this.constructionUpgrades.filter(
          (e3) => e3.id == this.gameModel.persistentData.currentConstruction.id
        )[0];
        let t2;
        for (let s = 0; s < this.gameModel.persistentData.constructions.length; s++) {
          if (e2.id == this.gameModel.persistentData.constructions[s].id) {
            t2 = this.gameModel.persistentData.constructions[s];
            t2.effect = e2.effect;
            t2.rank++;
          }
        }
        if (!t2) {
          this.gameModel.persistentData.constructions.push({
            id: e2.id,
            name: e2.name,
            rank: 1,
            type: e2.type,
            effect: e2.effect
          });
        }
        this.gameModel.persistentData.currentConstruction = false;
        this.gameModel.saveData();
        this.applyUpgrades();
        this.angularModel.updateConstructionUpgrades();
        this.gameModel.sendMessage(`Construction of ${e2.name} complete!`);
        if (e2.completeMessage) {
          this.gameModel.sendMessage(e2.completeMessage);
        }
      }
      updateAutoUpgrades() {
        if (this.gameModel.autoUpgrades) {
          for (let e2 = 0; e2 < this.upgrades.length; e2++) {
            if (this.upgrades[e2].auto) {
              this.purchaseUpgrade(this.upgrades[e2], false);
            }
          }
          if (this.gameModel.constructions.factory) {
            for (let e2 = 0; e2 < this.partFactory.generators.length; e2++) {
              if (this.partFactory.generators[e2].auto) {
                this.partFactory.purchaseGenerator(
                  this.partFactory.generators[e2],
                  false
                );
              }
            }
          }
        }
        if (this.gameModel.autoShatter) {
          this.doShatter();
        }
      }
      updateConstruction(e2) {
        if ((this.gameModel.persistentData.currentConstruction || this.gameModel.autoconstruction) && this.gameModel.persistentData.currentConstruction.state != this.constructionStates.paused) {
          if (this.gameModel.persistentData.currentConstruction) {
            this.constructionTickTimer -= e2;
            if (this.constructionTickTimer < 0) {
              this.constructionTickTimer = 1;
              if (this.consumeResources(
                this.gameModel.persistentData.currentConstruction.costPerTick
              )) {
                this.gameModel.persistentData.currentConstruction.state = this.constructionStates.building;
                this.gameModel.persistentData.currentConstruction.timeRemaining -= 1;
                if (this.gameModel.persistentData.currentConstruction.timeRemaining <= 0) {
                  this.completeConstruction();
                }
              } else {
                this.gameModel.persistentData.currentConstruction.state = this.constructionStates.autoPaused;
              }
            }
          } else if (this.gameModel.autoconstruction) {
            const e3 = this.getAvailableConstructions();
            if (!e3 || e3.length == 0) {
              return void (this.gameModel.autoconstruction = false);
            }
            let t2 = null;
            let s = 0;
            for (let i = 0; i < e3.length; i++) {
              const a = (e3[i].costs.energy || 0) + (e3[i].costs.blood || 0) + (e3[i].costs.brains || 0) + (e3[i].costs.bones || 0) + 100 * (e3[i].costs.parts || 0);
              if (a < s || !t2) {
                s = a;
                t2 = e3[i];
              }
            }
            if (t2) {
              setTimeout(() => this.startConstruction(t2));
            }
          }
        }
      }
      startConstruction(e2) {
        if (this.gameModel.persistentData.currentConstruction) {
          return;
        }
        const t2 = this.gameModel.persistentData.blood >= (e2.costs.blood || 0) && this.gameModel.persistentData.brains >= (e2.costs.brains || 0) && this.gameModel.persistentData.bones >= (e2.costs.bones || 0) && this.gameModel.persistentData.parts >= (e2.costs.parts || 0) && this.gameModel.energy >= (e2.costs.energy || 0);
        const s = {
          energy: 0,
          blood: 0,
          brains: 0,
          bones: 0,
          parts: 0
        };
        if (e2.costs.energy) {
          s.energy = e2.costs.energy / (t2 ? 5 : e2.time);
        }
        if (e2.costs.blood) {
          s.blood = e2.costs.blood / (t2 ? 5 : e2.time);
        }
        if (e2.costs.brains) {
          s.brains = e2.costs.brains / (t2 ? 5 : e2.time);
        }
        if (e2.costs.bones) {
          s.bones = e2.costs.bones / (t2 ? 5 : e2.time);
        }
        if (e2.costs.parts) {
          s.parts = e2.costs.parts / (t2 ? 5 : e2.time);
        }
        this.gameModel.persistentData.currentConstruction = {
          state: this.constructionStates.building,
          name: e2.name,
          id: e2.id,
          timeRemaining: t2 ? 5 : e2.time,
          time: t2 ? 5 : e2.time,
          costPerTick: s
        };
      }
      playPauseConstruction() {
        if (this.gameModel.persistentData.currentConstruction) {
          if (this.gameModel.persistentData.currentConstruction.state == this.constructionStates.paused) {
            this.gameModel.persistentData.currentConstruction.state = this.constructionStates.building;
          } else {
            this.gameModel.persistentData.currentConstruction.state = this.constructionStates.paused;
          }
        }
      }
      cancelConstruction() {
        this.gameModel.persistentData.currentConstruction = false;
      }
      constructionAvailable(e2) {
        return !(this.gameModel.persistentData.currentConstruction && this.gameModel.persistentData.currentConstruction.id == e2.id || this.currentRankConstruction(e2) >= e2.cap || e2.requires && this.gameModel.persistentData.constructions.filter(
          (t2) => t2.id == e2.requires
        ).length == 0);
      }
      constructionComplete(e2) {
        return this.currentRankConstruction(e2) >= e2.cap;
      }
      getAvailableConstructions() {
        return this.constructionUpgrades.filter(
          (e2) => this.constructionAvailable(e2)
        );
      }
      getCompletedConstructions() {
        return this.constructionUpgrades.filter(
          (e2) => this.constructionComplete(e2)
        );
      }
      upgradeIdCheck() {
        const e2 = [];
        this.upgrades.forEach((t2) => {
          if (e2[t2.id]) {
            console.error(`ID ${t2.id} already used`);
          }
          e2[t2.id] = true;
        });
        this.prestigeUpgrades.forEach((t2) => {
          if (e2[t2.id]) {
            console.error(`ID ${t2.id} already used`);
          }
          e2[t2.id] = true;
        });
        this.constructionUpgrades.forEach((t2) => {
          if (e2[t2.id]) {
            console.error(`ID ${t2.id} already used`);
          }
          e2[t2.id] = true;
        });
      }
      updateRunicSyphon(e2) {
        if (e2.percentage > 0) {
          this.gameModel.persistentData.runes.life.blood += e2.blood / 2;
          this.gameModel.persistentData.runes.death.blood += e2.blood / 2;
          this.gameModel.persistentData.runes.life.brains += e2.brains / 2;
          this.gameModel.persistentData.runes.death.brains += e2.brains / 2;
          this.gameModel.persistentData.runes.life.bones += e2.bones / 2;
          this.gameModel.persistentData.runes.death.bones += e2.bones / 2;
          e2.blood = 0;
          e2.brains = 0;
          e2.bones = 0;
          this.updateRuneEffects();
        }
      }
      shatterPercent(e2) {
        const t2 = 1e8 * 1.5 ** this.gameModel.persistentData.runeshatter;
        return Math.floor(100 * Math.min(1, e2.blood / t2));
      }
      shatterBloodCost(e2) {
        return Math.max(
          0,
          1e8 * 1.5 ** this.gameModel.persistentData.runeshatter - e2.blood
        );
      }
      shatterEffect() {
        return 1.1 ** this.gameModel.persistentData.runeshatter;
      }
      canShatter() {
        return !!this.gameModel.persistentData.runes && this.shatterPercent(this.gameModel.persistentData.runes.life) + this.shatterPercent(this.gameModel.persistentData.runes.death) == 200;
      }
      doShatter() {
        if (this.canShatter()) {
          this.gameModel.persistentData.runeshatter++;
          this.gameModel.persistentData.runes.life.blood = 0;
          this.gameModel.persistentData.runes.death.blood = 0;
          this.gameModel.persistentData.runes.life.brains = 0;
          this.gameModel.persistentData.runes.death.brains = 0;
          this.gameModel.persistentData.runes.life.bones = 0;
          this.gameModel.persistentData.runes.death.bones = 0;
          this.updateRuneEffects();
          this.applyUpgrades();
        }
      }
      infuseRune(e2, t2, s) {
        const i = e2 == "life" ? this.gameModel.persistentData.runes.life : this.gameModel.persistentData.runes.death;
        switch (t2) {
          case "blood": {
            if (this.gameModel.persistentData.blood >= s) {
              i.blood += s;
              this.gameModel.persistentData.blood -= s;
            }
            break;
          }
          case "brains": {
            if (this.gameModel.persistentData.brains >= s) {
              i.brains += s;
              this.gameModel.persistentData.brains -= s;
            }
            break;
          }
          case "bones": {
            if (this.gameModel.persistentData.bones >= s) {
              i.bones += s;
              this.gameModel.persistentData.bones -= s;
            }
          }
        }
        this.updateRuneEffects();
      }
      updateRuneEffects() {
        if (!this.gameModel.persistentData.runes) {
          return;
        }
        const e2 = {
          attackSpeed: 1,
          critChance: 0,
          critDamage: 1,
          damageReduction: 1,
          healthRegen: 0,
          damageReflection: 0
        };
        this.runeCalculations.forEach((s, t2) => {
          const i = this.gameModel.persistentData.runes[s.rune][s.cost];
          if (i > 0) {
            let t3 = (Math.log(i) / Math.log(s.logBase) + s.adjustment) / 100;
            if (t3 > 0) {
              if (s.cap && t3 > s.cap) {
                t3 = s.cap;
              }
              if (s.subtract) {
                e2[s.effect] -= t3;
              } else {
                e2[s.effect] += t3;
              }
            }
          }
        });
        this.gameModel.runeEffects = e2;
      }
    }
    class he {
      constructor(e2, t2, s, i, a, r, n, o, h2, l2, d2) {
        this.id = e2;
        this.name = t2;
        this.type = s;
        this.costs = i;
        this.time = a;
        this.multiplier = r;
        this.effect = n;
        this.cap = o;
        this.requires = h2;
        this.description = l2;
        this.completeMessage = d2;
      }
    }
    class le {
      constructor(e2, t2, s, i, a, r, n, o, h2, l2, d2) {
        this.id = e2;
        this.name = t2;
        this.type = s;
        this.costType = i;
        this.basePrice = a;
        this.multiplier = r;
        this.effect = n;
        this.cap = o;
        this.description = h2;
        this.rank = 1;
        this.purchaseMessage = l2;
        this.requires = d2;
      }
    }
    class Trophies {
      constructor() {
        this.gameModel = GameModel.getInstance();
        this.upgrades = new Upgrades();
        this.trophyStats = [
          {
            type: this.upgrades.types.health,
            value: 50,
            percentage: false
          },
          {
            type: this.upgrades.types.damage,
            value: 7,
            percentage: false
          },
          {
            type: this.upgrades.types.energyCap,
            value: 10,
            percentage: false
          },
          {
            type: this.upgrades.types.energyRate,
            value: 0.5,
            percentage: false
          },
          {
            type: this.upgrades.types.plagueTicks,
            value: 1,
            percentage: false,
            static: true
          },
          {
            type: this.upgrades.types.plagueDamage,
            value: 50,
            percentage: false
          },
          {
            type: this.upgrades.types.bloodCap,
            value: 5e3,
            percentage: false
          },
          {
            type: this.upgrades.types.brainsRate,
            value: 2,
            percentage: false
          },
          {
            type: this.upgrades.types.zombieHealthPC,
            value: 0.02,
            percentage: true
          },
          {
            type: this.upgrades.types.bonesRate,
            value: 2,
            percentage: false
          },
          {
            type: this.upgrades.types.zombieDmgPC,
            value: 0.02,
            percentage: true
          }
        ];
        if (Trophies.instance) {
          return Trophies.instance;
        }
        Trophies.instance = this;
      }
      isPercentage(e2) {
        for (let t2 = 0; t2 < this.trophyStats.length; t2++) {
          if (this.trophyStats[t2].type == e2) {
            return this.trophyStats[t2].percentage == 1;
          }
        }
      }
      doesLevelHaveTrophy(e2) {
        return !(this.gameModel.persistentData.vipEscaped && this.gameModel.persistentData.vipEscaped.includes(e2) || this.gameModel.persistentData.trophies && this.gameModel.persistentData.trophies.includes(e2) || e2 % 5 != 0);
      }
      createTrophy(e2, t2, s) {
        const i = Math.round(e2 / 5) - 1;
        const a = Math.floor(i / this.trophyStats.length);
        const r = this.trophyStats[i - a * this.trophyStats.length];
        return {
          level: e2,
          type: r.type,
          effect: r.static ? r.value : r.value * (a + 1),
          rank: 1,
          owned: t2,
          escaped: s
        };
      }
      trophyAquired(e2) {
        if (!this.gameModel.persistentData.trophies) {
          this.gameModel.persistentData.trophies = [];
        }
        if (this.gameModel.persistentData.trophies.includes(e2)) {
          this.gameModel.sendMessage("The VIP has been killed!");
        } else {
          this.gameModel.persistentData.trophies.push(e2);
          this.gameModel.persistentData.trophies.sort();
          this.gameModel.saveData();
          this.upgrades.applyUpgrades();
          if (window.kongregate) {
            window.kongregate.stats.submit(
              "trophies",
              this.gameModel.persistentData.trophies.length
            );
          }
          this.gameModel.sendMessage(
            "The VIP has been killed! - New Trophy Aquired"
          );
        }
      }
      getTrophyList() {
        if (!this.gameModel.persistentData.trophies) {
          this.gameModel.persistentData.trophies = [];
        }
        if (!this.gameModel.persistentData.vipEscaped) {
          this.gameModel.persistentData.vipEscaped = [];
        }
        const e2 = [];
        let t2 = this.gameModel.persistentData.allTimeHighestLevel + 5;
        for (let e3 = 0; e3 < this.gameModel.persistentData.trophies.length; e3++) {
          if (this.gameModel.persistentData.trophies[e3] > t2) {
            t2 = this.gameModel.persistentData.trophies[e3];
          }
        }
        for (let s = 5; s <= t2; s += 5) {
          e2.push(
            this.createTrophy(
              s,
              this.gameModel.persistentData.trophies.includes(s),
              this.gameModel.persistentData.vipEscaped.includes(s)
            )
          );
        }
        return e2;
      }
      getTrophyTotals() {
        const e2 = this.getTrophyList().filter((e3) => e3.owned);
        const t2 = [];
        for (let s = 0; s < e2.length; s++) {
          if (t2.filter((t3) => t3.type == e2[s].type).length == 0) {
            t2.push(e2[s]);
          } else if (this.isPercentage(e2[s].type)) {
            t2.filter((t3) => t3.type == e2[s].type)[0].effect = (t2.filter((t3) => t3.type == e2[s].type)[0].effect + 1) * (1 + e2[s].effect) - 1;
          } else {
            t2.filter((t3) => t3.type == e2[s].type)[0].effect += e2[s].effect;
          }
        }
        return t2;
      }
      getAquiredTrophyList() {
        if (!this.gameModel.persistentData.trophies) {
          this.gameModel.persistentData.trophies = [];
        }
        const e2 = [];
        for (let t2 = 0; t2 < this.gameModel.persistentData.trophies.length; t2++) {
          e2.push(
            this.createTrophy(
              this.gameModel.persistentData.trophies[t2],
              true,
              false
            )
          );
        }
        return e2;
      }
    }
    let humanState;
    ((humanState2) => {
      humanState2[humanState2["standing"] = 0] = "standing";
      humanState2[humanState2["walking"] = 1] = "walking";
      humanState2[humanState2["attacking"] = 2] = "attacking";
      humanState2[humanState2["fleeing"] = 3] = "fleeing";
      humanState2[humanState2["escaping"] = 4] = "escaping";
    })(humanState || (humanState = {}));
    class fe extends PIXI.Text {
      constructor(...args) {
        super(...args);
        this.human = null;
        this.yOffset = 0;
      }
    }
    class ye extends $ {
      constructor(...args) {
        super(...args);
        this.flee = 0;
        this.standing = 0;
        this.target = 0;
        this.plagueTick = 0;
        this.healTick = 0;
      }
    }
    class xe extends K {
      constructor(...args) {
        super(...args);
        this.dog = false;
        this.doctor = false;
        this.tank = false;
        this.vip = false;
        this.torchBearer = false;
      }
    }
    class ve extends Q {
      constructor(...args) {
        super(...args);
        this.maxSpeed = 0;
        this.flags = new xe();
        this.target = null;
        this.speedMod = 0;
        this.human = true;
        this.plagueTicks = 0;
        this.plagueDamage = 0;
        this.visionDistance = 0;
        this.timer = new ye();
      }
    }
    class Humans {
      constructor() {
        this.maxWalkSpeed = 15;
        this.maxRunSpeed = 35;
        this.minSecondsTostand = 1;
        this.maxSecondsToStand = 60;
        this.chanceToStayInCurrentBuilding = 0.95;
        this.textures = [];
        this.doctorTextures = [];
        this.humans = [];
        this.discardedHumans = [];
        this.aliveHumans = [];
        this.graveyardAttackers = [];
        this.humansPerLevel = 50;
        this.maxHumans = 1e3;
        this.scaling = 2;
        this.visionDistance = 60;
        this.vipEscaping = false;
        this.fleeChancePerZombie = 0.1;
        this.fleeTime = 10;
        this.scanTime = 3;
        this.attackDistance = 20;
        this.moveTargetDistance = 3;
        this.attackSpeed = 2;
        this.attackDamage = 5;
        this.fadeSpeed = 0.1;
        this.plagueTickTimer = 5;
        this.healTickTimer = 5;
        this.burnTickTimer = 5;
        this.smokeTimer = 0.3;
        this.fastDistance = weighted_hybrid_distance;
        this.frozen = false;
        this.pandemic = false;
        this.graveYardPosition = null;
        this.drawTargets = false;
        if (Humans.instance) {
          return Humans.instance;
        }
        Humans.instance = this;
      }
      randomSecondsToStand() {
        return this.minSecondsTostand + Math.random() * (this.maxSecondsToStand - this.minSecondsTostand);
      }
      damageHuman(e2, t2) {
        this.gameModel.addBlood(Math.round(t2 / 3));
        e2.health -= t2;
        e2.timer.scan = 0;
        if (e2.flags.tank) {
          this.fragments.newPart(e2.x, e2.y - 18, 8086798);
        } else {
          this.blood.newSplatter(e2.x, e2.y);
          e2.speedMod = Math.max(Math.min(1, e2.health / e2.maxHealth), 0.25);
        }
        if (e2.health <= 0 && !e2.flags.dead) {
          this.bones.newBones(e2.x, e2.y);
          e2.flags.dead = true;
          this.gameModel.addBrains(1);
          this.skeleton.addXp(this.gameModel.level);
          this.skeleton.testForLoot();
          if (e2.flags.tank) {
            this.blasts.newDroneBlast(e2.x, e2.y - 5);
            this.fragments.newFragmentExplosion(e2.x, e2.y - 5, 8086798);
            e2.visible = false;
          } else {
            e2.textures = e2.deadTexture;
          }
          if (e2.flags.vip) {
            this.vipText.visible = false;
            this.trophies.trophyAquired(this.gameModel.level);
            setTimeout(
              () => {
                this.vipEscaping = false;
              },
              2e3
              /* 2e3 */
            );
          }
        }
        if (!this.army.assaultStarted) {
          if (Math.random() > 0.9 && this.gameModel.isBossStage(this.gameModel.level)) {
            this.army.assaultStarted = true;
            this.gameModel.sendMessage("The assault has begun!");
          }
        }
      }
      updateBurns(e2, t2) {
        e2.timer.burnTick -= t2;
        e2.timer.smoke -= t2;
        if (e2.timer.smoke < 0) {
          this.smoke.newFireSmoke(e2.x, e2.y - 14);
          e2.timer.smoke = this.smokeTimer;
        }
        if (e2.timer.burnTick < 0) {
          this.damageHuman(e2, e2.burnDamage);
          e2.timer.burnTick = this.burnTickTimer;
          this.exclamations.newFire(e2);
        }
      }
      assignRandomTarget(e2) {
        if (Math.random() > this.chanceToStayInCurrentBuilding || e2.timer.flee > 0) {
          e2.currentPoi = this.map.getRandomBuilding();
        }
        e2.target = this.map.randomPositionInBuilding(e2.currentPoi);
        e2.maxSpeed = e2.timer.flee > 0 ? this.maxRunSpeed : this.maxWalkSpeed;
        e2.xSpeed = 0;
        e2.ySpeed = 0;
      }
      getMaxNpcs() {
        return Math.min(
          this.humansPerLevel * this.gameModel.level,
          this.maxHumans
        );
      }
      getMaxHumans() {
        return this.gameModel.isBossStage(this.gameModel.level) ? 0 : this.getMaxNpcs() - (this.police.police.length + this.army.armymen.length);
      }
      getMaxDoctors() {
        return this.gameModel.level < 18 ? 0 : Math.min(Math.round(0.7 * this.gameModel.level), 75);
      }
      getTorchChance() {
        return this.gameModel.level < 10 ? 0 : 0.02 * Math.min(this.gameModel.level - 10, 40);
      }
      getMaxHealth(e2) {
        if (e2 < 7) {
          return 10 * (e2 + 4);
        }
        if (e2 < 12) {
          return 20 * (e2 - 1);
        }
        if (e2 < 16) {
          return 25 * (e2 - 3);
        }
        if (e2 < 29) {
          return 50 * (e2 - 9);
        }
        if (e2 < 49) {
          return 100 * (e2 - 19);
        }
        if (e2 < 64) {
          return 300 * (e2 - 39);
        }
        if (e2 < 85) {
          return 500 * (e2 - 49);
        }
        if (e2 < 499) {
          return 17800 * 1.015 ** (e2 - 84);
        }
        if (e2 < 999) {
          return 85e5 * 1.03 ** (e2 - 499);
        }
        if (e2 < 1499) {
          return 98e16 * 1.021 ** (e2 - 1499);
        }
        if (e2 > 2299) {
          return 845e23 * 1.025 ** (e2 - 2299);
        }
        return 45e11 * 1.025 ** (e2 - 999);
      }
      getAttackDamage() {
        if (this.gameModel.level != 1) {
          if (this.gameModel.level != 2) {
            if (this.gameModel.level != 3) {
              this.attackDamage = Math.round(
                this.getMaxHealth(this.gameModel.level) / 10
              );
            } else {
              this.attackDamage = 5;
            }
          } else {
            this.attackDamage = 4;
          }
        } else {
          this.attackDamage = 2;
        }
      }
      setupVipText(e2) {
        if (!this.vipText) {
          this.vipText = new fe("VIP", {
            fontFamily: "sans-serif",
            fontSize: 64,
            fill: "#FC0",
            stroke: "#000",
            strokeThickness: 5,
            align: "center"
          });
          this.vipText.anchor.set(0.5, 1);
          this.vipText.scale.x = 0.25;
          this.vipText.scale.y = 0.25;
          b.addChild(this.vipText);
        }
        this.vipText.visible = true;
        this.vipText.human = e2;
        this.vipText.yOffset = -20;
        this.vipText.x = e2.x;
        this.vipText.y = e2.y + this.vipText.yOffset;
      }
      populate() {
        this.map = new ee();
        this.zombies = new Zombies();
        this.gameModel = GameModel.getInstance();
        this.blood = new _e();
        this.smoke = new ot();
        this.bones = new Bones();
        this.skeleton = new Skeleton();
        this.blasts = new nt();
        this.fragments = new lt();
        this.trophies = new Trophies();
        this.exclamations = new it();
        this.bullets = new rt();
        this.police = new Police();
        this.army = new Army();
        this.tanks = new De();
        this.map.populatePois();
        if (this.textures.length == 0) {
          for (let e3 = 0; e3 < 6; e3++) {
            const t3 = [];
            for (let s2 = 0; s2 < 3; s2++) {
              t3.push(PIXI.Texture.from(`human${e3 + 1}_${s2 + 1}.png`));
            }
            this.textures.push({
              animated: t3,
              dead: [PIXI.Texture.from(`human${e3 + 1}_dead.png`)]
            });
          }
        }
        if (this.doctorTextures.length == 0) {
          for (let e3 = 0; e3 < 3; e3++) {
            this.doctorTextures.push(PIXI.Texture.from(`doctor${e3 + 1}.png`));
          }
          this.doctorDeadTexture = [PIXI.Texture.from("doctor4.png")];
        }
        if (this.humans.length > 0) {
          for (let e3 = 0; e3 < this.humans.length; e3++) {
            g.removeChild(this.humans[e3]);
            this.humans[e3].stop();
          }
          this.discardedHumans = this.humans.slice();
          this.humans.length = 0;
          this.aliveHumans.length = 0;
        }
        this.police.populate();
        this.army.populate();
        this.tanks.populate();
        this.getAttackDamage();
        const e2 = this.getMaxHumans();
        let t2 = this.getMaxDoctors();
        const s = this.getMaxHealth(this.gameModel.level);
        let i = this.trophies.doesLevelHaveTrophy(this.gameModel.level);
        this.vip = void 0;
        if (i) {
          this.escapeTarget = {
            x: P.x / 2,
            y: P.y + 50
          };
        } else if (this.vipText) {
          this.vipText.visible = false;
        }
        for (let a = 0; a < e2; a++) {
          let e3;
          if (t2 > 0) {
            if (this.discardedHumans.length > 0) {
              e3 = this.discardedHumans.pop();
              e3.textures = this.doctorTextures;
            } else {
              e3 = new ve(this.doctorTextures);
            }
            e3.deadTexture = this.doctorDeadTexture;
            e3.flags.doctor = true;
            e3.flags.torchBearer = false;
            e3.timer.healTick = Math.random() * this.healTickTimer;
            t2--;
          } else {
            const t3 = Math.random() < this.getTorchChance();
            const s2 = Math.floor(3 * Math.random()) + (t3 ? 3 : 0);
            if (this.discardedHumans.length > 0) {
              e3 = this.discardedHumans.pop();
              e3.textures = this.textures[s2].animated;
            } else {
              e3 = new ve(this.textures[s2].animated);
            }
            e3.flags.torchBearer = t3;
            e3.deadTexture = this.textures[s2].dead;
            e3.flags.doctor = false;
          }
          e3.reset();
          e3.flags.vip = false;
          e3.flags.dead = false;
          e3.flags.burning = false;
          e3.flags.infected = false;
          e3.burnDamage = 0;
          e3.plagueDamage = 0;
          e3.plagueTicks = 0;
          e3.animationSpeed = 0.15;
          e3.anchor.set(35 / 80, 1);
          e3.currentPoi = this.map.getRandomBuilding();
          e3.position.copyFrom(this.map.randomPositionInBuilding(e3.currentPoi));
          e3.zIndex = e3.position.y;
          e3.xSpeed = 0;
          e3.ySpeed = 0;
          e3.timer.plagueTick = Math.random() * this.plagueTickTimer;
          e3.target = false;
          e3.speedMod = 1;
          e3.zombieTarget = null;
          e3.lastKnownBuilding = null;
          e3.visionDistance = this.visionDistance;
          e3.visible = true;
          e3.alpha = 1;
          e3.maxHealth = s;
          e3.health = s;
          if (i && !e3.flags.doctor) {
            e3.flags.vip = true;
            this.vip = e3;
            i = false;
            e3.maxHealth = e3.health = 2 * s;
            this.setupVipText(e3);
          }
          e3.timer.scan = Math.random() * this.scanTime;
          e3.timer.flee = 0;
          this.changeState(e3, 0 /* standing */);
          e3.timer.standing = Math.random() * this.randomSecondsToStand();
          e3.timer.attack = this.attackSpeed;
          e3.scale.set(
            Math.random() > 0.5 ? this.scaling : -1 * this.scaling,
            this.scaling
          );
          this.humans.push(e3);
          g.addChild(e3);
        }
      }
      updateHumanSpeed(e2, t2) {
        if (this.frozen) {
          return void e2.gotoAndStop(0);
        }
        if (!e2.playing) {
          e2.play();
        }
        if (e2.timer.dogStun && e2.timer.dogStun > 0) {
          return void (e2.timer.dogStun -= t2);
        }
        if (e2.timer.target != 0 || !e2.targetVector) {
          e2.timer.target = 0;
        }
        e2.timer.target -= t2;
        if (e2.timer.target <= 0) {
          e2.targetVector = this.map.howDoIGetToMyTarget(e2, e2.target);
          e2.timer.target = 0.2;
        }
        const s = e2.speedMod * e2.maxSpeed;
        e2.xSpeed = e2.targetVector.x * s;
        e2.ySpeed = e2.targetVector.y * s;
        if (isNaN(e2.xSpeed) || isNaN(e2.ySpeed)) {
          e2.xSpeed = 0;
          e2.ySpeed = 0;
        }
        e2.position.x += e2.xSpeed * t2;
        e2.position.y += e2.ySpeed * t2;
        e2.zIndex = e2.position.y;
        if (Math.abs(e2.xSpeed) > 1 && !e2.flags.tank) {
          e2.scale.x = e2.xSpeed > 0 ? this.scaling : -this.scaling;
        }
      }
      update(e2) {
        if (this.gameModel.currentState != this.gameModel.states.playingLevel) {
          return;
        }
        const t2 = [];
        const s = this.zombies.aliveZombies;
        this.graveyardAttackers.length = 0;
        for (let i = 0; i < this.humans.length; i++) {
          this.updateHuman(this.humans[i], e2, s);
          if (!this.humans[i].flags.dead) {
            t2.push(this.humans[i]);
          }
        }
        this.aliveHumans = t2;
        this.gameModel.stats.human.count = this.aliveHumans.length;
        this.police.update(e2, s);
        this.army.update(e2, s);
        this.tanks.update(e2, s);
        if (this.vipText && this.vipText.visible) {
          this.vipText.x = this.vipText.human.x;
          this.vipText.y = this.vipText.human.y + this.vipText.yOffset;
        }
        this.gameModel.humanCount = this.aliveHumans.length;
      }
      updateDeadHumanFading(e2, t2) {
        if (e2.visible) {
          if (e2.alpha > 0.5 && e2.alpha - this.fadeSpeed * t2 <= 0.5 && !e2.flags.tank && Math.random() < this.gameModel.riseFromTheDeadChance) {
            this.zombies.createZombie(e2.x, e2.y, e2.flags.dog);
            e2.visible = false;
            return void g.removeChild(e2);
          }
          e2.alpha -= this.fadeSpeed * t2;
          if (e2.alpha < 0) {
            e2.visible = false;
            g.removeChild(e2);
          }
        }
      }
      changeState(e2, t2) {
        switch (t2) {
          case 0 /* standing */: {
            e2.gotoAndStop(0);
            e2.maxSpeed = this.maxWalkSpeed;
            e2.timer.standing = this.randomSecondsToStand();
            break;
          }
          case 1 /* walking */: {
            e2.play();
            e2.maxSpeed = this.maxWalkSpeed;
            break;
          }
          case 3 /* fleeing */: {
            e2.play();
            e2.timer.flee = this.fleeTime;
            e2.maxSpeed = this.maxRunSpeed;
            this.assignRandomTarget(e2);
            this.exclamations.newExclamation(e2);
            break;
          }
          case 4 /* escaping */: {
            e2.play();
            e2.maxSpeed = this.maxRunSpeed;
            e2.target = this.escapeTarget;
            this.exclamations.newExclamation(e2);
            this.gameModel.sendMessage("The VIP is escaping!");
            this.vipEscaping = true;
            break;
          }
          case 2 /* attacking */: {
            e2.play();
            e2.maxSpeed = this.maxRunSpeed;
          }
        }
        e2.state = t2;
      }
      inflictBurn(e2, t2) {
        if (e2.flags.torchBearer) {
          if (t2.flags.burning) {
            t2.burnDamage += this.attackDamage;
          } else {
            this.exclamations.newFire(t2);
            t2.burnDamage = this.attackDamage;
          }
          t2.flags.burning = true;
        }
      }
      burnHuman(e2, t2) {
        if (e2) {
          if (e2.flags.burning) {
            e2.burnDamage += t2;
          } else {
            e2.timer.burnTick = this.burnTickTimer;
            e2.timer.smoke = this.smokeTimer;
            this.exclamations.newFire(e2);
            e2.burnDamage = t2;
          }
          e2.flags.burning = true;
        }
      }
      updatePlague(e2, t2) {
        e2.timer.plagueTick -= t2;
        if (e2.timer.plagueTick < 0) {
          this.damageHuman(e2, e2.plagueDamage);
          e2.timer.plagueTick = this.plagueTickTimer * (1 / this.gameModel.runeEffects.attackSpeed);
          this.exclamations.newPoison(e2);
          e2.plagueTicks--;
          if (this.pandemic) {
            this.pandemicBullet(e2);
          }
          if (e2.plagueTicks <= 0) {
            e2.flags.infected = false;
            e2.plagueDamage = 0;
          }
        }
      }
      pandemicBullet(e2) {
        for (let t2 = 0; t2 < this.aliveHumans.length; t2++) {
          if (Math.abs(this.aliveHumans[t2].x - e2.x) < 30 && Math.abs(this.aliveHumans[t2].y - e2.y) < 30 && Math.random() < 0.3) {
            this.bullets.newBullet(
              e2,
              this.aliveHumans[t2],
              this.gameModel.zombieDamage / 2,
              true
            );
          }
        }
      }
      healHuman(e2) {
        if (e2.health < e2.maxHealth) {
          if (e2.flags.infected && e2.plagueTicks > 0) {
            e2.plagueTicks--;
          }
          e2.health += 2 * this.attackDamage;
          if (e2.health > e2.maxHealth) {
            e2.health = e2.maxHealth;
            e2.speedMod = Math.max(Math.min(1, e2.health / e2.maxHealth), 0.25);
          }
          this.exclamations.newHealing(e2);
        }
      }
      doHeal(e2, t2) {
        e2.timer.healTick -= t2;
        if (e2.timer.healTick < 0) {
          const t3 = 100;
          e2.timer.healTick = this.healTickTimer;
          for (let s = 0; s < this.aliveHumans.length; s++) {
            if (Math.abs(this.aliveHumans[s].x - e2.x) < t3 && Math.abs(this.aliveHumans[s].y - e2.y) < t3 && this.fastDistance(
              e2.x,
              e2.y,
              this.aliveHumans[s].x,
              this.aliveHumans[s].y
            ) < t3) {
              this.healHuman(this.aliveHumans[s]);
            }
          }
        }
      }
      updateHuman(e2, t2, s) {
        if (e2.flags.dead) {
          return this.updateDeadHumanFading(e2, t2);
        }
        e2.timer.attack -= t2;
        e2.timer.scan -= t2;
        e2.timer.flee -= t2;
        if (e2.flags.infected) {
          this.updatePlague(e2, t2);
        }
        if (e2.flags.doctor) {
          this.doHeal(e2, t2);
        }
        if (e2.flags.burning) {
          this.updateBurns(e2, t2);
        }
        if ((!e2.zombieTarget || e2.zombieTarget.flags.dead) && e2.timer.scan < 0) {
          const t3 = this.scanForZombies(e2, s);
          if (t3 > 0) {
            if (e2.flags.vip) {
              if (e2.state !== 4 /* escaping */) {
                this.changeState(e2, 4 /* escaping */);
              }
            } else if (Math.random() < t3 * this.fleeChancePerZombie) {
              this.changeState(e2, 3 /* fleeing */);
            } else {
              e2.target = e2.zombieTarget;
              this.changeState(e2, 2 /* attacking */);
            }
          }
        }
        switch (e2.state) {
          case 0 /* standing */: {
            e2.timer.standing -= t2;
            if (e2.timer.standing < 0) {
              this.assignRandomTarget(e2);
              this.changeState(e2, 1 /* walking */);
            }
            break;
          }
          case 1 /* walking */:
          case 3 /* fleeing */: {
            if (this.fastDistance(
              e2.position.x,
              e2.position.y,
              e2.target.x,
              e2.target.y
            ) < this.moveTargetDistance) {
              e2.target = void 0;
              e2.zombieTarget = void 0;
              this.changeState(e2, 0 /* standing */);
            } else {
              this.updateHumanSpeed(e2, t2);
            }
            break;
          }
          case 4 /* escaping */: {
            if (this.fastDistance(
              e2.position.x,
              e2.position.y,
              e2.target.x,
              e2.target.y
            ) < this.moveTargetDistance) {
              this.smoke.newDroneCloud(e2.x, e2.y);
              e2.flags.dead = true;
              e2.zombieTarget = void 0;
              e2.visible = false;
              this.vipText.visible = false;
              this.gameModel.sendMessage("The VIP has escaped!");
              this.gameModel.vipEscaped();
              setTimeout(
                () => {
                  this.vipEscaping = false;
                },
                2e3
                /* 2e3 */
              );
            } else {
              this.updateHumanSpeed(e2, t2);
            }
            break;
          }
          case 2 /* attacking */: {
            e2.scale.x = e2.target.x > e2.x ? this.scaling : -this.scaling;
            if (e2.zombieTarget && !e2.zombieTarget.flags.dead) {
              if (this.fastDistance(
                e2.position.x,
                e2.position.y,
                e2.target.x,
                e2.target.y
              ) < this.attackDistance) {
                if (e2.timer.attack < 0) {
                  this.zombies.damageZombie(e2.zombieTarget, this.attackDamage, e2);
                  this.inflictBurn(e2, e2.zombieTarget);
                  e2.timer.attack = this.attackSpeed;
                }
              } else {
                this.updateHumanSpeed(e2, t2);
              }
            } else {
              this.changeState(e2, 0 /* standing */);
            }
          }
        }
      }
      scanForZombies(e2, t2) {
        e2.timer.scan = this.scanTime;
        let s = 0;
        for (let i = 0; i < t2.length; i++) {
          if (!t2[i].flags.dead && Math.abs(t2[i].x - e2.x) < e2.visionDistance && Math.abs(t2[i].y - e2.y) < e2.visionDistance && (e2.zombieTarget = t2[i], s++, s > 9)) {
            return s;
          }
        }
        return s;
      }
    }
    class Me extends ve {
      constructor(...args) {
        super(...args);
        this.radioTime = 0;
        this.followTimer = 0;
      }
    }
    let policeState;
    ((policeState2) => {
      policeState2[policeState2["shooting"] = 0] = "shooting";
      policeState2[policeState2["attacking"] = 1] = "attacking";
      policeState2[policeState2["walking"] = 2] = "walking";
      policeState2[policeState2["running"] = 3] = "running";
      policeState2[policeState2["standing"] = 4] = "standing";
      policeState2[policeState2["following"] = 5] = "following";
      policeState2[policeState2["hunting"] = 6] = "hunting";
    })(policeState || (policeState = {}));
    class Police {
      constructor() {
        this.maxWalkSpeed = 15;
        this.maxRunSpeed = 40;
        this.police = [];
        this.discardedPolice = [];
        this.walkTexture = [];
        this.deadTexture = [];
        this.dogTexture = [];
        this.deadDogTexture = [];
        this.policeDogLevel = 20;
        this.policePerLevel = 1;
        this.attackSpeed = 2;
        this.attackDamage = 16;
        this.attackDistance = 20;
        this.moveTargetDistance = 5;
        this.shootDistance = 110;
        this.visionDistance = 150;
        this.scaling = 2;
        this.dogScaling = 1.3;
        this.radioTime = 30;
        if (Police.instance) {
          return Police.instance;
        }
        Police.instance = this;
      }
      isExtraPolice() {
        return (this.gameModel.level + 10) % 20 == 0;
      }
      getMaxPolice() {
        const e2 = Math.min(
          Math.round(this.policePerLevel * this.gameModel.level),
          100
        );
        return this.gameModel.level < 3 ? 0 : this.isExtraPolice() ? Math.max(2 * e2, 150) : e2;
      }
      getMaxHealth() {
        return Math.round(1.1 * this.humans.getMaxHealth(this.gameModel.level));
      }
      getAttackDamage() {
        this.attackDamage = Math.round(this.getMaxHealth() / 10);
      }
      populate() {
        this.map = new ee();
        this.gameModel = GameModel.getInstance();
        this.humans = new Humans();
        this.exclamations = new it();
        this.zombies = new Zombies();
        this.bullets = new rt();
        if (this.walkTexture.length == 0) {
          for (let e3 = 0; e3 < 3; e3++) {
            this.walkTexture.push(PIXI.Texture.from(`cop${e3 + 1}.png`));
          }
          this.deadTexture = [PIXI.Texture.from("cop4.png")];
          for (let e3 = 0; e3 < 2; e3++) {
            this.dogTexture.push(PIXI.Texture.from(`dog${e3 + 1}.png`));
          }
          this.deadDogTexture = [PIXI.Texture.from("dogdead.png")];
        }
        if (this.police.length > 0) {
          for (let e3 = 0; e3 < this.police.length; e3++) {
            g.removeChild(this.police[e3]);
          }
          this.discardedPolice = this.police.slice();
          this.police = [];
        }
        const e2 = this.getMaxPolice();
        const t2 = this.getMaxHealth();
        const s = 0.6 * t2;
        this.getAttackDamage();
        for (let i = 0; i < e2; i++) {
          let e3;
          if (this.discardedPolice.length > 0) {
            e3 = this.discardedPolice.pop();
            e3.alpha = 1;
            e3.textures = this.walkTexture;
          } else {
            e3 = new Me(this.walkTexture);
          }
          e3.reset();
          e3.flags.dog = false;
          e3.flags.dead = false;
          e3.flags.infected = false;
          e3.flags.burning = false;
          e3.burnDamage = 0;
          e3.plagueDamage = 0;
          e3.plagueTicks = 0;
          e3.deadTexture = this.deadTexture;
          e3.animationSpeed = 0.2;
          e3.anchor.set(35 / 80, 1);
          e3.currentPoi = this.map.getRandomBuilding();
          e3.position.copyFrom(this.map.randomPositionInBuilding(e3.currentPoi));
          e3.zIndex = e3.position.y;
          e3.xSpeed = 0;
          e3.ySpeed = 0;
          e3.radioTime = 5;
          e3.speedMod = 1;
          e3.lastKnownBuilding = void 0;
          e3.timer.plagueTick = Math.random() * this.humans.plagueTickTimer;
          e3.maxSpeed = this.maxWalkSpeed;
          e3.visionDistance = this.visionDistance;
          e3.visible = true;
          e3.maxHealth = t2;
          e3.health = t2;
          e3.timer.scan = Math.random() * this.humans.scanTime;
          e3.timer.standing = Math.random() * this.humans.randomSecondsToStand();
          e3.target = false;
          e3.zombieTarget = void 0;
          e3.policeState = 4 /* standing */;
          e3.timer.attack = this.attackSpeed;
          e3.scale.set(
            Math.random() > 0.5 ? this.scaling : -1 * this.scaling,
            this.scaling
          );
          this.police.push(e3);
          g.addChild(e3);
          if (this.gameModel.level >= this.policeDogLevel && Math.random() > 0.5) {
            this.createPoliceDog(e3, s);
          }
        }
        if (this.isExtraPolice()) {
          this.gameModel.sendMessage("Warning: High Police Activity!");
        }
      }
      createPoliceDog(e2, t2) {
        let s;
        if (this.discardedPolice.length > 0) {
          s = this.discardedPolice.pop();
          s.alpha = 1;
          s.textures = this.dogTexture;
        } else {
          s = new Me(this.dogTexture);
        }
        s.reset();
        s.owner = e2;
        s.flags.dog = true;
        s.flags.dead = false;
        s.flags.infected = false;
        s.flags.burning = false;
        s.burnDamage = 0;
        s.plagueDamage = 0;
        s.plagueTicks = 0;
        s.deadTexture = this.deadDogTexture;
        s.animationSpeed = 0.15;
        s.anchor.set(0.5, 1);
        s.position.set(e2.position.x + 3, e2.position.y);
        s.zIndex = s.position.y;
        s.xSpeed = 0;
        s.ySpeed = 0;
        s.speedMod = 1;
        s.lastKnownBuilding = null;
        s.timer.plagueTick = Math.random() * this.humans.plagueTickTimer;
        s.maxSpeed = this.maxRunSpeed;
        s.visionDistance = this.visionDistance;
        s.visible = true;
        s.maxHealth = t2;
        s.health = t2;
        s.timer.scan = Math.random() * this.humans.scanTime;
        s.target = e2;
        s.zombieTarget = null;
        s.policeState = 5 /* following */;
        s.followTimer = 0;
        s.timer.attack = this.attackSpeed;
        s.scale.set(
          Math.random() > 0.5 ? this.dogScaling : -1 * this.dogScaling,
          this.dogScaling
        );
        this.police.push(s);
        g.addChild(s);
      }
      update(e2, t2) {
        let s = 0;
        for (let i = 0; i < this.police.length; i++) {
          if (this.police[i].flags.dog) {
            this.updatePoliceDog(this.police[i], e2, t2);
          } else {
            this.updatePolice(this.police[i], e2, t2);
          }
          if (!this.police[i].flags.dead) {
            this.humans.aliveHumans.push(this.police[i]);
            s++;
          }
        }
        this.gameModel.stats.police.count = s;
      }
      decideStateOnZombieDistance(e2) {
        if (e2.zombieTarget && !e2.zombieTarget.flags.dead) {
          e2.target = e2.zombieTarget;
          const t2 = weighted_hybrid_distance(
            e2.position.x,
            e2.position.y,
            e2.zombieTarget.x,
            e2.zombieTarget.y
          );
          if (t2 > this.shootDistance) {
            return void this.changeState(e2, 3 /* running */);
          }
          if (t2 < this.attackDistance) {
            return void this.changeState(e2, 1 /* attacking */);
          }
          this.changeState(e2, 0 /* shooting */);
        }
      }
      changeState(e2, t2) {
        switch (t2) {
          case 4 /* standing */: {
            e2.gotoAndStop(0);
            break;
          }
          case 2 /* walking */: {
            e2.play();
            e2.maxSpeed = this.maxWalkSpeed;
            break;
          }
          case 3 /* running */: {
            e2.play();
            e2.maxSpeed = this.maxRunSpeed;
            break;
          }
          case 0 /* shooting */: {
            e2.gotoAndStop(0);
            break;
          }
          case 1 /* attacking */: {
            e2.play();
          }
        }
        e2.policeState = t2;
      }
      radioForBackup(e2) {
        let t2 = null;
        let s = 2e3;
        for (let a = 0; a < this.police.length; a++) {
          if (!this.police[a].flags.dead && !this.police[a].flags.dog && (!this.police[a].zombieTarget || this.police[a].zombieTarget.flags.dead)) {
            const r = weighted_hybrid_distance(
              e2.x,
              e2.y,
              this.police[a].x,
              this.police[a].y
            );
            if (r < s) {
              t2 = this.police[a];
              s = r;
            }
          }
        }
        if (t2) {
          t2.zombieTarget = e2.zombieTarget;
          this.exclamations.newRadio(e2);
          this.exclamations.newRadio(t2);
          e2.radioTime = this.radioTime;
          t2.radioTime = this.radioTime;
        }
      }
      updatePolice(e2, t2, s) {
        if (e2.flags.dead) {
          return this.humans.updateDeadHumanFading(e2, t2);
        }
        e2.timer.attack -= t2;
        e2.timer.scan -= t2;
        e2.radioTime -= t2;
        if (e2.flags.infected) {
          this.humans.updatePlague(e2, t2);
        }
        if (e2.flags.burning) {
          this.humans.updateBurns(e2, t2);
        }
        if ((!e2.zombieTarget || e2.zombieTarget.flags.dead) && e2.timer.scan < 0) {
          this.humans.scanForZombies(e2, s);
          if (e2.zombieTarget && !e2.zombieTarget.flags.dead && e2.radioTime < 0) {
            this.radioForBackup(e2);
          }
        }
        this.decideStateOnZombieDistance(e2);
        switch (e2.policeState) {
          case 4 /* standing */: {
            e2.timer.standing -= t2;
            if (e2.timer.standing < 0) {
              this.humans.assignRandomTarget(e2);
              this.changeState(e2, 2 /* walking */);
            }
            break;
          }
          case 2 /* walking */: {
            if (weighted_hybrid_distance(
              e2.position.x,
              e2.position.y,
              e2.target.x,
              e2.target.y
            ) < this.moveTargetDistance) {
              e2.target = false;
              e2.zombieTarget = null;
              e2.timer.standing = this.humans.randomSecondsToStand();
              this.changeState(e2, 4 /* standing */);
            } else {
              this.humans.updateHumanSpeed(e2, t2);
            }
            break;
          }
          case 3 /* running */: {
            if (e2.zombieTarget && !e2.zombieTarget.flags.dead) {
              if (e2.target) {
                this.humans.updateHumanSpeed(e2, t2);
              }
            } else {
              this.changeState(e2, 4 /* standing */);
            }
            break;
          }
          case 1 /* attacking */: {
            if (e2.zombieTarget && !e2.zombieTarget.flags.dead) {
              e2.scale.x = e2.zombieTarget.x > e2.x ? this.scaling : -this.scaling;
              if (e2.timer.attack < 0) {
                this.zombies.damageZombie(e2.zombieTarget, this.attackDamage, e2);
                e2.timer.attack = this.attackSpeed;
              }
            } else {
              this.changeState(e2, 4 /* standing */);
            }
            break;
          }
          case 0 /* shooting */: {
            if (e2.zombieTarget && !e2.zombieTarget.flags.dead) {
              e2.scale.x = e2.zombieTarget.x > e2.x ? this.scaling : -this.scaling;
              if (e2.timer.attack < 0) {
                this.bullets.newBullet(e2, e2.zombieTarget, this.attackDamage);
                e2.timer.attack = this.attackSpeed;
              }
            } else {
              this.changeState(e2, 4 /* standing */);
            }
          }
        }
      }
      updateDogSpeed(e2, t2) {
        this.humans.updateHumanSpeed(e2, t2);
        if (Math.abs(e2.xSpeed) > 1) {
          e2.scale.x = e2.xSpeed > 0 ? this.dogScaling : -this.dogScaling;
        }
      }
      updatePoliceDog(e2, t2, s) {
        if (e2.flags.dead) {
          return this.humans.updateDeadHumanFading(e2, t2);
        }
        e2.timer.attack -= t2;
        e2.timer.scan -= t2;
        if (e2.flags.infected) {
          this.humans.updatePlague(e2, t2);
        }
        if (e2.flags.burning) {
          this.humans.updateBurns(e2, t2);
        }
        switch (e2.policeState) {
          case 5 /* following */: {
            if (e2.owner.flags.dead) {
              e2.policeState = 6 /* hunting */;
              e2.play();
              break;
            }
            if (e2.owner.zombieTarget && !e2.owner.zombieTarget.flags.dead) {
              e2.policeState = 1 /* attacking */;
              e2.play();
              e2.target = e2.owner.zombieTarget;
              break;
            }
            e2.target = e2.owner;
            if (weighted_hybrid_distance(
              e2.position.x,
              e2.position.y,
              e2.target.x,
              e2.target.y
            ) < this.moveTargetDistance) {
              e2.followTimer = 3 * Math.random();
              e2.gotoAndStop(0);
            } else {
              e2.followTimer -= t2;
              if (e2.followTimer < 0) {
                e2.play();
                this.updateDogSpeed(e2, t2);
              }
            }
            break;
          }
          case 1 /* attacking */: {
            if (e2.zombieTarget && !e2.zombieTarget.flags.dead) {
              if (weighted_hybrid_distance(
                e2.position.x,
                e2.position.y,
                e2.zombieTarget.x,
                e2.zombieTarget.y
              ) < this.moveTargetDistance) {
                e2.scale.x = e2.target.x > e2.x ? this.dogScaling : -this.dogScaling;
                if (e2.timer.attack < 0) {
                  this.zombies.damageZombie(e2.zombieTarget, this.attackDamage, e2);
                  e2.target.dogStun = 1;
                  e2.timer.attack = this.attackSpeed;
                }
              } else {
                e2.target = e2.zombieTarget;
                this.updateDogSpeed(e2, t2);
              }
            } else {
              e2.policeState = 5 /* following */;
            }
            break;
          }
          case 6 /* hunting */: {
            if ((!e2.zombieTarget || e2.zombieTarget.flags.dead) && e2.timer.scan < 0) {
              this.humans.scanForZombies(e2, s);
              if (e2.zombieTarget) {
                e2.policeState = 1 /* attacking */;
              }
            }
            if (weighted_hybrid_distance(
              e2.position.x,
              e2.position.y,
              e2.target.x,
              e2.target.y
            ) < this.moveTargetDistance) {
              e2.target = {
                x: Math.random() * P.x,
                y: Math.random() * P.y
              };
              e2.maxSpeed = this.maxRunSpeed;
            } else {
              this.updateDogSpeed(e2, t2);
            }
          }
        }
      }
    }
    class we extends ve {
      constructor(...args) {
        super(...args);
        this.minigun = false;
        this.rocketlauncher = false;
        this.attackingGraveyard = false;
        this.shotsLeft = 0;
        this.shotTimer = 0;
      }
    }
    let armyState;
    ((armyState2) => {
      armyState2[armyState2["shooting"] = 0] = "shooting";
      armyState2[armyState2["attacking"] = 1] = "attacking";
      armyState2[armyState2["walking"] = 2] = "walking";
      armyState2[armyState2["running"] = 3] = "running";
      armyState2[armyState2["standing"] = 4] = "standing";
    })(armyState || (armyState = {}));
    class Army {
      constructor() {
        this.maxWalkSpeed = 20;
        this.maxRunSpeed = 50;
        this.armymen = [];
        this.discardedArmymen = [];
        this.textures = [];
        this.aliveZombies = [];
        this.armyPerLevel = 0.9;
        this.attackSpeed = 2;
        this.attackDamage = 20;
        this.attackDistance = 25;
        this.moveTargetDistance = 5;
        this.shootDistance = 130;
        this.visionDistance = 200;
        this.scaling = 2;
        this.shotsPerBurst = 3;
        this.droneStrikeTimer = 0;
        this.droneStrikeTime = 35;
        this.assaultStarted = false;
        this.droneStrike = null;
        this.droneActive = false;
        this.droneBlastRadius = 35;
        if (Army.instance) {
          return Army.instance;
        }
        Army.instance = this;
      }
      isExtraArmy() {
        return this.gameModel.level % 20 == 0;
      }
      getMaxArmy() {
        const e2 = Math.min(
          Math.round(this.armyPerLevel * this.gameModel.level),
          100
        );
        return this.gameModel.level < 11 ? 0 : this.isExtraArmy() ? Math.max(2 * e2, 150) : this.gameModel.isBossStage(this.gameModel.level) ? Math.max(e2, 75) : e2;
      }
      getMaxHealth() {
        return Math.round(1.2 * this.humans.getMaxHealth(this.gameModel.level));
      }
      getAttackDamage() {
        this.attackDamage = Math.round(this.getMaxHealth() / 10);
      }
      populate() {
        this.map = new ee();
        this.zombies = new Zombies();
        this.humans = new Humans();
        this.gameModel = GameModel.getInstance();
        this.graveyard = new Graveyard();
        this.bullets = new rt();
        this.assaultStarted = false;
        this.blasts = new nt();
        this.exclamations = new it();
        if (this.textures.length == 0) {
          for (let e3 = 0; e3 < 3; e3++) {
            const t3 = [];
            for (let s = 0; s < 3; s++) {
              t3.push(PIXI.Texture.from(`army${e3 + 1}_${s + 1}.png`));
            }
            this.textures.push({
              animated: t3,
              dead: [PIXI.Texture.from(`army${e3 + 1}_dead.png`)]
            });
          }
        }
        if (this.droneStrike && this.droneStrike.laser) {
          b.removeChild(this.droneStrike.text);
          b.removeChild(this.droneStrike.laser);
        }
        if (this.armymen.length > 0) {
          for (let e3 = 0; e3 < this.armymen.length; e3++) {
            g.removeChild(this.armymen[e3]);
          }
          this.discardedArmymen = this.armymen.slice();
          this.armymen = [];
        }
        const e2 = this.getMaxArmy();
        const t2 = this.getMaxHealth();
        this.getAttackDamage();
        this.droneStrike = false;
        this.droneStrikeTimer = Math.random() * this.droneStrikeTime;
        this.droneActive = this.gameModel.level >= 25;
        for (let s = 0; s < e2; s++) {
          let e3;
          let s2 = 0;
          if (this.gameModel.level > 35 && Math.random() < 0.3) {
            s2 = 1;
          }
          if (this.gameModel.level > 45 && Math.random() < 0.3 || this.gameModel.isBossStage(this.gameModel.level) && Math.random() < 0.5) {
            s2 = 2;
          }
          if (this.discardedArmymen.length > 0) {
            e3 = this.discardedArmymen.pop();
            e3.alpha = 1;
            e3.textures = this.textures[s2].animated;
          } else {
            e3 = new we(this.textures[s2].animated);
          }
          e3.reset();
          e3.flags.dead = false;
          e3.flags.infected = false;
          e3.flags.burning = false;
          e3.burnDamage = 0;
          e3.plagueDamage = 0;
          e3.minigun = s2 == 1;
          e3.rocketlauncher = s2 == 2;
          e3.deadTexture = this.textures[s2].dead;
          e3.animationSpeed = 0.2;
          e3.anchor.set(35 / 80, 1);
          e3.currentPoi = this.map.getRandomBuilding();
          e3.position.copyFrom(this.map.randomPositionInBuilding(e3.currentPoi));
          e3.zIndex = e3.position.y;
          e3.xSpeed = 0;
          e3.ySpeed = 0;
          e3.speedMod = 1;
          e3.lastKnownBuilding = null;
          e3.maxSpeed = this.maxWalkSpeed;
          e3.visionDistance = this.visionDistance;
          e3.visible = true;
          e3.maxHealth = t2;
          e3.health = t2;
          e3.timer.attack = this.attackSpeed;
          e3.timer.plagueTick = Math.random() * this.humans.plagueTickTimer;
          e3.timer.scan = Math.random() * this.humans.scanTime;
          e3.timer.standing = Math.random() * this.humans.randomSecondsToStand();
          e3.target = false;
          e3.zombieTarget = null;
          e3.graveYardTarget = null;
          e3.armyState = 4 /* standing */;
          e3.attackingGraveyard = false;
          e3.scale.set(
            Math.random() > 0.5 ? this.scaling : -1 * this.scaling,
            this.scaling
          );
          this.armymen.push(e3);
          g.addChild(e3);
        }
        if (this.isExtraArmy()) {
          this.gameModel.sendMessage("Warning: High Military Activity!");
        }
      }
      update(e2, t2) {
        let s = 0;
        this.aliveZombies = t2;
        if (this.droneActive) {
          this.droneStrikeTimer -= e2;
        }
        for (let i = 0; i < this.armymen.length; i++) {
          this.updateArmy(this.armymen[i], e2, t2);
          if (!this.armymen[i].flags.dead) {
            this.humans.aliveHumans.push(this.armymen[i]);
            if (this.armymen[i].attackingGraveyard) {
              this.humans.graveyardAttackers.push(this.armymen[i]);
            }
            s++;
          }
        }
        this.gameModel.stats.army.count = s;
        this.updateDroneStrike(e2, t2);
      }
      decideStateOnZombieDistance(e2) {
        if (e2.graveYardTarget || e2.zombieTarget && !e2.zombieTarget.flags.dead) {
          e2.target = e2.graveYardTarget ?? e2.zombieTarget;
          const s = weighted_hybrid_distance(
            e2.position.x,
            e2.position.y,
            e2.target.x,
            e2.target.y
          );
          if (s > this.shootDistance && !e2.rocketlauncher) {
            return void this.changeState(e2, 3 /* running */);
          }
          if (s > 1.2 * this.shootDistance && e2.rocketlauncher) {
            return void this.changeState(e2, 3 /* running */);
          }
          if (s < this.attackDistance && !e2.graveYardTarget) {
            return void this.changeState(e2, 1 /* attacking */);
          }
          this.changeState(e2, 0 /* shooting */);
        }
      }
      changeState(e2, t2) {
        switch (t2) {
          case 4 /* standing */: {
            e2.gotoAndStop(0);
            break;
          }
          case 2 /* walking */: {
            e2.play();
            e2.maxSpeed = this.maxWalkSpeed;
            break;
          }
          case 3 /* running */: {
            e2.play();
            e2.maxSpeed = this.maxRunSpeed;
            break;
          }
          case 0 /* shooting */: {
            e2.gotoAndStop(0);
            break;
          }
          case 1 /* attacking */: {
            e2.play();
          }
        }
        e2.armyState = t2;
      }
      updateArmy(e2, t2, s) {
        if (e2.flags.dead) {
          return this.humans.updateDeadHumanFading(e2, t2);
        }
        e2.timer.attack -= t2;
        e2.timer.scan -= t2;
        if (e2.flags.infected) {
          this.humans.updatePlague(e2, t2);
        }
        if (e2.flags.burning) {
          this.humans.updateBurns(e2, t2);
        }
        if (!e2.graveYardTarget && (!e2.zombieTarget || e2.zombieTarget.flags.dead) && e2.timer.scan < 0) {
          if (this.humans.scanForZombies(e2, s) > 3 && this.droneActive && this.droneStrikeTimer < 0) {
            this.callDroneStrike(e2, s);
          }
          if (this.assaultStarted && e2.rocketlauncher && Math.random() > 0.98) {
            e2.graveYardTarget = this.graveyard.target;
            e2.attackingGraveyard = true;
          }
        }
        this.decideStateOnZombieDistance(e2);
        switch (e2.armyState) {
          case 4 /* standing */: {
            e2.timer.standing -= t2;
            if (e2.timer.standing < 0) {
              this.humans.assignRandomTarget(e2);
              this.changeState(e2, 2 /* walking */);
            }
            break;
          }
          case 2 /* walking */: {
            if (weighted_hybrid_distance(
              e2.position.x,
              e2.position.y,
              e2.target.x,
              e2.target.y
            ) < this.moveTargetDistance) {
              e2.target = null;
              e2.zombieTarget = null;
              e2.timer.standing = this.humans.randomSecondsToStand();
              this.changeState(e2, 4 /* standing */);
            } else {
              this.humans.updateHumanSpeed(e2, t2);
            }
            break;
          }
          case 3 /* running */: {
            if (e2.graveYardTarget || e2.zombieTarget && !e2.zombieTarget.flags.dead) {
              e2.target = e2.graveYardTarget ?? e2.zombieTarget;
              this.humans.updateHumanSpeed(e2, t2);
            } else {
              this.changeState(e2, 4 /* standing */);
            }
            break;
          }
          case 1 /* attacking */: {
            if (e2.zombieTarget && !e2.zombieTarget.flags.dead) {
              e2.scale.x = e2.zombieTarget.x > e2.x ? this.scaling : -this.scaling;
              if (e2.timer.attack < 0) {
                this.zombies.damageZombie(e2.zombieTarget, this.attackDamage, e2);
                e2.timer.attack = this.attackSpeed;
              }
            } else {
              this.changeState(e2, 4 /* standing */);
            }
            break;
          }
          case 0 /* shooting */: {
            if (e2.graveYardTarget || e2.zombieTarget && !e2.zombieTarget.flags.dead) {
              e2.target = e2.graveYardTarget ?? e2.zombieTarget;
              e2.scale.x = e2.target.x > e2.x ? this.scaling : -this.scaling;
              if (e2.timer.attack < 0) {
                e2.shotsLeft = this.shotsPerBurst;
                if (e2.minigun) {
                  e2.shotsLeft = 3 * this.shotsPerBurst;
                }
                if (e2.rocketlauncher) {
                  e2.shotsLeft = 1;
                }
                e2.timer.attack = e2.rocketlauncher ? 1.5 * this.attackSpeed : this.attackSpeed;
                e2.shotTimer = 0;
              }
              if (e2.shotsLeft > 0) {
                e2.shotTimer -= t2;
                if (e2.shotTimer < 0) {
                  e2.shotTimer = 0.15;
                  if (e2.minigun) {
                    e2.shotTimer = 0.08;
                  }
                  this.bullets.newBullet(
                    e2,
                    e2.target,
                    e2.rocketlauncher ? 1.2 * this.attackDamage : e2.minigun ? this.attackDamage / 2 : this.attackDamage,
                    false,
                    e2.rocketlauncher
                  );
                  e2.shotsLeft--;
                }
              }
            } else {
              this.changeState(e2, 4 /* standing */);
            }
          }
        }
      }
      callDroneStrike(e2, t2) {
        let s = 0;
        for (let i2 = 0; i2 < t2.length; i2++) {
          if (t2[i2].x > e2.zombieTarget.x - this.droneBlastRadius && t2[i2].x < e2.zombieTarget.x + this.droneBlastRadius && t2[i2].y > e2.zombieTarget.y - this.droneBlastRadius && t2[i2].y < e2.zombieTarget.y + this.droneBlastRadius) {
            s++;
          }
        }
        let i = 0;
        const a = this.humans.aliveHumans;
        for (let t3 = 0; t3 < a.length; t3++) {
          if (a[t3].x > e2.zombieTarget.x - this.droneBlastRadius && a[t3].x < e2.zombieTarget.x + this.droneBlastRadius && a[t3].y > e2.zombieTarget.y - this.droneBlastRadius && a[t3].y < e2.zombieTarget.y + this.droneBlastRadius) {
            i++;
          }
        }
        if (s > 1 && i == 0) {
          this.exclamations.newRadio(e2);
          this.droneStrikeTimer = this.droneStrikeTime;
          this.droneStrike = {
            caller: e2,
            target: e2.zombieTarget,
            timer: 3,
            bombsLeft: 3
          };
        }
      }
      droneBomb(e2) {
        this.droneExplosion(
          this.droneStrike.target.x + 32 * (Math.random() - 1),
          this.droneStrike.target.y + 32 * (Math.random() - 1),
          e2,
          3 * this.attackDamage
        );
        this.droneStrike.timer = 0.3;
        this.droneStrike.bombsLeft--;
      }
      droneExplosion(e2, t2, s, i) {
        if (!s) {
          s = this.aliveZombies;
        }
        this.blasts.newDroneBlast(e2, t2);
        for (let a = 0; a < s.length; a++) {
          if (s[a].x > e2 - this.droneBlastRadius && s[a].x < e2 + this.droneBlastRadius && s[a].y > t2 - this.droneBlastRadius && s[a].y < t2 + this.droneBlastRadius) {
            this.zombies.damageZombie(s[a], i, null);
          }
        }
      }
      updateDroneStrike(e2, t2) {
        if (this.droneStrike) {
          this.droneStrike.timer -= e2;
          if (!this.droneStrike.startedBombing) {
            if (!this.droneStrike.text) {
              this.droneStrike.text = new PIXI.Text("3", {
                fontFamily: "sans-serif",
                fontSize: 40,
                fill: "#F00",
                stroke: "#000",
                strokeThickness: 0,
                align: "center"
              });
              this.droneStrike.text.anchor = {
                x: 0.5,
                y: 1
              };
              this.droneStrike.text.scale.x = 0.5;
              this.droneStrike.text.scale.y = 0.5;
              b.addChild(this.droneStrike.text);
              this.droneStrike.laser = new PIXI.Graphics();
              b.addChild(this.droneStrike.laser);
            }
            this.droneStrike.text.text = Math.ceil(this.droneStrike.timer);
            this.droneStrike.text.x = this.droneStrike.target.x;
            this.droneStrike.text.y = this.droneStrike.target.y - 30;
            this.droneStrike.laser.clear();
            this.droneStrike.laser.lineStyle(1, 16711680);
            this.droneStrike.laser.moveTo(
              this.droneStrike.caller.x,
              this.droneStrike.caller.y - 10
            );
            this.droneStrike.laser.lineTo(
              this.droneStrike.target.x,
              this.droneStrike.target.y - 10
            );
          }
          if ((this.droneStrike.caller.dead || this.droneStrike.target.dead) && !this.droneStrike.startedBombing) {
            b.removeChild(this.droneStrike.text);
            b.removeChild(this.droneStrike.laser);
            this.droneStrike = false;
            return void (this.droneStrikeTimer = 0);
          }
          if (this.droneStrike.timer < 0) {
            if (!this.droneStrike.startedBombing) {
              b.removeChild(this.droneStrike.text);
              b.removeChild(this.droneStrike.laser);
              this.droneStrike.startedBombing = true;
            }
            this.droneBomb(t2);
            if (this.droneStrike.bombsLeft <= 0) {
              this.droneStrike = false;
            }
          }
        }
      }
    }
    class Ce extends ve {
      constructor(...args) {
        super(...args);
        this.attackingGraveyard = false;
      }
    }
    let tankState;
    ((tankState2) => {
      tankState2[tankState2["shooting"] = 0] = "shooting";
      tankState2[tankState2["attacking"] = 1] = "attacking";
      tankState2[tankState2["patrolling"] = 2] = "patrolling";
    })(tankState || (tankState = {}));
    let currentDirection;
    ((currentDirection2) => {
      currentDirection2[currentDirection2["horizontal"] = 0] = "horizontal";
      currentDirection2[currentDirection2["vertical"] = 1] = "vertical";
    })(currentDirection || (currentDirection = {}));
    class De {
      constructor() {
        this.speed = 20;
        this.tanks = [];
        this.aliveTanks = [];
        this.attackDamage = 0;
        this.attackSpeed = 3;
        this.scaling = 3;
        this.moveTargetDistance = 20;
        this.shootDistance = 300;
        this.aliveZombies = null;
        if (De.instance) {
          return De.instance;
        }
        De.instance = this;
      }
      getMaxTanks() {
        return this.gameModel.isBossStage(this.gameModel.level) ? Math.min(Math.round(this.gameModel.level / 30), 20) : 0;
      }
      getMaxHealth() {
        return Math.round(10 * this.humans.getMaxHealth(this.gameModel.level));
      }
      getAttackDamage() {
        this.attackDamage = Math.round(this.getMaxHealth() / 10);
      }
      populate() {
        this.map = new ee();
        this.gameModel = GameModel.getInstance();
        this.zombies = new Zombies();
        this.humans = new Humans();
        this.army = new Army();
        this.graveyard = new Graveyard();
        this.bullets = new rt();
        if (!this.textures) {
          this.textures = {
            vertical: [],
            horizontal: [],
            turret: null
          };
          for (let e3 = 0; e3 < 2; e3++) {
            this.textures.horizontal.push(PIXI.Texture.from(`tank${e3}.png`));
          }
          for (let e3 = 2; e3 < 4; e3++) {
            this.textures.vertical.push(PIXI.Texture.from(`tank${e3}.png`));
          }
          this.textures.turret = PIXI.Texture.from("tank4.png");
        }
        if (this.tanks.length > 0) {
          for (let e3 = 0; e3 < this.tanks.length; e3++) {
            g.removeChild(this.tanks[e3]);
          }
          this.tanks = [];
          this.aliveTanks = [];
        }
        const e2 = this.getMaxTanks();
        const t2 = this.getMaxHealth();
        this.getAttackDamage();
        for (let s = 0; s < e2; s++) {
          const e3 = new Ce(this.textures.horizontal);
          e3.flags.tank = true;
          e3.turretSprite = new PIXI.Sprite(this.textures.turret);
          e3.addChild(e3.turretSprite);
          e3.animationSpeed = 0.2;
          e3.anchor.set(0.5, 1);
          e3.turretSprite.anchor.set(7.5 / 16, 7.5 / 16);
          e3.x = 0;
          e3.y = 0;
          e3.play();
          e3.turretSprite.x = 0;
          e3.turretSprite.y = -7;
          e3.currentDirection = 0 /* horizontal */;
          e3.currentPoi = this.map.getRandomBuilding();
          e3.position.copyFrom(this.map.randomPositionInBuilding(e3.currentPoi));
          e3.zIndex = e3.position.y;
          e3.xSpeed = 0;
          e3.ySpeed = 0;
          e3.speedMod = 1;
          e3.flags.dead = false;
          e3.flags.infected = false;
          e3.flags.burning = false;
          e3.burnDamage = 0;
          e3.lastKnownBuilding = null;
          e3.plagueDamage = 0;
          e3.timer.plagueTick = Math.random() * this.humans.plagueTickTimer;
          e3.maxSpeed = this.speed;
          e3.visionDistance = 250;
          e3.visible = true;
          e3.maxHealth = t2;
          e3.health = t2;
          e3.timer.scan = Math.random() * this.humans.scanTime;
          e3.target = false;
          e3.zombieTarget = null;
          e3.graveYardTarget = null;
          e3.attackingGraveyard = false;
          e3.tankState = 2 /* patrolling */;
          e3.timer.attack = this.attackSpeed;
          e3.scale.set(this.scaling, this.scaling);
          this.tanks.push(e3);
          g.addChild(e3);
        }
      }
      update(e2, t2) {
        this.aliveZombies = t2;
        this.aliveTanks = [];
        for (let s = 0; s < this.tanks.length; s++) {
          this.updateTank(this.tanks[s], e2, t2);
          if (!this.tanks[s].flags.dead) {
            this.humans.aliveHumans.push(this.tanks[s]);
            this.aliveTanks.push(this.tanks[s]);
            if (this.tanks[s].attackingGraveyard) {
              this.humans.graveyardAttackers.push(this.tanks[s]);
            }
          }
        }
      }
      updateTank(e2, t2, s) {
        if (e2.flags.dead) {
          return this.humans.updateDeadHumanFading(e2, t2);
        }
        e2.timer.attack -= t2;
        e2.timer.scan -= t2;
        if (e2.flags.burning) {
          this.humans.updateBurns(e2, t2);
        }
        if (!e2.attackingGraveyard && (!e2.zombieTarget || e2.zombieTarget.flags.dead) && e2.timer.scan < 0) {
          this.humans.scanForZombies(e2, s);
          if (this.army.assaultStarted && Math.random() > 0.9) {
            e2.graveYardTarget = this.graveyard.target, e2.attackingGraveyard = true;
          }
        }
        this.decideStateOnZombieDistance(e2);
        switch (e2.tankState) {
          case 2 /* patrolling */: {
            if (!e2.target) {
              e2.target = this.map.randomPositionInBuilding(null);
            }
            if (weighted_hybrid_distance(
              e2.position.x,
              e2.position.y,
              e2.target.x,
              e2.target.y
            ) < this.moveTargetDistance) {
              e2.target = false;
              e2.zombieTarget = null;
            } else {
              this.humans.updateHumanSpeed(e2, t2);
            }
            break;
          }
          case 1 /* attacking */: {
            if (e2.attackingGraveyard) {
              e2.target = e2.graveYardTarget;
              this.humans.updateHumanSpeed(e2, t2);
            } else if (e2.zombieTarget && !e2.zombieTarget.flags.dead) {
              this.humans.updateHumanSpeed(e2, t2);
            } else {
              this.changeState(e2, 2 /* patrolling */);
            }
            break;
          }
          case 0 /* shooting */: {
            if (e2.graveYardTarget || e2.zombieTarget && !e2.zombieTarget.flags.dead) {
              if (e2.timer.attack < 0) {
                e2.timer.attack = this.attackSpeed;
                this.bullets.newBullet(
                  e2,
                  e2.graveYardTarget || e2.zombieTarget,
                  this.attackDamage,
                  false,
                  true
                );
              }
            } else {
              this.changeState(e2, 2 /* patrolling */);
            }
          }
        }
        this.updateTankSprites(e2, t2);
      }
      updateTankSprites(e2, t2) {
        if (Math.abs(e2.xSpeed) > Math.abs(e2.ySpeed)) {
          if (e2.currentDirection != 0 /* horizontal */) {
            e2.currentDirection = 0 /* horizontal */;
            e2.textures = this.textures.horizontal;
            e2.play();
            e2.turretSprite.y = -7;
          }
        } else if (e2.currentDirection != 1 /* vertical */) {
          e2.currentDirection = 1 /* vertical */;
          e2.textures = this.textures.vertical;
          e2.play();
          e2.turretSprite.y = -8;
        }
        if (e2.graveYardTarget || e2.zombieTarget) {
          e2.target = e2.graveYardTarget ?? e2.zombieTarget;
          const i = Math.atan2(e2.target.x - e2.x, e2.y - e2.target.y) + Math.PI / 2;
          if (e2.turretSprite.rotation > i) {
            e2.turretSprite.rotation -= 3 * t2;
          } else {
            e2.turretSprite.rotation += 3 * t2;
          }
        }
      }
      decideStateOnZombieDistance(e2) {
        if (e2.graveYardTarget || e2.zombieTarget && !e2.zombieTarget.flags.dead) {
          e2.target = e2.graveYardTarget ?? e2.zombieTarget;
          if (weighted_hybrid_distance(
            e2.position.x,
            e2.position.y,
            e2.target.x,
            e2.target.y
          ) > this.shootDistance) {
            return void this.changeState(e2, 1 /* attacking */);
          }
          this.changeState(e2, 0 /* shooting */);
        }
      }
      changeState(e2, t2) {
        switch (t2) {
          case 2 /* patrolling */:
          case 1 /* attacking */: {
            e2.play();
            break;
          }
          case 0 /* shooting */: {
            e2.gotoAndStop(0);
          }
        }
        e2.tankState = t2;
      }
    }
    class Pe extends Q {
      constructor(...args) {
        super(...args);
        this.currentDirection = 0;
        this.bulletReflect = 0;
        this.zombieId = 0;
        this.lastKnownBuilding = null;
        this.maxSpeed = 0;
        this.graveyard = false;
        this.regenTimer = 0;
        this.bloodbornTimer = 0;
        this.level = 0;
        this.creatureType = 0;
        this.scaling = 0;
        this.attackDamage = 0;
        this.speedMultiplier = 1;
        this.price = 0;
        this.immuneToBurns = false;
        this.zombie = true;
        this.textureSet = {
          set: false,
          down: [],
          up: [],
          left: [],
          right: [],
          dead: []
        };
      }
    }
    let zombieState;
    ((zombieState2) => {
      zombieState2[zombieState2["lookingForTarget"] = 0] = "lookingForTarget";
      zombieState2[zombieState2["movingToTarget"] = 1] = "movingToTarget";
      zombieState2[zombieState2["attackingTarget"] = 2] = "attackingTarget";
    })(zombieState || (zombieState = {}));
    class ze extends PIXI.Text {
      constructor(...args) {
        super(...args);
        this.speed = 30;
        this.fadeTime = 0.5;
      }
      updateCritTeext(e2) {
        if (this.visible) {
          this.y -= this.speed * e2;
          this.fadeTime -= e2;
          if (this.fadeTime < 0) {
            this.alpha -= 2 * e2;
            if (this.alpha < 0) {
              this.visible = false;
              Re.push(this);
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
    const Ie = new PIXI.TextStyle({
      fill: "#ef0",
      fontSize: 64
    });
    const Be = [];
    const Re = [];
    function He(e2, t2, s) {
      if (GameModel.getInstance().persistentData.particles) {
        if (Re.length > 0) {
          const i = Re.pop();
          i.reset();
          i.text = formatDecimal(s);
          i.position.set(e2, t2);
        } else {
          const i = new ze(formatDecimal(s), Ie);
          b.addChild(i);
          i.position.set(e2, t2);
          i.anchor.set(0.5, 1);
          i.scale.set(0.2, 0.2);
          Be.push(i);
        }
      }
    }
    class Fe extends K {
      constructor(...args) {
        super(...args);
        this.dog = false;
        this.super = false;
      }
    }
    class Ee extends Pe {
      constructor(...args) {
        super(...args);
        this.flags = new Fe();
        this.mod = 1;
        this.scaleMod = 1;
        this.textureId = 0;
        this.turnTimer = 0;
      }
    }
    class Zombies {
      constructor() {
        this.zombies = [];
        this.discardedZombies = [];
        this.aliveZombies = [];
        this.aliveHumans = [];
        this.zombiePartition = [];
        this.scaling = 2;
        this.moveTargetDistance = 15;
        this.attackDistance = 15;
        this.attackSpeed = 3;
        this.targetDistance = 100;
        this.fadeSpeed = 0.1;
        this.refundChance = 0;
        this.currId = 1;
        this.scanTime = 3;
        this.textures = [];
        this.dogTexture = [];
        this.deadDogTexture = [];
        this.maxSpeed = 10;
        this.zombieCursor = null;
        this.zombieCursorText = null;
        this.zombieCursorScale = 3;
        this.mouseOutOfBounds = false;
        this.burnTickTimer = 5;
        this.bloodpact = 1;
        this.bloodborn = 0;
        this.gigamutagen = 0;
        this.gigamutationTimer = 10;
        this.smokeTimer = 0.3;
        this.fastDistance = weighted_hybrid_distance;
        this.magnitude = pythag;
        this.detonate = false;
        this.super = false;
        this.reactionTime = 0;
        this.graveyardAttackers = [];
        this.spaceNeeded = 3;
        if (Zombies.instance) {
          return Zombies.instance;
        }
        Zombies.instance = this;
      }
      populate() {
        this.map = new ee();
        this.model = GameModel.getInstance();
        this.humans = new Humans();
        this.graveyard = new Graveyard();
        this.creatureFactory = new CreatureFactory();
        this.smoke = new ot();
        this.blood = new _e();
        this.bones = new Bones();
        this.exclamations = new it();
        this.blasts = new nt();
        this.bullets = new rt();
        this.model.zombieCount = 0;
        if (this.textures.length == 0) {
          for (let e2 = 0; e2 < 3; e2++) {
            const t2 = [];
            for (let s = 0; s < 3; s++) {
              t2.push(PIXI.Texture.from(`zombie${e2 + 1}_${s + 1}.png`));
            }
            this.textures.push({
              animated: t2,
              dead: [PIXI.Texture.from(`zombie${e2 + 1}_dead.png`)]
            });
          }
          for (let e2 = 0; e2 < 2; e2++) {
            this.dogTexture.push(PIXI.Texture.from(`zombiedog${e2 + 1}.png`));
          }
          this.deadDogTexture = [PIXI.Texture.from("zombiedogdead.png")];
        }
        if (this.zombies.length > 0) {
          for (let e2 = 0; e2 < this.zombies.length; e2++) {
            g.removeChild(this.zombies[e2]);
            this.zombies[e2].stop();
          }
          this.discardedZombies = this.zombies.slice();
          this.zombies.length = 0;
          this.aliveZombies.length = 0;
        }
        if (!this.zombieCursor) {
          this.zombieCursor = new PIXI.Container();
          const e2 = new PIXI.Sprite(PIXI.Texture.from("zombie1_1.png"));
          e2.alpha = 0.6;
          e2.scale.x = 1;
          e2.scale.y = 1;
          e2.anchor.set(35 / 80, 1);
          this.zombieCursorText = new PIXI.Text("1", {
            fontFamily: "sans-serif",
            fontSize: 40,
            fill: "#FFF",
            stroke: "#000",
            strokeThickness: 0,
            align: "center"
          });
          this.zombieCursorText.anchor = {
            x: 0.5,
            y: 1
          };
          this.zombieCursorText.scale.x = 0.1;
          this.zombieCursorText.scale.y = 0.1;
          this.zombieCursorText.y = -9;
          this.zombieCursorText.visible = false;
          this.zombieCursorText.alpha = 0.7;
          this.zombieCursor.addChild(e2);
          this.zombieCursor.addChild(this.zombieCursorText);
          m.addChild(this.zombieCursor);
        }
      }
      createZombie(e2, t2, s = false) {
        const i = Math.floor(Math.random() * this.textures.length);
        let a;
        if (this.discardedZombies.length > 0) {
          a = this.discardedZombies.pop();
          a.textures = s ? this.dogTexture : this.textures[i].animated;
        } else {
          a = new Ee(s ? this.dogTexture : this.textures[i].animated);
        }
        a.zombie = true;
        a.mod = 1;
        a.scaleMod = 1;
        if (this.super) {
          a.mod = 10;
          a.scaleMod = 1.5;
        }
        a.flags = new Fe();
        a.flags.dog = s;
        a.flags.super = this.super;
        a.deadTexture = a.flags.dog ? this.deadDogTexture : this.textures[i].dead;
        a.textureId = i;
        a.burnDamage = 0;
        a.lastKnownBuilding = false;
        a.alpha = 1;
        a.animationSpeed = 0.15;
        a.anchor.set(35 / 80, 1);
        a.bloodbornTimer = this.bloodborn;
        a.position.set(e2, t2);
        a.target = null;
        a.zIndex = a.position.y;
        a.visible = true;
        a.maxHealth = a.health = this.model.zombieHealth * a.mod;
        a.regenTimer = 5;
        a.state = 0 /* lookingForTarget */;
        const r = s ? 0.7 : 1;
        a.scaling = a.scaleMod * this.scaling * r;
        a.scale.set(Math.random() > 0.5 ? a.scaling : -1 * a.scaling, a.scaling);
        a.timer.attack = 0;
        a.xSpeed = 0;
        a.ySpeed = 0;
        a.speedMultiplier = 1;
        a.timer.scan = 0;
        a.timer.burnTick = this.burnTickTimer;
        a.timer.smoke = this.smokeTimer;
        a.play();
        a.zombieId = this.currId++;
        this.zombies.push(a);
        g.addChild(a);
        this.smoke.newZombieSpawnCloud(e2, t2 - 2);
      }
      spawnZombie(e2, t2) {
        if (this.model.energy >= this.model.zombieCost) {
          this.model.energy -= this.model.zombieCost;
          this.createZombie(e2, t2, false);
        }
      }
      spawnAllZombies(e2, t2) {
        const s = Math.min(
          Math.floor(this.model.energy / this.model.zombieCost),
          100
        );
        for (let i = 0; i < s; i++) {
          this.spawnZombie(
            e2 + 4 * (Math.random() - 1),
            t2 + 4 * (Math.random() - 1)
          );
        }
      }
      damageZombie(e2, t2, s) {
        if (e2.graveyard) {
          this.graveyard.damageGraveyard(t2);
        } else {
          if (e2.boneshield) {
            e2.boneshield--;
            return void this.bones.newPart(e2.x, e2.y, 1);
          }
          if (this.graveyard.isWithinFence(e2)) {
            t2 *= 0.5;
            this.exclamations.newShield(e2);
          }
          if (e2.bloodbornTimer > 0) {
            t2 *= 0.5;
            this.exclamations.newShield(e2);
          }
          if (s && s.flags.infected) {
            t2 *= this.model.plagueDmgReduction;
          }
          e2.health -= t2 * this.model.runeEffects.damageReduction;
          this.setSpeedMultiplier(e2);
          this.blood.newSplatter(e2.x, e2.y);
          if (e2.health <= 0 && !e2.flags.dead) {
            this.bones.newBones(e2.x, e2.y);
            e2.flags.dead = true;
            if (e2.flags.golem && this.refundChance > 0) {
              this.model.sendMessage("Golem Refunded!");
              this.creatureFactory.refundParts(e2, this.refundChance);
            }
            if (Math.random() < this.model.infectedBlastChance) {
              this.causePlagueExplosion(e2, 0.2 * e2.maxHealth, true, false);
            }
            e2.textures = e2.deadTexture;
            e2.gotoAndStop(0);
            if (Math.random() < this.model.brainRecoverChance) {
              this.model.addBrains(1);
            }
          }
          if (s && this.model.runeEffects.damageReflection > 0) {
            this.humans.damageHuman(
              s,
              t2 * this.model.runeEffects.damageReflection
            );
          }
        }
      }
      causePlagueExplosion(e2, t2, s = true, i = false) {
        const a = i ? 75 : 50;
        this.blood.newPlagueSplatter(e2.x, e2.y);
        if (i) {
          this.blasts.newDetonateBlast(e2.x, e2.y - 4);
        } else {
          this.blasts.newZombieBlast(e2.x, e2.y - 4);
        }
        if (s) {
          e2.visible = false;
          g.removeChild(e2);
        }
        for (let s2 = 0; s2 < this.aliveHumans.length; s2++) {
          if (Math.abs(this.aliveHumans[s2].x - e2.x) < a && Math.abs(this.aliveHumans[s2].y - e2.y) < a && this.fastDistance(
            e2.x,
            e2.y,
            this.aliveHumans[s2].x,
            this.aliveHumans[s2].y
          ) < a) {
            this.inflictPlague(this.aliveHumans[s2]);
            this.humans.damageHuman(this.aliveHumans[s2], t2);
          }
        }
        if (this.model.blastHealing > 0) {
          const s2 = t2 * this.model.blastHealing;
          for (let t3 = 0; t3 < this.aliveZombies.length; t3++) {
            if (Math.abs(this.aliveZombies[t3].x - e2.x) < a && Math.abs(this.aliveZombies[t3].y - e2.y) < a && this.fastDistance(
              e2.x,
              e2.y,
              this.aliveZombies[t3].x,
              this.aliveZombies[t3].y
            ) < a) {
              this.healZombie(this.aliveZombies[t3], s2);
            }
          }
        }
      }
      partitionInsert(e2, t2) {
        const s = Math.round(t2.x / 10);
        const i = Math.round(t2.y / 10);
        if (!e2[s]) {
          e2[s] = [];
        }
        if (!e2[s][i]) {
          e2[s][i] = [];
        }
        e2[s][i].push(t2);
      }
      partitionGetNeighbours(e2) {
        const t2 = [];
        const s = Math.round(e2.x / 10);
        const i = Math.round(e2.y / 10);
        for (let e3 = s - 1; e3 <= s + 1; e3++) {
          if (this.zombiePartition[e3]) {
            for (let s2 = i - 1; s2 <= i + 1; s2++) {
              if (this.zombiePartition[e3][s2]) {
                t2.push(...this.zombiePartition[e3][s2]);
              }
            }
          }
        }
        return t2;
      }
      update(e2) {
        this.maxSpeed = this.model.zombieSpeed;
        if (this.detonate) {
          this.maxSpeed *= 1.5;
        }
        this.reactionTime = Math.max(
          0.2,
          this.aliveZombies.length / 2e3
          /* 2e3 */
        );
        const t2 = [];
        const s = [];
        this.aliveHumans = this.humans.aliveHumans;
        this.graveyardAttackers = this.humans.graveyardAttackers;
        if (this.gigamutagen > 0) {
          this.gigamutationTimer -= e2;
        }
        for (let i = 0; i < this.zombies.length; i++) {
          if (this.zombies[i].visible) {
            this.updateZombie(this.zombies[i], e2);
            if (!this.zombies[i].flags.dead) {
              t2.push(this.zombies[i]);
              this.partitionInsert(s, this.zombies[i]);
            }
          }
        }
        this.model.zombieCount = t2.length;
        this.aliveZombies = t2;
        this.zombiePartition = s;
        if (this.model.energy >= this.model.zombieCost && this.model.currentState == this.model.states.playingLevel) {
          this.zombieCursor.visible = !this.mouseOutOfBounds;
          if (Y.shift && !this.mouseOutOfBounds) {
            this.zombieCursorText.visible = true;
            const e3 = Math.min(
              Math.floor(this.model.energy / this.model.zombieCost),
              100
            );
            if (this.zombieCursorText.text != e3) {
              this.zombieCursorText.text = e3;
            }
          } else {
            this.zombieCursorText.visible = false;
          }
        } else {
          this.zombieCursor.visible = false;
        }
      }
      detonateZombie(e2) {
        if (e2.state == 2 /* attackingTarget */ || this.aliveHumans.length == 0 && Math.random() < 0.05) {
          this.bones.newBones(e2.x, e2.y);
          e2.flags.dead = true;
          this.causePlagueExplosion(e2, e2.maxHealth, true, true);
          if (Math.random() < this.model.brainRecoverChance) {
            this.model.addBrains(1);
          }
        }
      }
      updateZombie(e2, t2) {
        if (e2.flags.dead) {
          if (!e2.visible) {
            return;
          }
          e2.alpha -= this.fadeSpeed * t2;
          return void (e2.alpha < 0 && (e2.visible = false, g.removeChild(e2)));
        }
        if (e2.mod == 1 && this.gigamutationTimer < 0) {
          e2.mod = 10;
          e2.scaling *= 1.5;
          e2.scale.set(e2.scaling, e2.scaling);
          e2.maxHealth *= 10;
          e2.health *= 10;
          this.gigamutationTimer = this.gigamutagen;
          this.smoke.newZombieSpawnCloud(e2.x, e2.y - 2);
        }
        e2.bloodbornTimer -= t2;
        e2.timer.attack -= t2;
        e2.timer.scan -= t2;
        if (this.model.runeEffects.healthRegen > 0) {
          this.updateZombieRegen(e2, t2);
        }
        if (this.detonate) {
          this.detonateZombie(e2);
        }
        if (e2.flags.burning) {
          this.updateBurns(e2, t2);
        }
        if ((!e2.target || e2.target.flags.dead) && e2.timer.scan < 0) {
          e2.state = 0 /* lookingForTarget */;
        }
        switch (e2.state) {
          case 0 /* lookingForTarget */: {
            this.searchClosestTarget(e2.target ?? e2);
            if (!e2.target || e2.target.flags.dead) {
              this.assignRandomTarget(e2);
            }
            if (e2.target) {
              e2.state = 1 /* movingToTarget */;
            }
            break;
          }
          case 1 /* movingToTarget */: {
            const s = this.fastDistance(
              e2.position.x,
              e2.position.y,
              e2.target.x,
              e2.target.y
            );
            if (s < this.attackDistance) {
              e2.state = 2 /* attackingTarget */;
              break;
            }
            if (e2.timer.attack < 0 && s < this.model.spitDistance) {
              this.bullets.newBullet(
                e2,
                e2.target,
                this.model.zombieDamage / 2,
                true
              );
              e2.timer.attack = this.attackSpeed * (1 / (this.model.runeEffects.attackSpeed * this.model.ShockPCMod));
            }
            if (s > 3 * this.attackDistance && e2.timer.scan < 0) {
              this.searchClosestTarget(e2);
            }
            this.updateZombieSpeed(e2, t2);
            break;
          }
          case 2 /* attackingTarget */: {
            const s = this.fastDistance(
              e2.position.x,
              e2.position.y,
              e2.target.x,
              e2.target.y
            );
            if (s < this.attackDistance) {
              e2.scale.x = e2.target.x > e2.x ? e2.scaling : -e2.scaling;
              if (e2.timer.attack < 0) {
                this.humans.damageHuman(e2.target, this.calculateDamage(e2));
                if (e2.flags.dog) {
                  e2.target.timer.dogStun = 1;
                }
                if (Math.random() < this.model.infectedBiteChance) {
                  this.inflictPlague(e2.target);
                }
                e2.timer.attack = this.attackSpeed * (1 / (this.model.runeEffects.attackSpeed * this.model.ShockPCMod));
                if (e2.flags.burning) {
                  e2.timer.attack *= 1 / this.model.burningSpeedMod;
                }
              }
              if (s > this.attackDistance / 2) {
                this.updateZombieSpeed(e2, t2);
              }
            } else {
              e2.state = 1 /* movingToTarget */;
            }
            break;
          }
        }
      }
      setSpeedMultiplier(e2) {
        if (e2.flags.burning) {
          e2.speedMultiplier = this.model.burningSpeedMod;
        } else {
          e2.speedMultiplier = Math.max(Math.min(1, e2.health / e2.maxHealth), 0.4);
        }
      }
      updateZombieRegen(e2, t2) {
        e2.regenTimer -= t2;
        if (e2.regenTimer < 0) {
          e2.regenTimer = 5;
          if (e2.health < e2.maxHealth) {
            e2.health += e2.maxHealth * this.model.runeEffects.healthRegen;
            if (e2.health > e2.maxHealth) {
              e2.health = e2.maxHealth;
            }
            this.setSpeedMultiplier(e2);
          }
        }
      }
      healZombie(e2, t2) {
        if (e2.health < e2.maxHealth) {
          e2.health += t2;
          this.exclamations.newHealing(e2);
          if (e2.health > e2.maxHealth) {
            e2.health = e2.maxHealth;
          }
          this.setSpeedMultiplier(e2);
        }
      }
      calculateDamage(e2) {
        let t2 = this.model.zombieDamage * e2.mod;
        if (this.model.runeEffects.critChance > 0 && Math.random() < this.model.runeEffects.critChance) {
          t2 *= this.model.runeEffects.critDamage;
          He(e2.x, e2.y - 20, t2);
        }
        if (this.bloodpact > 0) {
          this.model.addBlood(t2 * this.bloodpact);
        }
        return t2;
      }
      inflictPlague(e2) {
        if (e2.flags.infected) {
          e2.plagueDamage += this.model.zombieDamage * this.model.PlagueVatPCMod / 2 + this.model.plagueDamageMod;
          e2.plagueTicks = this.model.plagueticks;
        } else {
          this.exclamations.newPoison(e2);
          e2.plagueDamage = this.model.zombieDamage * this.model.PlagueVatPCMod / 2 + this.model.plagueDamageMod;
          e2.plagueTicks = this.model.plagueticks;
        }
        e2.flags.infected = true;
      }
      updateBurns(e2, t2) {
        e2.timer.burnTick -= t2;
        e2.timer.smoke -= t2;
        if (e2.timer.smoke < 0) {
          this.smoke.newFireSmoke(e2.x, e2.y - 14);
          e2.timer.smoke = this.smokeTimer;
        }
        if (e2.timer.burnTick < 0) {
          this.damageZombie(e2, e2.burnDamage, null);
          e2.timer.burnTick = this.burnTickTimer;
          this.exclamations.newFire(e2);
        }
      }
      searchClosestTarget(e2) {
        if (e2.timer.scan > 0) {
          return;
        }
        e2.timer.scan = this.scanTime * Math.random();
        let t2 = 300;
        if (this.model.isBossStage(this.model.level) && Math.random() > 0.3) {
          for (let s = 0; s < this.graveyardAttackers.length; s++) {
            if (Math.abs(this.graveyardAttackers[s].x - e2.x) < t2 && Math.abs(this.graveyardAttackers[s].y - e2.y) < t2) {
              const i = this.fastDistance(
                e2.x,
                e2.y,
                this.graveyardAttackers[s].x,
                this.graveyardAttackers[s].y
              );
              if (i < t2) {
                e2.target = this.graveyardAttackers[s];
                t2 = i;
              }
            }
          }
        }
        if (t2 == 300) {
          t2 = 1e4;
          for (let s = 0; s < this.aliveHumans.length; s++) {
            if (Math.abs(this.aliveHumans[s].x - e2.x) < t2 && Math.abs(this.aliveHumans[s].y - e2.y) < t2) {
              const i = this.fastDistance(
                e2.x,
                e2.y,
                this.aliveHumans[s].x,
                this.aliveHumans[s].y
              );
              if (i < t2) {
                e2.target = this.aliveHumans[s];
                t2 = i;
              }
            }
          }
        }
      }
      assignRandomTarget(e2) {
        if (this.aliveHumans.length == 0) {
          return;
        }
        const t2 = this.map.findBuilding(e2);
        if (t2 && this.map.isInsidePoi(e2.x, e2.y, t2, 0)) {
          for (let s = 0; s < this.aliveHumans.length; s++) {
            if (this.map.isInsidePoi(
              this.aliveHumans[s].x,
              this.aliveHumans[s].y,
              t2,
              0
            )) {
              return void (e2.target = this.aliveHumans[s]);
            }
          }
        }
        e2.target = sample(this.aliveHumans);
      }
      dotProduct(e2, t2) {
        return e2 * e2 + t2 * t2;
      }
      updateZombieSpeed(e2, t2) {
        if (e2.timer.dogStun && e2.timer.dogStun > 0) {
          return void (e2.timer.dogStun -= t2);
        }
        if (!e2.timer.target || !e2.targetVector) {
          e2.timer.target = 0;
        }
        e2.timer.target -= t2;
        if (e2.timer.target <= 0) {
          e2.targetVector = this.map.howDoIGetToMyTarget(e2, e2.target);
          e2.timer.target = this.reactionTime;
        }
        if (this.model.gameSpeed > 1 || e2.flags.dog) {
          const t3 = e2.flags.dog ? 1.5 : 1;
          const s2 = Math.max(this.maxSpeed * e2.speedMultiplier * t3, 8);
          e2.xSpeed = e2.targetVector.x * s2;
          e2.ySpeed = e2.targetVector.y * s2;
        } else {
          const s2 = 5 * this.maxSpeed * t2;
          e2.xSpeed += e2.targetVector.x * s2;
          e2.ySpeed += e2.targetVector.y * s2;
          const i2 = this.dotProduct(e2.xSpeed, e2.ySpeed);
          const a = Math.max(this.maxSpeed * e2.speedMultiplier, 8) ** 2;
          if (i2 > a) {
            e2.xSpeed *= a / i2;
            e2.ySpeed *= a / i2;
          }
        }
        let s = {
          x: e2.position.x + e2.xSpeed * t2,
          y: e2.position.y + e2.ySpeed * t2
        };
        e2.turnTimer -= t2;
        if (e2.turnTimer < 0 && (e2.turnTimer = 0.5, !this.isSpaceToMove(e2, s.x, s.y))) {
          if (Math.random() > 0.5) {
            const t3 = {
              x: -e2.ySpeed / 2 + e2.xSpeed / 2,
              y: e2.xSpeed / 2 + e2.ySpeed / 2
            };
            e2.xSpeed = t3.x;
            e2.ySpeed = t3.y;
          } else {
            const t3 = {
              x: e2.ySpeed / 2 + e2.xSpeed / 2,
              y: -e2.xSpeed / 2 + e2.ySpeed / 2
            };
            e2.xSpeed = t3.x;
            e2.ySpeed = t3.y;
          }
          s = {
            x: e2.position.x + e2.xSpeed * t2,
            y: e2.position.y + e2.ySpeed * t2
          };
        }
        const i = this.map.checkCollisions(e2.position, s);
        if (i) {
          if (i.x) {
            e2.xSpeed = 0;
          }
          if (i.y) {
            e2.ySpeed = 0;
          }
          s = {
            x: e2.position.x + e2.xSpeed * t2,
            y: e2.position.y + e2.ySpeed * t2
          };
          if (i.x) {
            s.x = i.validX;
          }
          if (i.y) {
            s.y = i.validY;
          }
        }
        e2.position.set(s.x, s.y);
        e2.zIndex = e2.position.y;
        e2.scale.x = e2.xSpeed > 0 ? e2.scaling : -e2.scaling;
      }
      isSpaceToMove(e2, t2, s) {
        const i = this.partitionGetNeighbours(e2);
        for (let a = 0; a < i.length; a++) {
          if (i[a].health >= e2.health && i[a].zombieId != e2.zombieId && Math.abs(i[a].x - t2) < this.spaceNeeded && Math.abs(i[a].y - s) < this.spaceNeeded && Math.abs(i[a].x - t2) < this.spaceNeeded) {
            return this.fastDistance(t2, s, i[a].x, i[a].y) > this.fastDistance(e2.x, e2.y, i[a].x, i[a].y);
          }
        }
        return true;
      }
    }
    class Le extends Pe {
      constructor(...args) {
        super(...args);
        this.boneshieldTimer = 3;
        this.boneshield = 0;
        this.boneshieldContainer = new Ge();
      }
    }
    class Ze extends PIXI.Sprite {
      constructor(...args) {
        super(...args);
        this.speed = {
          x: 0,
          y: 0
        };
        this.flying = false;
      }
    }
    class Ge extends PIXI.Container {
      constructor(...args) {
        super(...args);
        this.spacing = 2 * Math.PI / 10;
        this.bones = [];
      }
      getTexture() {
        if (this.texture) {
          return this.texture;
        }
        const e2 = document.createElement("canvas");
        e2.width = 4;
        e2.height = 1;
        const t2 = e2.getContext("2d");
        t2.fillStyle = "#dddddd";
        t2.fillRect(0, 0, 4, 1);
        this.texture = PIXI.Texture.from(e2);
        return this.texture;
      }
      getBone() {
        const e2 = new Ze(this.getTexture());
        e2.anchor.set(0.5, 20);
        this.addChild(e2);
        this.bones.push(e2);
        return e2;
      }
      update(e2) {
        if (e2 > this.bones.length) {
          this.getBone().rotation = this.spacing * this.bones.length;
        }
        for (let t2 = 0; t2 < this.bones.length; t2++) {
          this.bones[t2].visible = t2 < e2;
        }
      }
    }
    class Skeleton {
      constructor() {
        this.skeletons = [];
        this.aliveSkeletons = [];
        this.discardedSprites = [];
        this.aliveHumans = [];
        this.scaling = 1;
        this.moveTargetDistance = 15;
        this.attackDistance = 25;
        this.attackSpeed = 3;
        this.targetDistance = 100;
        this.fadeSpeed = 0.1;
        this.currId = 1;
        this.scanTime = 3;
        this.spawnTimer = 0;
        this.respawnTime = 10;
        this.moveSpeed = 40;
        this.lastKillingBlow = 0;
        this.randomSpells = [];
        this.lootChance = 1e-3;
        this.spellTimer = 3;
        this.textures = {
          set: false,
          up: [],
          down: [],
          left: [],
          right: [],
          dead: []
        };
        this.directions = {
          down: 1,
          up: 2,
          right: 3,
          left: 4,
          dead: 5
        };
        this.burnTickTimer = 5;
        this.smokeTimer = 0.3;
        this.fastDistance = weighted_hybrid_distance;
        this.magnitude = pythag;
        this.damageZombie = null;
        this.searchClosestTarget = null;
        this.updateBurns = null;
        this.updateZombieRegen = null;
        this.causePlagueExplosion = null;
        this.inflictPlague = null;
        this.healZombie = null;
        this.setSpeedMultiplier = null;
        this.storageName = "incremancerskele";
        this.talentsStorageName = "incremancertalents";
        this.persistent = {
          xpRate: 0,
          skeletons: 0,
          level: 1,
          xp: 0,
          items: [],
          gearSetEquipped: -1,
          gearSets: [],
          currItemId: 0,
          talentReset: false
        };
        this.talents = [];
        this.talentPoints = 0;
        this.killingBlowParts = 0;
        this.lootChanceMod = 1;
        this.increaseChance = 0;
        this.darkorb = 0;
        this.darkorbTimer = 0;
        this.boneshield = 0;
        this.aliveZombies = [];
        this.graveyardAttackers = [];
        this.lootPositions = {
          helmet: {
            id: 1,
            name: "Helmet"
          },
          chest: {
            id: 2,
            name: "Chest"
          },
          legs: {
            id: 3,
            name: "Legs"
          },
          gloves: {
            id: 4,
            name: "Gloves"
          },
          boots: {
            id: 5,
            name: "Boots"
          },
          sword: {
            id: 6,
            name: "Sword"
          },
          shield: {
            id: 7,
            name: "Shield"
          }
        };
        this.rarity = {
          common: 1,
          rare: 2,
          epic: 3,
          legendary: 4,
          ancient: 5,
          divine: 6,
          chaos: 7
        };
        this.prefixes = {
          commonQuality: [
            "Wooden",
            "Sturdy",
            "Rigid",
            "Iron",
            "Rusty",
            "Flimsy",
            "Battered",
            "Damaged",
            "Used",
            "Stained",
            "Training"
          ],
          rareQuality: [
            "Steel",
            "Shiny",
            "Polished",
            "Forged",
            "Plated",
            "Bronze",
            "Reinforced",
            "Veteran's",
            "Reliable"
          ],
          epicQuality: [
            "Antique",
            "Ancient",
            "Famous",
            "Bejeweled",
            "Notorious",
            "Historic",
            "Mythical",
            "Extraordinary"
          ],
          legendaryQuality: [
            "Monstrous",
            "Diabolical",
            "Withering",
            "Terrible",
            "Demoniacal"
          ],
          ancientQuality: ["Grim", "Miserable", "Luxurious"],
          divineQuality: ["Divine"],
          chaosQuality: ["Chaotic", "Corrupted", "Fractured", "Twisted"]
        };
        this.stats = {
          respawnTime: {
            id: 1,
            scaling: 1
          },
          speed: {
            id: 2,
            scaling: 1
          },
          zombieHealth: {
            id: 3,
            scaling: 24
          },
          zombieDamage: {
            id: 4,
            scaling: 3
          },
          zombieSpeed: {
            id: 5,
            scaling: 1
          },
          harpySpeed: {
            id: 6,
            scaling: 1
          }
        };
        if (Skeleton.instance) {
          return Skeleton.instance;
        }
        Skeleton.instance = this;
      }
      getUsedPoints() {
        return this.talents.reduce((e2, t2) => e2 + t2, 0);
      }
      getAvailablePoints() {
        return this.talentPoints - this.getUsedPoints();
      }
      xpForNextLevel() {
        return 1e3 * this.persistent.level ** 2;
      }
      addXp(e2) {
        if (this.isAlive() && (this.persistent.xp += e2 * this.persistent.xpRate, this.persistent.xp > this.xpForNextLevel())) {
          this.persistent.xp -= this.xpForNextLevel();
          this.persistent.level++;
          this.upgrades.applyUpgrades();
          this.model.sendMessage(
            `Skeleton Champion reached level ${this.persistent.level}!`
          );
          const e3 = document.getElementById("skeleton");
          if (e3) {
            e3.classList.toggle("levelup");
            setTimeout(
              () => {
                e3.classList.toggle("levelup");
              },
              3e3
              /* 3e3 */
            );
          }
        }
      }
      isAlive() {
        for (let e2 = 0; e2 < this.skeletons.length; e2++) {
          if (!this.skeletons[e2].flags.dead) {
            return true;
          }
        }
        return false;
      }
      applyUpgrades() {
        if (this.persistent.skeletons > 0) {
          this.applyItemUpgrades();
          const scalingFactor = 1.0001 ** this.persistent.level;
          const e2 = 1 + this.persistent.level / 100;
          this.model.bloodPCMod *= e2;
          this.model.brainsPCMod *= e2;
          this.model.bonesPCMod *= e2;
          this.model.partsPCMod *= e2;
          this.model.zombieDamagePCMod *= e2;
          this.model.zombieHealthPCMod *= e2;
          this.model.PlagueVatPCMod *= scalingFactor;
          this.model.plagueDamageMod *= scalingFactor;
        }
      }
      acceptOffer() {
        this.model.persistentData.trophies = [];
        if (this.persistent.skeletons < 1) {
          this.persistent.skeletons = 1;
          this.persistent.xpRate = 1;
          this.model.sendMessage("Skeleton Champion joins the fight!");
        } else {
          this.persistent.xpRate *= 2;
        }
        this.upgrades.applyUpgrades();
        this.model.saveData();
      }
      populate() {
        this.model = GameModel.getInstance();
        this.map = new ee();
        this.graveyard = new Graveyard();
        this.exclamations = new it();
        this.bullets = new rt();
        this.spells = new Spells();
        this.smoke = new ot();
        this.upgrades = new Upgrades();
        this.humans = new Humans();
        this.zombies = new Zombies();
        this.prestigePoints = new Je();
        this.partFactory = new PartFactory();
        this.bones = new Bones();
        this.blasts = new nt();
        this.blood = new _e();
        this.damageZombie = this.zombies.damageZombie;
        this.searchClosestTarget = this.zombies.searchClosestTarget;
        this.updateBurns = this.zombies.updateBurns;
        this.updateZombieRegen = this.zombies.updateZombieRegen;
        this.causePlagueExplosion = this.zombies.causePlagueExplosion;
        this.inflictPlague = this.zombies.inflictPlague;
        this.healZombie = this.zombies.healZombie;
        this.setSpeedMultiplier = this.zombies.setSpeedMultiplier;
        if (!this.textures.set) {
          this.textures.down = [];
          this.textures.up = [];
          this.textures.right = [];
          this.textures.dead = [];
          for (let e3 = 0; e3 < 3; e3++) {
            this.textures.down.push(PIXI.Texture.from(`skeleton${e3}.png`));
          }
          for (let e3 = 3; e3 < 6; e3++) {
            this.textures.up.push(PIXI.Texture.from(`skeleton${e3}.png`));
          }
          for (let e3 = 6; e3 < 9; e3++) {
            this.textures.right.push(PIXI.Texture.from(`skeleton${e3}.png`));
          }
          this.textures.dead.push(PIXI.Texture.from("skeleton9.png"));
          this.textures.set = true;
        }
        const e2 = [];
        for (let t2 = 0; t2 < this.skeletons.length; t2++) {
          if (this.skeletons[t2].flags.dead) {
            this.discardedSprites.push(this.skeletons[t2]);
            g.removeChild(this.skeletons[t2]);
          } else {
            e2.push(this.skeletons[t2]);
            this.skeletons[t2].x = this.graveyard.sprite.x;
            this.skeletons[t2].zIndex = this.skeletons[t2].y = this.graveyard.sprite.y + (this.graveyard.level > 2 ? 8 : 0);
            this.skeletons[t2].target = null;
            this.skeletons[t2].state = 0 /* lookingForTarget */;
            this.skeletons[t2].timer.scan = 0;
          }
        }
        this.skeletons = e2;
        this.aliveSkeletons = [];
        this.lootChance = 1e-3;
        if (this.model.level < this.persistent.level) {
          this.lootChance *= 0.5;
        }
        if (this.model.level > 2 * this.persistent.level) {
          this.lootChance *= 1.5;
        }
      }
      spawnCreature() {
        let e2;
        if (this.discardedSprites.length > 0) {
          e2 = this.discardedSprites.pop();
          e2.textures = this.textures.down;
        } else {
          e2 = new Le(this.textures.down);
          e2.addChild(e2.boneshieldContainer);
          e2.boneshieldContainer.position.set(0, -16);
        }
        e2.tint = 15658734;
        e2.immuneToBurns = false;
        e2.bulletReflect = 0;
        e2.zombie = true;
        e2.textureSet = this.textures;
        e2.deadTexture = this.textures.dead;
        e2.currentDirection = this.directions.down;
        e2.flags = new K();
        e2.burnDamage = 0;
        e2.lastKnownBuilding = false;
        e2.alpha = 1;
        e2.animationSpeed = 0.15;
        e2.anchor.set(8.5 / 16, 1);
        e2.position.set(
          this.graveyard.sprite.x,
          this.graveyard.sprite.y + (this.graveyard.level > 2 ? 8 : 0)
        );
        e2.target = null;
        e2.zIndex = e2.position.y;
        e2.visible = true;
        e2.maxHealth = e2.health = 10 * this.model.zombieHealth;
        e2.attackDamage = 10 * this.model.zombieDamage;
        e2.regenTimer = 5;
        e2.state = 0 /* lookingForTarget */;
        e2.scaling = this.scaling;
        e2.scale.set(e2.scaling, e2.scaling);
        e2.timer.ability = 4 * Math.random();
        e2.timer.attack = 0;
        e2.timer.scan = 0;
        e2.timer.burnTick = this.burnTickTimer;
        e2.timer.smoke = this.smokeTimer;
        e2.xSpeed = 0;
        e2.ySpeed = 0;
        e2.speedMultiplier = 1;
        e2.maxSpeed = this.moveSpeed;
        e2.play();
        e2.zombieId = this.currId++;
        this.skeletons.push(e2);
        g.addChild(e2);
        this.smoke.newZombieSpawnCloud(e2.x, e2.y - 2);
      }
      skeletonTimer() {
        return this.aliveSkeletons.length < this.persistent.skeletons ? this.spawnTimer : 0;
      }
      update(e2) {
        this.aliveHumans = this.humans.aliveHumans;
        this.graveyardAttackers = this.humans.graveyardAttackers;
        this.aliveZombies = this.zombies.aliveZombies;
        this.aliveSkeletons = [];
        this.spellTimer -= e2;
        for (let t2 = 0; t2 < this.skeletons.length; t2++) {
          if (this.skeletons[t2].visible) {
            this.updateCreature(this.skeletons[t2], e2);
            if (!this.skeletons[t2].flags.dead) {
              this.aliveZombies.push(this.skeletons[t2]);
              this.aliveSkeletons.push(this.skeletons[t2]);
            }
          }
        }
        if (this.aliveSkeletons.length < this.persistent.skeletons) {
          this.spawnTimer -= e2;
          if (this.spawnTimer < 0) {
            this.spawnCreature();
            this.spawnTimer = this.respawnTime;
          }
        }
        this.lastKillingBlow -= e2;
        if (this.model.persistentData.autoSellGear == true && this.aliveSkeletons.length > 0) {
          this.destroyAllItems();
        }
        if (this.model.persistentData.autoSellGearLegendary == true && this.aliveSkeletons.length > 0) {
          this.destroyAllItemsLegendary();
        }
      }
      updateCreature(e2, t2) {
        if (e2.flags.dead) {
          if (!e2.visible) {
            return;
          }
          e2.alpha -= this.fadeSpeed * t2;
          return void (e2.alpha < 0 && (e2.visible = false, g.removeChild(e2)));
        }
        if (this.boneshield > 0 && e2.boneshield < this.boneshield) {
          e2.boneshieldTimer -= t2;
          if (e2.boneshieldTimer < 0) {
            e2.boneshieldTimer = 10 / this.boneshield;
            e2.boneshield++;
          }
        }
        if (this.boneshield) {
          e2.boneshieldContainer.visible = true;
          e2.boneshieldContainer.update(e2.boneshield);
          e2.boneshieldContainer.rotation += t2;
        } else {
          e2.boneshieldContainer.visible = false;
        }
        if (this.darkorb > 0) {
          this.darkorbTimer -= t2;
          if (this.darkorbTimer < 0 && e2.target && !e2.target.flags.dead) {
            this.darkorbTimer = this.darkorb;
            this.bullets.newBullet(
              e2,
              e2.target,
              this.calculateDamage(e2),
              false,
              false,
              false,
              true
            );
          }
        }
        e2.timer.attack -= t2;
        e2.timer.scan -= t2;
        e2.timer.ability -= t2;
        if (this.model.runeEffects.healthRegen > 0) {
          this.updateZombieRegen(e2, t2);
        }
        if (e2.flags.burning && !e2.immuneToBurns) {
          this.updateBurns(e2, t2);
        }
        if (e2.timer.ability < 0) {
          e2.timer.ability = 4;
        }
        if (!e2.target || e2.target.flags.dead) {
          e2.state = 0 /* lookingForTarget */;
          e2.timer.target = 0;
          e2.timer.scan = 0;
        }
        switch (e2.state) {
          case 0 /* lookingForTarget */: {
            this.searchClosestTarget(e2);
            if (e2.target) {
              e2.state = 1 /* movingToTarget */;
            }
            break;
          }
          case 1 /* movingToTarget */: {
            const s = this.fastDistance(
              e2.position.x,
              e2.position.y,
              e2.target.x,
              e2.target.y
            );
            if (s < this.attackDistance) {
              e2.state = 2 /* attackingTarget */;
              break;
            }
            if (s > 3 * this.attackDistance && e2.timer.scan < 0) {
              this.searchClosestTarget(e2);
            }
            this.updateCreatureSpeed(e2, t2);
            break;
          }
          case 2 /* attackingTarget */: {
            const s = this.fastDistance(
              e2.position.x,
              e2.position.y,
              e2.target.x,
              e2.target.y
            );
            if (s < this.attackDistance) {
              if (e2.timer.attack < 0 && !e2.target.flags.dead && (this.humans.damageHuman(e2.target, this.calculateDamage(e2)), e2.target.flags.dead && this.killingBlow(e2.target), e2.timer.attack = this.attackSpeed * (1 / (this.model.runeEffects.attackSpeed * this.model.ShockPCMod)), e2.flags.burning && (e2.timer.attack *= 1 / this.model.burningSpeedMod), this.randomSpells.length > 0)) {
                for (let e3 = 0; e3 < this.randomSpells.length; e3++) {
                  if (this.spellTimer < 0 && Math.random() < 0.07 + this.increaseChance) {
                    this.spells.castSpellNoMana(this.randomSpells[e3]);
                    this.spellTimer = 3;
                  }
                }
              }
              if (s > this.attackDistance / 2) {
                this.updateCreatureSpeed(e2, t2);
              }
            } else {
              e2.state = 1 /* movingToTarget */;
            }
            break;
          }
        }
      }
      killingBlow(e2) {
        if (this.killingBlowParts) {
          this.model.persistentData.parts += this.killingBlowParts * this.partFactory.factoryStats().partsPerSec;
        }
        if (this.lastKillingBlow <= 0) {
          this.model.addPrestigePoints(
            Math.round(this.persistent.level * 1.00025 ** this.persistent.level)
          );
          this.lastKillingBlow = 20;
          this.prestigePoints.newPart(e2.x, e2.y);
        }
      }
      orbHit(e2) {
        if (e2.flags.dead) {
          this.killingBlow(e2);
        }
        if (this.randomSpells.length > 0) {
          for (let e3 = 0; e3 < this.randomSpells.length; e3++) {
            if (this.spellTimer < 0 && Math.random() < 0.04) {
              this.spells.castSpellNoMana(this.randomSpells[e3]);
              this.spellTimer = 3;
            }
          }
        }
      }
      incinerate() {
        let e2;
        for (let t2 = 0; t2 < this.skeletons.length; t2++) {
          if (this.skeletons[t2].visible) {
            e2 = this.skeletons[t2];
          }
        }
        if (e2) {
          for (let t2 = 0; t2 < this.aliveHumans.length; t2++) {
            if (Math.abs(this.aliveHumans[t2].x - e2.x) < 200 && Math.abs(this.aliveHumans[t2].y - e2.y) < 200) {
              this.humans.burnHuman(this.aliveHumans[t2], e2.attackDamage);
            }
          }
        }
      }
      getCreatureDirection(e2) {
        if (Math.abs(e2.xSpeed) > Math.abs(e2.ySpeed)) {
          if (e2.xSpeed < 0) {
            return this.directions.left;
          }
          return this.directions.right;
        }
        if (e2.ySpeed < 0) {
          return this.directions.up;
        }
        return this.directions.down;
      }
      changeTextureDirection(e2) {
        const t2 = this.getCreatureDirection(e2);
        if (t2 !== e2.currentDirection) {
          switch (t2) {
            case this.directions.up: {
              e2.textures = e2.textureSet.up;
              e2.scale.x = e2.scaling;
              break;
            }
            case this.directions.down: {
              e2.textures = e2.textureSet.down;
              e2.scale.x = e2.scaling;
              break;
            }
            case this.directions.right: {
              e2.textures = e2.textureSet.right;
              e2.scale.x = e2.scaling;
              break;
            }
            case this.directions.left: {
              e2.textures = e2.textureSet.right;
              e2.scale.x = -e2.scaling;
            }
          }
          e2.currentDirection = t2;
          e2.play();
        }
      }
      updateCreatureSpeed(e2, t2) {
        if (e2.timer.dogStun > 0) {
          return void (e2.timer.dogStun -= t2);
        }
        if (!e2.timer.target || !e2.targetVector) {
          e2.timer.target = 0;
        }
        e2.timer.target -= t2;
        if (e2.timer.target <= 0) {
          e2.targetVector = this.map.howDoIGetToMyTarget(e2, e2.target);
          e2.timer.target = 0.2;
        }
        const s = 4 * this.fastDistance(e2.x, e2.y, e2.target.x, e2.target.y);
        const i = Math.min(e2.speedMultiplier * e2.maxSpeed, s);
        e2.xSpeed = e2.targetVector.x * i;
        e2.ySpeed = e2.targetVector.y * i;
        e2.position.x += e2.xSpeed * t2;
        e2.position.y += e2.ySpeed * t2;
        e2.zIndex = e2.position.y;
        this.changeTextureDirection(e2);
      }
      calculateDamage(e2) {
        let e_attackDamage_1 = e2.attackDamage;
        if (this.model.runeEffects.critChance > 0 && Math.random() < this.model.runeEffects.critChance) {
          e_attackDamage_1 *= this.model.runeEffects.critDamage;
          He(e2.x, e2.y - 10, e_attackDamage_1);
        }
        return e_attackDamage_1;
      }
      applyItemUpgrades() {
        this.model = GameModel.getInstance();
        this.moveSpeed = 40 + this.model.SkeleMoveMod;
        this.respawnTime = 10;
        this.randomSpells = [];
        this.persistent.items.filter((e2) => e2.q).forEach((e2) => {
          e2.e.forEach((t2) => {
            switch (t2) {
              case this.stats.respawnTime.id: {
                this.respawnTime--;
                break;
              }
              case this.stats.speed.id: {
                this.moveSpeed++;
                break;
              }
              case this.stats.zombieHealth.id: {
                this.model.zombieHealth += e2.l * this.stats.zombieHealth.scaling;
                break;
              }
              case this.stats.zombieDamage.id: {
                this.model.zombieDamage += e2.l * this.stats.zombieDamage.scaling;
                break;
              }
              case this.stats.zombieSpeed.id: {
                this.model.zombieSpeed++;
                break;
              }
              case this.stats.harpySpeed.id: {
                this.model.harpySpeed += 10;
              }
            }
          });
          if (e2.se) {
            e2.se.forEach((e3) => {
              this.randomSpells.push(e3);
            });
          }
        });
      }
      getLootName(e2) {
        let t2 = "";
        switch (e2.r) {
          case this.rarity.common: {
            t2 = this.prefixes.commonQuality[e2.p];
            break;
          }
          case this.rarity.rare: {
            t2 = this.prefixes.rareQuality[e2.p];
            break;
          }
          case this.rarity.epic: {
            t2 = this.prefixes.epicQuality[e2.p];
            break;
          }
          case this.rarity.legendary: {
            t2 = this.prefixes.legendaryQuality[e2.p];
            break;
          }
          case this.rarity.ancient: {
            t2 = this.prefixes.ancientQuality[e2.p];
            break;
          }
          case this.rarity.divine: {
            t2 = this.prefixes.divineQuality[e2.p];
            break;
          }
          case this.rarity.chaos: {
            t2 = this.prefixes.chaosQuality[e2.p];
          }
        }
        let s = "";
        switch (e2.s) {
          case this.lootPositions.helmet.id: {
            s = this.lootPositions.helmet.name;
            break;
          }
          case this.lootPositions.chest.id: {
            s = this.lootPositions.chest.name;
            break;
          }
          case this.lootPositions.legs.id: {
            s = this.lootPositions.legs.name;
            break;
          }
          case this.lootPositions.gloves.id: {
            s = this.lootPositions.gloves.name;
            break;
          }
          case this.lootPositions.boots.id: {
            s = this.lootPositions.boots.name;
            break;
          }
          case this.lootPositions.sword.id: {
            s = this.lootPositions.sword.name;
            break;
          }
          case this.lootPositions.shield.id: {
            s = this.lootPositions.shield.name;
          }
        }
        return `${t2} ${s}`;
      }
      getLootClass(item) {
        switch (item.r) {
          case this.rarity.common: {
            return "common";
          }
          case this.rarity.rare: {
            return "rare";
          }
          case this.rarity.epic: {
            return "epic";
          }
          case this.rarity.legendary: {
            return "legendary";
          }
          case this.rarity.ancient: {
            return "ancient";
          }
          case this.rarity.divine: {
            return "divine";
          }
          case this.rarity.chaos: {
            return "chaos";
          }
        }
      }
      getLootStats(e2) {
        const t2 = [];
        if (e2.e) {
          for (let s = 0; s < e2.e.length; s++) {
            switch (e2.e[s]) {
              case this.stats.respawnTime.id: {
                t2.push("-1 second respawn time");
                break;
              }
              case this.stats.speed.id: {
                t2.push("+1 movement speed");
                break;
              }
              case this.stats.zombieHealth.id: {
                t2.push(
                  `+${formatWhole(
                    this.stats.zombieHealth.scaling * e2.l
                  )} zombie health`
                );
                break;
              }
              case this.stats.zombieDamage.id: {
                t2.push(
                  `+${formatWhole(
                    this.stats.zombieDamage.scaling * e2.l
                  )} zombie damage`
                );
                break;
              }
              case this.stats.zombieSpeed.id: {
                t2.push("+1 zombie speed");
                break;
              }
              case this.stats.harpySpeed.id: {
                t2.push("+10 harpy speed");
              }
            }
          }
        }
        return t2;
      }
      getSpecialEffects(e2) {
        const t2 = [];
        if (e2.se) {
          for (let s = 0; s < e2.se.length; s++) {
            const i = this.spells.spells.filter((t3) => t3.id == e2.se[s])[0];
            t2.push(
              i.itemText || `Has a chance to cast ${i.name} when attacking, this does not cost energy or trigger a cooldown`
            );
          }
        }
        return t2;
      }
      getSpecialEffectsName(e2) {
        const t2 = [];
        if (e2.se) {
          for (let s = 0; s < e2.se.length; s++) {
            const i = this.spells.spells.filter((t3) => t3.id == e2.se[s])[0];
            t2.push(i.name.replace(" ", "-"));
          }
        }
        return t2;
      }
      getSpecialEffectsList() {
        const t2 = [];
        for (let s = 0; s < this.spells.spells.length; s++) {
          t2.push(this.spells.spells[s]);
        }
        return t2;
      }
      getRarityList() {
        return [
          this.rarity.common,
          this.rarity.rare,
          this.rarity.epic,
          this.rarity.legendary,
          this.rarity.ancient,
          this.rarity.divine,
          this.rarity.chaos
        ];
      }
      getTypeList() {
        return [
          this.lootPositions.helmet.id,
          this.lootPositions.chest.id,
          this.lootPositions.gloves.id,
          this.lootPositions.legs.id,
          this.lootPositions.boots.id,
          this.lootPositions.sword.id,
          this.lootPositions.shield.id
        ];
      }
      testForLoot() {
        if (this.persistent.skeletons > 0 && Math.random() < this.lootChance) {
          const e2 = this.generateLoot(this.persistent.level);
          this.model.sendMessage(`${this.getLootName(e2)} collected!`);
          this.persistent.items.push(e2);
        }
      }
      generateLoot(e2) {
        const t2 = Math.round(6 * Math.random()) + 1;
        let s = this.rarity.common;
        const i = [];
        if (Math.random() < 0.2 * this.lootChanceMod && (s = this.rarity.rare, Math.random() < 0.2 * this.lootChanceMod && (s = this.rarity.epic, Math.random() < 0.1 * this.lootChanceMod && (s = this.rarity.legendary, Math.random() < 0.1 * this.lootChanceMod && (s = this.rarity.ancient, Math.random() < 0.1 * this.lootChanceMod))))) {
          s = this.rarity.divine;
          const e3 = sample(this.spells.spells);
          i.push(e3.id);
        }
        if (s == this.rarity.legendary) {
          const e3 = sample(this.spells.spells);
          i.push(e3.id);
        }
        if (s == this.rarity.ancient) {
          s = Math.random() < 0.2 ? this.rarity.chaos : this.rarity.ancient;
          const e3 = sample(this.spells.spells);
          i.push(e3.id);
        }
        let r = 0;
        switch (s) {
          case this.rarity.common: {
            r = Math.floor(Math.random() * this.prefixes.commonQuality.length);
            break;
          }
          case this.rarity.rare: {
            r = Math.floor(Math.random() * this.prefixes.rareQuality.length);
            break;
          }
          case this.rarity.epic: {
            r = Math.floor(Math.random() * this.prefixes.epicQuality.length);
            break;
          }
          case this.rarity.legendary: {
            r = Math.floor(Math.random() * this.prefixes.legendaryQuality.length);
            break;
          }
          case this.rarity.ancient: {
            r = Math.floor(Math.random() * this.prefixes.ancientQuality.length);
            break;
          }
          case this.rarity.divine: {
            r = Math.floor(Math.random() * this.prefixes.divineQuality.length);
            break;
          }
          case this.rarity.chaos: {
            r = Math.floor(Math.random() * this.prefixes.chaosQuality.length);
          }
        }
        const n = [];
        if (s == this.rarity.chaos) {
          for (let e3 = 0; e3 < 5; e3++) {
            n.push(Math.ceil(6 * Math.random()));
          }
        } else {
          n[0] = Math.random() > 0.5 ? this.stats.zombieHealth.id : this.stats.zombieDamage.id;
          for (let e3 = 0; e3 < s - 1; e3++) {
            let e4 = Math.ceil(6 * Math.random());
            while (n.includes(e4)) {
              e4 = Math.ceil(6 * Math.random());
            }
            n.push(e4);
          }
        }
        return {
          id: this.persistent.currItemId++,
          l: e2,
          s: t2,
          r: s,
          p: r,
          e: n,
          se: i,
          q: false
        };
      }
      destroyItem(e2) {
        this.addXp(e2.l * e2.r * 10);
        for (let t2 = 0; t2 < this.persistent.items.length; t2++) {
          if (this.persistent.items[t2].id === e2.id) {
            this.persistent.items.splice(t2, 1);
          }
        }
      }
      destroyAllItems() {
        this.addXp(
          this.xpForItems() - this.xpForAncient() - this.xpForDivine() - this.xpForChaos()
        );
        this.persistent.items = this.persistent.items.filter(
          (e2) => e2.q || e2.r == this.rarity.legendary || e2.r == this.rarity.ancient || e2.r == this.rarity.divine || e2.r == this.rarity.chaos
        );
      }
      destroyAllItemsLegendary() {
        this.addXp(this.xpForLegendary());
        this.persistent.items = this.persistent.items.filter(
          (e2) => e2.q || e2.r == this.rarity.common || e2.r == this.rarity.rare || e2.r == this.rarity.epic || e2.r == this.rarity.ancient || e2.r == this.rarity.divine || e2.r == this.rarity.chaos
        );
      }
      xpForItems() {
        let e2 = 0;
        this.persistent.items.filter((e3) => !e3.q && e3.r != this.rarity.legendary).forEach((t2) => {
          e2 += t2.l * t2.r * 10;
        });
        return e2;
      }
      xpForLegendary() {
        let e2 = 0;
        this.persistent.items.filter((e3) => !e3.q && e3.r == this.rarity.legendary).forEach((t2) => {
          e2 += t2.l * t2.r * 10;
        });
        return e2;
      }
      xpForAncient() {
        let e2 = 0;
        this.persistent.items.filter((e3) => !e3.q && e3.r == this.rarity.ancient).forEach((t2) => {
          e2 += t2.l * t2.r * 10;
        });
        return e2;
      }
      xpForDivine() {
        let e2 = 0;
        this.persistent.items.filter((e3) => !e3.q && e3.r == this.rarity.divine).forEach((t2) => {
          e2 += t2.l * t2.r * 10;
        });
        return e2;
      }
      xpForChaos() {
        let e2 = 0;
        this.persistent.items.filter((e3) => !e3.q && e3.r == this.rarity.chaos).forEach((t2) => {
          e2 += t2.l * t2.r * 10;
        });
        return e2;
      }
      xpTotal() {
        return this.xpForItems() - this.xpForAncient - this.xpForDivine - this.xpForChaos;
      }
    }
    class Creatures {
      constructor() {
        this.creatureFactory = new CreatureFactory();
        this.zombies = new Zombies();
        this.creatures = [];
        this.creatureCount = [];
        this.aliveCreatures = [];
        this.aliveZombies = [];
        this.graveyardAttackers = [];
        this.discardedSprites = [];
        this.aliveHumans = [];
        this.scaling = 1.6;
        this.moveTargetDistance = 15;
        this.attackDistance = 20;
        this.attackSpeed = 3;
        this.targetDistance = 100;
        this.fadeSpeed = 0.1;
        this.currId = 1;
        this.scanTime = 3;
        this.refundChance = 0;
        this.creatureTypes = this.creatureFactory.types;
        this.golemTextures = {
          set: false,
          down: [],
          up: [],
          left: [],
          right: [],
          dead: []
        };
        this.directions = {
          down: 1,
          up: 2,
          right: 3,
          left: 4,
          dead: 5
        };
        this.burnTickTimer = 5;
        this.smokeTimer = 0.3;
        this.fastDistance = weighted_hybrid_distance;
        this.magnitude = pythag;
        this.damageZombie = this.zombies.damageZombie;
        this.searchClosestTarget = this.zombies.searchClosestTarget;
        this.updateBurns = this.zombies.updateBurns;
        this.updateZombieRegen = this.zombies.updateZombieRegen;
        this.causePlagueExplosion = this.zombies.causePlagueExplosion;
        this.inflictPlague = this.zombies.inflictPlague;
        this.healZombie = this.zombies.healZombie;
        this.setSpeedMultiplier = this.zombies.setSpeedMultiplier;
        if (Creatures.instance) {
          return Creatures.instance;
        }
        Creatures.instance = this;
      }
      populate() {
        this.map = new ee();
        this.model = GameModel.getInstance();
        this.graveyard = new Graveyard();
        this.smoke = new ot();
        this.bullets = new rt();
        this.humans = new Humans();
        this.exclamations = new it();
        this.blood = new _e();
        this.bones = new Bones();
        this.blasts = new nt();
        if (!this.golemTextures.set) {
          this.golemTextures.down = [];
          this.golemTextures.up = [];
          this.golemTextures.right = [];
          this.golemTextures.dead = [];
          for (let e3 = 0; e3 < 3; e3++) {
            this.golemTextures.down.push(PIXI.Texture.from(`golem${e3}.png`));
          }
          for (let e3 = 3; e3 < 6; e3++) {
            this.golemTextures.up.push(PIXI.Texture.from(`golem${e3}.png`));
          }
          for (let e3 = 6; e3 < 9; e3++) {
            this.golemTextures.right.push(PIXI.Texture.from(`golem${e3}.png`));
          }
          this.golemTextures.dead.push(PIXI.Texture.from("golem9.png"));
          this.golemTextures.set = true;
        }
        const e2 = [];
        for (let t2 = 0; t2 < this.creatures.length; t2++) {
          if (this.model.constructions.monsterFactory) {
            if (this.creatures[t2].flags.dead) {
              this.discardedSprites.push(this.creatures[t2]);
              g.removeChild(this.creatures[t2]);
            } else {
              e2.push(this.creatures[t2]);
              this.creatures[t2].x = this.graveyard.sprite.x;
              this.creatures[t2].zIndex = this.creatures[t2].y = this.graveyard.sprite.y + (this.graveyard.level > 2 ? 8 : 0);
              this.creatures[t2].target = null;
              this.creatures[t2].state = 0 /* lookingForTarget */;
            }
          } else {
            this.discardedSprites.push(this.creatures[t2]);
            g.removeChild(this.creatures[t2]);
          }
        }
        this.creatures = e2;
        this.aliveCreatures = [];
        this.creatureFactory.spawnSavedCreatures();
      }
      spawnCreature(e2, t2, s, i, a, r) {
        if (this.model.creatureCount >= this.model.creatureLimit) {
          return;
        }
        let n;
        if (this.discardedSprites.length > 0) {
          n = this.discardedSprites.pop();
          n.textures = this.golemTextures.down;
        } else {
          n = new Pe(this.golemTextures.down);
        }
        switch (i) {
          case this.creatureTypes.earthGolem: {
            n.tint = 11042610;
            n.bulletReflect = this.model.bulletproofChance;
            break;
          }
          case this.creatureTypes.airGolem: {
            n.tint = 10266040;
            break;
          }
          case this.creatureTypes.fireGolem: {
            n.tint = 14370586;
            n.immuneToBurns = true;
            break;
          }
          case this.creatureTypes.waterGolem: {
            n.tint = 5080808;
            n.immuneToBurns = true;
          }
        }
        n.flags = new K();
        n.flags.golem = true;
        n.burnDamage = 0;
        n.level = a;
        n.textureSet = this.golemTextures;
        n.deadTexture = this.golemTextures.dead;
        n.currentDirection = this.directions.down;
        n.creatureType = i;
        n.price = r;
        n.lastKnownBuilding = false;
        n.alpha = 1;
        n.animationSpeed = 0.15;
        n.anchor.set(8.5 / 16, 1);
        n.position.set(
          this.graveyard.sprite.x,
          this.graveyard.sprite.y + (this.graveyard.level > 2 ? 8 : 0)
        );
        n.target = null;
        n.zIndex = n.position.y;
        n.visible = true;
        n.maxHealth = e2;
        n.health = e2;
        n.attackDamage = t2;
        n.regenTimer = 5;
        n.state = 0 /* lookingForTarget */;
        n.scaling = this.scaling;
        n.scale.set(n.scaling, n.scaling);
        n.xSpeed = 0;
        n.ySpeed = 0;
        n.speedMultiplier = 1;
        n.maxSpeed = s;
        n.timer.ability = 4 * Math.random();
        n.timer.attack = 0;
        n.timer.scan = 0;
        n.timer.burnTick = this.burnTickTimer;
        n.timer.smoke = this.smokeTimer;
        n.play();
        n.zombieId = this.currId++;
        this.creatures.push(n);
        g.addChild(n);
        this.smoke.newZombieSpawnCloud(n.x, n.y - 2);
        this.model.creatureCount++;
      }
      update(e2) {
        let t2 = 0;
        this.aliveHumans = this.humans.aliveHumans;
        this.graveyardAttackers = this.humans.graveyardAttackers;
        this.aliveZombies = this.zombies.aliveZombies;
        this.creatureCount = [];
        for (let e3 = 0; e3 < this.creatureFactory.creatures.length; e3++) {
          this.creatureCount[this.creatureFactory.creatures[e3].type] = 0;
        }
        this.model.persistentData.savedCreatures = [];
        for (let t3 = 0; t3 < this.creatures.length; t3++) {
          if (this.creatures[t3].visible) {
            this.updateCreature(this.creatures[t3], e2);
          }
        }
        for (let e3 = 0; e3 < this.creatures.length; e3++) {
          if (this.creatures[e3].visible) {
            if (!this.creatures[e3].flags.dead) {
              this.aliveZombies.push(this.creatures[e3]);
              t2++;
              this.creatureCount[this.creatures[e3].creatureType]++;
              this.model.persistentData.savedCreatures.push({
                t: this.creatures[e3].creatureType,
                l: this.creatures[e3].level
              });
            }
          }
        }
        this.model.creatureCount = t2;
      }
      updateCreature(e2, t2) {
        if (e2.flags.dead) {
          if (!e2.visible) {
            return;
          }
          e2.alpha -= this.fadeSpeed * t2;
          return void (e2.alpha < 0 && (e2.visible = false, g.removeChild(e2)));
        }
        e2.timer.attack -= t2;
        e2.timer.scan -= t2;
        e2.timer.ability -= t2;
        if (this.model.runeEffects.healthRegen > 0) {
          this.updateZombieRegen(e2, t2);
        }
        if (e2.flags.burning && !e2.immuneToBurns) {
          this.updateBurns(e2, t2);
        }
        if (e2.timer.ability < 0) {
          e2.timer.ability = 4;
          switch (e2.creatureType) {
            case this.creatureTypes.earthGolem: {
              this.golemTaunt(e2);
              break;
            }
            case this.creatureTypes.waterGolem: {
              this.golemHeal(e2);
              break;
            }
            case this.creatureTypes.fireGolem: {
              this.golemFireball(e2);
            }
          }
        }
        if ((!e2.target || e2.target.flags.dead) && e2.timer.scan < 0) {
          e2.state = 0 /* lookingForTarget */;
        }
        switch (e2.state) {
          case 0 /* lookingForTarget */: {
            this.searchClosestTarget(e2);
            if (e2.target) {
              e2.state = 1 /* movingToTarget */;
            }
            break;
          }
          case 1 /* movingToTarget */: {
            const s = this.fastDistance(
              e2.position.x,
              e2.position.y,
              e2.target.x,
              e2.target.y
            );
            if (s < this.attackDistance) {
              e2.state = 2 /* attackingTarget */;
              break;
            }
            if (s > 3 * this.attackDistance && e2.timer.scan < 0) {
              this.searchClosestTarget(e2);
            }
            this.updateCreatureSpeed(e2, t2);
            break;
          }
          case 2 /* attackingTarget */: {
            const s = this.fastDistance(
              e2.position.x,
              e2.position.y,
              e2.target.x,
              e2.target.y
            );
            if (s < this.attackDistance) {
              e2.scale.x = e2.target.x > e2.x ? e2.scaling : -e2.scaling;
              if (e2.timer.attack < 0) {
                this.humans.damageHuman(e2.target, this.calculateDamage(e2));
                if (e2.creatureType == this.creatureTypes.fireGolem) {
                  this.humans.burnHuman(e2.target, e2.attackDamage / 2);
                }
                e2.timer.attack = this.attackSpeed * (1 / (this.model.runeEffects.attackSpeed * this.model.ShockPCMod));
                if (e2.flags.burning) {
                  e2.timer.attack *= 1 / this.model.burningSpeedMod;
                }
              }
              if (s > this.attackDistance / 2) {
                this.updateCreatureSpeed(e2, t2);
              }
            } else {
              e2.state = 1 /* movingToTarget */;
            }
            break;
          }
        }
      }
      getCreatureDirection(e2) {
        if (Math.abs(e2.xSpeed) > Math.abs(e2.ySpeed)) {
          if (e2.xSpeed < 0) {
            return this.directions.left;
          }
          return this.directions.right;
        }
        if (e2.ySpeed < 0) {
          return this.directions.up;
        }
        return this.directions.down;
      }
      changeTextureDirection(e2) {
        const t2 = this.getCreatureDirection(e2);
        if (t2 !== e2.currentDirection) {
          switch (t2) {
            case this.directions.up: {
              e2.textures = e2.textureSet.up;
              e2.scale.x = e2.scaling;
              break;
            }
            case this.directions.down: {
              e2.textures = e2.textureSet.down;
              e2.scale.x = e2.scaling;
              break;
            }
            case this.directions.right: {
              e2.textures = e2.textureSet.right;
              e2.scale.x = e2.scaling;
              break;
            }
            case this.directions.left: {
              e2.textures = e2.textureSet.right;
              e2.scale.x = -e2.scaling;
            }
          }
          e2.currentDirection = t2;
          e2.play();
        }
      }
      updateCreatureSpeed(e2, t2) {
        if (e2.timer.dogStun && e2.timer.dogStun > 0) {
          return void (e2.timer.dogStun -= t2);
        }
        if (!e2.timer.target || !e2.targetVector) {
          e2.timer.target = 0;
        }
        e2.timer.target -= t2;
        if (e2.timer.target <= 0) {
          e2.targetVector = this.map.howDoIGetToMyTarget(e2, e2.target);
          e2.timer.target = 0.2;
        }
        const s = e2.speedMultiplier * e2.maxSpeed;
        e2.xSpeed = e2.targetVector.x * s;
        e2.ySpeed = e2.targetVector.y * s;
        e2.position.x += e2.xSpeed * t2;
        e2.position.y += e2.ySpeed * t2;
        e2.zIndex = e2.position.y;
        this.changeTextureDirection(e2);
      }
      calculateDamage(e2) {
        let e_attackDamage = e2.attackDamage;
        if (this.model.runeEffects.critChance > 0 && Math.random() < this.model.runeEffects.critChance) {
          e_attackDamage *= this.model.runeEffects.critDamage;
          He(e2.x, e2.y - 10, e_attackDamage);
        }
        return e_attackDamage;
      }
      golemTaunt(e2) {
        for (let t2 = 0; t2 < this.aliveHumans.length; t2++) {
          if (Math.abs(this.aliveHumans[t2].x - e2.x) < this.targetDistance && Math.abs(this.aliveHumans[t2].y - e2.y) < this.targetDistance) {
            if (!this.aliveHumans[t2].vip) {
              this.aliveHumans[t2].zombieTarget = e2;
              this.aliveHumans[t2].target = e2;
            }
          }
        }
      }
      golemHeal(e2) {
        const e_attackDamage = e2.attackDamage;
        for (let s = 0; s < this.aliveZombies.length; s++) {
          if (Math.abs(this.aliveZombies[s].x - e2.x) < this.targetDistance && Math.abs(this.aliveZombies[s].y - e2.y) < this.targetDistance) {
            this.healZombie(this.aliveZombies[s], e_attackDamage);
          }
        }
        for (let s = 0; s < this.creatures.length; s++) {
          if (!this.creatures[s].flags.dead && this.creatures[s].visible && Math.abs(this.creatures[s].x - e2.x) < this.targetDistance && Math.abs(this.creatures[s].y - e2.y) < this.targetDistance) {
            this.healZombie(this.creatures[s], e_attackDamage);
          }
        }
      }
      golemFireball(e2) {
        let t2 = 5;
        for (let s = 0; s < this.aliveHumans.length; s++) {
          if (t2 > 0 && Math.abs(this.aliveHumans[s].x - e2.x) < this.targetDistance && Math.abs(this.aliveHumans[s].y - e2.y) < this.targetDistance) {
            t2--;
            this.bullets.newBullet(
              e2,
              this.aliveHumans[s],
              e2.attackDamage / 2,
              false,
              false,
              true
            );
          }
        }
      }
    }
    class Ne extends PIXI.Sprite {
      constructor(...args) {
        super(...args);
        this.graveyard = true;
      }
    }
    class Graveyard {
      constructor() {
        this.spikeSprites = [];
        this.level = 1;
        this.spikeTimer = 5;
        this.fenceRadius = 50;
        this.fastDistance = weighted_hybrid_distance;
        this.graveyardHealth = 0;
        this.graveyardMaxHealth = 0;
        this.target = {
          graveyard: true,
          x: 0,
          y: 0
        };
        this.healthBar = null;
        this.fence = null;
        this.fencePosts = [];
        if (Graveyard.instance) {
          return Graveyard.instance;
        }
        Graveyard.instance = this;
      }
      initialize() {
        this.boneCollectors = new BoneCollectors();
        this.zmMap = new ee();
        this.zombies = new Zombies();
        this.bones = new Bones();
        this.gameModel = GameModel.getInstance();
        this.smoke = new ot();
        this.harpies = new Ke();
        this.blood = new _e();
        this.humans = new Humans();
        if (this.gameModel.persistentData.graveyardZombies === void 0) {
          this.gameModel.persistentData.graveyardZombies = 1;
        }
        this.drawGraveyard();
        this.drawFence();
        this.drawHealthBar();
        this.bones.initialize();
        this.boneCollectors.populate();
        this.harpies.populate();
      }
      damageGraveyard(e2) {
        if (this.gameModel.isBossStage(this.gameModel.level)) {
          this.graveyardHealth -= e2;
          if (this.graveyardHealth < 0) {
            this.gameModel.currentState = this.gameModel.states.failed;
            this.gameModel.startTimer = 3;
          }
        }
      }
      drawHealthBar() {
        if (this.gameModel.isBossStage(this.gameModel.level)) {
          this.gameModel.sendMessage("Defend the Graveyard!");
          this.graveyardHealth = this.graveyardMaxHealth = 100 * this.gameModel.zombieHealth * this.gameModel.graveyardHealthMod;
          if (!this.healthBar) {
            this.healthBar = {
              container: new PIXI.Container(),
              background: new PIXI.Graphics(),
              foreground: new PIXI.Graphics(),
              percentage: 100
            };
            this.healthBar.container.addChild(this.healthBar.background);
            this.healthBar.container.addChild(this.healthBar.foreground);
            b.addChild(this.healthBar.container);
          }
          this.target.x = P.x / 2;
          this.target.y = P.y / 2;
          this.healthBar.container.visible = true;
          this.healthBar.container.x = this.target.x - 50;
          this.healthBar.container.y = this.target.y - 100;
          this.healthBar.background.clear();
          this.healthBar.background.lineStyle(12, 3355443);
          this.healthBar.background.moveTo(-2, 0);
          this.healthBar.background.lineTo(102, 0);
          this.healthBar.foreground.clear();
          this.healthBar.foreground.lineStyle(8, 16601682);
          this.healthBar.foreground.moveTo(0, 0);
          this.healthBar.foreground.lineTo(100, 0);
        } else if (this.healthBar) {
          this.healthBar.background.clear();
          this.healthBar.foreground.clear();
          this.healthBar.container.visible = false;
        }
      }
      updateHealthBar() {
        const e2 = Math.max(
          Math.round(this.graveyardHealth / this.graveyardMaxHealth * 100),
          0
        );
        if (e2 != this.healthBar.percentage) {
          this.healthBar.foreground.clear();
          if (e2 > 0) {
            this.healthBar.foreground.lineStyle(8, 16601682);
            this.healthBar.foreground.moveTo(0, 0);
            this.healthBar.foreground.lineTo(e2, 0);
          }
          this.healthBar.percentage = e2;
        }
      }
      drawGraveyard() {
        if (!this.spikeTexture) {
          this.spikeTexture = PIXI.Texture.from("spikes.png");
        }
        if (this.sprite) {
          u.removeChild(this.sprite);
        }
        if (this.fortSprite) {
          g.removeChild(this.fortSprite);
          this.fortSprite = null;
        }
        this.level = 1;
        let e2 = "graveyard1.png";
        let t2 = "";
        if (this.gameModel.constructions.crypt) {
          this.level = 2;
          e2 = "graveyard2.png";
        }
        if (this.gameModel.constructions.fort) {
          this.level = 3;
          e2 = "sprites/megagraveyard.png";
          t2 = "fort1.png";
        }
        if (this.gameModel.constructions.fortress) {
          this.level = 4;
          e2 = "sprites/megagraveyard.png";
          t2 = "fort2.png";
        }
        if (this.gameModel.constructions.citadel) {
          this.level = 5;
          e2 = "sprites/megagraveyard.png";
          t2 = "fort3.png";
        }
        if (this.sprite) {
          this.sprite.texture = PIXI.Texture.from(e2);
        } else {
          this.sprite = new Ne(PIXI.Texture.from(e2));
        }
        const s = this.zmMap.graveYardLocation;
        this.sprite.width = 32;
        this.sprite.height = 32;
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.scale.set(2, 2);
        this.sprite.visible = false;
        u.addChild(this.sprite);
        this.sprite.x = s.x;
        this.sprite.y = s.y;
        this.zmMap.graveyardCollision = false;
        if (t2) {
          if (this.fortSprite) {
            this.fortSprite.texture = PIXI.Texture.from(t2);
          } else {
            this.fortSprite = new PIXI.Sprite(PIXI.Texture.from(t2));
          }
          this.fortSprite.anchor.set(0.5, 1);
          this.fortSprite.scale.set(2, 2);
          this.fortSprite.x = s.x;
          this.fortSprite.zIndex = this.fortSprite.y = s.y + 2;
          this.fortSprite.visible = false;
          g.addChild(this.fortSprite);
        }
      }
      drawFence() {
        if (!this.fence) {
          this.fence = new PIXI.Container();
          u.addChild(this.fence);
        }
        this.fenceRadius = this.gameModel.fenceRadius;
        if (!this.fenceTextures) {
          this.fenceTextures = [];
          for (let e3 = 0; e3 < 4; e3++) {
            this.fenceTextures.push(PIXI.Texture.from(`fencepost${e3 + 1}.png`));
          }
        }
        this.fencePosts.forEach((e3) => e3.visible = false);
        this.fence.cacheAsBitmap = false;
        const e2 = Math.round(0.4 * this.fenceRadius);
        const t2 = 2 * Math.PI / e2;
        for (let r2 = 0; r2 < e2; r2++) {
          let e3;
          if (this.fencePosts[r2]) {
            e3 = this.fencePosts[r2];
            e3.visible = true;
          } else {
            e3 = new PIXI.Sprite(sample(this.fenceTextures));
            this.fencePosts.push(e3);
            this.fence.addChild(e3);
          }
          e3.anchor.set(0.5, 1);
          e3.scale.x = Math.random() > 0.5 ? 1 : -1;
          const n = 10 * Math.random() - 5;
          0;
          s = this.fenceRadius + n;
          i = t2 * r2;
          const o = {
            x: 0 * Math.cos(i) - s * Math.sin(i),
            y: 0 * Math.sin(i) + s * Math.cos(i)
          };
          e3.position.set(o.x, o.y);
        }
        var s;
        var i;
        this.fence.cacheAsBitmap = true;
        const r = this.zmMap.graveYardLocation;
        this.fence.x = r.x;
        this.fence.y = r.y;
      }
      update(e2) {
        this.boneCollectors.addAndRemoveBoneCollectors();
        this.harpies.addAndRemoveHarpies();
        if (this.gameModel.isBossStage(this.gameModel.level)) {
          this.updateHealthBar();
        }
        if (!this.gameModel.constructions.graveyard || this.gameModel.currentState != this.gameModel.states.playingLevel) {
          this.sprite.visible = false;
          return void (this.fence.visible = false);
        }
        if (this.level < 2 && this.gameModel.constructions.crypt || this.level < 3 && this.gameModel.constructions.fort || this.level < 4 && this.gameModel.constructions.fortress || this.level < 5 && this.gameModel.constructions.citadel) {
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
        if (this.gameModel.energy >= this.gameModel.energyMax && !this.gameModel.hidden) {
          for (let e3 = 0; e3 < this.gameModel.persistentData.graveyardZombies; e3++) {
            this.zombies.spawnZombie(
              this.sprite.x,
              this.sprite.y + (this.level > 2 ? 8 : 0)
            );
          }
        }
        this.bones.update(e2);
        this.boneCollectors.update(e2);
        this.harpies.update(e2);
        if (this.gameModel.constructions.fence && this.gameModel.currentState == this.gameModel.states.playingLevel) {
          if (this.fenceRadius !== this.gameModel.fenceRadius) {
            this.drawFence();
          }
          this.fence.visible = true;
        } else {
          this.fence.visible = false;
        }
        this.updatePlagueSpikes(e2);
        this.updateSpikeSprites(e2);
      }
      updatePlagueSpikes(e2) {
        if (this.gameModel.constructions.plagueSpikes && (this.spikeTimer -= e2, this.spikeTimer < 0)) {
          this.spikeTimer = this.gameModel.spikeDelay;
          const e3 = this.humans.aliveHumans;
          for (let t2 = 0; t2 < e3.length; t2++) {
            if (Math.abs(e3[t2].x - this.sprite.x) < this.fenceRadius && Math.abs(e3[t2].y - this.sprite.y) < this.fenceRadius && this.fastDistance(this.sprite.x, this.sprite.y, e3[t2].x, e3[t2].y) < this.fenceRadius) {
              this.zombies.inflictPlague(e3[t2]);
              this.humans.damageHuman(e3[t2], this.gameModel.zombieDamage);
              this.blood.newPlagueSplatter(e3[t2].x, e3[t2].y);
              this.addSpikeSprite(e3[t2]);
            }
          }
        }
      }
      addSpikeSprite(e2) {
        let t2 = null;
        for (let e3 = 0; e3 < this.spikeSprites.length; e3++) {
          if (!this.spikeSprites[e3].visible) {
            t2 = this.spikeSprites[e3];
            break;
          }
        }
        if (!t2) {
          t2 = new PIXI.Sprite(this.spikeTexture);
          this.spikeSprites.push(t2);
          g.addChild(t2);
          t2.anchor.set(0.5, 1);
        }
        t2.visible = true;
        t2.alpha = 1;
        t2.x = e2.x;
        t2.y = e2.y + 2;
        t2.zIndex = t2.y;
        t2.scale.y = 2;
        t2.scale.x = Math.random() > 0.5 ? 1.5 : -1.5;
      }
      updateSpikeSprites(e2) {
        for (let t2 = 0; t2 < this.spikeSprites.length; t2++) {
          if (this.spikeSprites[t2].visible) {
            this.spikeSprites[t2].alpha -= 0.4 * e2;
            if (this.spikeSprites[t2].alpha <= 0) {
              this.spikeSprites[t2].visible = false;
            }
          }
        }
      }
      isWithinFence(e2) {
        return !(!this.gameModel.constructions.fence || this.gameModel.currentState != this.gameModel.states.playingLevel) && e2.x > this.fence.x - this.fenceRadius && e2.x < this.fence.x + this.fenceRadius && e2.y > this.fence.y - this.fenceRadius && e2.y < this.fence.y + this.fenceRadius && this.fastDistance(e2.x, e2.y, this.fence.x, this.fence.y) <= this.fenceRadius;
      }
    }
    class Ye extends PIXI.AnimatedSprite {
      constructor(e2) {
        super(e2);
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.bones = 0;
        this.speedFactor = 0;
        this.boneList = [];
        this.target = null;
        this.animationSpeed = 0.2;
      }
    }
    let boneCollectorState;
    ((boneCollectorState2) => {
      boneCollectorState2[boneCollectorState2["collecting"] = 0] = "collecting";
      boneCollectorState2[boneCollectorState2["returning"] = 1] = "returning";
      boneCollectorState2[boneCollectorState2["waiting"] = 2] = "waiting";
    })(boneCollectorState || (boneCollectorState = {}));
    class BoneCollectors {
      constructor() {
        this.sprites = [];
        this.maxSpeed = 125;
        this.scaling = 2;
        this.collectDistance = 10;
        this.fastDistance = weighted_hybrid_distance;
        if (BoneCollectors.instance) {
          return BoneCollectors.instance;
        }
        BoneCollectors.instance = this;
      }
      populate() {
        this.graveyard = new Graveyard();
        this.gameModel = GameModel.getInstance();
        this.bones = new Bones();
        if (!this.texture) {
          this.texture = [];
          for (let e2 = 0; e2 < 2; e2++) {
            this.texture.push(PIXI.Texture.from(`bonecollector${e2 + 1}.png`));
          }
        }
        for (let e2 = 0; e2 < this.sprites.length; e2++) {
          this.sprites[e2].boneList = [];
          this.sprites[e2].target = false;
          this.sprites[e2].position.set(
            this.graveyard.sprite.x,
            this.graveyard.sprite.y
          );
          this.sprites[e2].state = 0 /* collecting */;
        }
      }
      addAndRemoveBoneCollectors() {
        if (this.sprites.length > this.gameModel.persistentData.boneCollectors) {
          const e2 = this.sprites.pop();
          if (e2.boneList) {
            for (let t2 = 0; t2 < e2.boneList.length; t2++) {
              e2.boneList[t2].collector = false;
              if (e2.target && e2.target.collector) {
                e2.target.collector = false;
              }
            }
          }
          this.gameModel.addBones(e2.bones);
          g.removeChild(e2);
        }
        if (this.sprites.length < this.gameModel.persistentData.boneCollectors) {
          const e2 = new Ye(this.texture);
          e2.animationSpeed = 0.2;
          e2.anchor.set(0.5, 1);
          e2.position.set(this.graveyard.sprite.x, this.graveyard.sprite.y);
          e2.zIndex = e2.position.y;
          e2.visible = true;
          e2.scale.set(
            Math.random() > 0.5 ? this.scaling : -1 * this.scaling,
            this.scaling
          );
          e2.xSpeed = 0;
          e2.ySpeed = 0;
          e2.bones = 0;
          e2.speedFactor = 0;
          e2.state = 0 /* collecting */;
          e2.play();
          e2.boneList = [];
          this.sprites.push(e2);
          g.addChild(e2);
        }
      }
      update(e2) {
        for (let t2 = 0; t2 < this.sprites.length; t2++) {
          this.updateBoneCollector(this.sprites[t2], e2);
        }
      }
      findNearestBone(e2) {
        if (!e2.boneList) {
          e2.boneList = [];
        }
        if (e2.boneList.length == 0) {
          let { x: x2, y: y2 } = e2;
          for (let i = 0; i < 3; i++) {
            let i2 = null;
            let a = 2e3;
            for (let e3 = 0; e3 < this.bones.uncollected.length; e3++) {
              if (this.bones.uncollected[e3].value > 0 && !this.bones.uncollected[e3].collector) {
                const r = this.fastDistance(
                  x2,
                  y2,
                  this.bones.uncollected[e3].x,
                  this.bones.uncollected[e3].y
                );
                if (r < a) {
                  a = r, i2 = this.bones.uncollected[e3];
                }
              }
            }
            if (!i2) {
              break;
            }
            e2.boneList.push(i2);
            i2.collector = true;
            x2 = i2.x;
            y2 = i2.y;
          }
        }
        if (e2.boneList.length > 0) {
          e2.target = e2.boneList.shift();
        } else {
          e2.target = false;
        }
      }
      updateBoneCollector(e2, t2) {
        if (e2.target && (!e2.target.graveyard || e2.state != 0 /* collecting */)) {
          this.updateSpeed(e2, t2);
        }
        switch (e2.state) {
          case 0 /* collecting */: {
            if (!e2.target || !e2.target.value || !e2.target.visible) {
              this.findNearestBone(e2);
            }
            if (e2.target && e2.target.value > 0 && this.fastDistance(
              e2.position.x,
              e2.position.y,
              e2.target.x,
              e2.target.y
            ) < this.collectDistance) {
              e2.bones += e2.target.value, e2.target.value = 0, e2.speedFactor = 0;
            }
            if (e2.bones >= this.gameModel.boneCollectorCapacity || !e2.target) {
              e2.state = 1 /* returning */;
              return void (e2.target = this.graveyard.sprite);
            }
            break;
          }
          case 1 /* returning */: {
            if (!e2.target) {
              e2.target = this.graveyard.sprite;
            }
            if (this.fastDistance(
              e2.position.x,
              e2.position.y,
              e2.target.x,
              e2.target.y
            ) < this.collectDistance) {
              e2.target = false, this.gameModel.addBones(e2.bones), e2.bones = 0, e2.state = 0 /* collecting */, e2.speedFactor = 0;
            }
          }
        }
      }
      updateSpeed(e2, t2) {
        e2.speedFactor = Math.min(1, e2.speedFactor += 3 * t2);
        const s = e2.target.x - e2.x;
        const i = e2.target.y - e2.y;
        const a = Math.abs(s);
        const r = Math.abs(i);
        if (Math.max(a, r) == 0) {
          return;
        }
        let n = 1 / Math.max(a, r);
        n *= 1.29289 - (a + r) * n * 0.29289;
        e2.xSpeed = s * n * this.maxSpeed * e2.speedFactor;
        e2.ySpeed = i * n * this.maxSpeed * e2.speedFactor;
        e2.position.x += e2.xSpeed * t2;
        e2.position.y += e2.ySpeed * t2;
        e2.zIndex = e2.position.y;
      }
    }
    let harpyState;
    ((harpyState2) => {
      harpyState2[harpyState2["bombing"] = 0] = "bombing";
      harpyState2[harpyState2["returning"] = 1] = "returning";
    })(harpyState || (harpyState = {}));
    class je extends PIXI.AnimatedSprite {
      constructor(e2) {
        super(e2);
        this.target = null;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.bombs = 0;
        this.speedFactor = 0;
        this.animationSpeed = 0.2;
        this.anchor.set(0.5, 1);
        this.visible = true;
      }
    }
    class $e extends PIXI.Sprite {
      constructor(e2) {
        super(e2);
        this.dropped = false;
        this.floor = 0;
        this.rotSpeed = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.fire = false;
        this.anchor.set(0.5, 0.5);
      }
    }
    class Ke {
      constructor() {
        this.sprites = [];
        this.discardedSprites = [];
        this.bombSprites = [];
        this.discardedBombSprites = [];
        this.bombHeight = 100;
        this.scaling = 2.5;
        this.fastDistance = weighted_hybrid_distance;
        if (Ke.instance) {
          return Ke.instance;
        }
        Ke.instance = this;
      }
      populate() {
        this.model = GameModel.getInstance();
        this.graveyard = new Graveyard();
        this.zombies = new Zombies();
        this.humans = new Humans();
        this.tanks = new De();
        if (!this.textures) {
          this.textures = [];
          for (let e2 = 0; e2 < 2; e2++) {
            this.textures.push(PIXI.Texture.from(`harpy${e2 + 1}.png`));
          }
          this.bombTexture = PIXI.Texture.from("harpybomb.png");
        }
        if (this.model.persistentData.harpies === void 0) {
          this.model.persistentData.harpies = 0;
        }
        for (let e2 = 0; e2 < this.bombSprites.length; e2++) {
          if (this.bombSprites[e2].visible) {
            this.bombSprites[e2].visible = false;
            this.discardedBombSprites.push(this.bombSprites[e2]);
          }
        }
        for (let e2 = 0; e2 < this.sprites.length; e2++) {
          this.sprites[e2].bomb = null;
          this.sprites[e2].target = false;
          this.sprites[e2].position.set(
            this.graveyard.sprite.x,
            this.graveyard.sprite.y - this.bombHeight
          );
          this.sprites[e2].state = 1 /* returning */;
        }
      }
      addAndRemoveHarpies() {
        if (this.sprites.length > this.model.persistentData.harpies) {
          const e2 = this.sprites.pop();
          e2.target = false;
          if (e2.bomb) {
            e2.bomb.dropped = true;
            e2.bomb.floor = e2.bomb.y + this.bombHeight;
          }
          b.removeChild(e2);
          this.discardedSprites.push(e2);
        }
        if (this.sprites.length < this.model.persistentData.harpies) {
          const e2 = this.discardedSprites.length > 0 ? this.discardedSprites.pop() : new je(this.textures);
          e2.position.set(
            this.graveyard.sprite.x,
            this.graveyard.sprite.y - this.bombHeight
          );
          e2.zIndex = e2.position.y;
          e2.scale.set(
            Math.random() > 0.5 ? this.scaling : -1 * this.scaling,
            this.scaling
          );
          e2.state = 1 /* returning */;
          e2.play();
          this.sprites.push(e2);
          b.addChild(e2);
        }
      }
      update(e2) {
        for (let t2 = 0; t2 < this.sprites.length; t2++) {
          this.updateHarpy(this.sprites[t2], e2);
        }
        for (let t2 = 0; t2 < this.bombSprites.length; t2++) {
          if (this.bombSprites[t2].visible) {
            this.updateBomb(this.bombSprites[t2], e2);
          }
        }
      }
      updateBomb(e2, t2) {
        if (e2.dropped) {
          e2.rotation += t2 * e2.rotSpeed;
          e2.ySpeed += 50 * t2;
          e2.scale.x = e2.scale.y -= 0.2 * t2;
          e2.y += e2.ySpeed * t2;
          if (e2.y >= e2.floor - 2) {
            e2.visible = false;
            this.discardedBombSprites.push(e2);
            if (e2.fire) {
              this.humans.burnHuman(e2.target, 0.1 * this.model.zombieHealth);
            }
            this.zombies.causePlagueExplosion(
              e2,
              0.2 * this.model.zombieHealth,
              false,
              false
            );
          }
        } else {
          e2.x = e2.harpy.x;
          e2.y = e2.harpy.y;
        }
      }
      updateHarpy(e2, t2) {
        switch (e2.state) {
          case 0 /* bombing */: {
            if (!e2.target || e2.target.graveyard || e2.target.dead) {
              if (this.model.tankBuster && this.model.isBossStage(this.model.level) && this.tanks.aliveTanks.length > 0) {
                e2.target = sample(this.tanks.aliveTanks);
                e2.bomb.fire = true;
              } else {
                for (let t3 = 0; t3 < 8 && (e2.target = sample(this.humans.aliveHumans), e2.target && !(this.fastDistance(
                  e2.x,
                  e2.y,
                  e2.target.x,
                  e2.target.y - this.bombHeight
                ) < 500)); t3++) {
                }
                e2.bomb.fire = false;
              }
            }
            if (!e2.target) {
              return void (e2.state = 1 /* returning */);
            }
            if (this.fastDistance(
              e2.x,
              e2.y,
              e2.target.x,
              e2.target.y - this.bombHeight
            ) < 10) {
              e2.bombs--;
              e2.bomb.dropped = true;
              e2.bomb.floor = e2.target.y;
              e2.bomb.target = e2.target;
              e2.bomb = null;
              e2.speedFactor = 0;
              e2.target = false;
              if (e2.bombs <= 0) {
                e2.state = 1 /* returning */;
              } else {
                this.getBomb(e2);
              }
            } else {
              this.updateHarpySpeed(e2, t2);
            }
            break;
          }
          case 1 /* returning */: {
            if (!e2.target) {
              e2.target = this.graveyard.sprite;
            }
            if (this.fastDistance(
              e2.x,
              e2.y,
              e2.target.x,
              e2.target.y - this.bombHeight
            ) < 10) {
              e2.bombs = this.model.harpyBombs;
              if (!e2.bomb) {
                this.getBomb(e2);
              }
              e2.state = 0 /* bombing */;
              e2.speedFactor = 0;
            } else {
              this.updateHarpySpeed(e2, t2);
            }
          }
        }
      }
      getBomb(e2) {
        let t2;
        if (this.discardedBombSprites.length > 0) {
          t2 = this.discardedBombSprites.pop();
        } else {
          t2 = new $e(this.bombTexture);
          this.bombSprites.push(t2);
          b.addChild(t2);
        }
        t2.scale.x = 2;
        t2.scale.y = 2;
        t2.rotation = 0;
        t2.rotSpeed = Math.random() > 0.5 ? 4 : -4;
        t2.ySpeed = 0;
        t2.visible = true;
        t2.dropped = false;
        t2.harpy = e2;
        e2.bomb = t2;
      }
      updateHarpySpeed(e2, t2) {
        e2.speedFactor = Math.min(1, e2.speedFactor += 2 * t2);
        const s = e2.target.x - e2.x;
        const i = e2.target.y - this.bombHeight - e2.y;
        const a = Math.abs(s);
        const r = Math.abs(i);
        if (Math.max(a, r) == 0) {
          return;
        }
        let n = 1 / Math.max(a, r);
        n *= 1.29289 - (a + r) * n * 0.29289;
        e2.xSpeed = s * n * this.model.harpySpeed * e2.speedFactor;
        e2.ySpeed = i * n * this.model.harpySpeed * e2.speedFactor;
        e2.position.x += e2.xSpeed * t2;
        e2.position.y += e2.ySpeed * t2;
        e2.scale.x = e2.xSpeed > 0 ? this.scaling : -1 * this.scaling;
      }
    }
    class Particles {
      constructor() {
        this.blood = new _e();
        this.smoke = new ot();
        this.prestigePoints = new Je();
        this.bullets = new rt();
        this.exclamations = new it();
        this.blasts = new nt();
        this.fragments = new lt();
        if (Particles.instance) {
          return Particles.instance;
        }
        Particles.instance = this;
      }
      initialize() {
        this.blood.initialize();
        this.bullets.initialize();
        this.exclamations.initialize();
        this.blasts.initialize();
        this.smoke.initialize();
        this.fragments.initialize();
        this.prestigePoints.initialize();
      }
      update(e2) {
        this.blood.update(e2);
        this.bullets.update(e2);
        this.exclamations.update(e2);
        this.blasts.update(e2);
        this.smoke.update(e2);
        this.fragments.update(e2);
        this.prestigePoints.update(e2);
        ((e3) => {
          for (let t2 = 0; t2 < Be.length; t2++) {
            Be[t2].updateCritText(e3);
          }
        })(e2);
      }
    }
    class Je extends _ {
      constructor() {
        super();
        this.zmMap = new ee();
        this.speed = 20;
        if (Je.instance) {
          return Je.instance;
        }
        Je.instance = this;
        this.create = (e2) => new J(e2);
      }
      initialize() {
        this.gameModel = GameModel.getInstance();
        if (!this.container) {
          this.setup(new PIXI.Container(), PIXI.Texture.from("pp.png"));
          b.addChild(this.container);
        }
        this.targetElement = document.getElementById("prestige-button");
        this.animElement = document.getElementById("prestige-bg");
      }
      update(e2) {
        if (!this.gameModel.persistentData.particles) {
          return void (this.container.visible = false);
        }
        this.container.visible = true;
        let t2 = {
          x: 0,
          y: 0
        };
        if (this.targetElement != null) {
          const e3 = this.targetElement.getBoundingClientRect();
          t2 = {
            x: e3.x + e3.width / 2,
            y: e3.y + e3.height / 2
          };
          t2.x -= c.x;
          t2.y -= c.y;
          t2.x = t2.x / c.scale.x;
          t2.y = t2.y / c.scale.y;
        }
        for (let s = 0; s < this.sprites.length; s++) {
          if (this.sprites[s].visible) {
            this.updatePart(this.sprites[s], e2, t2);
          }
        }
      }
      updatePart(e2, t2, s) {
        const a = this.zmMap.normalizeVector({
          x: s.x - e2.x,
          y: s.y - e2.y
        });
        const r = 300 * a.x - e2.xSpeed;
        const n = 300 * a.y - e2.ySpeed;
        e2.xSpeed += r * t2;
        e2.ySpeed += n * t2;
        e2.x += e2.xSpeed * t2;
        e2.y += e2.ySpeed * t2;
        if (weighted_hybrid_distance(e2.x, e2.y, s.x, s.y) < 30 && (e2.visible = false, e2.x = 100, e2.y = 100, this.animElement)) {
          const e3 = this.animElement;
          e3.classList.toggle("levelup");
          setTimeout(
            () => {
              e3.classList.toggle("levelup");
            },
            3e3
            /* 3e3 */
          );
        }
      }
      newPart(e2, t2) {
        if (!this.container.visible) {
          return;
        }
        const s = this.getSprite();
        s.x = e2;
        s.y = t2 - 10;
        s.visible = true;
        s.scale.set(2, 2);
        s.xSpeed = 0;
        s.ySpeed = -100;
      }
    }
    class _e {
      constructor() {
        this.maxParts = 500;
        this.partCounter = 0;
        this.partsPerSplatter = 6;
        this.ecoPartsPerSplatter = 3;
        this.container = null;
        this.sprites = [];
        this.gravity = 100;
        this.spraySpeed = 20;
        this.fadeSpeed = 0.7;
        this.visibleParts = 0;
        this.viewableArea = null;
        if (_e.instance) {
          return _e.instance;
        }
        _e.instance = this;
      }
      getTexture(e2) {
        const t2 = document.createElement("canvas");
        t2.width = 1;
        t2.height = 1;
        const s = t2.getContext("2d");
        s.fillStyle = e2;
        s.fillRect(0, 0, 1, 1);
        return PIXI.Texture.from(t2);
      }
      initialize() {
        this.gameModel = GameModel.getInstance();
        this.viewableArea = G;
        if (!this.container) {
          this.container = new PIXI.Container();
          p.addChild(this.container);
          this.texture = this.getTexture("#ff0000");
          this.plagueTexture = this.getTexture("#00ff00");
        }
        if (this.sprites.length < this.maxParts) {
          for (let e2 = 0; e2 < this.maxParts; e2++) {
            const e3 = new ht(this.texture);
            this.sprites.push(e3);
            e3.visible = false;
            if (Math.random() > 0.5) {
              e3.scale.set(2, 2);
            }
            this.container.addChild(e3);
          }
        }
      }
      update(e2) {
        if (this.gameModel.persistentData.particles) {
          this.container.visible = true;
          this.visibleParts = 0;
          for (let t2 = 0; t2 < this.sprites.length; t2++) {
            if (this.sprites[t2].visible) {
              this.updatePart(this.sprites[t2], e2);
              this.visibleParts++;
            }
          }
        } else {
          this.container.visible = false;
        }
      }
      updatePart(e2, t2) {
        if (e2.hitFloor) {
          e2.alpha -= this.fadeSpeed * t2;
          if (e2.alpha <= 0) {
            e2.visible = false;
          }
        } else {
          e2.ySpeed += this.gravity * t2;
          e2.x += e2.xSpeed * t2;
          e2.y += e2.ySpeed * t2;
          if (e2.y >= e2.floor) {
            e2.hitFloor = true;
          }
        }
      }
      newPart(e2, t2, s) {
        if (this.viewableArea.hideParticle(e2, t2)) {
          return;
        }
        const i = this.sprites[this.partCounter++];
        if (this.partCounter >= this.maxParts) {
          this.partCounter = 0;
        }
        i.texture = s ? this.plagueTexture : this.texture;
        i.x = e2;
        i.y = t2 - (8 + 10 * Math.random());
        i.floor = t2;
        i.hitFloor = false;
        i.visible = true;
        i.alpha = 1;
        i.scale.set(1, 1);
        if (Math.random() > 0.5) {
          i.scale.set(2, 2);
        }
        const a = Math.random() * (s ? 1.5 * this.spraySpeed : this.spraySpeed);
        i.xSpeed = Math.random() > 0.5 ? -1 * a : a;
        i.ySpeed = -1 * (s ? 1.5 * this.spraySpeed : this.spraySpeed);
      }
      newSplatter(e2, t2) {
        if (this.container.visible)
          if (this.visibleParts < 0.9 * this.maxParts)
            for (let s = 0; s < this.partsPerSplatter; s++)
              this.newPart(e2, t2, false);
          else
            for (let s = 0; s < this.ecoPartsPerSplatter; s++)
              this.newPart(e2, t2, false);
      }
      newPlagueSplatter(e2, t2) {
        if (this.container.visible)
          for (let s = 0; s < this.partsPerSplatter; s++)
            this.newPart(e2, t2, true);
      }
    }
    class et extends J {
      constructor(...args) {
        super(...args);
        this.fadeTime = 0;
        this.floor = 0;
        this.rotSpeed = 0;
        this.value = 1;
        this.collector = null;
        this.hitFloor = false;
      }
    }
    class Bones {
      constructor() {
        this.partsLimit = 100;
        this.partsPerSplatter = 3;
        this.container = null;
        this.sprites = [];
        this.discardedSprites = [];
        this.uncollected = [];
        this.gravity = 100;
        this.spraySpeed = 20;
        this.fadeTime = 40;
        this.fadeSpeed = 0.2;
        this.fadeBones = false;
        this.texture = null;
        this.gameModel = null;
        if (Bones.instance) {
          return Bones.instance;
        }
        Bones.instance = this;
      }
      getTexture() {
        const e2 = document.createElement("canvas");
        e2.width = 4;
        e2.height = 1;
        const t2 = e2.getContext("2d");
        t2.fillStyle = "#dddddd";
        t2.fillRect(0, 0, 4, 1);
        return PIXI.Texture.from(e2);
      }
      initialize() {
        this.gameModel = GameModel.getInstance();
        if (!this.container) {
          this.container = new PIXI.Container();
          p.addChild(this.container);
          this.texture = this.getTexture();
        }
        for (let e2 = 0; e2 < this.sprites.length; e2++) {
          this.sprites[e2].value = 0;
          this.sprites[e2].visible = false;
          this.container.removeChild(this.sprites[e2]);
        }
        this.discardedSprites = this.sprites.slice();
      }
      update(e2) {
        const t2 = [];
        for (let s = 0; s < this.sprites.length; s++) {
          if (this.sprites[s].visible) {
            this.updatePart(this.sprites[s], e2);
            t2.push(this.sprites[s]);
          }
        }
        this.uncollected = t2;
        this.fadeBones = t2.length > 200;
      }
      updatePart(e2, t2) {
        if (e2.value <= 0) {
          e2.visible = false;
          this.discardedSprites.push(e2);
          return void this.container.removeChild(e2);
        }
        if (e2.hitFloor) {
          if (this.fadeBones) {
            e2.fadeTime -= t2;
          }
          if (e2.fadeTime < 0 && !e2.collector) {
            e2.alpha -= this.fadeSpeed * t2, e2.alpha <= 0 && (e2.visible = false, this.discardedSprites.push(e2), this.container.removeChild(e2));
          }
        } else {
          e2.ySpeed += this.gravity * t2;
          e2.rotation += e2.rotSpeed * t2;
          e2.x += e2.xSpeed * t2;
          e2.y += e2.ySpeed * t2;
          if (e2.y >= e2.floor) {
            e2.hitFloor = true;
          }
        }
      }
      newPart(e2, t2, s) {
        let i = null;
        if (this.discardedSprites.length > 0) {
          i = this.discardedSprites.pop();
        } else {
          i = new et(this.texture);
          this.sprites.push(i);
        }
        this.container.addChild(i);
        i.x = e2;
        i.y = t2 - (8 + 10 * Math.random());
        i.fadeTime = Math.random() * this.fadeTime;
        i.rotation = 5 * Math.random();
        i.rotSpeed = 4 * Math.random() - 2;
        i.floor = t2;
        i.hitFloor = false;
        i.collector = false;
        i.visible = true;
        i.value = s;
        i.alpha = 1;
        i.scale.set(1, 1);
        if (Math.random() > 0.5) {
          i.scale.set(1.5, 1.5);
        }
        const a = Math.random() * this.spraySpeed;
        i.xSpeed = Math.random() > 0.5 ? -1 * a : a;
        i.ySpeed = -1 * this.spraySpeed;
      }
      newBones(e2, t2) {
        if (this.gameModel.constructions.graveyard) {
          if (this.sprites.length - this.discardedSprites.length > this.partsLimit) {
            this.newPart(e2, t2, 3);
          } else {
            for (let s = 0; s < this.partsPerSplatter; s++) {
              this.newPart(e2, t2, 1);
            }
          }
        }
      }
    }
    class st extends PIXI.Sprite {
      constructor(...args) {
        super(...args);
        this.time = 0;
        this.target = null;
      }
    }
    class it {
      constructor() {
        this.sprites = [];
        this.discardedSprites = [];
        this.maxSprites = 10;
        this.height = 20;
        this.fadeSpeed = 4;
        if (it.instance) {
          return it.instance;
        }
        it.instance = this;
      }
      initialize() {
        if (!this.container) {
          this.container = new PIXI.Container();
          b.addChild(this.container);
          this.healTexture = PIXI.Texture.from("healing.png");
          this.exclamationTexture = PIXI.Texture.from("exclamation.png");
          this.radioTexture = PIXI.Texture.from("radio.png");
          this.fireTexture = PIXI.Texture.from("fire.png");
          this.shieldTexture = PIXI.Texture.from("shield.png");
          this.poisonTexture = PIXI.Texture.from("poison.png");
        }
        for (let e2 = 0; e2 < this.sprites.length; e2++) {
          this.container.removeChild(this.sprites[e2]);
        }
        if (this.sprites.length < this.maxSprites) {
          for (let e2 = 0; e2 < this.maxSprites; e2++) {
            const e3 = new st(this.exclamationTexture);
            e3.anchor.set(0.5, 1);
            this.sprites.push(e3);
            e3.visible = false;
          }
        }
        this.discardedSprites = this.sprites.slice();
      }
      newIcon(e2, t2, s) {
        if (e2.hasIcon) {
          return;
        }
        let i;
        if (this.discardedSprites.length > 0) {
          i = this.discardedSprites.pop();
        } else {
          i = new st(this.exclamationTexture);
          i.anchor.set(0.5, 1);
          this.sprites.push(i);
        }
        this.container.addChild(i);
        i.texture = t2;
        i.target = e2;
        i.target.hasIcon = true;
        i.x = e2.x;
        i.y = e2.y - this.height;
        i.visible = true;
        i.time = s;
        i.alpha = 1;
        i.scale.set(1.5, 1.5);
      }
      newHealing(e2) {
        this.newIcon(e2, this.healTexture, 1);
      }
      newExclamation(e2) {
        this.newIcon(e2, this.exclamationTexture, 2);
      }
      newRadio(e2) {
        this.newIcon(e2, this.radioTexture, 3);
      }
      newFire(e2) {
        this.newIcon(e2, this.fireTexture, 1);
      }
      newShield(e2) {
        this.newIcon(e2, this.shieldTexture, 1);
      }
      newPoison(e2) {
        this.newIcon(e2, this.poisonTexture, 1);
      }
      update(e2) {
        for (let t2 = 0; t2 < this.sprites.length; t2++) {
          if (this.sprites[t2].visible) {
            this.updateSprite(this.sprites[t2], e2);
          }
        }
      }
      updateSprite(e2, t2) {
        e2.x = e2.target.x;
        e2.y = e2.target.y - this.height;
        e2.time -= t2;
        if (e2.time < 0) {
          e2.alpha -= t2 * this.fadeSpeed;
          if (e2.alpha < 0) {
            e2.visible = false;
            e2.target.hasIcon = false;
            this.discardedSprites.push(e2);
          }
        }
      }
    }
    class at extends J {
      constructor(...args) {
        super(...args);
        this.plague = false;
        this.rocket = false;
        this.fireball = false;
        this.darkorb = false;
        this.target = null;
        this.source = null;
        this.hitbox = 0;
        this.damage = 0;
      }
    }
    class rt {
      constructor() {
        this.zombies = new Zombies();
        this.humans = new Humans();
        this.graveyard = new Graveyard();
        this.army = new Army();
        this.maxParts = 20;
        this.speed = 150;
        this.hitbox = 12;
        this.sprites = [];
        this.discardedSprites = [];
        this.fadeSpeed = 0.2;
        if (rt.instance) {
          return rt.instance;
        }
        rt.instance = this;
      }
      getTexture() {
        const e2 = document.createElement("canvas");
        e2.width = 1;
        e2.height = 1;
        const t2 = e2.getContext("2d");
        t2.fillStyle = "#ffffff";
        t2.fillRect(0, 0, 1, 1);
        return PIXI.Texture.from(e2);
      }
      getFireballTexture() {
        const e2 = document.createElement("canvas");
        e2.width = 8;
        e2.height = 8;
        const t2 = e2.getContext("2d");
        const s = t2.createRadialGradient(4, 4, 0, 4, 4, 4);
        s.addColorStop(0, "rgba(255,255,0,1)");
        s.addColorStop(0.8, "rgba(255,0,0,0.2)");
        s.addColorStop(1, "rgba(255,0,0,0)");
        t2.fillStyle = s;
        t2.fillRect(0, 0, 8, 8);
        return PIXI.Texture.from(e2);
      }
      getDarkOrbTexture() {
        const e2 = document.createElement("canvas");
        e2.width = 8;
        e2.height = 8;
        const t2 = e2.getContext("2d");
        const s = t2.createRadialGradient(4, 4, 0, 4, 4, 4);
        s.addColorStop(0, "rgba(0,0,0,1)");
        s.addColorStop(0.8, "rgba(0,0,128,0.5)");
        s.addColorStop(1, "rgba(0,0,255,0)");
        t2.fillStyle = s;
        t2.fillRect(0, 0, 8, 8);
        return PIXI.Texture.from(e2);
      }
      initialize() {
        if (!this.texture) {
          this.texture = this.getTexture();
          this.fireballTexture = this.getFireballTexture();
          this.darkOrbTexture = this.getDarkOrbTexture();
        }
        for (let e2 = 0; e2 < this.sprites.length; e2++) {
          g.removeChild(this.sprites[e2]);
        }
        if (this.sprites.length < this.maxParts) {
          for (let e2 = 0; e2 < this.maxParts; e2++) {
            const e3 = new at(this.texture);
            e3.scale.x = 2;
            e3.scale.y = 2;
            e3.visible = false;
            this.sprites.push(e3);
          }
        }
        this.discardedSprites = this.sprites.slice();
      }
      update(e2) {
        for (let t2 = 0; t2 < this.sprites.length; t2++) {
          if (this.sprites[t2].visible) {
            this.updatePart(this.sprites[t2], e2);
          }
        }
      }
      updatePart(e2, t2) {
        if (weighted_hybrid_distance(e2.x, e2.y + 8, e2.target.x, e2.target.y) < e2.hitbox) {
          if (e2.plague) {
            this.zombies.inflictPlague(e2.target);
            this.humans.damageHuman(e2.target, e2.damage);
          } else if (e2.fireball) {
            this.humans.burnHuman(e2.target, e2.damage);
            this.humans.damageHuman(e2.target, e2.damage);
          } else if (e2.darkorb) {
            if (!e2.target.flags.dead) {
              this.humans.damageHuman(e2.target, e2.damage);
              e2.target.timer.dogStun = 5;
              new Skeleton().orbHit(e2.target);
            }
          } else if (!e2.rocket && e2.target.bulletReflect && Math.random() < e2.target.bulletReflect) {
            this.newBullet(e2.target, e2.source, e2.damage, false, false, false);
          } else if (e2.rocket) {
            if (e2.target.graveyard) {
              this.graveyard.damageGraveyard(e2.damage);
            }
            this.army.droneExplosion(e2.target.x, e2.target.y, null, e2.damage);
          } else {
            if (e2.target.zombie) {
              this.zombies.damageZombie(e2.target, e2.damage, e2.source);
            }
            if (e2.target.human) {
              this.humans.damageHuman(e2.target, e2.damage);
            }
          }
          e2.visible = false;
          this.discardedSprites.push(e2);
          g.removeChild(e2);
        } else {
          e2.x += e2.xSpeed * t2;
          e2.y += e2.ySpeed * t2;
          e2.zIndex = e2.y;
        }
        if (e2.darkorb) {
          e2.alpha -= this.fadeSpeed * t2 * 0.4;
        } else {
          e2.alpha -= this.fadeSpeed * t2;
        }
        if (e2.alpha < 0) {
          e2.visible = false;
          this.discardedSprites.push(e2);
          g.removeChild(e2);
        }
      }
      newBullet(e2, t2, s, i = false, a = false, r = false, n = false) {
        let o;
        if (this.discardedSprites.length > 0) {
          o = this.discardedSprites.pop();
        } else {
          o = new at(this.texture);
          o.scale.x = 2;
          o.scale.y = 2;
          this.sprites.push(o);
        }
        g.addChild(o);
        o.texture = n ? this.darkOrbTexture : r ? this.fireballTexture : this.texture;
        o.source = e2;
        o.x = e2.x;
        o.y = e2.y - 8;
        if (i) {
          o.y = e2.y - 12;
        }
        o.target = t2;
        o.damage = s;
        o.visible = true;
        o.alpha = 1;
        o.hitbox = a ? 1.5 * this.hitbox : this.hitbox;
        o.plague = i;
        o.rocket = a;
        o.fireball = r;
        o.darkorb = n;
        o.tint = i ? 65280 : a ? 16772096 : 16777215;
        o.scale.x = o.scale.y = a ? 2.5 : 2;
        if (r) {
          o.scale.x = 1.5;
          o.scale.y = 1.5;
        }
        const h2 = t2.x - o.x;
        const l2 = t2.y - 8 - o.y;
        const d2 = Math.abs(h2);
        const c2 = Math.abs(l2);
        let u2 = 1 / Math.max(d2, c2);
        u2 *= 1.29289 - (d2 + c2) * u2 * 0.29289;
        o.xSpeed = h2 * u2 * this.speed;
        o.ySpeed = l2 * u2 * this.speed;
        o.rotation = Math.atan2(o.ySpeed, o.xSpeed);
      }
    }
    class nt extends _ {
      constructor() {
        super();
        this.viewableArea = null;
        if (nt.instance) {
          return nt.instance;
        }
        nt.instance = this;
        this.create = (e2) => new J(e2);
      }
      getTexture() {
        const e2 = document.createElement("canvas");
        e2.width = 32;
        e2.height = 32;
        const t2 = e2.getContext("2d");
        const s = t2.createRadialGradient(16, 16, 0, 16, 16, 16);
        s.addColorStop(0, "rgba(255,255,255,1)");
        s.addColorStop(0.8, "rgba(255,255,128,0.2)");
        s.addColorStop(1, "rgba(255,180,0,0)");
        t2.fillStyle = s;
        t2.fillRect(0, 0, 32, 32);
        return PIXI.Texture.from(e2);
      }
      initialize() {
        this.viewableArea = G;
        if (!this.texture) {
          this.texture = this.getTexture();
          this.container = new PIXI.Container();
          b.addChild(this.container);
          this.setup(this.container, this.texture);
        }
      }
      update(e2) {
        for (let t2 = 0; t2 < this.sprites.length; t2++) {
          if (this.sprites[t2].visible) {
            this.updatePart(this.sprites[t2], e2);
          }
        }
      }
      updatePart(e2, t2) {
        if (e2.visible) {
          e2.scale.y -= 10 * t2;
          e2.scale.x = e2.scale.y;
          if (e2.scale.x <= 0) {
            this.discardSprite(e2);
          }
        }
      }
      newBlast(e2, t2) {
        if (this.viewableArea.hideParticle(e2, t2)) {
          return;
        }
        const s = this.getSprite();
        s.anchor.set(0.5, 0.5);
        s.tint = 16777215;
        s.scale.x = 2;
        s.scale.y = 2;
        s.x = e2;
        s.y = t2;
        new ot().newCloud(e2, t2);
      }
      newZombieBlast(e2, t2) {
        if (this.viewableArea.hideParticle(e2, t2)) {
          return;
        }
        const s = this.getSprite();
        s.anchor.set(0.5, 0.5);
        s.tint = 11206570;
        s.scale.x = 2;
        s.scale.y = 2;
        s.x = e2;
        s.y = t2;
        new ot().newCloud(e2, t2);
      }
      newDetonateBlast(e2, t2) {
        if (this.viewableArea.hideParticle(e2, t2)) {
          return;
        }
        const s = this.getSprite();
        s.anchor.set(0.5, 0.5);
        s.tint = 6750054;
        s.scale.x = 2.5;
        s.scale.y = 2.5;
        s.x = e2;
        s.y = t2;
        new ot().newCloud(e2, t2);
      }
      newDroneBlast(e2, t2) {
        const s = this.getSprite();
        s.anchor.set(0.5, 0.5);
        s.scale.x = 2;
        s.scale.y = 2;
        s.tint = 16777215;
        s.x = e2;
        s.y = t2;
        new ot().newDroneCloud(e2, t2);
      }
    }
    class ot extends _ {
      constructor() {
        super();
        this.tint = 16777215;
        this.viewableArea = null;
        this.allowTint = false;
        this.gameModel = null;
        this.sizeVariance = 0.2;
        if (ot.instance) {
          return ot.instance;
        }
        ot.instance = this;
        this.create = (e2) => new J(e2);
      }
      getTexture() {
        const e2 = document.createElement("canvas");
        e2.width = 12;
        e2.height = 12;
        const t2 = e2.getContext("2d");
        t2.shadowBlur = 5;
        t2.shadowColor = "white";
        const s = t2.createRadialGradient(6, 6, 0, 6, 6, 4);
        s.addColorStop(0, "rgba(255,255,255,0.05)");
        s.addColorStop(0.5, "rgba(255,255,255,0.1)");
        s.addColorStop(1, "rgba(255,255,255,0)");
        t2.fillStyle = s;
        t2.fillRect(0, 0, 12, 12);
        return PIXI.Texture.from(e2);
      }
      initialize() {
        this.gameModel = GameModel.getInstance();
        this.viewableArea = G;
        this.allowTint = this.gameModel.app && this.gameModel.app.renderer && this.gameModel.app.renderer.type == 1;
        if (!this.texture) {
          this.setup(new PIXI.Container(), this.getTexture());
          b.addChild(this.container);
        }
      }
      update(e2) {
        if (this.gameModel.persistentData.particles) {
          this.container.visible = true;
          for (let t2 = 0; t2 < this.sprites.length; t2++) {
            if (this.sprites[t2].visible) {
              this.updatePart(this.sprites[t2], e2);
            }
          }
        } else {
          this.container.visible = false;
        }
      }
      updatePart(e2, t2) {
        e2.scale.y -= 1.5 * t2;
        e2.scale.x = e2.scale.y;
        e2.y += e2.ySpeed * t2;
        if (e2.scale.x <= 0) {
          this.discardSprite(e2);
        }
      }
      newSmoke(e2, t2, s = 0) {
        if (this.viewableArea.hideParticle(e2, t2)) {
          return;
        }
        const i = this.getSprite();
        if (this.allowTint) {
          i.tint = this.tint;
        }
        i.ySpeed = -30;
        i.anchor.set(0.5, 0.5);
        i.scale.x = i.scale.y = 1.6 - this.sizeVariance + Math.random() * this.sizeVariance * 2;
        i.visible = true;
        i.x = e2 - s + Math.random() * s * 2;
        i.y = t2 - s + Math.random() * s * 2;
      }
      newFireSmoke(e2, t2) {
        if (this.container.visible) {
          this.tint = 16777215;
          this.newSmoke(e2, t2, 3);
        }
      }
      newCloud(e2, t2) {
        if (this.container.visible) {
          this.tint = 65280;
          for (let s = 0; s < 10; s++) {
            this.newSmoke(e2, t2, 16);
          }
        }
      }
      newDroneCloud(e2, t2) {
        if (this.container.visible) {
          this.tint = 16777215;
          for (let s = 0; s < 10; s++) {
            this.newSmoke(e2, t2, 24);
          }
        }
      }
      newZombieSpawnCloud(e2, t2) {
        if (this.container.visible) {
          this.tint = 65280;
          for (let s = 0; s < 5; s++) {
            this.newSmoke(e2, t2, 6);
          }
        }
      }
    }
    class ht extends J {
      constructor(...args) {
        super(...args);
        this.hitFloor = false;
      }
    }
    class lt extends _ {
      constructor() {
        super();
        this.partsPerSplatter = 15;
        this.gravity = 100;
        this.spraySpeed = 50;
        this.fadeSpeed = 0.7;
        this.viewableArea = G;
        if (lt.instance) {
          return lt.instance;
        }
        lt.instance = this;
        this.create = (e2) => new ht(e2);
      }
      getTexture() {
        const e2 = document.createElement("canvas");
        e2.width = 5;
        e2.height = 1;
        const t2 = e2.getContext("2d");
        t2.fillStyle = "#FFFFFF";
        t2.fillRect(0, 0, 5, 1);
        return PIXI.Texture.from(e2);
      }
      initialize() {
        this.gameModel = GameModel.getInstance();
        this.viewableArea = G;
        if (!this.container) {
          this.container = new PIXI.Container();
          p.addChild(this.container);
          this.texture = this.getTexture();
          this.setup(this.container, this.texture);
        }
      }
      update(e2) {
        if (this.gameModel.persistentData.particles) {
          this.container.visible = true;
          for (let t2 = 0; t2 < this.sprites.length; t2++) {
            if (this.sprites[t2].visible) {
              this.updatePart(this.sprites[t2], e2);
            }
          }
        } else {
          this.container.visible = false;
        }
      }
      updatePart(e2, t2) {
        if (e2.hitFloor) {
          e2.alpha -= this.fadeSpeed * t2;
          if (e2.alpha <= 0) {
            this.discardSprite(e2);
          }
        } else {
          e2.ySpeed += this.gravity * t2;
          e2.x += e2.xSpeed * t2;
          e2.y += e2.ySpeed * t2;
          if (e2.y >= e2.floor) {
            e2.hitFloor = true;
          }
          e2.rotation += e2.rotSpeed * t2;
        }
      }
      newPart(e2, t2, s) {
        if (!this.container.visible) {
          return;
        }
        if (this.viewableArea.hideParticle(e2, t2)) {
          return;
        }
        const i = this.getSprite();
        i.tint = s;
        i.x = e2;
        i.y = t2 - (8 + 10 * Math.random());
        i.floor = t2;
        i.hitFloor = false;
        i.rotation = 5 * Math.random();
        i.rotSpeed = 4 * Math.random() - 2;
        i.alpha = 1;
        i.scale.set(2, 2);
        const a = Math.random() * this.spraySpeed;
        i.xSpeed = Math.random() > 0.5 ? -1 * a : a;
        i.ySpeed = -1 * (10 + Math.random() * this.spraySpeed);
      }
      newFragmentExplosion(e2, t2, s) {
        if (this.container.visible) {
          for (let i = 0; i < this.partsPerSplatter; i++) {
            this.newPart(e2, t2, s);
          }
        }
      }
    }
    const dt = new Skeleton();
    const ct = new Zombies();
    const ut = new Creatures();
    const pt = new CreatureFactory();
    const gt = new Spells();
    const mt = "Golem Mastery";
    const bt = "Zombie Mastery";
    const ft = "Skeleton Mastery";
    const yt = "Spell Mastery";
    class xt {
      constructor(e2, t2, s, i, a, r) {
        this.id = 0;
        this.maxPoints = 0;
        this.active = function() {
          return dt.talents[this.id] && dt.talents[this.id] > 0;
        };
        this.full = function() {
          return dt.talents[this.id] && dt.talents[this.id] == 10;
        };
        this.reset = function() {
          dt.talents[this.id] = 0;
        };
        this.max = function() {
          dt.talents[this.id] = this.maxPoints;
          if (dt.getAvailablePoints() < 0) {
            dt.talents[this.id] += dt.getAvailablePoints();
          }
        };
        this.set = function(e3) {
          if (!dt.talents[this.id]) {
            dt.talents[this.id] = 0;
          }
          if (e3 < 0 || e3 > 0 && dt.getAvailablePoints() > 0) {
            dt.talents[this.id] += e3;
            if (dt.talents[this.id] < 0) {
              dt.talents[this.id] = 0;
            }
            if (dt.talents[this.id] > this.maxPoints) {
              dt.talents[this.id] = this.maxPoints;
            }
          }
        };
        this.id = e2;
        this.name = t2;
        this.description = r;
        this.group = s;
        this.maxPoints = i;
        this.apply = a;
      }
    }
    class vt {
      constructor(e2, t2) {
        this.talents = [];
        this.name = e2;
        this.class = t2;
      }
    }
    const St = [
      new xt(
        1,
        "Efficiency",
        mt,
        12,
        function() {
          pt.creatureCostReduction = 1;
          const e2 = dt.talents[this.id];
          if (e2 && e2 > 0) {
            pt.creatureCostReduction -= 0.075 * e2;
          }
        },
        function() {
          const e2 = dt.talents[this.id];
          return e2 && e2 > 0 ? `Golem upgrade and summoning cost reduced by ${7.5 * e2}%` : "Reduces golem upgrade and summoning cost by 7.5%";
        }
      ),
      new xt(
        2,
        "Thrifty",
        mt,
        12,
        function() {
          dt.killingBlowParts = 0;
          const e2 = dt.talents[this.id];
          if (e2 && e2 > 0) {
            dt.killingBlowParts = 10 * e2;
          }
        },
        function() {
          const e2 = dt.talents[this.id];
          return e2 && e2 > 0 ? `Skeleton killing blows reward ${10 * e2}x of your current parts per second` : "Skeleton killing blows reward 10x of your current parts per second";
        }
      ),
      new xt(
        3,
        "Fatal Bargain",
        mt,
        12,
        function() {
          ut.refundChance = 0;
          ct.refundChance = 0;
          const e2 = dt.talents[this.id];
          if (e2 && e2 > 0) {
            ut.refundChance = 0.08 * e2;
            ct.refundChance = 0.08 * e2;
          }
        },
        function() {
          const e2 = dt.talents[this.id];
          return e2 && e2 > 0 ? `${8 * e2}% parts refund on golem death` : "Grants 8% parts refund on golem death";
        }
      ),
      new xt(
        4,
        "Recovery",
        yt,
        12,
        function() {
          gt.cooldownReduction = 1;
          const e2 = dt.talents[this.id];
          if (e2 && e2 > 0) {
            gt.cooldownReduction = 1 - 0.05 * e2;
          }
        },
        function() {
          const e2 = dt.talents[this.id];
          return e2 && e2 > 0 ? `Spell cooldown time reduced by ${5 * e2}%` : "Reduces spell cooldown time by 5%";
        }
      ),
      new xt(
        5,
        "Endurance",
        yt,
        12,
        function() {
          gt.timeExtension = 0;
          const e2 = dt.talents[this.id];
          if (e2 && e2 > 0) {
            gt.timeExtension = e2;
          }
        },
        function() {
          const e2 = dt.talents[this.id];
          return e2 && e2 > 0 ? `Spell duration increased by ${e2} seconds` : "Increases spell duration by 1 second";
        }
      ),
      new xt(
        6,
        "Opportunist",
        yt,
        12,
        function() {
          gt.costReduction = 0;
          dt.increaseChance = 0;
          const e2 = dt.talents[this.id];
          if (e2 && e2 > 0) {
            dt.increaseChance = 0.02 * e2;
          }
        },
        function() {
          const e2 = dt.talents[this.id];
          return e2 && e2 > 0 ? `Gear spell activation chance increased by ${2 * e2}%` : "Increases spell activation chance by 2%";
        }
      ),
      new xt(
        7,
        "Shiny",
        ft,
        12,
        function() {
          dt.lootChanceMod = 1;
          const e2 = dt.talents[this.id];
          if (e2 && e2 > 0) {
            dt.lootChanceMod = 1 + 0.1 * e2;
          }
        },
        function() {
          const e2 = dt.talents[this.id];
          return e2 && e2 > 0 ? `Rare loot chance increased by ${10 * e2}%` : "Increases the chance for rare loot by 10%";
        }
      ),
      new xt(
        8,
        "Dark Orb",
        ft,
        10,
        function() {
          dt.darkorb = 0;
          const e2 = dt.talents[this.id];
          if (e2 && e2 > 0) {
            dt.darkorb = 12 - e2;
          }
        },
        function() {
          const e2 = dt.talents[this.id];
          return e2 && e2 > 0 ? `Dark orb released every ${12 - e2} seconds` : "Releases a dark orb of energy every 11 seconds";
        }
      ),
      new xt(
        9,
        "Bone Shield",
        ft,
        12,
        function() {
          dt.boneshield = 0;
          const e2 = dt.talents[this.id];
          if (e2 && e2 > 0) {
            dt.boneshield = e2;
          }
        },
        function() {
          const e2 = dt.talents[this.id];
          return e2 && e2 > 0 ? `Gains a shield of ${e2} bones every 10 seconds` : "Gain a shield of 1 bone to protect the skeleton every 10 seconds";
        }
      ),
      new xt(
        10,
        "Gigamutagen",
        bt,
        12,
        function() {
          ct.gigamutagen = 0;
          const e2 = dt.talents[this.id];
          if (e2 && e2 > 0) {
            ct.gigamutagen = 14 - e2;
          }
        },
        function() {
          const e2 = dt.talents[this.id];
          return e2 && e2 > 0 ? `Gigazombie mutation every ${14 - e2} seconds` : "Mutates a random zombie into a gigazombie every 13 seconds";
        }
      ),
      new xt(
        11,
        "Blood Pact",
        bt,
        12,
        function() {
          ct.bloodpact = 0;
          const e2 = dt.talents[this.id];
          if (e2 && e2 > 0) {
            ct.bloodpact = 0.05 * e2;
          }
        },
        function() {
          const e2 = dt.talents[this.id];
          return e2 && e2 > 0 ? `${5 * e2}% of zombie damage converted to blood` : "Converts an additional 5% of zombie damage to blood";
        }
      ),
      new xt(
        12,
        "Blood Born",
        bt,
        12,
        function() {
          ct.bloodborn = 0;
          const e2 = dt.talents[this.id];
          if (e2 && e2 > 0) {
            ct.bloodborn = e2;
          }
        },
        function() {
          const e2 = dt.talents[this.id];
          return e2 && e2 > 0 ? `${e2} seconds of additional 50% damage reduction` : "Grants 1 second of additional 50% damage reduction to newly spawned zombies";
        }
      )
    ];
    const Mt = [];
    function kt() {
      St.forEach((e2) => {
        const t2 = dt.talents[e2.id];
        if (t2 && t2 < 0) {
          dt.talents[e2.id] = 0;
        }
      });
      if (dt.talentPoints < dt.getUsedPoints()) {
        wt();
      }
      St.forEach((e2) => e2.apply());
    }
    function wt() {
      if (dt.persistent.talentReset) {
        St.forEach((e2) => e2.reset());
        dt.persistent.talentReset = false;
      }
    }
    St.forEach((e2) => {
      if (Mt.filter((t2) => t2.name == e2.group).length == 0) {
        let t2 = "blood";
        if (e2.group == mt) {
          t2 = "parts";
        }
        if (e2.group == ft) {
          t2 = "bones";
        }
        if (e2.group == yt) {
          t2 = "energy";
        }
        if (e2.group == bt) {
          t2 = "brains";
        }
        Mt.push(new vt(e2.group, t2));
      }
      Mt.filter((t2) => t2.name == e2.group)[0].talents.push(e2);
      if (!dt.talents[e2.id]) {
        dt.talents[e2.id] = 0;
      }
    });
    angular.module("zombieApp", []).filter("decimal", () => formatDecimal).filter("whole", () => formatWhole).config([
      "$compileProvider",
      (e2) => {
        e2.aHrefSanitizationWhitelist(
          /^\s*(https?|ftp|mailto|javascript|data|blob):/
        );
        e2.debugInfoEnabled(false);
      }
    ]).controller("ZombieController", [
      "$scope",
      "$interval",
      "$document",
      function(e2, t2, s) {
        const i = new Skeleton();
        const partFactory = new PartFactory();
        const o = new CreatureFactory();
        const h2 = new Upgrades();
        const l2 = new Trophies();
        function u2() {
          const e3 = (/* @__PURE__ */ new Date()).getTime();
          !(function(e4, t3) {
            this.model.update(e4, t3);
            this.updateMessages(e4);
            if (this.sidePanels.factory) {
              this.factoryStats = factory.factoryStats();
            }
          })(
            Math.min(1e3, Math.max(e3 - this.lastUpdate, 0)) / 1e3,
            e3
          );
          this.lastUpdate = e3;
        }
        this.model = GameModel.getInstance();
        this.skeleton = () => i.persistent;
        this.spells = new Spells();
        this.keysPressed = Y;
        this.files = [];
        this.messageTimer = 4;
        this.message = false;
        this.lastUpdate = 0;
        this.sidePanels = {};
        this.upgrades = [];
        this.currentShopFilter = "blood";
        this.currentConstructionFilter = "available";
        this.graveyardTab = "minions";
        this.trophyTab = "all";
        this.factoryTab = "parts";
        this.factoryStats = {};
        this.moveTooltip = d;
        this.confirmMessage = "";
        this.confirmCancel = function() {
          this.confirmCallback = false;
        };
        this.closeSidePanels = function() {
          this.currentShopFilter = "blood";
          this.currentConstructionFilter = "available";
          this.graveyardTab = "minions";
          this.factoryTab = "parts";
          this.sidePanels.options = false;
          this.sidePanels.graveyard = false;
          this.sidePanels.runesmith = false;
          this.sidePanels.prestige = false;
          this.sidePanels.construction = false;
          this.sidePanels.shop = false;
          this.sidePanels.open = false;
          this.sidePanels.factory = false;
          this.levelSelect.shown = false;
        };
        this.openSidePanel = function(e3) {
          this.closeSidePanels();
          switch (e3) {
            case "shop": {
              this.filterShop(this.currentShopFilter);
              this.sidePanels.shop = true;
              break;
            }
            case "construction": {
              this.filterConstruction(this.currentConstructionFilter);
              this.sidePanels.construction = true;
              break;
            }
            case "graveyard": {
              this.sidePanels.graveyard = true;
              this.graveyardTab = "minions";
              this.trophyTab = "all";
              break;
            }
            case "runesmith": {
              this.sidePanels.runesmith = true;
              break;
            }
            case "factory": {
              this.sidePanels.factory = true;
              this.upgrades = factory.generators;
              this.factoryStats = factory.factoryStats();
              this.factory.updateDelays();
              break;
            }
            case "prestige": {
              this.upgrades = h2.prestigeUpgrades.filter(
                (e4) => e4.cap == 0 || this.currentRank(e4) < e4.cap
              );
              this.upgrades.push(
                ...h2.prestigeUpgrades.filter(
                  (e4) => e4.cap !== 0 && this.currentRank(e4) >= e4.cap
                )
              );
              this.upgrades = this.upgrades.filter((e4) => e4.id !== 115);
              this.sidePanels.prestige = true;
              break;
            }
            case "options": {
              this.sidePanels.options = true;
              this.model.downloadSaveGame();
            }
          }
          this.sidePanels.open = true;
        };
        this.graveyardTabSelect = function(e3) {
          this.graveyardTab = e3;
          if (e3 == "trophies") {
            this.trophies = l2.getTrophyList();
            this.trophyTab = "all";
          }
        };
        this.trophyTabSelect = function(e3) {
          this.trophyTab = e3;
          switch (e3) {
            case "all": {
              this.trophies = l2.getTrophyList();
              break;
            }
            case "collected": {
              this.trophies = l2.getTrophyList().filter((e4) => e4.owned);
              break;
            }
            case "uncollected": {
              this.trophies = l2.getTrophyList().filter((e4) => !e4.owned);
              break;
            }
            case "totals": {
              this.trophies = l2.getTrophyTotals();
            }
          }
        };
        this.filterShop = function(e3) {
          this.currentShopFilter = e3;
          this.upgrades = h2.getUpgrades(e3);
        };
        this.filterConstruction = function(e3) {
          this.currentConstructionFilter = e3;
          switch (e3) {
            case "available": {
              this.upgrades = h2.getAvailableConstructions();
              break;
            }
            case "completed": {
              this.upgrades = h2.getCompletedConstructions();
            }
          }
        };
        this.resetGame = function() {
          this.confirmMessage = "Are you sure you want to reset everything? If you have a cloud save it will also be deleted. Make sure you export your save game first.";
          this.confirmCallback = function() {
            this.model.resetData();
            this.confirmCallback = false;
          };
        };
        this.addBoneCollector = function() {
          if (this.model.getEnergyRate() >= 1) {
            this.model.persistentData.boneCollectors++;
          }
        };
        this.subtractBoneCollector = function() {
          if (this.model.persistentData.boneCollectors > 0) {
            this.model.persistentData.boneCollectors--;
          }
        };
        this.maxBoneCollectors = function() {
          return Math.floor(
            this.model.getEnergyRate() + this.model.persistentData.boneCollectors
          );
        };
        this.setBoneCollectors = function(e3) {
          if (e3 >= 0 && this.model.getEnergyRate() >= e3 - this.model.persistentData.boneCollectors) {
            this.model.persistentData.boneCollectors = e3;
          }
        };
        this.setHarpies = function(e3) {
          if (e3 >= 0 && e3 < this.model.persistentData.harpies || this.model.getEnergyRate() >= 1 && e3 > 0) {
            this.model.persistentData.harpies = e3;
          }
        };
        this.maxHarpies = function() {
          return Math.floor(
            this.model.getEnergyRate() + this.model.persistentData.harpies
          );
        };
        this.setGraveyardZombies = function(e3) {
          if (e3 <= this.maxGraveyardZombies() && e3 >= 0) {
            this.model.persistentData.graveyardZombies = e3;
          }
        };
        this.maxGraveyardZombies = function() {
          return Math.floor(this.model.energyMax / this.model.zombieCost);
        };
        this.upgradePrice = function(e3) {
          return this.sidePanels.factory && e3.costType != "prestigePoints" ? factory.purchasePrice(e3) : h2.upgradePrice(e3);
        };
        this.factory = {
          delays: [],
          changeFactoryTab(e3) {
            this.factoryTab = e3;
            if (e3 == "parts") {
              this.upgrades = factory.generators;
              this.updateDelays();
            } else {
              this.upgrades = o.creatures;
            }
          },
          buyGenerator(e3) {
            if (this.keysPressed.shift) {
              factory.purchaseMaxGenerators(e3);
            } else {
              factory.purchaseGenerator(e3);
            }
            this.factoryStats = factory.factoryStats();
          },
          generatorPrice: (e3) => factory.purchasePrice(e3),
          creaturePrice: (e3) => o.purchasePrice(e3),
          creatureLevelPrice: (e3) => o.levelPrice(e3),
          creaturePercent(e3) {
            return Math.min(
              Math.round(
                this.model.persistentData.parts / this.creaturePrice(e3) * 100
              ),
              100
            );
          },
          creatureLevelPercent(e3) {
            return Math.min(
              Math.round(
                this.model.persistentData.parts / this.creatureLevelPrice(e3) * 100
              ),
              100
            );
          },
          buyCreature: (e3) => o.startBuilding(e3),
          creatureTooExpensive: (e3) => !o.canAffordCreature(e3),
          creatureButtonText(e3) {
            return e3.building ? "Building..." : this.creatureTooExpensive(e3) ? `${formatWhole(
              this.creaturePrice(e3) - this.model.persistentData.parts
            )} parts required` : `Build (${formatWhole(this.creaturePrice(e3))} parts)`;
          },
          creatureLevelButtonText(e3) {
            return this.canLevelCreature(e3) ? `Upgrade Level ${e3.level + 1} (${formatWhole(
              this.creatureLevelPrice(e3)
            )} parts)` : `${formatWhole(
              this.creatureLevelPrice(e3) - this.model.persistentData.parts
            )} parts required`;
          },
          canBuildCreature(e3) {
            return !this.creatureTooExpensive(e3) && !e3.building && o.creaturesBuildingCount() + this.model.creatureCount < this.model.creatureLimit;
          },
          canLevelCreature(e3) {
            return this.creatureLevelPrice(e3) < this.model.persistentData.parts;
          },
          levelCreature(e3) {
            o.levelCreature(e3);
          },
          autoBuild(e3, t3) {
            if (e3.autobuild + t3 >= 0 && e3.autobuild + t3 <= this.model.creatureLimit) {
              o.creatureAutoBuildNumber(e3, t3);
            }
          },
          creatureStats: (e3) => o.creatureStats(e3),
          updateDelays() {
            this.delays = [];
            for (let e3 = 0; e3 < factory.generatorsApplied.length; e3++) {
              this.delays[factory.generatorsApplied[e3].id] = (-1 * (factory.generatorsApplied[e3].time - factory.generatorsApplied[e3].timeLeft)).toFixed(2);
            }
          }
        };
        this.levelSelect = {
          shown: false,
          levelsPerPage: 50,
          levels: [],
          levelRanges: [],
          start: 1,
          showButton: () => this.model.persistentData.allTimeHighestLevel > 1,
          show() {
            if (this.shown) {
              this.shown = false;
            } else {
              this.closeSidePanels();
              this.shown = true;
              this.level = this.model.levelInfo(this.model.level);
              this.start = Math.floor((this.level.level - 1) / this.levelsPerPage) * this.levelsPerPage + 1;
              this.populate();
            }
          },
          populate() {
            this.levels = [];
            this.levelRanges = [];
            if (this.start > this.levelsPerPage) {
              this.levelRanges.push(this.start - this.levelsPerPage);
            }
            this.levelRanges.push(this.start);
            if (this.start + this.levelsPerPage <= this.model.persistentData.allTimeHighestLevel + 1) {
              this.levelRanges.push(this.start + this.levelsPerPage);
            }
            for (let e3 = this.start; e3 < this.start + this.levelsPerPage; e3++) {
              this.levels.push(this.model.levelInfo(e3));
            }
          },
          selectRange(e3) {
            this.start = e3;
            this.populate();
          },
          select(e3) {
            this.level = e3;
          },
          startLevel() {
            this.model.startLevel(this.level.level);
            this.shown = false;
          }
        };
        this.addToHomeScreen = function() {
          this.model.deferredPrompt;
        };
        this.constructionPercent = function() {
          if (this.model.persistentData.currentConstruction) {
            const e3 = this.model.persistentData.currentConstruction.time - this.model.persistentData.currentConstruction.timeRemaining;
            return Math.round(
              e3 / this.model.persistentData.currentConstruction.time * 100
            );
          }
          return 0;
        };
        this.updateConstructionUpgrades = function() {
          if (this.sidePanels.construction == 1) {
            this.upgrades = h2.getAvailableConstructions();
          }
        };
        this.startConstruction = function(e3) {
          h2.startConstruction(e3);
          this.upgrades = h2.getAvailableConstructions();
        };
        this.playPauseConstruction = () => {
          h2.playPauseConstruction();
        };
        this.cancelConstruction = function() {
          this.confirmMessage = "Are you sure you want to cancel construction? Used materials will not be refunded";
          this.confirmCallback = function() {
            h2.cancelConstruction();
            this.upgrades = h2.getAvailableConstructions();
            this.confirmCallback = false;
          };
        };
        this.upgradeSubtitle = (e3) => {
          switch (e3.type) {
            case h2.types.energyRate: {
              return `+${e3.effect} energy per second`;
            }
            case h2.types.energyCap: {
              return `+${e3.effect} max energy`;
            }
            case h2.types.bloodCap: {
              return `+${formatWhole(e3.effect)} max blood`;
            }
            case h2.types.bloodStoragePC: {
              return `+${Math.round(100 * e3.effect)}% max blood`;
            }
            case h2.types.bloodGainPC: {
              return `+${Math.round(100 * e3.effect)}% blood income`;
            }
            case h2.types.brainsGainPC: {
              return `+${Math.round(100 * e3.effect)}% brains income`;
            }
            case h2.types.bonesGainPC: {
              return `+${Math.round(100 * e3.effect)}% bones income`;
            }
            case h2.types.partsGainPC: {
              return `+${Math.round(100 * e3.effect)}% parts income`;
            }
            case h2.types.brainsStoragePC: {
              return `+${Math.round(100 * e3.effect)}% max brains`;
            }
            case h2.types.energyCost: {
              return `-${e3.effect} zombie energy cost`;
            }
            case h2.types.brainsCap: {
              return `+${e3.effect} max brains`;
            }
            case h2.types.damage: {
              return `+${e3.effect} zombie damage`;
            }
            case h2.types.speed: {
              return `+${e3.effect} zombie speed`;
            }
            case h2.types.health: {
              return `+${e3.effect} zombie health`;
            }
            case h2.types.brainRecoverChance: {
              return `+${Math.round(100 * e3.effect)}% chance to recover brain`;
            }
            case h2.types.riseFromTheDeadChance: {
              return `+${Math.round(
                100 * e3.effect
              )}% chance for corpse to become zombie`;
            }
            case h2.types.infectedBite: {
              return `+${Math.round(
                100 * e3.effect
              )}% chance for zombies to infect their targets`;
            }
            case h2.types.infectedBlast: {
              return `+${Math.round(
                100 * e3.effect
              )}% chance for zombies to explode on death`;
            }
            case h2.types.boneCollectorCapacity: {
              return `+${e3.effect} bone collector capacity`;
            }
            case h2.types.zombieDmgPC: {
              return `+${formatWhole(
                Math.round(100 * e3.effect)
              )}% zombie damage`;
            }
            case h2.types.zombieHealthPC: {
              return `+${formatWhole(
                Math.round(100 * e3.effect)
              )}% zombie health`;
            }
            case h2.types.bonesRate: {
              return `+${e3.effect} bones per second`;
            }
            case h2.types.brainsRate: {
              return `+${e3.effect} brains per second`;
            }
            case h2.types.plagueDamage: {
              return `+${formatWhole(e3.effect)} plague damage`;
            }
            case h2.types.plagueTicks: {
              return `+${formatWhole(e3.effect)} plague ticks`;
            }
            case h2.types.spitDistance: {
              return `+${e3.effect} spit distance`;
            }
            case h2.types.blastHealing: {
              return `+${Math.round(100 * e3.effect)}% plague healing`;
            }
            case h2.types.plagueArmor: {
              return `+${Math.round(100 * e3.effect)}% damage reduction`;
            }
            case h2.types.monsterLimit: {
              return `+${e3.effect} creature limit`;
            }
            case h2.types.runicSyphon: {
              return `+${Math.round(100 * e3.effect)}% runic syphon`;
            }
            case h2.types.gigazombies: {
              return "Unlock more gigazombies";
            }
            case h2.types.bulletproof: {
              return `+${Math.round(
                100 * e3.effect
              )}% earth golem bullet reflect`;
            }
            case h2.types.harpySpeed: {
              return `+${e3.effect} harpy speed`;
            }
            case h2.types.harpyBombs: {
              return `+${e3.effect} harpy bombs`;
            }
            case h2.types.tankBuster: {
              return "Anti tank harpies";
            }
            case h2.types.spikeDelay: {
              return "-20% spike delay";
            }
          }
          return "";
        };
        this.currentRank = function(e3) {
          return this.sidePanels.factory ? factory.currentRank(e3) : h2.currentRank(e3);
        };
        this.currentRankConstruction = (e3) => h2.currentRankConstruction(e3);
        this.upgradeTooExpensive = function(e3) {
          return this.sidePanels.factory ? !factory.canAffordGenerator(e3) : !h2.canAffordUpgrade(e3) || e3.cap != 0 && h2.currentRank(e3) >= e3.cap;
        };
        this.requiredForUpgrade = function(e3) {
          const t3 = this.upgradePrice(e3);
          switch (e3.costType) {
            case h2.costs.energy: {
              return `${formatWhole(t3 - this.model.energy)} energy required`;
            }
            case h2.costs.blood:
            case factory.costs.blood: {
              return `${formatWhole(
                t3 - this.model.persistentData.blood
              )} blood required`;
            }
            case h2.costs.brains: {
              return `${formatWhole(
                t3 - this.model.persistentData.brains
              )} brains required`;
            }
            case h2.costs.bones: {
              return `${formatWhole(
                t3 - this.model.persistentData.bones
              )} bones required`;
            }
            case h2.costs.prestigePoints: {
              return `${formatWhole(
                t3 - this.model.persistentData.prestigePointsToSpend
              )} prestige points required`;
            }
            case factory.costs.parts: {
              return `${formatWhole(
                t3 - this.model.persistentData.parts
              )} parts required`;
            }
          }
        };
        this.purchaseText = function(e3) {
          if (this.keysPressed.shift) {
            if (this.sidePanels.factory) {
              const maxAffordableUpgrades = factory.upgradeMaxAffordable(e3);
              return `Purchase ${maxAffordableUpgrades} (${formatWhole(
                factory.upgradeMaxPrice(e3, maxAffordableUpgrades)
              )} ${this.costTranslate(e3.costType)})`;
            }
            {
              const maxAffordableUpgrades = h2.upgradeMaxAffordable(e3);
              return `Purchase ${maxAffordableUpgrades} (${formatWhole(
                h2.upgradeMaxPrice(e3, maxAffordableUpgrades)
              )} ${this.costTranslate(e3.costType)})`;
            }
          }
          return `Purchase (${formatWhole(
            this.upgradePrice(e3)
          )} ${this.costTranslate(e3.costType)})`;
        };
        this.costTranslate = (e3) => e3 == h2.costs.prestigePoints ? "points" : e3;
        this.buyUpgrade = function(e3) {
          if (this.keysPressed.shift) {
            h2.purchaseMaxUpgrades(e3);
          } else {
            h2.purchaseUpgrade(e3);
          }
        };
        this.destroyUpgrade = (e3) => {
          h2.removeUpgrade(e3);
        };
        this.upgradeStatInfo = (e3) => h2.displayStatValue(e3);
        this.startGame = function() {
          this.model.startGame();
        };
        this.nextLevel = function() {
          this.model.nextLevel();
        };
        this.toggleAutoStart = function() {
          if (this.model.persistentData.autoStart) {
            this.model.persistentData.autoStart = false;
          } else {
            this.model.persistentData.autoStart = true;
          }
        };
        this.toggleAutoStartWait = function() {
          if (this.model.persistentData.autoStartWait) {
            this.model.persistentData.autoStartWait = false;
          } else {
            this.model.persistentData.autoStartWait = true;
          }
        };
        this.toggleAutoSellGear = function() {
          if (this.model.persistentData.autoSellGear) {
            this.model.persistentData.autoSellGear = false;
          } else {
            this.model.persistentData.autoSellGear = true;
          }
        };
        this.toggleAutoSellGearLegendary = function() {
          if (this.model.persistentData.autoSellGearLegendary) {
            this.model.persistentData.autoSellGearLegendary = false;
          } else {
            this.model.persistentData.autoSellGearLegendary = true;
          }
        };
        this.toggleResolution = function(e3) {
          this.model.persistentData.resolution = e3;
          this.model.setResolution(this.model.persistentData.resolution);
        };
        this.getResolution = function() {
          return this.model.persistentData.resolution || 1;
        };
        this.toggleZoomButtons = function() {
          this.model.persistentData.zoomButtons = !this.model.persistentData.zoomButtons;
        };
        this.zoom = function(e3) {
          this.model.zoom(e3);
        };
        this.resetZoom = function() {
          this.model.centerGameContainer(true);
        };
        this.toggleShowFps = function() {
          this.model.persistentData.showfps = !this.model.persistentData.showfps;
        };
        this.toggleParticles = function() {
          this.model.persistentData.particles = !this.model.persistentData.particles;
        };
        this.isShowPrestige = function() {
          return this.model.persistentData.prestigePointsEarned !== void 0 && this.model.persistentData.allTimeHighestLevel > 5;
        };
        this.doPrestige = function() {
          this.confirmMessage = "Are you sure you want to prestige now?";
          this.confirmCallback = function() {
            this.model.prestige();
            this.confirmCallback = false;
          };
        };
        this.constructionLeadsTo = (e3) => h2.constructionLeadsTo(e3);
        this.howToPlay = [
          "This started as Chalice's Mod, expanded by CirusDane (called Danemancer), for incremancer - We hope you enjoy the qol changes!",
          "Energy refills over time. You need 10 energy to spawn a zombie by clicking on the ground.",
          "Hold shift or control to spawn multiple zombies with a single click.",
          "Whenever one of your zombies attacks a human you will collect some blood.",
          "Killing a human or turning them into a zombie will earn you 1 brain.",
          "You can spend these currencies in the shop to purchase upgrades for your zombie horde.",
          "Hold shift to buy the maximum affordable number of upgrades.",
          "The world can be dragged with the mouse to explore it. Or by using the WASD or arrow keys.",
          "You can zoom in and out using your mouse wheel. Pinch to zoom on mobile."
        ];
        this.updateMessages = function(e3) {
          if (this.message) {
            this.messageTimer -= e3;
            if (this.model.messageQueue.length > 0) {
              this.messageTimer -= e3;
            }
            if (this.messageTimer < 0) {
              this.message = false, this.messageTimer = 4;
            }
          } else if (this.model.messageQueue.length > 0) {
            this.message = this.model.messageQueue.shift();
            this.messageTimer = 4;
          }
        };
        this.infusionAmount = 1e3;
        this.infusionMax = false;
        this.infuseRune = function(e3, t3) {
          if (this.infusionMax) {
            switch (t3) {
              case "blood": {
                h2.infuseRune(e3, t3, this.model.persistentData.blood);
                break;
              }
              case "brains": {
                h2.infuseRune(e3, t3, this.model.persistentData.brains);
                break;
              }
              case "bones": {
                h2.infuseRune(e3, t3, this.model.persistentData.bones);
              }
            }
          } else {
            h2.infuseRune(e3, t3, this.infusionAmount);
          }
        };
        this.shatterPercent = (e3) => h2.shatterPercent(e3);
        this.shatterBloodCost = (e3) => h2.shatterBloodCost(e3);
        this.shatterSatiate = function(e3, t3) {
          h2.infuseRune(e3, "blood", this.shatterBloodCost(t3));
        };
        this.canShatter = () => h2.canShatter();
        this.doShatter = () => {
          h2.doShatter();
        };
        this.shatterEffect = () => 100 * h2.shatterEffect();
        this.infuseButtonText = function() {
          return this.infusionMax ? "Max" : formatWhole(this.infusionAmount);
        };
        this.energyPercent = function() {
          return Math.min(
            Math.round(this.model.energy / this.model.energyMax * 100),
            100
          );
        };
        this.bloodPercent = function() {
          return Math.min(
            Math.round(
              this.model.persistentData.blood / this.model.bloodMax * 100
            ),
            100
          );
        };
        this.brainsPercent = function() {
          return Math.min(
            Math.round(
              this.model.persistentData.brains / this.model.brainsMax * 100
            ),
            100
          );
        };
        this.costAboveCap = function(e3, t3) {
          switch (e3.costType) {
            case "blood": {
              if (t3 > this.model.bloodMax) {
                return "Blood capacity too low";
              }
              break;
            }
            case "brains": {
              if (t3 > this.model.brainsMax) {
                return "Brains capacity too low";
              }
            }
          }
          return false;
        };
        this.upgradeButtonText = function(e3) {
          if (e3.cap != 0 && this.currentRank(e3) >= e3.cap) {
            return "Sold Out";
          }
          const t3 = this.upgradePrice(e3);
          if (this.upgradeTooExpensive(e3)) {
            return this.costAboveCap(e3, t3) || this.requiredForUpgrade(e3);
          }
          return this.purchaseText(e3, t3);
        };
        this.upgradePercent = function(e3) {
          switch (e3.costType) {
            case "blood": {
              return Math.round(
                100 * Math.min(
                  1,
                  this.model.persistentData.blood / this.upgradePrice(e3)
                )
              );
            }
            case "brains": {
              return Math.round(
                100 * Math.min(
                  1,
                  this.model.persistentData.brains / this.upgradePrice(e3)
                )
              );
            }
            case "bones": {
              return Math.round(
                100 * Math.min(
                  1,
                  this.model.persistentData.bones / this.upgradePrice(e3)
                )
              );
            }
            case "parts": {
              return Math.round(
                100 * Math.min(
                  1,
                  this.model.persistentData.parts / this.upgradePrice(e3)
                )
              );
            }
            case "prestigePoints": {
              return Math.round(
                100 * Math.min(
                  1,
                  this.model.persistentData.prestigePointsToSpend / this.upgradePrice(e3)
                )
              );
            }
          }
        };
        this.skeletonTimer = () => i.skeletonTimer();
        this.skeletonMenu = {
          isShown: false,
          isNewGearSetShown: false,
          showFilters: false,
          tab: "inventory",
          newGearSetName: "New Set",
          maxGearSet: 5,
          itemsFilters: { se: [], r: [], t: [] },
          changeTab(e3) {
            this.tab = e3;
          },
          equipped: [],
          show() {
            this.tab = "inventory";
            this.upgrade = h2.prestigeUpgrades.filter((e3) => e3.id == 115)[0];
            this.upgrades = Mt;
            this.isShown = !this.isShown;
            if (this.isShown) {
              this.updateEquippedItems();
            }
          },
          showNewGearSet() {
            this.newGearSetName = "New Set";
            this.isNewGearSetShown = !this.isNewGearSetShown;
            Y.canType = this.isNewGearSetShown;
          },
          selectGearSet(index) {
            i.persistent.gearSetEquipped = index;
            if (i.persistent.gearSetEquipped == -1) {
              return;
            }
            i.persistent.gearSets[i.persistent.gearSetEquipped].slots.forEach(
              (t3) => {
                i.persistent.items.filter(
                  (e3) => e3.s == t3.s && (e3.q = t3.id == e3.id)
                );
              }
            );
            h2.applyUpgrades();
            this.updateEquippedItems();
          },
          canCreateGearSets() {
            return i.persistent.gearSets.length < this.maxGearSet;
          },
          canDeleteGearSets: () => i.persistent.gearSets.length > 0 && i.persistent.gearSetEquipped != -1,
          gearSets: () => i.persistent.gearSets,
          gearSetEquipped: () => i.persistent.gearSetEquipped,
          createGearSet() {
            if (this.newGearSetName == null) {
              return;
            }
            let name = this.newGearSetName.replace(/[^\w^\S]*$/gi, "");
            if (name.length == 0) {
              return;
            }
            let newGearSet = { name, slots: [] };
            const e3 = i.persistent.items.filter(
              (e4) => e4.q && e4.s == i.lootPositions.helmet.id
            );
            if (e3.length > 0) {
              newGearSet.slots.push({ s: e3[0].s, id: e3[0].id });
            } else {
              newGearSet.slots.push([
                {
                  s: i.lootPositions.helmet.id,
                  id: -1
                }
              ]);
            }
            const s2 = i.persistent.items.filter(
              (e4) => e4.q && e4.s == i.lootPositions.sword.id
            );
            if (s2.length > 0) {
              newGearSet.slots.push({ s: s2[0].s, id: s2[0].id });
            } else {
              newGearSet.slots.push({
                s: i.lootPositions.sword.id,
                id: -2
              });
            }
            const a = i.persistent.items.filter(
              (e4) => e4.q && e4.s == i.lootPositions.chest.id
            );
            if (a.length > 0) {
              newGearSet.slots.push({ s: a[0].s, id: a[0].id });
            } else {
              newGearSet.slots.push({
                s: i.lootPositions.chest.id,
                id: -3
              });
            }
            const r = i.persistent.items.filter(
              (e4) => e4.q && e4.s == i.lootPositions.shield.id
            );
            if (r.length > 0) {
              newGearSet.slots.push({ s: r[0].s, id: r[0].id });
            } else {
              newGearSet.slots.push({
                s: i.lootPositions.shield.id,
                id: -4
              });
            }
            const o2 = i.persistent.items.filter(
              (e4) => e4.q && e4.s == i.lootPositions.gloves.id
            );
            if (o2.length > 0) {
              newGearSet.slots.push({ s: o2[0].s, id: o2[0].id });
            } else {
              newGearSet.slots.push({
                s: i.lootPositions.gloves.id,
                id: -5
              });
            }
            const h3 = i.persistent.items.filter(
              (e4) => e4.q && e4.s == i.lootPositions.legs.id
            );
            if (h3.length > 0) {
              newGearSet.slots.push({ s: h3[0].s, id: h3[0].id });
            } else {
              newGearSet.slots.push({
                s: i.lootPositions.legs.id,
                id: -6
              });
            }
            const l3 = i.persistent.items.filter(
              (e4) => e4.q && e4.s == i.lootPositions.boots.id
            );
            if (l3.length > 0) {
              newGearSet.slots.push({ s: l3[0].s, id: l3[0].id });
            } else {
              newGearSet.slots.push({
                s: i.lootPositions.boots.id,
                id: -7
              });
            }
            i.persistent.gearSets.push(newGearSet);
            this.selectGearSet(i.persistent.gearSets.length - 1);
            this.showNewGearSet();
          },
          deleteGearSet() {
            i.persistent.gearSets.splice(i.persistent.gearSetEquipped, 1);
            if (i.persistent.gearSets.length > 0) {
              this.selectGearSet(0);
            } else {
              this.selectGearSet(-1);
            }
          },
          filterItemsBySpecialEffect(i2) {
            if (this.itemsFilters.se.includes(i2)) {
              this.itemsFilters.se.splice(this.itemsFilters.se.indexOf(i2), 1);
            } else {
              this.itemsFilters.se.push(i2);
            }
          },
          filterItemsByRarity(i2) {
            if (this.itemsFilters.r.includes(i2)) {
              this.itemsFilters.r.splice(this.itemsFilters.r.indexOf(i2), 1);
            } else {
              this.itemsFilters.r.push(i2);
            }
          },
          filterItemsByType(i2) {
            if (this.itemsFilters.t.includes(i2)) {
              this.itemsFilters.t.splice(this.itemsFilters.t.indexOf(i2), 1);
            } else {
              this.itemsFilters.t.push(i2);
            }
          },
          isFiltered(i2) {
            return (this.itemsFilters.se.length > 0 ? i2.se.length > 0 ? this.itemsFilters.se.includes(i2.se[0]) : false : true) && (this.itemsFilters.r.length > 0 ? this.itemsFilters.r.includes(i2.r) : true) && (this.itemsFilters.t.length > 0 ? this.itemsFilters.t.includes(i2.s) : true);
          },
          resetFilter() {
            this.itemsFilters.se = [];
            this.itemsFilters.r = [];
            this.itemsFilters.t = [];
          },
          acceptOffer() {
            i.acceptOffer();
            this.isShown = false;
          },
          anotherOffer: () => i.persistent.skeletons > 0 && this.model.persistentData.trophies.length >= (i.persistent.xpRate < 4 ? 20 * i.persistent.xpRate : i.persistent.xpRate < 8 ? 70 : i.persistent.xpRate < 16 ? 110 : i.persistent.xpRate < 32 ? 160 : i.persistent.xpRate < 64 ? 220 : i.persistent.xpRate < 128 ? 290 : i.persistent.xpRate < 256 ? 370 : i.persistent.xpRate < 512 ? 460 : i.persistent.xpRate < 1024 ? 560 : i.persistent.xpRate < 2048 ? 670 : i.persistent.xpRate < 4096 ? 790 : 720 + (Math.log2(i.persistent.xpRate) - 7) * (Math.log2(i.persistent.xpRate) - 7) * 10),
          trophies: () => i.persistent.skeletons > 0 ? ` - ${this.model.persistentData.trophies.length} / ${i.persistent.xpRate < 4 ? 20 * i.persistent.xpRate : i.persistent.xpRate < 8 ? 70 : i.persistent.xpRate < 16 ? 110 : i.persistent.xpRate < 32 ? 160 : i.persistent.xpRate < 64 ? 220 : i.persistent.xpRate < 128 ? 290 : i.persistent.xpRate < 256 ? 370 : i.persistent.xpRate < 512 ? 460 : i.persistent.xpRate < 1024 ? 560 : i.persistent.xpRate < 2048 ? 670 : i.persistent.xpRate < 4096 ? 790 : 720 + (Math.log2(i.persistent.xpRate) - 7) * (Math.log2(i.persistent.xpRate) - 7) * 10} Trophies` : "",
          talentPoints: () => i.talentPoints,
          talentsAssigned: () => i.getUsedPoints(),
          talentValue: (e3) => `${i.talents[e3.id]} / ${e3.maxPoints}`,
          talentSet(e3, t3) {
            e3.set(t3);
            kt();
          },
          talentReset(e3) {
            e3.reset();
            kt();
          },
          canReset: () => i.persistent.talentReset,
          talentsReset() {
            wt();
            kt();
          },
          talentMax(e3) {
            e3.max();
            kt();
          },
          xpPercent: () => Math.round(
            100 * Math.min(1, this.skeleton().xp / i.xpForNextLevel())
          ),
          xpForNextLevel: () => i.xpForNextLevel(),
          xpRate: () => 100 * i.persistent.xpRate,
          prestigePointsPerKill: () => 1.00025 ** this.skeleton().level * this.skeleton().level,
          isAlive: () => i.isAlive(),
          timer: () => Math.ceil(i.skeletonTimer()),
          updateEquippedItems() {
            this.equipped = [];
            const e3 = i.persistent.items.filter(
              (e4) => e4.q && e4.s == i.lootPositions.helmet.id
            );
            if (e3.length > 0) {
              this.equipped.push([e3[0]]);
            } else {
              this.equipped.push([
                {
                  name: "Helmet Slot",
                  s: i.lootPositions.helmet.id,
                  id: -1
                }
              ]);
            }
            const t3 = [];
            const s2 = i.persistent.items.filter(
              (e4) => e4.q && e4.s == i.lootPositions.sword.id
            );
            if (s2.length > 0) {
              t3.push(s2[0]);
            } else {
              t3.push({
                name: "Sword Slot",
                s: i.lootPositions.sword.id,
                id: -2
              });
            }
            const a = i.persistent.items.filter(
              (e4) => e4.q && e4.s == i.lootPositions.chest.id
            );
            if (a.length > 0) {
              t3.push(a[0]);
            } else {
              t3.push({
                name: "Chest Slot",
                s: i.lootPositions.chest.id,
                id: -3
              });
            }
            const r = i.persistent.items.filter(
              (e4) => e4.q && e4.s == i.lootPositions.shield.id
            );
            if (r.length > 0) {
              t3.push(r[0]);
            } else {
              t3.push({
                name: "Shield Slot",
                s: i.lootPositions.shield.id,
                id: -4
              });
            }
            this.equipped.push(t3);
            const n = [];
            const o2 = i.persistent.items.filter(
              (e4) => e4.q && e4.s == i.lootPositions.gloves.id
            );
            if (o2.length > 0) {
              n.push(o2[0]);
            } else {
              n.push({
                name: "Gloves Slot",
                s: i.lootPositions.gloves.id,
                id: -5
              });
            }
            const h3 = i.persistent.items.filter(
              (e4) => e4.q && e4.s == i.lootPositions.legs.id
            );
            if (h3.length > 0) {
              n.push(h3[0]);
            } else {
              n.push({
                name: "Legs Slot",
                s: i.lootPositions.legs.id,
                id: -6
              });
            }
            const l3 = i.persistent.items.filter(
              (e4) => e4.q && e4.s == i.lootPositions.boots.id
            );
            if (l3.length > 0) {
              n.push(l3[0]);
            } else {
              n.push({
                name: "Boots Slot",
                s: i.lootPositions.boots.id,
                id: -7
              });
            }
            this.equipped.push(n);
            this.equipped.push([
              {
                name: "Destroy Items",
                s: -1,
                id: -8
              }
            ]);
          },
          inventoryItems: () => i.persistent.items.filter((e3) => !e3.q).sort((e3, t3) => t3.r * t3.l - e3.r * e3.l),
          itemName: (e3) => e3.name || i.getLootName(e3),
          itemSubName(e3) {
            if (!e3.name) {
              switch (e3.r) {
                case i.rarity.common: {
                  return `Common level ${e3.l} ${this.itemType(e3)}`;
                }
                case i.rarity.rare: {
                  return `Rare level ${e3.l} ${this.itemType(e3)}`;
                }
                case i.rarity.epic: {
                  return `Epic level ${e3.l} ${this.itemType(e3)}`;
                }
                case i.rarity.legendary: {
                  return `Legendary level ${e3.l} ${this.itemType(e3)}`;
                }
                case i.rarity.ancient: {
                  return `Ancient level ${e3.l} ${this.itemType(e3)}`;
                }
                case i.rarity.divine: {
                  return `Divine level ${e3.l} ${this.itemType(e3)}`;
                }
                case i.rarity.chaos: {
                  return `Chaos level ${e3.l} ${this.itemType(e3)}`;
                }
              }
            }
            if (-1 == e3.s) {
              return "Click this to destroy all non-equipped items (legendary items will not be automatically destroyed). Or drag items here to destroy them.";
            }
          },
          itemStats: (e3) => i.getLootStats(e3),
          itemEffects: (e3) => i.getSpecialEffects(e3),
          itemEffectsNamesClass: (e3) => i.getSpecialEffectsName(e3).join(" ").toLowerCase(),
          itemEffectsList: () => i.getSpecialEffectsList(),
          itemEffectsListClass: (e3) => e3.replace(" ", "-").toLowerCase(),
          itemRarityList: () => i.getRarityList(),
          itemRarityClass: (e3) => i.getLootClass({ r: e3 }),
          itemTypeList: () => i.getTypeList(),
          itemTypeClass(e3) {
            return this.itemType({ s: e3 });
          },
          itemRarityName(r) {
            switch (r) {
              case i.rarity.common: {
                return "Common";
              }
              case i.rarity.rare: {
                return "Rare";
              }
              case i.rarity.epic: {
                return "Epic";
              }
              case i.rarity.legendary: {
                return "Legendary";
              }
              case i.rarity.ancient: {
                return "Ancient";
              }
              case i.rarity.divine: {
                return "Divine";
              }
              case i.rarity.chaos: {
                return "Chaos";
              }
            }
          },
          itemType(e3) {
            switch (e3.s) {
              case -1: {
                return "trash";
              }
              case i.lootPositions.helmet.id: {
                return "helmet";
              }
              case i.lootPositions.chest.id: {
                return "chest";
              }
              case i.lootPositions.gloves.id: {
                return "gloves";
              }
              case i.lootPositions.legs.id: {
                return "legs";
              }
              case i.lootPositions.boots.id: {
                return "boots";
              }
              case i.lootPositions.sword.id: {
                return "sword";
              }
              case i.lootPositions.shield.id: {
                return "shield";
              }
            }
          },
          itemClass: (e3) => e3.name ? "empty" : i.getLootClass(e3),
          itemById(e3) {
            let t3 = null;
            i.persistent.items.forEach((s2) => {
              if (s2.id == e3) {
                t3 = s2;
              }
            });
            return t3;
          },
          itemDropped(e3, t3) {
            let s2 = null;
            i.persistent.items.forEach((t4) => {
              if (t4.id == e3) {
                s2 = t4;
              }
            });
            if (-1 == t3) {
              i.destroyItem(s2);
            } else {
              if (s2.s == t3) {
                i.persistent.items.forEach((e4) => {
                  if (e4.s == t3) {
                    e4.q = false;
                  }
                }), s2.q = true, h2.applyUpgrades();
              }
              this.updateEquippedItems();
            }
            if (i.persistent.gearSetEquipped != -1 && -1 != t3) {
              i.persistent.gearSets[i.persistent.gearSetEquipped].slots.forEach(
                (t4) => {
                  if (t4.s == s2.s) {
                    t4.id = s2.id;
                  }
                }
              );
            }
          },
          equipItem(e3) {
            if (this.isShown && Y.shift) {
              this.itemDropped(e3.id, -1);
              return;
            }
            i.persistent.items.forEach((t3) => {
              if (t3.s == e3.s) {
                t3.q = false;
              }
            });
            e3.q = true;
            h2.applyUpgrades();
            this.updateEquippedItems();
            if (i.persistent.gearSetEquipped != -1) {
              i.persistent.gearSets[i.persistent.gearSetEquipped].slots.forEach(
                (t3) => {
                  if (t3.s == e3.s) {
                    t3.id = e3.id;
                  }
                }
              );
            }
          },
          trashAll() {
            this.confirmMessage = `Are you sure you want to destroy all non-equipped items? You will earn ${formatWhole(
              i.xpTotal()
            )} xp`;
            this.confirmCallback = function() {
              this.confirmCallback = false;
              i.destroyAllItems();
            };
          }
        };
        s.ready(function() {
          e2.updatePromise = t2(u2, 200);
          h2.angularModel = this;
          kt();
        });
      }
    ]).directive("levelSelect", () => ({
      templateUrl: "./templates/levelselect.html"
    })).directive("levelStats", () => ({
      templateUrl: "./templates/levelstats.html"
    })).directive("graveyardMenu", () => ({
      templateUrl: "./templates/graveyardmenu.html"
    })).directive("runesmithMenu", () => ({
      templateUrl: "./templates/runesmithmenu.html"
    })).directive("optionsMenu", () => ({
      templateUrl: "./templates/optionsmenu.html"
    })).directive("shopMenu", () => ({
      templateUrl: "./templates/shopmenu.html"
    })).directive("constructionMenu", () => ({
      templateUrl: "./templates/constructionmenu.html"
    })).directive("prestigeMenu", () => ({
      templateUrl: "./templates/prestigemenu.html"
    })).directive("championsHoldMenu", () => ({
      templateUrl: "./templates/championshold.html"
    })).directive("factoryMenu", () => ({
      templateUrl: "./templates/factorymenu.html"
    })).directive("customOnChange", () => ({
      restrict: "A",
      link(e2, t2, s) {
        const i = e2.$eval(s.customOnChange);
        t2.on("change", i);
        t2.on("$destroy", () => {
          t2.off();
        });
      }
    })).directive("draggableItem", [
      "$rootScope",
      (e2) => ({
        restrict: "A",
        link(t2, s, i, a) {
          const r = t2.item.id;
          if (i.draggableItem == "true") {
            angular.element(s).attr("draggable", "true");
            s.bind("dragstart", (t3) => {
              document.getElementById("champ-hold").classList.toggle("no-tooltip");
              t3.dataTransfer.setData("text", r);
              const i2 = s[0].getBoundingClientRect();
              t3.dataTransfer.setDragImage(s[0], i2.width / 2, i2.height / 2);
              e2.$emit("item-drag-start", r);
              setTimeout(() => {
                angular.element(s)[0].style.opacity = "0.3";
              });
            });
            s.bind("dragend", (t3) => {
              document.getElementById("champ-hold").classList.toggle("no-tooltip");
              angular.element(s)[0].style.opacity = "";
              e2.$emit("item-drag-end", r);
            });
          }
        }
      })
    ]).directive("shiftDeleteItem", [
      "$rootScope",
      (e2) => ({
        restrict: "A",
        link(t2, s, i, a) {
          s.bind("mouseenter", () => {
            if (Y.shift) {
              s.addClass("shift-trash");
            }
          });
          s.bind("mouseleave", () => {
            s.removeClass("shift-trash");
          });
        }
      })
    ]).directive("droppableTarget", [
      "$rootScope",
      (e2) => ({
        restrict: "A",
        link(t2, s, i, a) {
          const r = t2.item.s;
          s.bind("dragover", (e3) => {
            if (e3.preventDefault) {
              e3.preventDefault();
            }
            e3.dataTransfer.dropEffect = "move";
            return false;
          });
          s.bind("dragenter", (e3) => {
            if (e3.target && e3.target.classList && e3.target.classList.contains("icon")) {
              angular.element(e3.target.parentElement).addClass("over");
            }
          });
          s.bind("dragleave", (e3) => {
            if (e3.target && e3.target.classList && e3.target.classList.contains("icon")) {
              angular.element(e3.target.parentElement).removeClass("over");
            }
          });
          s.bind("drop", (e3) => {
            if (e3.preventDefault) {
              e3.preventDefault();
            }
            if (e3.stopPropagation) {
              e3.stopPropagation();
            }
            if (e3.target.classList.contains("icon")) {
              angular.element(e3.target.parentElement).removeClass("over");
            }
            const s2 = e3.dataTransfer.getData("text");
            const i2 = t2.zm.skeletonMenu.itemById(s2);
            if (i2) {
              const e4 = t2.zm.skeletonMenu.itemType(i2);
              document.getElementsByClassName("equipped")[0].classList.remove(e4);
            }
            t2.zm.skeletonMenu.itemDropped(s2, r);
          });
          e2.$on("item-drag-start", (e3, s2) => {
            const i2 = t2.zm.skeletonMenu.itemById(s2);
            if (i2) {
              const e4 = t2.zm.skeletonMenu.itemType(i2);
              document.getElementsByClassName("equipped")[0].classList.add(e4);
            }
          });
          e2.$on("item-drag-end", (e3, s2) => {
            const i2 = t2.zm.skeletonMenu.itemById(s2);
            if (i2) {
              const e4 = t2.zm.skeletonMenu.itemType(i2);
              document.getElementsByClassName("equipped")[0].classList.remove(e4);
            }
          });
        }
      })
    ]);
    Incremancer = e;
  })();
})();
