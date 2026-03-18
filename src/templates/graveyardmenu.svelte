{#if sidePanels.graveyard}
  <div class="shop">
    <div class="shop-title">
      <h2>Cursed Graveyard</h2>
      <button on:click={closeSidePanels()}>Close</button>
    </div>
    <div class="tabs">
      <button
        on:click={graveyardTabSelect('minions')}
        class:active={graveyardTab === 'minions'}>Minions</button
      >
      <button
        on:click={graveyardTabSelect('trophies')}
        class:active={graveyardTab === 'trophies'}>Trophies</button
      >
    </div>
    {#if graveyardTab === 'minions'}
      <div class="upgrades">
        <div class="bone-collectors bones">
          <h4>
            Bone Collectors <button
              on:click={(bcinfo = !bcinfo)}
              class:active={bcinfo}>Info</button
            >
          </h4>
          <p hidden={!bcinfo}>
            Hire bone collectors to gather bones from the town's dead and your own fallen zombies. Each bone collector consumes 1 energy per
            second. They're hungry little creatures. Must be all that running around.
          </p>
          <h4>Energy rate {decimal(model.getEnergyRate())} per second</h4>
          <button on:click={subtractBoneCollector()}>-</button><label>{whole(model.persistentData.boneCollectors)} bone collectors</label
          ><button on:click={addBoneCollector()}>+</button>
        </div>
        <div class="bone-collectors bones">
          <h4>
            Zombies to Spawn <button
              on:click={(zsinfo = !zsinfo)}
              class:active={zsinfo}>Info</button
            >
          </h4>
          <p hidden={!zsinfo}>
            Control how many zombies the graveyard spawns each time your energy is full. This is limited by your maximum energy.
          </p>
          <div class="clear">
            <button on:click={setGraveyardZombies(0)}>0</button>
            <button on:click={setGraveyardZombies(model.persistentData.graveyardZombies - 1)}>-</button>
            <label>{whole(model.persistentData.graveyardZombies)} zombies</label>
            <button on:click={setGraveyardZombies(model.persistentData.graveyardZombies + 1)}>+</button>
            <button on:click={setGraveyardZombies(maxGraveyardZombies())}>{maxGraveyardZombies()}</button>
          </div>
        </div>
        {#if model.zombieCages > 0}
          <div class="bone-collectors bones">
            <h4>
              Caged Zombies <button
                on:click={(czinfo = !czinfo)}
                class:active={czinfo}>Info</button
              >
            </h4>
            <div class="clear cages">
              <h4>You currently have {model.zombiesInCages} / {model.zombieCages} zombies caged</h4>
              <p hidden={!czinfo}>
                You can release them to fight again, or sacrifice them to gain {whole(model.cagedZombieSacrificeValue().blood)} blood, {model.cagedZombieSacrificeValue()
                  .brains} brains, and {model.cagedZombieSacrificeValue().bones} bones
              </p>
              <button
                on:click={model.releaseCagedZombies()}
                disabled={model.zombiesInCages === 0 || model.currentState !== model.states.playingLevel}>Release</button
              >
              <button
                on:click={(model.persistentData.autoRelease = !model.persistentData.autoRelease)}
                class:active={model.persistentData.autoRelease}>Auto Release</button
              >
              <button
                on:click={model.sacrificeCagedZombies()}
                disabled={model.zombiesInCages === 0}>Sacrifice</button
              >
            </div>
          </div>
        {/if}
        {#if model.constructions.aviary}
          <div class="bone-collectors bones">
            <h4>
              Harpies <button
                on:click={(hpinfo = !hpinfo)}
                class:active={hpinfo}>Info</button
              >
            </h4>
            <p hidden={!hpinfo}>
              Release harpies that drop barrels of plague infected zombie flesh on unsuspecting humans. Each harpy consumes 1 energy per
              second. Harpy bombs infect humans with plague and cause {whole(model.zombieHealth * 0.2)} damage. The damage scales with zombie
              health.
            </p>
            <h4>Energy rate {decimal(model.getEnergyRate())} per second</h4>
            <button on:click={setHarpies(model.persistentData.harpies - 1)}>-</button><label
              >{whole(model.persistentData.harpies)} harpies</label
            ><button on:click={setHarpies(model.persistentData.harpies + 1)}>+</button>
          </div>
        {/if}
        <!-- NOTE: side tangent, but gigazombies looks like it was intended to be perm, not a spell.
        thats kind of weird trivia.-->
        <!-- <div class="bone-collectors bones" ng-if="model.gigazombies">
            <h4>Gigazombies <button on:click={gzinfo = ! gzinfo} class="{gzinfo ? 'active' : ''}">Info</button></h4>
            <p ng-show="gzinfo">Causes any zombie spawned using energy to be a Gigazombie. This will increase their health and damage by 10x, and energy cost by 5x.</p>
            <h4>Energy cost per zombie {model.zombieCost}</h4>
            <button on:click={model.toggleGigazombies();} class="{model.persistentData.gigazombiesOn ? 'active' : ''}">{model.persistentData.gigazombiesOn ? 'Gigazombies On' : 'Gigazombies Off'}</button>
          </div> -->
      </div>
    {/if}
    {#if graveyardTab === 'trophies'}
      <p>
        Earn bonuses by collecting the severed heads of VIPs from certain towns. These trophies persist through prestige resets, while
        escaped VIPs will return to town.
      </p>
      <div class="tabs">
        <button
          on:click={trophyTabSelect('all')}
          class={trophyTab == 'all' ? 'active' : ''}>All</button
        >
        <button
          on:click={trophyTabSelect('collected')}
          class={trophyTab == 'collected' ? 'active' : ''}>Collected</button
        >
        <button
          on:click={trophyTabSelect('uncollected')}
          class={trophyTab == 'uncollected' ? 'active' : ''}>Uncollected</button
        >
        <button
          on:click={trophyTabSelect('totals')}
          class={trophyTab == 'totals' ? 'active' : ''}>Stat Totals</button
        >
      </div>
    {/if}
    {#if graveyardTab === 'trophies'}
      <div class="upgrades">
        {#each trophies as trophy}
          <div class="upgrade bones {trophy.owned ? 'owned' : 'uncollected'}">
            {#if trophyTab !== 'totals'}
              <label
                >Level: {trophy.level}
                {#if trophy.escaped}
                  <span class="escaped">VIP Escaped</span>
                {/if}
              </label>
            {/if}
            <label>{upgradeSubtitle(trophy)}</label>
          </div>
        {/each}
      </div>
    {/if}
  </div>
{/if}
