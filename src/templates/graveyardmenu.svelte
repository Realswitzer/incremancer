{#if sidePanels.graveyard}
  <div class="shop">
    <div class="shop-title">
      <h2>Cursed Graveyard</h2>
      <button onclick={closeSidePanels()}>Close</button>
    </div>
    <div class="tabs">
      <button
        onclick={graveyardTabSelect('minions')}
        class:active={graveyardTab === 'minions'}>Minions</button
      >
      <button
        onclick={graveyardTabSelect('trophies')}
        class:active={graveyardTab === 'trophies'}>Trophies</button
      >
    </div>
    {#if graveyardTab === 'minions'}
      <div class="upgrades">
        <div class="bone-collectors bones">
          <h4>
            Bone Collectors <button
              onclick={(bcinfo = !bcinfo)}
              class:active={bcinfo}>Info</button
            >
          </h4>
          <p hidden={!bcinfo}>
            Hire bone collectors to gather bones from the town's dead and your own fallen zombies. Each bone collector consumes 1 energy per
            second. They're hungry little creatures. Must be all that running around.
          </p>
          <h4>Energy rate {decimal(model.getEnergyRate())} per second</h4>
          <button onclick={subtractBoneCollector()}>-</button><label>{whole(model.persistentData.boneCollectors)} bone collectors</label
          ><button onclick={addBoneCollector()}>+</button>
        </div>
        <div class="bone-collectors bones">
          <h4>
            Zombies to Spawn <button
              onclick={(zsinfo = !zsinfo)}
              class:active={zsinfo}>Info</button
            >
          </h4>
          <p hidden={!zsinfo}>
            Control how many zombies the graveyard spawns each time your energy is full. This is limited by your maximum energy.
          </p>
          <div class="clear">
            <button onclick={setGraveyardZombies(0)}>0</button>
            <button onclick={setGraveyardZombies(model.persistentData.graveyardZombies - 1)}>-</button>
            <label>{whole(model.persistentData.graveyardZombies)} zombies</label>
            <button onclick={setGraveyardZombies(model.persistentData.graveyardZombies + 1)}>+</button>
            <button onclick={setGraveyardZombies(maxGraveyardZombies())}>{maxGraveyardZombies()}</button>
          </div>
        </div>
        {#if model.zombieCages > 0}
          <div class="bone-collectors bones">
            <h4>
              Caged Zombies <button
                onclick={(czinfo = !czinfo)}
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
                onclick={model.releaseCagedZombies()}
                disabled={model.zombiesInCages === 0 || model.currentState !== model.states.playingLevel}>Release</button
              >
              <button
                onclick={(model.persistentData.autoRelease = !model.persistentData.autoRelease)}
                class:active={model.persistentData.autoRelease}>Auto Release</button
              >
              <button
                onclick={model.sacrificeCagedZombies()}
                disabled={model.zombiesInCages === 0}>Sacrifice</button
              >
            </div>
          </div>
        {/if}
        {#if model.constructions.aviary}
          <div class="bone-collectors bones">
            <h4>
              Harpies <button
                onclick={(hpinfo = !hpinfo)}
                class:active={hpinfo}>Info</button
              >
            </h4>
            <p hidden={!hpinfo}>
              Release harpies that drop barrels of plague infected zombie flesh on unsuspecting humans. Each harpy consumes 1 energy per
              second. Harpy bombs infect humans with plague and cause {whole(model.zombieHealth * 0.2)} damage. The damage scales with zombie
              health.
            </p>
            <h4>Energy rate {decimal(model.getEnergyRate())} per second</h4>
            <button onclick={setHarpies(model.persistentData.harpies - 1)}>-</button><label
              >{whole(model.persistentData.harpies)} harpies</label
            ><button onclick={setHarpies(model.persistentData.harpies + 1)}>+</button>
          </div>
        {/if}
        <!-- NOTE: side tangent, but gigazombies looks like it was intended to be perm, not a spell.
        thats kind of weird trivia.-->
        <!-- <div class="bone-collectors bones" ng-if="model.gigazombies">
            <h4>Gigazombies <button onclick={gzinfo = ! gzinfo} class="{gzinfo ? 'active' : ''}">Info</button></h4>
            <p ng-show="gzinfo">Causes any zombie spawned using energy to be a Gigazombie. This will increase their health and damage by 10x, and energy cost by 5x.</p>
            <h4>Energy cost per zombie {model.zombieCost}</h4>
            <button onclick={model.toggleGigazombies();} class="{model.persistentData.gigazombiesOn ? 'active' : ''}">{model.persistentData.gigazombiesOn ? 'Gigazombies On' : 'Gigazombies Off'}</button>
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
          onclick={trophyTabSelect('all')}
          class={trophyTab == 'all' ? 'active' : ''}>All</button
        >
        <button
          onclick={trophyTabSelect('collected')}
          class={trophyTab == 'collected' ? 'active' : ''}>Collected</button
        >
        <button
          onclick={trophyTabSelect('uncollected')}
          class={trophyTab == 'uncollected' ? 'active' : ''}>Uncollected</button
        >
        <button
          onclick={trophyTabSelect('totals')}
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
