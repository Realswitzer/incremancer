{#if sidePanels.prestige}
  <div class="shop">
    <div class="shop-title">
      <h2>Prestige Menu</h2>
      <button on:click={closeSidePanels()}>Close</button>
    </div>
    <h3>Prestige now to unlock {whole(model.persistentData.prestigePointsEarned)} prestige points</h3>
    <p class="prestige-info">This will reset your game progress but grant you powerful prestige points to spend.</p>
    <button
      on:click={doPrestige()}
      disabled={model.persistentData.prestigePointsEarned <= 0}>Prestige Now</button
    >
    <p class="prestige-info">
      You currently have <strong>{whole(model.persistentData.prestigePointsToSpend)}</strong> prestige points to spend
    </p>
    <div class="upgrades">
      {#each upgrades as upgrade}
        <div class="upgrade bones">
          <h4>{upgrade.name}</h4>
          <h4 class="cost">Cost: {whole(upgradePrice(upgrade))} Points</h4>
          <label>{upgradeSubtitle(upgrade)}</label>
          <button
            on:click={buyUpgrade(upgrade)}
            disabled={upgradeTooExpensive(upgrade)}
          >
            {upgrade.cap != 0 && currentRank(upgrade) >= upgrade.cap
              ? 'Sold Out'
              : upgradeTooExpensive(upgrade)
                ? requiredForUpgrade(upgrade)
                : purchaseText(upgrade)}
            <span
              class="percent"
              style:width={() => {
                upgradePercent(upgrade) + '%';
              }}
            ></span>
          </button>
          <button
            on:click={(upgrade.selected = !upgrade.selected)}
            class="info"
            class:active={upgrade.selected}>Info</button
          >
          <p hidden={!upgrade.selected}>{upgrade.description}</p>
          <p hidden={!upgrade.selected}>
            Current Rank: {currentRank(upgrade)}{upgrade.cap != 0 ? ' / ' + upgrade.cap : ''} - {upgradeStatInfo(upgrade)}
          </p>
        </div>
      {/each}
    </div>
  </div>
{/if}
