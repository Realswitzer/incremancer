{#if sidePanels.factory}
  <div class="shop">
    <div class="shop-title">
      <h2>Factory</h2>
      <button on:click={closeSidePanels()}>Close</button>
    </div>
    <div class="tabs">
      <button
        on:click={factory.changeFactoryTab('parts')}
        class="parts {factoryTab == 'parts' ? 'active' : ''}">Parts</button
      >
      <button
        on:click={factory.changeFactoryTab('creatures')}
        class="blood {factoryTab == 'creatures' ? 'active' : ''} "
        ng-if="model.constructions.monsterFactory">Creatures</button
      >
      <button
        on:click={factory.changeFactoryTab('level')}
        class="blood {factoryTab == 'level' ? 'active' : ''}"
        ng-if="model.constructions.monsterFactory">Upgrade</button
      >
    </div>
    <p ng-if="factoryTab == 'parts'">
      You currently have {factoryStats.machines} machines, producing an average of {whole(
        factoryStats.partsPerSec * model.gameSpeed
      )} creature parts per second.
    </p>
    <div
      class="upgrades"
      ng-if="factoryTab == 'parts'"
    >
      <div
        ng-repeat="generator in upgrades"
        class="upgrade {generator.costType}"
      >
        <h4>{generator.name} ({currentRank(generator)})</h4>
        <h4 class="cost">{whole(factory.generatorPrice(generator))} {generator.costType}</h4>
        <div class="generator-progress clear {currentRank(generator) > 0 ? 'active' : ''}">
          <span
            class="percent"
            style:animation-duration={() => {
              generator.time / model.gameSpeed + 's';
            }}
            style:animation-delay={() => {
              factory.delays[generator.id] + 's';
            }}
          ></span>
        </div>
        <button
          on:click={factory.buyGenerator(generator)}
          disabled={upgradeTooExpensive(generator)}
          >{upgradeButtonText(generator)}
          <span
            class="percent"
            style:width={() => {
              upgradePercent(generator) + '%';
            }}
          ></span>
        </button>
        <button
          on:click={(generator.selected = !generator.selected)}
          class="info {generator.selected ? 'active' : ''}">i</button
        >
        <button
          on:click={(generator.auto = !generator.auto)}
          class="info {generator.auto ? 'active' : ''} "
          ng-if="model.autoUpgrades">{generator.auto ? 'On' : 'Auto'}</button
        >
        <div class="clear"></div>
        <p ng-show="generator.selected">{generator.description}</p>
        <p ng-show="generator.selected">
          Owned: {currentRank(generator)} - Producing {decimal(
            currentRank(generator) * generator.produces
          )} parts every {generator.time} seconds
        </p>
      </div>
    </div>
    <p ng-if="factoryTab == 'creatures'">
      You currently have {model.creatureCount} creatures, and a maximum of {model.creatureLimit}.
    </p>
    <p ng-if="factoryTab == 'creatures'">
      Creatures can be automatically built until they reach your set limit.
    </p>
    <div
      class="upgrades"
      ng-if="factoryTab == 'creatures'"
    >
      <div
        ng-repeat="creature in upgrades"
        class="upgrade parts"
      >
        <h4>{creature.name} Level:{creature.level}</h4>
        <h4 class="cost">{whole(factory.creaturePrice(creature))} parts</h4>
        <div class="clear"></div>
        <button
          on:click={factory.buyCreature(creature)}
          disabled={!factory.canBuildCreature(creature)}
          >{factory.creatureButtonText(creature)}
          <span
            class="percent"
            style:width={() => {
              factory.creaturePercent(creature) + '%';
            }}
          ></span>
        </button>
        <button
          on:click={(creature.selected = !creature.selected)}
          class="info {creature.selected ? 'active' : ''}">i</button
        >
        <p ng-show="creature.selected">{creature.description}</p>
        <div
          class="clear"
          style="margin-top:5px;"
        >
          <button on:click={factory.autoBuild(creature, -1)}>-</button><span style="padding:0 10px"
            >Auto build {creature.autobuild}</span
          ><button on:click={factory.autoBuild(creature, 1)}>+</button>
        </div>
      </div>
    </div>
    <p ng-if="factoryTab == 'level'">
      Each time you level up a creature its health and damage will increase by 75%, but the cost
      will increase by 100%. Make sure you can afford it because there's no going back.
    </p>
    <div
      class="upgrades"
      ng-if="factoryTab == 'level'"
    >
      <div
        ng-repeat="creature in upgrades"
        class="upgrade parts"
      >
        <h4>{creature.name} Level:{creature.level}</h4>
        <h4 class="cost">{whole(factory.creatureLevelPrice(creature))} parts</h4>
        <div class="clear"></div>
        <button
          on:click={factory.levelCreature(creature)}
          disabled={!factory.canLevelCreature(creature)}
          >{factory.creatureLevelButtonText(creature)}
          <span
            class="percent"
            style:width={() => {
              factory.creatureLevelPercent(creature) + '%';
            }}
          ></span>
        </button>
        <button
          on:click={(creature.selected = !creature.selected)}
          class="info {creature.selected ? 'active' : ''}">i</button
        >
        <table
          style="width:100%;margin-top:5px;text-align: left;"
          ng-show="creature.selected"
        >
          <tr>
            <th colspan="2">Current Level: {creature.level}</th>
            <th colspan="2">Next Level: {creature.level + 1}</th>
          </tr>
          <tr>
            <th>Health</th>
            <td>{decimal(factory.creatureStats(creature).thisLevel.health)}</td>
            <th>Health</th>
            <td>{decimal(factory.creatureStats(creature).nextLevel.health)}</td>
          </tr>
          <tr>
            <th>Damage</th>
            <td>{decimal(factory.creatureStats(creature).thisLevel.damage)}</td>
            <th>Damage</th>
            <td>{decimal(factory.creatureStats(creature).nextLevel.damage)}</td>
          </tr>
          <tr>
            <th>Speed</th>
            <td>{creature.speed}</td>
            <th>Speed</th>
            <td>{creature.speed}</td>
          </tr>
          <tr>
            <th>Cost</th>
            <td>{decimal(factory.creatureStats(creature).thisLevel.cost)}</td>
            <th>Cost</th>
            <td>{decimal(factory.creatureStats(creature).nextLevel.cost)}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
{/if}
