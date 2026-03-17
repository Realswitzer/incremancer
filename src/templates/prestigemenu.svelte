<div class="shop" ng-if="sidePanels.prestige">
  <div class="shop-title">
    <h2>Prestige Menu</h2>
    <button on:click={closeSidePanels()}>Close</button>
  </div>
  <h3>Prestige now to unlock {model.persistentData.prestigePointsEarned|whole} prestige points</h3>
  <p class="prestige-info">This will reset your game progress but grant you powerful prestige points to spend.</p>
  <button on:click={doPrestige();} ng-disabled="model.persistentData.prestigePointsEarned <= 0">Prestige Now</button>
  <p class="prestige-info">You currently have <strong>{model.persistentData.prestigePointsToSpend|whole}</strong> prestige points to spend</p>
  <div class="upgrades">
    <div ng-repeat="upgrade in upgrades" class="upgrade bones">
      <h4>{upgrade.name}</h4>
      <h4 class="cost">Cost: {upgradePrice(upgrade)|whole} Points</h4>
      <label>{upgradeSubtitle(upgrade)}</label>
      <button on:click={buyUpgrade(upgrade);} ng-disabled="upgradeTooExpensive(upgrade)}>
        {upgrade.cap != 0 && currentRank(upgrade) >= upgrade.cap ? 'Sold Out' : upgradeTooExpensive(upgrade) ? requiredForUpgrade(upgrade) : purchaseText(upgrade)}
        <span class="percent" ng-style="{'width':upgradePercent(upgrade) + '%'}"></span>
      </button>
      <button on:click={upgrade.selected = !upgrade.selected} class="info  {upgrade.selected ? 'active' : ''}">Info</button>
      <p ng-show="upgrade.selected">{upgrade.description}</p>
      <p ng-show="upgrade.selected">Current Rank: {currentRank(upgrade)}{upgrade.cap != 0 ? ' / ' + upgrade.cap : ''} - {upgradeStatInfo(upgrade)}</p>
    </div>
  </div>
</div>