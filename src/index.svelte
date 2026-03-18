<!doctype html>
<html lang="en">
  <head>
    <title>Incremancer</title>
    <meta
      name="description"
      content="Zombie necromancer idle game"
    />
    <meta
      name="keywords"
      content="zombie,game,idle,javascript"
    />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1"
    />
    <meta
      name="robots"
      content="noindex"
    />
    <meta
      name="theme-color"
      content="#104510"
    />
    <meta charset="utf-8" />
    <link
      rel="manifest"
      href="/manifest.json"
    />
    <script src="/legacy/lz-string.min.js"></script>
    <script src="/legacy/pixi-legacy.min.js"></script>
    <script src="/legacy/angular.min.js"></script>

    <script src="/legacy/utilsfunctions.js"></script>
    <script src="/legacy/zombiemancer.js"></script>
    <script src="/legacy/spells.js"></script>
    <script src="/legacy/zmmap.js"></script>
    <script src="/legacy/partfactory.js"></script>
    <script src="/legacy/creaturefactory.js"></script>
    <script src="/legacy/gamemodel.js"></script>
    <script src="/legacy/upgrades.js"></script>
    <script src="/legacy/trophies.js"></script>
    <script src="/legacy/humans.js"></script>
    <script src="/legacy/zombies.js"></script>
    <script src="/legacy/skeleton.js"></script>
    <script src="/legacy/creatures.js"></script>
    <script src="/legacy/graveyard.js"></script>
    <script src="/legacy/bloodparts.js"></script>
    <script src="/legacy/angularzombie.js"></script>
    <link
      rel="stylesheet"
      type="text/css"
      href="/assets/zombiemancer.css"
    />
    <link
      rel="shortcut icon"
      href="/favicon.ico"
      type="image/x-icon"
    />
  </head>

  <body
    ng-app="zombieApp"
    ng-controller="ZombieController as zm"
  >
    {#if message}
      <div class="message">
        <p>{message}</p>
      </div>
    {/if}
    <div class="stats {model.persistentData.zoomButtons ? 'zoom' : ''}">
      <label>Level: {model.level}</label>
      <button
        ng-click="showStats = !showStats"
        class={showStats ? 'active' : ''}
      >
        Stats
      </button>
      <label>Humans: {model.getHumanCount()}</label>
      <label>Zombies: {model.zombieCount}</label>
      <label ng-if="model.constructions.monsterFactory"
        >Creatures: {model.creatureCount} / {model.creatureLimit}</label
      >
      <label ng-if="model.persistentData.showfps">FPS: {model.frameRate}</label>
    </div>

    <div class="resources">
      <label class="energy"
        >Energy:<span class="value">{model.energy | decimal} / {model.energyMax | whole}</span><span
          class="percent"
          style:width={() => {
            energyPercent() + '%';
          }}
        ></span></label
      >
      <label class="blood"
        >Blood:<span class="value"
          >{model.persistentData.blood | whole} / {model.bloodMax | whole}</span
        ><span
          class="percent"
          style:width={() => {
            bloodPercent() + '%';
          }}
        ></span></label
      >
      <label class="brains"
        >Brains:<span class="value"
          >{model.persistentData.brains | whole} / {model.brainsMax | whole}</span
        ><span
          class="percent"
          style:width={() => {
            brainsPercent() + '%';
          }}
        ></span></label
      >
      <label
        class="bones"
        ng-if="model.constructions.graveyard || model.persistentData.bones > 0"
        >Bones:<span class="value">{model.persistentData.bones | whole}</span></label
      >
      <label
        class="parts"
        ng-if="model.constructions.factory || model.persistentData.parts > 0"
        >Parts:<span class="value">{model.persistentData.parts | whole}</span></label
      >
      <div class="spells">
        <button
          ng-repeat="spell in spells.getUnlockedSpells()"
          ng-click="spells.castSpell(spell)"
          class="spell {spell.active ? 'active' : spell.onCooldown ? 'cooldown' : ''}"
          ng-disabled="spell.onCooldown || spell.energyCost > model.energy"
        >
          <span class="icon">{spell.name}</span>
          <span
            class="timer"
            ng-if="spell.active || spell.onCooldown"
            >{spell.active ? spell.timer : spell.cooldownLeft | whole}</span
          >
          <span
            class="tooltip"
            ng-if="!spell.active && !spell.onCooldown">{spell.tooltip}</span
          >
        </button>
        <div
          class="skeleton"
          ng-if="model.persistentData.allTimeHighestLevel >= 50"
          ng-click="skeletonMenu.show()"
        >
          <div
            class="bg"
            id="skeleton"
          ></div>
          <div class="xp">
            <span
              style:height={() => {
                skeletonMenu.xpPercent() + '%';
              }}
            ></span>
          </div>
          <div
            class="lvl"
            ng-if="skeleton().skeletons > 0 && skeletonMenu.isAlive()"
          >
            lvl {skeleton().level}
          </div>
          <div
            class="lvl dead"
            ng-if="skeleton().skeletons > 0 && !skeletonMenu.isAlive()"
          >
            DEAD: {skeletonMenu.timer()}
          </div>
        </div>
      </div>
    </div>

    <div class="buttons {sidePanels.open ? 'open' : ''}">
      <button
        ng-click="openSidePanel('shop');"
        class={sidePanels.shop ? 'active' : ''}
      >
        Shop
      </button>
      <button
        ng-click="openSidePanel('construction');"
        ng-if="model.construction"
        class={sidePanels.construction ? 'active' : ''}
      >
        <span
          ng-if="model.persistentData.currentConstruction"
          class="tag">{constructionPercent()}%</span
        >Construction
      </button>
      <button
        ng-click="openSidePanel('graveyard');"
        ng-if="model.constructions.graveyard"
        class={sidePanels.graveyard ? 'active' : ''}
      >
        Graveyard
      </button>
      <button
        ng-click="openSidePanel('factory');"
        ng-if="model.constructions.factory"
        class={sidePanels.factory ? 'active' : ''}
      >
        Factory
      </button>
      <button
        ng-click="openSidePanel('runesmith');"
        ng-if="model.constructions.runesmith"
        class="{sidePanels.runesmith ? 'active' : ''}{canShatter() ? 'shatter' : ''}"
      >
        Runesmith
      </button>
      <button
        ng-click="openSidePanel('prestige');"
        ng-if="isShowPrestige()"
        class={sidePanels.prestige ? 'active' : ''}
        id="prestige-button"
      >
        <div id="prestige-bg"></div>
        Prestige
      </button>
      <button
        ng-click="openSidePanel('options');"
        class={sidePanels.options ? 'active' : ''}
      >
        Options
      </button>
      <button
        ng-click="levelSelect.show()"
        class={levelSelect.shown ? 'active' : ''}
        ng-if="levelSelect.showButton()"
      >
        Level Select
      </button>
    </div>

    <div
      class="zoom-buttons"
      ng-if="model.persistentData.zoomButtons"
    >
      <button ng-click="zoom(-1);">-</button>
      <button ng-click="resetZoom();">Reset</button>
      <button ng-click="zoom(+1);">+</button>
    </div>

    <shop-menu></shop-menu>
    <construction-menu></construction-menu>
    <graveyard-menu></graveyard-menu>
    <factory-menu></factory-menu>
    <runesmith-menu></runesmith-menu>
    <champions-hold-menu></champions-hold-menu>
    <prestige-menu></prestige-menu>
    <options-menu></options-menu>
    <level-select></level-select>
    <level-stats></level-stats>

    <div
      class="start-game"
      ng-if="model.currentState == model.states.startGame"
    >
      <h2>Incremancer</h2>
      <h4>Take control of a horde of zombies to ravage small towns</h4>
      <ul>
        <li ng-repeat="text in howToPlay">{text}</li>
      </ul>
      <h2
        ng-if="model.offlineMessage"
        style="margin: 1em"
      >
        {model.offlineMessage}
      </h2>
      <button ng-click="startGame();">Start Level {model.level}</button>
    </div>

    <div
      class="end-level"
      ng-if="model.currentState == model.states.failed"
    >
      <h2>Level {model.level} Failed</h2>
      <h4>You have been defeated</h4>
      <button ng-click="model.startLevel(model.level - 1);">
        Go back to Level {model.level - 1}
      </button>
      <button ng-click="model.startLevel(model.level);">
        Retry Level {model.level}
      </button>
    </div>

    <div
      class="end-level"
      ng-if="model.currentState == model.states.levelCompleted"
    >
      <h2>Level {model.level} Complete</h2>
      <h4>All the humans are either dead or undead!</h4>
      <h4 ng-if="model.prestigePointsEarned > 0">
        You have earned {model.prestigePointsEarned} prestige points
      </h4>
      <h4
        ng-if="model.endLevelBones"
        style="margin: 1em"
      >
        Your bone collectors have gathered the remaining {model.endLevelBones} bones from the town
      </h4>
      <button ng-click="nextLevel();">Start Level {model.level + 1}</button>
    </div>

    {#if model.currentState === model.states.prestiged}
      <div class="start-game">
        <h2>You have prestiged!</h2>
        <p>It's time to start from the beginning again, but this time stronger and faster.</p>
        <h4>You have {model.persistentData.prestigePointsToSpend} prestige points to spend</h4>
        <p>It is recommended to spend your points before clicking start game</p>
        <p>as some of their effects will only activate when a new level is started.</p>
        <button on:click={startGame()}>Start Level {model.level}</button>
      </div>
    {/if}
  </body>
</html>
