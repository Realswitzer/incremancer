<div class="shop" ng-if="sidePanels.construction">
  <div class="shop-title">
    <h2>Unholy Construction</h2>
    <button on:click={closeSidePanels();}>Close</button>
  </div>
  <div class="tabs">
    <button on:click={filterConstruction('available');} class="{currentConstructionFilter == 'available' ? 'active' : ''}">Available</button>
    <button on:click={filterConstruction('completed');} class="{currentConstructionFilter == 'completed' ? 'active' : ''}">Completed</button>
    <button ng-if="model.autoconstructionUnlocked" on:click={model.autoconstruction = !model.autoconstruction} class="{model.autoconstruction ? 'active' : ''}">{model.autoconstruction ? 'Auto On' : 'Auto Off'}</button>
  </div>
  <div class="upgrade current-construction" ng-if="model.persistentData.currentConstruction">
    <h4>Building - {model.persistentData.currentConstruction.name}</h4>
    <p>Consuming 
      <span ng-if="model.persistentData.currentConstruction.costPerTick.energy" class="energy">{model.persistentData.currentConstruction.costPerTick.energy|decimal} energy</span> 
      <span ng-if="model.persistentData.currentConstruction.costPerTick.blood" class="blood">{model.persistentData.currentConstruction.costPerTick.blood|decimal} blood</span>
      <span ng-if="model.persistentData.currentConstruction.costPerTick.brains" class="brains">{model.persistentData.currentConstruction.costPerTick.brains|decimal} brains</span>
      <span ng-if="model.persistentData.currentConstruction.costPerTick.bones" class="bones">{model.persistentData.currentConstruction.costPerTick.bones|decimal} bones</span>
      <span ng-if="model.persistentData.currentConstruction.costPerTick.parts" class="parts">{model.persistentData.currentConstruction.costPerTick.parts|decimal} parts</span>
      each second
    </p>
    <div class="progress {model.persistentData.currentConstruction.state == 'building' ? 'active' : 'stopped'}">
      <div ng-style="{'width':constructionPercent() + '%'}"></div>
      <span>{constructionPercent()}%</span>
    </div>
    <p ng-if="!model.persistentData.currentConstruction.shortfall"><strong>Time Remaining: {model.persistentData.currentConstruction.timeRemaining}</strong></p>
    <p ng-if="model.persistentData.currentConstruction.shortfall">
      <strong>Production stopped, need more
      <span ng-if="model.persistentData.currentConstruction.shortfall.energy" class="energy">energy</span>
      <span ng-if="model.persistentData.currentConstruction.shortfall.blood" class="blood">blood</span>
      <span ng-if="model.persistentData.currentConstruction.shortfall.brains" class="brains">brains</span>
      <span ng-if="model.persistentData.currentConstruction.shortfall.bones" class="bones">bones</span>
      <span ng-if="model.persistentData.currentConstruction.shortfall.parts" class="parts">parts</span>
      </strong>
    </p>
    <button on:click={playPauseConstruction();}>{model.persistentData.currentConstruction.state == 'paused' ? 'Resume' : 'Pause'}</button>
    <button on:click={cancelConstruction();}>Cancel</button>
  </div>
  <div class="upgrades">
    <div ng-repeat="upgrade in upgrades" class="upgrade">
      <h4>{upgrade.name}</h4>
      <p>{upgrade.description}</p>
      <label ng-if="currentRankConstruction(upgrade) < upgrade.cap">Time to build: {upgrade.time} seconds</label>
      <div ng-if="currentRankConstruction(upgrade) < upgrade.cap">
        <label>Total Cost: </label>
        <label ng-if="upgrade.costs.energy" class="energy">{upgrade.costs.energy|whole} energy ({upgrade.costs.energy/upgrade.time|whole} per sec)</label>
        <label ng-if="upgrade.costs.blood" class="blood">{upgrade.costs.blood|whole} blood ({upgrade.costs.blood/upgrade.time|whole} per sec)</label>
        <label ng-if="upgrade.costs.brains" class="brains">{upgrade.costs.brains|whole} brains ({upgrade.costs.brains/upgrade.time|whole} per sec)</label>
        <label ng-if="upgrade.costs.bones" class="bones">{upgrade.costs.bones|whole} bones ({upgrade.costs.bones/upgrade.time|whole} per sec)</label>
        <label ng-if="upgrade.costs.parts" class="parts">{upgrade.costs.parts|whole} parts ({upgrade.costs.parts/upgrade.time|whole} per sec)</label>
      </div>
      <label ng-if="constructionLeadsTo(upgrade)">Required for: {constructionLeadsTo(upgrade)}</label>
      <p ng-if="currentRankConstruction(upgrade) < upgrade.cap">Current Rank: {currentRankConstruction(upgrade)} / {upgrade.cap}</p>
      <button on:click={startConstruction(upgrade)} ng-disabled="model.persistentData.currentConstruction} ng-if="currentRankConstruction(upgrade) < upgrade.cap">Begin Construction</button>
    </div>
  </div>
</div>