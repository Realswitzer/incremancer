import {
  CreatureFactory,
  GameModel,
  PartFactory,
  Skeleton,
  Spells,
  Trophies,
  Upgrades,
  KeysPressed,
  format2Places,
  moveToolTip,
  formatWhole,
  TalentUpgrades,
  Talent,
  TalentData,
  applyTalents,
  resetTalents,
} from "./internal";

angular
  .module("zombieApp", [])
  .filter("decimal", function () {
    return format2Places;
  })
  .filter("whole", function () {
    return formatWhole;
  })
  .config([
    "$compileProvider",
    function ($compileProvider) {
      $compileProvider.aHrefSanitizationWhitelist(
        /^\s*(https?|ftp|mailto|javascript|data|blob):/
      );
      $compileProvider.debugInfoEnabled(false);
    },
  ])
  .controller("ZombieController", [
    "$scope",
    "$interval",
    "$document",
    function ($scope, $interval, $document) {
      const skeleton = new Skeleton();
      const spells = new Spells();
      const partFactory = new PartFactory();
      const creatureFactory = new CreatureFactory();
      const upgrades = new Upgrades();
      const trophies = new Trophies();
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const zm = this;
      zm.model = GameModel.getInstance();
      zm.skeleton = function () {
        return skeleton.persistent;
      };
      zm.spells = spells;
      zm.keysPressed = KeysPressed;

      zm.files = [];
      zm.messageTimer = 4;
      zm.message = false;
      zm.lastUpdate = 0;
      zm.sidePanels = {};
      zm.upgrades = [];
      zm.currentShopFilter = "blood";
      zm.currentConstructionFilter = "available";
      zm.graveyardTab = "minions";
      zm.trophyTab = "all";
      zm.factoryTab = "parts";
      zm.factoryStats = {};
      zm.moveTooltip = moveToolTip;
      zm.confirmMessage = "";
      zm.confirmCancel = function () {
        zm.confirmCallback = false;
      };
      zm.closeSidePanels = function () {
        zm.currentShopFilter = "blood";
        zm.currentConstructionFilter = "available";
        zm.graveyardTab = "minions";
        zm.factoryTab = "parts";
        zm.sidePanels.options = false;
        zm.sidePanels.graveyard = false;
        zm.sidePanels.runesmith = false;
        zm.sidePanels.prestige = false;
        zm.sidePanels.construction = false;
        zm.sidePanels.shop = false;
        zm.sidePanels.open = false;
        zm.sidePanels.factory = false;
        zm.levelSelect.shown = false;
      };

      zm.openSidePanel = function (type: string) {
        zm.closeSidePanels();
        switch (type) {
          case "shop":
            zm.filterShop(zm.currentShopFilter);
            zm.sidePanels.shop = true;
            break;
          case "construction":
            zm.filterConstruction(zm.currentConstructionFilter);
            zm.sidePanels.construction = true;
            break;
          case "graveyard":
            zm.sidePanels.graveyard = true;
            zm.graveyardTab = "minions";
            zm.trophyTab = "all";
            break;
          case "runesmith":
            zm.sidePanels.runesmith = true;
            break;
          case "factory":
            zm.sidePanels.factory = true;
            zm.upgrades = partFactory.generators;
            zm.factoryStats = partFactory.factoryStats();
            zm.factory.updateDelays();
            break;
          case "prestige":
            zm.upgrades = upgrades.prestigeUpgrades.filter(
              (upgrade) =>
                upgrade.cap == 0 || zm.currentRank(upgrade) < upgrade.cap
            );
            zm.upgrades.push(
              ...upgrades.prestigeUpgrades.filter(
                (upgrade) =>
                  upgrade.cap !== 0 && zm.currentRank(upgrade) >= upgrade.cap
              )
            );
            zm.upgrades = zm.upgrades.filter((upg) => upg.id !== 115);
            zm.sidePanels.prestige = true;
            break;
          case "options":
            zm.sidePanels.options = true;
            zm.model.downloadSaveGame();
            break;
        }
        zm.sidePanels.open = true;
      };

      zm.graveyardTabSelect = function (tab: string) {
        zm.graveyardTab = tab;
        if (tab == "trophies") {
          zm.trophies = trophies.getTrophyList();
          zm.trophyTab = "all";
        }
      };

      zm.trophyTabSelect = function (tab: string) {
        zm.trophyTab = tab;
        switch (tab) {
          case "all":
            zm.trophies = trophies.getTrophyList();
            break;
          case "collected":
            zm.trophies = trophies
              .getTrophyList()
              .filter((trophy) => trophy.owned);
            break;
          case "uncollected":
            zm.trophies = trophies
              .getTrophyList()
              .filter((trophy) => !trophy.owned);
            break;
          case "totals":
            zm.trophies = trophies.getTrophyTotals();
            break;
        }
      };

      zm.filterShop = function (type: string) {
        zm.currentShopFilter = type;
        zm.upgrades = upgrades.getUpgrades(type);
      };

      zm.filterConstruction = function (type: string) {
        zm.currentConstructionFilter = type;
        switch (type) {
          case "available":
            zm.upgrades = upgrades.getAvailableConstructions();
            break;
          case "completed":
            zm.upgrades = upgrades.getCompletedConstructions();
            break;
        }
      };

      zm.resetGame = function () {
        zm.confirmMessage =
          "Are you sure you want to reset everything? If you have a cloud save it will also be deleted. Make sure you export your save game first.";
        zm.confirmCallback = function () {
          zm.model.resetData();
          zm.confirmCallback = false;
        };
      };

      zm.addBoneCollector = function () {
        if (zm.model.getEnergyRate() >= 1)
          zm.model.persistentData.boneCollectors++;
      };

      zm.subtractBoneCollector = function () {
        if (zm.model.persistentData.boneCollectors > 0)
          zm.model.persistentData.boneCollectors--;
      };
      zm.maxBoneCollectors = function () {
        return Math.floor(
          zm.model.getEnergyRate() + zm.model.persistentData.boneCollectors
        );
      };
      zm.setBoneCollectors = function (number: number) {
        if (
          number >= 0 &&
          zm.model.getEnergyRate() >=
            number - zm.model.persistentData.boneCollectors
        ) {
          zm.model.persistentData.boneCollectors = number;
        }
      };

      zm.setHarpies = function (number: number) {
        if (
          (number >= 0 && number < zm.model.persistentData.harpies) ||
          (zm.model.getEnergyRate() >= 1 && number > 0)
        ) {
          zm.model.persistentData.harpies = number;
        }
      };
      zm.maxHarpies = function () {
        return Math.floor(
          zm.model.getEnergyRate() + zm.model.persistentData.harpies
        );
      };
      zm.setGraveyardZombies = function (number: number) {
        if (number <= zm.maxGraveyardZombies() && number >= 0)
          zm.model.persistentData.graveyardZombies = number;
      };

      zm.maxGraveyardZombies = function () {
        return Math.floor(zm.model.energyMax / zm.model.zombieCost);
      };

      zm.upgradePrice = function (upgrade) {
        if (zm.sidePanels.factory && "prestigePoints" !== upgrade.costType) {
          return partFactory.purchasePrice(upgrade);
        }
        return upgrades.upgradePrice(upgrade);
      };

      // ---- Factory Functions ---- //
      zm.factory = {
        delays: [],
        changeFactoryTab(tab: string) {
          zm.factoryTab = tab;
          if (tab == "parts") {
            zm.upgrades = partFactory.generators;
            this.updateDelays();
          } else {
            zm.upgrades = creatureFactory.creatures;
          }
        },
        buyGenerator(generator) {
          if (zm.keysPressed.shift) {
            partFactory.purchaseMaxGenerators(generator);
          } else {
            partFactory.purchaseGenerator(generator);
          }
          zm.factoryStats = partFactory.factoryStats();
        },
        generatorPrice(upgrade) {
          return partFactory.purchasePrice(upgrade);
        },
        creaturePrice(creature) {
          return creatureFactory.purchasePrice(creature);
        },
        creatureLevelPrice(creature) {
          return creatureFactory.levelPrice(creature);
        },
        creaturePercent(creature) {
          return Math.min(
            Math.round(
              (zm.model.persistentData.parts / this.creaturePrice(creature)) *
                100
            ),
            100
          );
        },
        creatureLevelPercent(creature) {
          return Math.min(
            Math.round(
              (zm.model.persistentData.parts /
                this.creatureLevelPrice(creature)) *
                100
            ),
            100
          );
        },
        buyCreature(creature) {
          return creatureFactory.startBuilding(creature);
        },
        creatureTooExpensive(creature) {
          return !creatureFactory.canAffordCreature(creature);
        },
        creatureButtonText(creature) {
          if (creature.building) {
            return "Building...";
          }
          if (this.creatureTooExpensive(creature)) {
            return (
              formatWhole(
                this.creaturePrice(creature) - zm.model.persistentData.parts
              ) + " parts required"
            );
          } else {
            return (
              "Build (" + formatWhole(this.creaturePrice(creature)) + " parts)"
            );
          }
        },
        creatureLevelButtonText(creature) {
          if (this.canLevelCreature(creature)) {
            return (
              "Upgrade Level " +
              (creature.level + 1) +
              " (" +
              formatWhole(this.creatureLevelPrice(creature)) +
              " parts)"
            );
          }
          return (
            formatWhole(
              this.creatureLevelPrice(creature) - zm.model.persistentData.parts
            ) + " parts required"
          );
        },
        canBuildCreature(creature) {
          if (this.creatureTooExpensive(creature)) return false;
          if (creature.building) return false;
          return (
            creatureFactory.creaturesBuildingCount() + zm.model.creatureCount <
            zm.model.creatureLimit
          );
        },
        canLevelCreature(creature) {
          return (
            this.creatureLevelPrice(creature) < zm.model.persistentData.parts
          );
        },
        levelCreature(creature) {
          creatureFactory.levelCreature(creature);
        },
        autoBuild(creature, number) {
          if (
            creature.autobuild + number >= 0 &&
            creature.autobuild + number <= zm.model.creatureLimit
          ) {
            creatureFactory.creatureAutoBuildNumber(creature, number);
          }
        },
        creatureStats(creature) {
          return creatureFactory.creatureStats(creature);
        },
        updateDelays() {
          this.delays = [];
          for (let i = 0; i < partFactory.generatorsApplied.length; i++) {
            this.delays[partFactory.generatorsApplied[i].id] = (
              -1 *
              (partFactory.generatorsApplied[i].time -
                partFactory.generatorsApplied[i].timeLeft)
            ).toFixed(2);
          }
        },
      };
      // ---- Factory Functions ---- //

      // ---- Level Select Functions ---- //
      zm.levelSelect = {
        shown: false,
        levelsPerPage: 50,
        levels: [],
        levelRanges: [],
        start: 1,
        showButton() {
          return zm.model.persistentData.allTimeHighestLevel > 1;
        },
        show() {
          if (!this.shown) {
            zm.closeSidePanels();
            this.shown = true;
            this.level = zm.model.levelInfo(zm.model.level);
            this.start =
              Math.floor((this.level.level - 1) / this.levelsPerPage) *
                this.levelsPerPage +
              1;
            this.populate();
          } else {
            this.shown = false;
          }
        },
        populate() {
          this.levels = [];
          this.levelRanges = [];
          if (this.start > this.levelsPerPage) {
            this.levelRanges.push(this.start - this.levelsPerPage);
          }
          this.levelRanges.push(this.start);
          if (
            this.start + this.levelsPerPage <=
            zm.model.persistentData.allTimeHighestLevel + 1
          ) {
            this.levelRanges.push(this.start + this.levelsPerPage);
          }

          for (let i = this.start; i < this.start + this.levelsPerPage; i++) {
            this.levels.push(zm.model.levelInfo(i));
          }
        },
        selectRange(range) {
          this.start = range;
          this.populate();
        },
        select(level) {
          this.level = level;
        },
        startLevel() {
          zm.model.startLevel(this.level.level);
          this.shown = false;
        },
      };
      // ---- Level Select Functions ---- //

      zm.addToHomeScreen = function () {
        if (zm.model.deferredPrompt) {
          //deferredPrompt.prompt();
        }
      };

      zm.constructionPercent = function () {
        if (zm.model.persistentData.currentConstruction) {
          const time =
            zm.model.persistentData.currentConstruction.time -
            zm.model.persistentData.currentConstruction.timeRemaining;
          return Math.round(
            (time / zm.model.persistentData.currentConstruction.time) * 100
          );
        }
        return 0;
      };

      zm.updateConstructionUpgrades = function () {
        if (zm.sidePanels.construction == true)
          zm.upgrades = upgrades.getAvailableConstructions();
      };

      zm.startConstruction = function (upgrade) {
        upgrades.startConstruction(upgrade);
        zm.upgrades = upgrades.getAvailableConstructions();
      };

      zm.playPauseConstruction = function () {
        upgrades.playPauseConstruction();
      };

      zm.cancelConstruction = function () {
        zm.confirmMessage =
          "Are you sure you want to cancel construction? Used materials will not be refunded";
        zm.confirmCallback = function () {
          upgrades.cancelConstruction();
          zm.upgrades = upgrades.getAvailableConstructions();
          zm.confirmCallback = false;
        };
      };

      zm.upgradeSubtitle = function (upgrade) {
        switch (upgrade.type) {
          case upgrades.types.energyRate:
            return "+" + upgrade.effect + " energy per second";
          case upgrades.types.energyCap:
            return "+" + upgrade.effect + " max energy";
          case upgrades.types.bloodCap:
            return "+" + formatWhole(upgrade.effect) + " max blood";
          case upgrades.types.bloodStoragePC:
            return "+" + Math.round(upgrade.effect * 100) + "% max blood";
          case upgrades.types.bloodGainPC:
            return "+" + Math.round(upgrade.effect * 100) + "% blood income";
          case upgrades.types.brainsGainPC:
            return "+" + Math.round(upgrade.effect * 100) + "% brains income";
          case upgrades.types.bonesGainPC:
            return "+" + Math.round(upgrade.effect * 100) + "% bones income";
          case upgrades.types.partsGainPC:
            return "+" + Math.round(upgrade.effect * 100) + "% parts income";
          case upgrades.types.brainsStoragePC:
            return "+" + Math.round(upgrade.effect * 100) + "% max brains";
          case upgrades.types.energyCost:
            return "-" + upgrade.effect + " zombie energy cost";
          case upgrades.types.brainsCap:
            return "+" + upgrade.effect + " max brains";
          case upgrades.types.damage:
            return "+" + upgrade.effect + " zombie damage";
          case upgrades.types.speed:
            return "+" + upgrade.effect + " zombie speed";
          case upgrades.types.health:
            return "+" + upgrade.effect + " zombie health";
          case upgrades.types.brainRecoverChance:
            return (
              "+" +
              Math.round(upgrade.effect * 100) +
              "% chance to recover brain"
            );
          case upgrades.types.riseFromTheDeadChance:
            return (
              "+" +
              Math.round(upgrade.effect * 100) +
              "% chance for corpse to become zombie"
            );
          case upgrades.types.infectedBite:
            return (
              "+" +
              Math.round(upgrade.effect * 100) +
              "% chance for zombies to infect their targets"
            );
          case upgrades.types.infectedBlast:
            return (
              "+" +
              Math.round(upgrade.effect * 100) +
              "% chance for zombies to explode on death"
            );
          case upgrades.types.boneCollectorCapacity:
            return "+" + upgrade.effect + " bone collector capacity";
          case upgrades.types.zombieDmgPC:
            return (
              "+" +
              formatWhole(Math.round(upgrade.effect * 100)) +
              "% zombie damage"
            );
          case upgrades.types.zombieHealthPC:
            return (
              "+" +
              formatWhole(Math.round(upgrade.effect * 100)) +
              "% zombie health"
            );
          case upgrades.types.bonesRate:
            return "+" + upgrade.effect + " bones per second";
          case upgrades.types.brainsRate:
            return "+" + upgrade.effect + " brains per second";
          case upgrades.types.plagueDamage:
            return "+" + formatWhole(upgrade.effect) + " plague damage";
          case upgrades.types.plagueTicks:
            return "+" + formatWhole(upgrade.effect) + " plague ticks";
          case upgrades.types.spitDistance:
            return "+" + upgrade.effect + " spit distance";
          case upgrades.types.blastHealing:
            return "+" + Math.round(upgrade.effect * 100) + "% plague healing";
          case upgrades.types.plagueArmor:
            return (
              "+" + Math.round(upgrade.effect * 100) + "% damage reduction"
            );
          case upgrades.types.monsterLimit:
            return "+" + upgrade.effect + " creature limit";
          case upgrades.types.runicSyphon:
            return "+" + Math.round(upgrade.effect * 100) + "% runic syphon";
          case upgrades.types.gigazombies:
            return "Unlock more gigazombies";
          case upgrades.types.bulletproof:
            return (
              "+" +
              Math.round(upgrade.effect * 100) +
              "% earth golem bullet reflect"
            );
          case upgrades.types.harpySpeed:
            return "+" + upgrade.effect + " harpy speed";
          case upgrades.types.harpyBombs:
            return "+" + upgrade.effect + " harpy bombs";
          case upgrades.types.tankBuster:
            return "Anti tank harpies";
          case upgrades.types.spikeDelay:
            return "-20% spike delay";
        }
        return "";
      };

      zm.currentRank = function (upgrade) {
        if (zm.sidePanels.factory) {
          return partFactory.currentRank(upgrade);
        }
        return upgrades.currentRank(upgrade);
      };

      zm.currentRankConstruction = function (upgrade) {
        return upgrades.currentRankConstruction(upgrade);
      };

      zm.upgradeTooExpensive = function (upgrade) {
        if (zm.sidePanels.factory) {
          return !partFactory.canAffordGenerator(upgrade);
        }
        return (
          !upgrades.canAffordUpgrade(upgrade) ||
          (upgrade.cap != 0 && upgrades.currentRank(upgrade) >= upgrade.cap)
        );
      };

      zm.requiredForUpgrade = function (upgrade) {
        const cost = zm.upgradePrice(upgrade);

        switch (upgrade.costType) {
          case upgrades.costs.energy:
            return formatWhole(cost - zm.model.energy) + " energy required";
          case upgrades.costs.blood:
          case partFactory.costs.blood:
            return (
              formatWhole(cost - zm.model.persistentData.blood) +
              " blood required"
            );
          case upgrades.costs.brains:
            return (
              formatWhole(cost - zm.model.persistentData.brains) +
              " brains required"
            );
          case upgrades.costs.bones:
            return (
              formatWhole(cost - zm.model.persistentData.bones) +
              " bones required"
            );
          case upgrades.costs.prestigePoints:
            return (
              formatWhole(
                cost - zm.model.persistentData.prestigePointsToSpend
              ) + " prestige points required"
            );
          case partFactory.costs.parts:
            return (
              formatWhole(cost - zm.model.persistentData.parts) +
              " parts required"
            );
        }
      };

      zm.purchaseText = function (upgrade) {
        if (zm.keysPressed.shift) {
          if (zm.sidePanels.factory) {
            const amount = partFactory.upgradeMaxAffordable(upgrade);
            const price = partFactory.upgradeMaxPrice(upgrade, amount);
            return (
              "Purchase " +
              amount +
              " (" +
              formatWhole(price) +
              " " +
              zm.costTranslate(upgrade.costType) +
              ")"
            );
          } else {
            const amount = upgrades.upgradeMaxAffordable(upgrade);
            const price = upgrades.upgradeMaxPrice(upgrade, amount);
            return (
              "Purchase " +
              amount +
              " (" +
              formatWhole(price) +
              " " +
              zm.costTranslate(upgrade.costType) +
              ")"
            );
          }
        }
        return (
          "Purchase (" +
          formatWhole(zm.upgradePrice(upgrade)) +
          " " +
          zm.costTranslate(upgrade.costType) +
          ")"
        );
      };

      ((zm.costTranslate = function (costType) {
        if (costType == upgrades.costs.prestigePoints) {
          return "points";
        }
        return costType;
      }),
        (zm.buyUpgrade = function (upgrade) {
          if (zm.keysPressed.shift) {
            upgrades.purchaseMaxUpgrades(upgrade);
          } else {
            upgrades.purchaseUpgrade(upgrade);
          }
        }));

      zm.destroyUpgrade = function (upgrade) {
        upgrades.removeUpgrade(upgrade);
      };

      zm.upgradeStatInfo = function (upgrade) {
        return upgrades.displayStatValue(upgrade);
      };

      zm.startGame = function () {
        zm.model.startGame();
      };

      zm.nextLevel = function () {
        zm.model.nextLevel();
      };

      zm.toggleAutoStart = function () {
        if (zm.model.persistentData.autoStart) {
          zm.model.persistentData.autoStart = false;
        } else {
          zm.model.persistentData.autoStart = true;
        }
      };

      zm.toggleAutoStartWait = function () {
        if (zm.model.persistentData.autoStartWait) {
          zm.model.persistentData.autoStartWait = false;
        } else {
          zm.model.persistentData.autoStartWait = true;
        }
      };

      zm.toggleAutoSellGear = function () {
        if (zm.model.persistentData.autoSellGear) {
          zm.model.persistentData.autoSellGear = false;
        } else {
          zm.model.persistentData.autoSellGear = true;
        }
      };

      zm.toggleAutoSellGearLegendary = function () {
        if (zm.model.persistentData.autoSellGearLegendary) {
          zm.model.persistentData.autoSellGearLegendary = false;
        } else {
          zm.model.persistentData.autoSellGearLegendary = true;
        }
      };

      zm.toggleResolution = function (resolution) {
        zm.model.persistentData.resolution = resolution;
        zm.model.setResolution(zm.model.persistentData.resolution);
      };

      zm.getResolution = function () {
        return zm.model.persistentData.resolution || 1;
      };

      zm.toggleZoomButtons = function () {
        zm.model.persistentData.zoomButtons =
          !zm.model.persistentData.zoomButtons;
      };

      zm.zoom = function (zoom) {
        zm.model.zoom(zoom);
      };

      zm.resetZoom = function () {
        zm.model.centerGameContainer(true);
      };

      zm.toggleShowFps = function () {
        zm.model.persistentData.showfps = !zm.model.persistentData.showfps;
      };

      zm.toggleParticles = function () {
        zm.model.persistentData.particles = !zm.model.persistentData.particles;
      };

      zm.isShowPrestige = function () {
        if (typeof zm.model.persistentData.prestigePointsEarned === "undefined")
          return false;
        return zm.model.persistentData.allTimeHighestLevel > 5;
      };

      zm.doPrestige = function () {
        zm.confirmMessage = "Are you sure you want to prestige now?";
        zm.confirmCallback = function () {
          zm.model.prestige();
          zm.confirmCallback = false;
        };
      };

      zm.constructionLeadsTo = function (upgrade) {
        return upgrades.constructionLeadsTo(upgrade);
      };

      zm.howToPlay = [
        "This started as Chalice's Mod, expanded by CirusDane (called Danemancer), for incremancer - We hope you enjoy the qol changes!",
        "Energy refills over time. You need 10 energy to spawn a zombie by clicking on the ground.",
        "Hold shift or control to spawn multiple zombies with a single click.",
        "Whenever one of your zombies attacks a human you will collect some blood.",
        "Killing a human or turning them into a zombie will earn you 1 brain.",
        "You can spend these currencies in the shop to purchase upgrades for your zombie horde.",
        "Hold shift to buy the maximum affordable number of upgrades.",
        "The world can be dragged with the mouse to explore it. Or by using the WASD or arrow keys.",
        "You can zoom in and out using your mouse wheel. Pinch to zoom on mobile.",
      ];

      zm.updateMessages = function (timeDiff) {
        if (zm.message) {
          zm.messageTimer -= timeDiff;
          if (zm.model.messageQueue.length > 0) zm.messageTimer -= timeDiff;
          if (zm.messageTimer < 0) {
            zm.message = false;
            zm.messageTimer = 4;
          }
        } else {
          if (zm.model.messageQueue.length > 0) {
            zm.message = zm.model.messageQueue.shift();
            zm.messageTimer = 4;
          }
        }
      };

      zm.infusionAmount = 1000;
      zm.infusionMax = false;

      zm.infuseRune = function (rune, cost) {
        if (zm.infusionMax) {
          switch (cost) {
            case "blood":
              upgrades.infuseRune(rune, cost, zm.model.persistentData.blood);
              break;
            case "brains":
              upgrades.infuseRune(rune, cost, zm.model.persistentData.brains);
              break;
            case "bones":
              upgrades.infuseRune(rune, cost, zm.model.persistentData.bones);
              break;
          }
        } else {
          upgrades.infuseRune(rune, cost, zm.infusionAmount);
        }
      };

      zm.shatterPercent = function (rune) {
        return upgrades.shatterPercent(rune);
      };

      zm.shatterBloodCost = function (rune) {
        return upgrades.shatterBloodCost(rune);
      };

      zm.shatterSatiate = function (runetype, rune) {
        upgrades.infuseRune(runetype, "blood", this.shatterBloodCost(rune));
      };

      zm.canShatter = function () {
        return upgrades.canShatter();
      };

      zm.doShatter = function () {
        upgrades.doShatter();
      };

      zm.shatterEffect = function () {
        return upgrades.shatterEffect() * 100;
      };

      zm.infuseButtonText = function () {
        if (zm.infusionMax) {
          return "Max";
        } else {
          return formatWhole(zm.infusionAmount);
        }
      };

      zm.energyPercent = function () {
        return Math.min(
          Math.round((zm.model.energy / zm.model.energyMax) * 100),
          100
        );
      };
      zm.bloodPercent = function () {
        return Math.min(
          Math.round((zm.model.persistentData.blood / zm.model.bloodMax) * 100),
          100
        );
      };
      zm.brainsPercent = function () {
        return Math.min(
          Math.round(
            (zm.model.persistentData.brains / zm.model.brainsMax) * 100
          ),
          100
        );
      };

      zm.costAboveCap = function (upgrade, price) {
        switch (upgrade.costType) {
          case "blood":
            if (price > zm.model.bloodMax) {
              return "Blood capacity too low";
            }
            break;
          case "brains":
            if (price > zm.model.brainsMax) {
              return "Brains capacity too low";
            }
            break;
        }
        return false;
      };

      zm.upgradeButtonText = function (upgrade) {
        if (upgrade.cap != 0 && zm.currentRank(upgrade) >= upgrade.cap)
          return "Sold Out";

        const price = zm.upgradePrice(upgrade);

        if (zm.upgradeTooExpensive(upgrade)) {
          const aboveCap = zm.costAboveCap(upgrade, price);
          if (aboveCap) return aboveCap;
          return zm.requiredForUpgrade(upgrade);
        }

        return zm.purchaseText(upgrade, price);
      };

      zm.upgradePercent = function (upgrade) {
        switch (upgrade.costType) {
          case "blood":
            return Math.round(
              Math.min(
                1,
                zm.model.persistentData.blood / zm.upgradePrice(upgrade)
              ) * 100
            );
          case "brains":
            return Math.round(
              Math.min(
                1,
                zm.model.persistentData.brains / zm.upgradePrice(upgrade)
              ) * 100
            );
          case "bones":
            return Math.round(
              Math.min(
                1,
                zm.model.persistentData.bones / zm.upgradePrice(upgrade)
              ) * 100
            );
          case "parts":
            return Math.round(
              Math.min(
                1,
                zm.model.persistentData.parts / zm.upgradePrice(upgrade)
              ) * 100
            );
          case "prestigePoints":
            return Math.round(
              Math.min(
                1,
                zm.model.persistentData.prestigePointsToSpend /
                  zm.upgradePrice(upgrade)
              ) * 100
            );
        }
      };

      zm.skeletonTimer = function () {
        return skeleton.skeletonTimer();
      };

      // ---- Skeleton Functions ---- //
      zm.skeletonMenu = {
        isShown: false,
        tab: "inventory",
        changeTab(tab: string) {
          this.tab = tab;
        },
        equipped: [],
        show() {
          this.tab = "inventory";
          this.upgrade = upgrades.prestigeUpgrades.filter(
            (upg) => upg.id === 115
          )[0];
          this.upgrades = TalentUpgrades;
          this.isShown = !this.isShown;
          if (this.isShown) {
            this.updateEquippedItems();
            setTimeout(function () {
              const elements =
                document.getElementsByClassName("item legendary");
              for (let i = 0; i < elements.length; i++) {
                // elements[i].style.animationDelay = (Math.random() * 4).toFixed(2) + "s";
              }
            }, 100);
          }
        },
        acceptOffer() {
          skeleton.acceptOffer();
          this.isShown = false;
        },
        anotherOffer() {
          // TODO: figure out how to format this without prettier freaking out
          return (
            skeleton.persistent.skeletons > 0 &&
            zm.model.persistentData.trophies.length >=
              (skeleton.persistent.xpRate < 8
                ? 20 * skeleton.persistent.xpRate
                : skeleton.persistent.xpRate < 16
                  ? 130
                  : skeleton.persistent.xpRate < 32
                    ? 190
                    : skeleton.persistent.xpRate < 64
                      ? 260
                      : skeleton.persistent.xpRate < 128
                        ? 340
                        : skeleton.persistent.xpRate < 256
                          ? 430
                          : skeleton.persistent.xpRate < 512
                            ? 530
                            : skeleton.persistent.xpRate < 1024
                              ? 640
                              : skeleton.persistent.xpRate < 2048
                                ? 760
                                : 720 +
                                  (Math.log2(skeleton.persistent.xpRate) - 7) *
                                    (Math.log2(skeleton.persistent.xpRate) -
                                      7) *
                                    10)
          );
        },
        trophies() {
          return skeleton.persistent.skeletons > 0
            ? ` - ${zm.model.persistentData.trophies.length} / ${
                i.persistent.xpRate < 8
                  ? 20 * i.persistent.xpRate
                  : skeleton.persistent.xpRate < 16
                    ? 130
                    : skeleton.persistent.xpRate < 32
                      ? 190
                      : skeleton.persistent.xpRate < 64
                        ? 260
                        : skeleton.persistent.xpRate < 128
                          ? 340
                          : skeleton.persistent.xpRate < 256
                            ? 430
                            : skeleton.persistent.xpRate < 512
                              ? 530
                              : skeleton.persistent.xpRate < 1024
                                ? 640
                                : skeleton.persistent.xpRate < 2048
                                  ? 760
                                  : 720 +
                                    (Math.log2(skeleton.persistent.xpRate) -
                                      7) *
                                      (Math.log2(skeleton.persistent.xpRate) -
                                        7) *
                                      10
              } Trophies`
            : "";
        },
        talentPoints: () => skeleton.talentPoints,
        talentsAssigned: () => skeleton.getUsedPoints(),
        talentValue: (talent: Talent) =>
          skeleton.talents[talent.id] + " / " + talent.maxPoints,
        talentSet(talent: Talent, points: number) {
          talent.set(points);
          applyTalents();
        },
        talentReset(talent: Talent) {
          talent.reset();
          applyTalents();
        },
        canReset: () => skeleton.persistent.talentReset,
        talentsReset() {
          resetTalents();
          applyTalents();
        },
        talentMax(talent: Talent) {
          talent.max();
          applyTalents();
        },
        xpPercent() {
          return Math.round(
            Math.min(1, zm.skeleton().xp / skeleton.xpForNextLevel()) * 100
          );
        },
        xpForNextLevel() {
          return skeleton.xpForNextLevel();
        },
        xpRate() {
          return skeleton.persistent.xpRate * 100;
        },
        isAlive() {
          return skeleton.isAlive();
        },
        timer() {
          return Math.ceil(skeleton.skeletonTimer());
        },
        updateEquippedItems() {
          this.equipped = [];
          const helmetItems = skeleton.persistent.items.filter(
            (i) => i.q && i.s == skeleton.lootPositions.helmet.id
          );
          if (helmetItems.length > 0) {
            this.equipped.push([helmetItems[0]]);
          } else {
            this.equipped.push([
              {
                name: "Helmet Slot",
                s: skeleton.lootPositions.helmet.id,
                id: -1,
              },
            ]);
          }
          const row2 = [];
          const swordItems = skeleton.persistent.items.filter(
            (i) => i.q && i.s == skeleton.lootPositions.sword.id
          );
          if (swordItems.length > 0) {
            row2.push(swordItems[0]);
          } else {
            row2.push({
              name: "Sword Slot",
              s: skeleton.lootPositions.sword.id,
              id: -2,
            });
          }
          const chestItems = skeleton.persistent.items.filter(
            (i) => i.q && i.s == skeleton.lootPositions.chest.id
          );
          if (chestItems.length > 0) {
            row2.push(chestItems[0]);
          } else {
            row2.push({
              name: "Chest Slot",
              s: skeleton.lootPositions.chest.id,
              id: -3,
            });
          }
          const shieldItems = skeleton.persistent.items.filter(
            (i) => i.q && i.s == skeleton.lootPositions.shield.id
          );
          if (shieldItems.length > 0) {
            row2.push(shieldItems[0]);
          } else {
            row2.push({
              name: "Shield Slot",
              s: skeleton.lootPositions.shield.id,
              id: -4,
            });
          }
          this.equipped.push(row2);
          const row3 = [];
          const gloveItems = skeleton.persistent.items.filter(
            (i) => i.q && i.s == skeleton.lootPositions.gloves.id
          );
          if (gloveItems.length > 0) {
            row3.push(gloveItems[0]);
          } else {
            row3.push({
              name: "Gloves Slot",
              s: skeleton.lootPositions.gloves.id,
              id: -5,
            });
          }
          const legItems = skeleton.persistent.items.filter(
            (i) => i.q && i.s == skeleton.lootPositions.legs.id
          );
          if (legItems.length > 0) {
            row3.push(legItems[0]);
          } else {
            row3.push({
              name: "Legs Slot",
              s: skeleton.lootPositions.legs.id,
              id: -6,
            });
          }
          const bootItems = skeleton.persistent.items.filter(
            (i) => i.q && i.s == skeleton.lootPositions.boots.id
          );
          if (bootItems.length > 0) {
            row3.push(bootItems[0]);
          } else {
            row3.push({
              name: "Boots Slot",
              s: skeleton.lootPositions.boots.id,
              id: -7,
            });
          }
          this.equipped.push(row3);
          this.equipped.push([{ name: "Destroy Items", s: -1, id: -8 }]);
        },
        inventoryItems() {
          return skeleton.persistent.items
            .filter((i) => !i.q)
            .sort((a, b) => b.r * b.l - a.r * a.l);
        },
        itemName(item) {
          return item.name || skeleton.getLootName(item);
        },
        itemSubName(item) {
          if (!item.name) {
            switch (item.r) {
              case skeleton.rarity.common:
                return "Common level " + item.l + " " + this.itemType(item);
              case skeleton.rarity.rare:
                return "Rare level " + item.l + " " + this.itemType(item);
              case skeleton.rarity.epic:
                return "Epic level " + item.l + " " + this.itemType(item);
              case skeleton.rarity.legendary:
                return "Legendary level " + item.l + " " + this.itemType(item);
              case skeleton.rarity.ancient:
                return "Ancient level " + item.l + " " + this.itemType(item);
              case skeleton.rarity.divine:
                return "Divine level " + item.l + " " + this.itemType(item);
            }
          }
          if (item.s == -1) {
            return "Click this to destroy all non-equipped items (legendary items will not be automatically destroyed). Or drag items here to destroy them.";
          }
        },
        itemStats(item) {
          return skeleton.getLootStats(item);
        },
        itemEffects(item) {
          return skeleton.getSpecialEffects(item);
        },
        itemType(item) {
          switch (item.s) {
            case -1:
              return "trash";
            case skeleton.lootPositions.helmet.id:
              return "helmet";
            case skeleton.lootPositions.chest.id:
              return "chest";
            case skeleton.lootPositions.gloves.id:
              return "gloves";
            case skeleton.lootPositions.legs.id:
              return "legs";
            case skeleton.lootPositions.boots.id:
              return "boots";
            case skeleton.lootPositions.sword.id:
              return "sword";
            case skeleton.lootPositions.shield.id:
              return "shield";
          }
        },
        itemClass(item) {
          return item.name ? "empty" : skeleton.getLootClass(item);
        },
        itemById(id: number) {
          let itemById = null;
          skeleton.persistent.items.forEach(function (item) {
            if (item.id == id) itemById = item;
          });
          return itemById;
        },
        itemDropped(itemId, target) {
          let draggedItem = null;
          skeleton.persistent.items.forEach(function (item) {
            if (item.id == itemId) draggedItem = item;
          });

          if (target == -1) {
            skeleton.destroyItem(draggedItem);
          } else {
            if (draggedItem.s == target) {
              skeleton.persistent.items.forEach(function (item) {
                if (item.s == target) {
                  item.q = false;
                }
              });
              draggedItem.q = true;
              upgrades.applyUpgrades();
            }
            this.updateEquippedItems();
          }
        },
        equipItem(itemClicked) {
          skeleton.persistent.items.forEach(function (item) {
            if (item.s == itemClicked.s) {
              item.q = false;
            }
          });
          itemClicked.q = true;
          upgrades.applyUpgrades();
          this.updateEquippedItems();
        },
        trashAll() {
          zm.confirmMessage =
            "Are you sure you want to destroy all non-equipped items? You will earn " +
            n(i.xpForItems()) +
            " xp";
          zm.confirmCallback = function () {
            zm.confirmCallback = false;
            skeleton.destroyAllItems();
          };
        },
      };
      // ---- Skeleton Functions ---- //

      function update() {
        const updateTime = new Date().getTime();
        const timeDiff =
          Math.min(1000, Math.max(updateTime - zm.lastUpdate, 0)) / 1000;
        innerUpdate(timeDiff, updateTime);
        zm.lastUpdate = updateTime;
      }

      function innerUpdate(timeDiff, updateTime) {
        zm.model.update(timeDiff, updateTime);
        zm.updateMessages(timeDiff);
      }
      if (zm.sidePanels.factory) {
        zm.factoryStats = partFactory.factoryStats();
      }

      $document.ready(function () {
        $scope.updatePromise = $interval(update, 200);
        upgrades.angularModel = zm;
      });
    },
  ])
  .directive("levelSelect", function () {
    return {
      templateUrl: "./templates/levelselect.html",
    };
  })
  .directive("levelStats", function () {
    return {
      templateUrl: "./templates/levelstats.html",
    };
  })
  .directive("graveyardMenu", function () {
    return {
      templateUrl: "./templates/graveyardmenu.html",
    };
  })
  .directive("runesmithMenu", function () {
    return {
      templateUrl: "./templates/runesmithmenu.html",
    };
  })
  .directive("optionsMenu", function () {
    return {
      templateUrl: "./templates/optionsmenu.html",
    };
  })
  .directive("shopMenu", function () {
    return {
      templateUrl: "./templates/shopmenu.html",
    };
  })
  .directive("constructionMenu", function () {
    return {
      templateUrl: "./templates/constructionmenu.html",
    };
  })
  .directive("prestigeMenu", function () {
    return {
      templateUrl: "./templates/prestigemenu.html",
    };
  })
  .directive("championsHoldMenu", function () {
    return {
      templateUrl: "./templates/championshold.html",
    };
  })
  .directive("factoryMenu", function () {
    return {
      templateUrl: "./templates/factorymenu.html",
    };
  })
  .directive("customOnChange", function () {
    return {
      restrict: "A",
      link: function (scope, element, attrs) {
        const onChangeHandler = scope.$eval(attrs.customOnChange);
        element.on("change", onChangeHandler);
        element.on("$destroy", function () {
          element.off();
        });
      },
    };
  })
  .directive("draggableItem", [
    "$rootScope",
    function ($rootScope) {
      return {
        restrict: "A",
        link: function (scope: any, el, attrs, controller) {
          const itemId = scope.item.id;

          if (attrs.draggableItem == "true") {
            angular.element(el).attr("draggable", "true");
            el.bind("dragstart", function (e) {
              document
                .getElementById("champ-hold")
                .classList.toggle("no-tooltip");
              e.dataTransfer.setData("text", itemId);
              const rect = el[0].getBoundingClientRect();
              e.dataTransfer.setDragImage(
                el[0],
                rect.width / 2,
                rect.height / 2
              );
              $rootScope.$emit("item-drag-start", itemId);
              setTimeout(function () {
                angular.element(el)[0].style.opacity = "0.3";
              });
            });
            el.bind("dragend", function (e) {
              document
                .getElementById("champ-hold")
                .classList.toggle("no-tooltip");
              angular.element(el)[0].style.opacity = "";
              $rootScope.$emit("item-drag-end", itemId);
            });
          }
        },
      };
    },
  ])
  .directive("droppableTarget", [
    "$rootScope",
    function ($rootScope) {
      return {
        restrict: "A",
        link: function (scope: any, el, attrs, controller) {
          const type = scope.item.s;

          el.bind("dragover", function (e) {
            if (e.preventDefault) {
              e.preventDefault(); // Necessary. Allows us to drop.
            }

            e.dataTransfer.dropEffect = "move"; // See the section on the DataTransfer object.
            return false;
          });

          el.bind("dragenter", function (e) {
            if (
              e.target &&
              e.target.classList &&
              e.target.classList.contains("icon")
            ) {
              angular.element(e.target.parentElement).addClass("over");
            }
          });

          el.bind("dragleave", function (e) {
            if (
              e.target &&
              e.target.classList &&
              e.target.classList.contains("icon")
            ) {
              angular.element(e.target.parentElement).removeClass("over");
            }
          });

          el.bind("drop", function (e) {
            if (e.preventDefault) {
              e.preventDefault(); // Necessary. Allows us to drop.
            }

            if (e.stopPropagation) {
              e.stopPropagation(); // Necessary. Allows us to drop.
            }
            if (e.target.classList.contains("icon")) {
              angular.element(e.target.parentElement).removeClass("over");
            }
            const data = e.dataTransfer.getData("text");
            const item = scope.zm.skeletonMenu.itemById(data);
            if (item) {
              const cssClass = scope.zm.skeletonMenu.itemType(item);
              document
                .getElementsByClassName("equipped")[0]
                .classList.remove(cssClass);
            }
            scope.zm.skeletonMenu.itemDropped(data, type);
          });
          $rootScope.$on("item-drag-start", function (e, result) {
            const item = scope.zm.skeletonMenu.itemById(result);
            if (item) {
              const cssClass = scope.zm.skeletonMenu.itemType(item);
              document
                .getElementsByClassName("equipped")[0]
                .classList.add(cssClass);
            }
          });
          $rootScope.$on("item-drag-end", function (e, result) {
            const item = scope.zm.skeletonMenu.itemById(result);
            if (item) {
              const cssClass = scope.zm.skeletonMenu.itemType(item);
              document
                .getElementsByClassName("equipped")[0]
                .classList.remove(cssClass);
            }
          });
        },
      };
    },
  ]);
