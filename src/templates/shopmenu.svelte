{#if sidePanels.shop}
  <div class="shop">
    <div class="shop-title">
      <h2>Shop</h2>
      <button on:click{closeSidePanels()}>Close</button>
    </div>
    <div class="tabs">
      <button
        on:click={filterShop('blood')}
        class="blood"
        class:active={currentShopFilter === 'blood'}
      >
        Blood
      </button>
      <button
        on:click={filterShop('brains')}
        class="brains"
        class:active={currentShopFilter === 'brains'}>Brains</button
      >
      {#if model.constructions.graveyard}
        <button
          on:click={filterShop('bones')}
          class="bones"
          ,
          class:active={currentShopFilter === 'bones'}>Bones</button
        >
      {/if}
      {#if model.constructions.monsterFactory}
        <button
          on:click={filterShop('parts')}
          class="parts"
          ,
          class:active={currentShopFilter === 'parts'}>Parts</button
        >
      {/if}
      <button
        on:click={filterShop('completed')}
        class="bones"
        ,
        class:active={currentShopFilter === 'completed'}>Complete</button
      >
    </div>
    <div class="upgrades">
      {#each upgrades as upgrade}
        <div class="upgrade {upgrade.costType}">
          <h4>{upgrade.name}</h4>
          <h4 class="cost">{whole(upgradePrice(upgrade))} {upgrade.costType}</h4>
          <label>{upgradeSubtitle(upgrade)}</label>
          <button
            on:click={buyUpgrade(upgrade)}
            disabled={upgradeTooExpensive(upgrade)}
            >{upgradeButtonText(upgrade)}
            <span
              class="percent"
              style:width={() => {
                upgradePercent(upgrade).toString(10) + '%';
              }}
            ></span>
          </button>
          <button
            on:click={(upgrade.selected = !upgrade.selected)}
            class="info"
            class:active={upgrade.selected}>i</button
          >
          {#if currentShopFilter != 'completed' && model.autoUpgrades}
            <button
              on:click={(upgrade.auto = !upgrade.auto)}
              class="info"
              class:active={upgrade.auto}
            >
              {upgrade.auto ? 'On' : 'Auto'}</button
            >
          {/if}
          <p hidden={!upgrade.selected}>{upgrade.description}</p>
          <p hidden={!upgrade.selected}>
            Current Rank: {currentRank(upgrade)}{upgrade.cap !== 0 ? ' / ' + upgrade.cap : ''} - {upgradeStatInfo(
              upgrade
            )}
          </p>
        </div>
      {/each}
    </div>
  </div>
{/if}
