<div class="shop" ng-if="sidePanels.graveyard">
  <div class="shop-title">
    <h2>Cursed Graveyard</h2>
    <button on:click={closeSidePanels();}>Close</button>
  </div>
  <div class="tabs">
    <button on:click={graveyardTabSelect('minions')} class="{graveyardTab == 'minions' ? 'active' : ''}">Minions</button>
    <button on:click={graveyardTabSelect('trophies')} class="{graveyardTab == 'trophies' ? 'active' : ''}">Trophies</button>
  </div>
  <div class="upgrades" ng-if="graveyardTab == 'minions'">
    <div class="bone-collectors bones">
      <h4>Bone Collectors <button on:click={bcinfo = !bcinfo} class="{bcinfo ? 'active' : ''}">Info</button></h4>
      <p ng-show="bcinfo">Hire bone collectors to gather bones from the town's dead and your own fallen zombies. Each bone collector consumes 1 energy per second. They're hungry little creatures. Must be all that running around.</p>
      <h4>Energy rate {model.getEnergyRate()|decimal} per second</h4>
      <button on:click={subtractBoneCollector()}>-</button><label>{model.persistentData.boneCollectors|whole} bone collectors</label><button on:click={addBoneCollector();}>+</button>
    </div>
    <div class="bone-collectors bones">
      <h4>Zombies to Spawn <button on:click={zsinfo = !zsinfo} class="{zsinfo ? 'active' : ''}">Info</button></h4>
      <p ng-show="zsinfo">Control how many zombies the graveyard spawns each time your energy is full. This is limited by your maximum energy.</p>
      <div class="clear">
        <button on:click={setGraveyardZombies(0);}>0</button>
        <button on:click={setGraveyardZombies(model.persistentData.graveyardZombies - 1);}>-</button>
        <label>{model.persistentData.graveyardZombies|whole} zombies</label>
        <button on:click={setGraveyardZombies(model.persistentData.graveyardZombies + 1);}>+</button>
        <button on:click={setGraveyardZombies(maxGraveyardZombies());}>{maxGraveyardZombies()}</button>
      </div>
    </div>
    <div class="bone-collectors bones" ng-if="model.zombieCages > 0">
      <h4>Caged Zombies <button on:click={czinfo = ! czinfo} class="{czinfo ? 'active' : ''}">Info</button></h4>
      <div class="clear cages">
        <h4>You currently have {model.zombiesInCages} / {model.zombieCages} zombies caged</h4>
        <p ng-show="czinfo">You can release them to fight again, or sacrifice them to gain {model.cagedZombieSacrificeValue().blood|whole} blood, {model.cagedZombieSacrificeValue().brains} brains, and {model.cagedZombieSacrificeValue().bones} bones</p>
        <button on:click={model.releaseCagedZombies()} ng-disabled="model.zombiesInCages == 0 || model.currentState != model.states.playingLevel">Release</button>
        <button on:click={model.persistentData.autoRelease = !model.persistentData.autoRelease} class="{model.persistentData.autoRelease ? 'active' : ''}">Auto Release</button>
        <button on:click={model.sacrificeCagedZombies()} ng-disabled="model.zombiesInCages == 0">Sacrifice</button>
      </div>
    </div>
    <div class="bone-collectors bones" ng-if="model.constructions.aviary">
      <h4>Harpies <button on:click={hpinfo = ! hpinfo} class="{hpinfo ? 'active' : ''}">Info</button></h4>
      <p ng-show="hpinfo">Release harpies that drop barrels of plague infected zombie flesh on unsuspecting humans. Each harpy consumes 1 energy per second. Harpy bombs infect humans with plague and cause {model.zombieHealth * 0.2|whole} damage. The damage scales with zombie health.</p>
      <h4>Energy rate {model.getEnergyRate()|decimal} per second</h4>
      <button on:click={setHarpies(model.persistentData.harpies - 1)}>-</button><label>{model.persistentData.harpies|whole} harpies</label><button on:click={setHarpies(model.persistentData.harpies + 1);}>+</button>
    </div>
    <!-- <div class="bone-collectors bones" ng-if="model.gigazombies">
      <h4>Gigazombies <button on:click={gzinfo = ! gzinfo} class="{gzinfo ? 'active' : ''}">Info</button></h4>
      <p ng-show="gzinfo">Causes any zombie spawned using energy to be a Gigazombie. This will increase their health and damage by 10x, and energy cost by 5x.</p>
      <h4>Energy cost per zombie {model.zombieCost}</h4>
      <button on:click={model.toggleGigazombies();} class="{model.persistentData.gigazombiesOn ? 'active' : ''}">{model.persistentData.gigazombiesOn ? 'Gigazombies On' : 'Gigazombies Off'}</button>
    </div> -->
  </div>
  <p ng-if="graveyardTab == 'trophies'">Earn bonuses by collecting the severed heads of VIPs from certain towns. These trophies persist through prestige resets, while escaped VIPs will return to town.</p>
  <div class="tabs" ng-if="graveyardTab == 'trophies'">
    <button on:click={trophyTabSelect('all')} class="{trophyTab == 'all' ? 'active' : ''}">All</button>
    <button on:click={trophyTabSelect('collected')} class="{trophyTab == 'collected' ? 'active' : ''}">Collected</button>
    <button on:click={trophyTabSelect('uncollected')} class="{trophyTab == 'uncollected' ? 'active' : ''}">Uncollected</button>
    <button on:click={trophyTabSelect('totals')} class="{trophyTab == 'totals' ? 'active' : ''}">Stat Totals</button>
  </div>
  <div class="upgrades" ng-if="graveyardTab == 'trophies'">
    <div ng-repeat="trophy in trophies" class="upgrade bones {trophy.owned ? 'owned' : 'uncollected'}">
      <label ng-if="trophyTab != 'totals'">Level: {trophy.level}<span ng-if="trophy.escaped" class="escaped">VIP Escaped</span></label>
      <label>{upgradeSubtitle(trophy)}</label>
    </div>
  </div>
</div>
