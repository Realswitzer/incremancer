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

  <body>
    {#if message}
      <div class="message">
        <p>{message}</p>
      </div>
    {/if}
    <div class="stats {model.persistentData.zoomButtons ? 'zoom' : ''}">
      <label>Level: {model.level}</label>
      <button
        onclick={(showStats = !showStats)}
        class:active={showStats}
      >
        Stats
      </button>
      <label>Humans: {model.getHumanCount()}</label>
      <label>Zombies: {model.zombieCount}</label>
      {#if model.constructions.monsterFactory}
        <label>Creatures: {model.creatureCount} / {model.creatureLimit}</label>
      {/if}
      {#if model.persistentData.showfps}
        <label>FPS: {model.frameRate}</label>
      {/if}
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
        >Blood:<span class="value">{model.persistentData.blood | whole} / {model.bloodMax | whole}</span><span
          class="percent"
          style:width={() => {
            bloodPercent() + '%';
          }}
        ></span></label
      >
      <label class="brains"
        >Brains:<span class="value">{model.persistentData.brains | whole} / {model.brainsMax | whole}</span><span
          class="percent"
          style:width={() => {
            brainsPercent() + '%';
          }}
        ></span></label
      >
      {#if model.constructions.graveyard || model.persistentData.bones > 0}
        <label class="bones">Bones:<span class="value">{model.persistentData.bones | whole}</span></label>
      {/if}
      {#if model.constructions.factory || model.persistentData.parts > 0}
        <label class="parts">Parts:<span class="value">{model.persistentData.parts | whole}</span></label>
      {/if}
      <div class="spells">
        {#each spells.getUnlockedSpells() as spell}
          <button
            onclick={spells.castSpell(spell)}
            class="spell {spell.active ? 'active' : spell.onCooldown ? 'cooldown' : ''}"
            disabled={spell.onCooldown || spell.energyCost > model.energy}
          >
            <span class="icon">{spell.name}</span>
            {#if spell.active || spell.onCooldown}
              <span class="timer">{spell.active ? spell.timer : spell.cooldownLeft | whole}</span>
            {/if}
            {#if !spell.active && !spell.onCooldown}
              <span class="tooltip">{spell.tooltip}</span>
            {/if}
          </button>
        {/each}
        {#if model.persistentData.allTimeHighestLevel >= 50}
          <div
            class="skeleton"
            onclick={skeletonMenu.show()}
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
            {#if skeleton().skeletons > 0 && skeletonMenu.isAlive()}
              <div class="lvl">
                lvl {skeleton().level}
              </div>
            {/if}
            {#if skeleton().skeletons > 0 && !skeletonMenu.isAlive()}
              <div class="lvl dead">
                DEAD: {skeletonMenu.timer()}
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>

    <div
      class="buttons"
      class:open={sidePanels.open}
    >
      <button
        onclick={OpenSidePanel('shop')}
        class:active={sidePanels.shop}
      >
        Shop
      </button>
      {#if model.construction}
        <button
          onclick={openSidePanel('construction')}
          class:active={sidePanels.construction}
        >
          {#if model.persistentData.currentConstruction}
            <span class="tag">{constructionPercent()}%</span>
          {/if}Construction
        </button>
      {/if}
      {#if model.constructions.graveyard}
        <button
          onclick={openSidePanel('graveyard')}
          class:active={sidePanels.graveyard}
        >
          Graveyard
        </button>
      {/if}
      {#if model.constructions.factory}
        <button
          onclick={openSidePanel('factory')}
          class:active={sidePanels.factory}
        >
          Factory
        </button>
      {/if}
      {#if model.constructions.runesmith}
        <button
          onclick={openSidePanel('runesmith')}
          class:active={sidePanels.runesmith}
          class:shatter={canShatter()}
        >
          Runesmith
        </button>
      {/if}
      {#if isShowPrestige()}
        <button
          onclick={openSidePanel('prestige')}
          class:active={sidePanels.prestige}
          id="prestige-button"
        >
          <div id="prestige-bg"></div>
          Prestige
        </button>
      {/if}
      <button
        onclick={openSidePanel('options')}
        class:active={sidePanels.options}
      >
        Options
      </button>
      {#if levelSelect.showButton()}
        <button
          onclick={levelSelect.show()}
          class:active={levelSelect.shown}
        >
          Level Select
        </button>
      {/if}
    </div>

    {#if model.persistentData.zoomButtons}
      <div class="zoom-buttons">
        <button onclick={zoom(-1)}>-</button>
        <button onclick={resetZoom()}>Reset</button>
        <button onclick={zoom(+1)}>+</button>
      </div>
    {/if}

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

    {#if model.currentState === model.states.startGame}
      <div class="start-game">
        <h2>Incremancer</h2>
        <h4>Take control of a horde of zombies to ravage small towns</h4>
        <ul>
          {#each howToPlay as text}
            <li>{text}</li>
          {/each}
        </ul>
        {#if model.offlineMessage}
          <h2 style="margin: 1em">
            {model.offlineMessage}
          </h2>
        {/if}
        <button onclick={startGame()}>Start Level {model.level}</button>
      </div>
    {/if}

    {#if model.currentState === model.states.failed}
      <div class="end-level">
        <h2>Level {model.level} Failed</h2>
        <h4>You have been defeated</h4>
        <button onclick={model.startLevel(model.level - 1)}>
          Go back to Level {model.level - 1}
        </button>
        <button onclick={model.startLevel(model.level)}>
          Retry Level {model.level}
        </button>
      </div>
    {/if}

    {#if model.currentState === model.states.levelCompleted}
      <div class="end-level">
        <h2>Level {model.level} Complete</h2>
        <h4>All the humans are either dead or undead!</h4>
        {#if model.prestigePointsEarned > 0}
          <h4>
            You have earned {model.prestigePointsEarned} prestige points
          </h4>
        {/if}
        {#if model.endLevelBones}
          <h4 style="margin: 1em">
            Your bone collectors have gathered the remaining {model.endLevelBones} bones from the town
          </h4>
        {/if}
        <button onclick={nextLevel()}>Start Level {model.level + 1}</button>
      </div>
    {/if}

    {#if model.currentState === model.states.prestiged}
      <div class="start-game">
        <h2>You have prestiged!</h2>
        <p>It's time to start from the beginning again, but this time stronger and faster.</p>
        <h4>You have {model.persistentData.prestigePointsToSpend} prestige points to spend</h4>
        <p>It is recommended to spend your points before clicking start game</p>
        <p>as some of their effects will only activate when a new level is started.</p>
        <button onclick={startGame()}>Start Level {model.level}</button>
      </div>
    {/if}
  </body>
</html>
