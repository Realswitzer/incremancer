{#if sidePanels.factory}
  <div class="shop">
    <div class="shop-title">
      <h2>Factory</h2>
      <button onclick={closeSidePanels()}>Close</button>
    </div>
    <div class="tabs">
      <button
        onclick={factory.changeFactoryTab('parts')}
        class="parts"
        class:active={factoryTab === 'parts'}>Parts</button
      >
      {#if model.constructions.monsterFactory}
        <button
          onclick={factory.changeFactoryTab('creatures')}
          class="blood"
          class:active={factoryTab === 'creatures'}>Creatures</button
        >
      {/if}

      {#if model.constructions.monsterFactory}
        <button
          onclick={factory.changeFactoryTab('level')}
          class="blood"
          class:active={factoryTab === 'level'}>Upgrade</button
        >
      {/if}
    </div>
    {#if factoryTab === 'parts'}
      <p>
        You currently have {factoryStats.machines} machines, producing an average of {whole(factoryStats.partsPerSec * model.gameSpeed)} creature
        parts per second.
      </p>
    {/if}
    {#if factoryTab === 'parts'}
      <div class="upgrades">
        {#each upgrades as generator}
          <div class="upgrade {generator.costType}">
            <h4>{generator.name} ({currentRank(generator)})</h4>
            <h4 class="cost">{whole(factory.generatorPrice(generator))} {generator.costType}</h4>
            <div
              class="generator-progress clear"
              class:active={currentRank(generator) > 0}
            >
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
              onclick={factory.buyGenerator(generator)}
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
              onclick={(generator.selected = !generator.selected)}
              class="info {generator.selected ? 'active' : ''}">i</button
            >
            {#if model.autoUpgrades}
              <button
                onclick={(generator.auto = !generator.auto)}
                class="info"
                class:active={generator.auto}>{generator.auto ? 'On' : 'Auto'}</button
              >
            {/if}
            <div class="clear"></div>
            <p hidden={!generator.selected}>{generator.description}</p>
            <p hidden={!generator.selected}>
              Owned: {currentRank(generator)} - Producing {decimal(currentRank(generator) * generator.produces)} parts every {generator.time}
              seconds
            </p>
          </div>
        {/each}
      </div>
    {/if}
    {#if factoryTab === 'creatures'}
      <p>
        You currently have {model.creatureCount} creatures, and a maximum of {model.creatureLimit}.
      </p>
    {/if}
    {#if factoryTab === 'creatures'}
      <p>Creatures can be automatically built until they reach your set limit.</p>
    {/if}
    {#if factoryTab === 'creatures'}
      <div class="upgrades">
        {#each upgrades as creature}
          <div class="upgrade parts">
            <h4>{creature.name} Level:{creature.level}</h4>
            <h4 class="cost">{whole(factory.creaturePrice(creature))} parts</h4>
            <div class="clear"></div>
            <button
              onclick={factory.buyCreature(creature)}
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
              onclick={(creature.selected = !creature.selected)}
              class="info"
              class:active={creature.selected}>i</button
            >
            <p hidden={!creature.selected}>{creature.description}</p>
            <div
              class="clear"
              style="margin-top:5px;"
            >
              <button onclick={factory.autoBuild(creature, -1)}>-</button><span style="padding:0 10px">Auto build {creature.autobuild}</span
              ><button onclick={factory.autoBuild(creature, 1)}>+</button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
    {#if factoryTab === 'level'}
      <p>
        Each time you level up a creature its health and damage will increase by 75%, but the cost will increase by 100%. Make sure you can
        afford it because there's no going back.
      </p>
    {/if}
    {#if factoryTab === 'level'}
      <div class="upgrades">
        {#each upgrades as creature}
          <div class="upgrade parts">
            <h4>{creature.name} Level:{creature.level}</h4>
            <h4 class="cost">{whole(factory.creatureLevelPrice(creature))} parts</h4>
            <div class="clear"></div>
            <button
              onclick={factory.levelCreature(creature)}
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
              onclick={(creature.selected = !creature.selected)}
              class="info"
              class:active={creature.selected}>i</button
            >
            <table
              style="width:100%; margin-top:5px; text-align: left;"
              hidden={!creature.selected}
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
        {/each}
      </div>
    {/if}
  </div>
{/if}
