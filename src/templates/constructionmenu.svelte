{#if sidePanels.construction}
  <div class="shop">
    <div class="shop-title">
      <h2>Unholy Construction</h2>
      <button onclick={closeSidePanels()}>Close</button>
    </div>
    <div class="tabs">
      <button
        onclick={filterConstruction('available')}
        class:active={currentConstructionFilter === 'available'}>Available</button
      >
      <button
        onclick={filterConstruction('completed')}
        class:active={currentConstructionFilter === 'completed'}>Completed</button
      >
      {#if model.autoconstructionUnlocked}
        <button
          onclick={(model.autoconstruction = !model.autoconstruction)}
          class:active={model.autoconstruction}>{model.autoconstruction ? 'Auto On' : 'Auto Off'}</button
        >
      {/if}
    </div>
    {#if model.persistentData.currentConstruction}
      <div class="upgrade current-construction">
        <h4>Building - {model.persistentData.currentConstruction.name}</h4>
        <p>
          Consuming
          {#if model.persistentData.currentConstruction.costPerTick.energy}
            <span class="energy">{decimal(model.persistentData.currentConstruction.costPerTick.energy)} energy</span>
          {/if}
          {#if model.persistentData.currentConstruction.costPerTick.blood}
            <span class="blood">{decimal(model.persistentData.currentConstruction.costPerTick.blood)} blood</span>
          {/if}
          {#if model.persistentData.currentConstruction.costPerTick.brains}
            <span class="brains">{decimal(model.persistentData.currentConstruction.costPerTick.brains)} brains</span>
          {/if}
          {#if model.persistentData.currentConstruction.costPerTick.bones}
            <span class="bones">{decimal(model.persistentData.currentConstruction.costPerTick.bones)} bones</span>
          {/if}
          {#if model.persistentData.currentConstruction.costPerTick.parts}
            <span class="parts">{decimal(model.persistentData.currentConstruction.costPerTick.parts)} parts</span>{/if}
          each second
        </p>
        <div class="progress {model.persistentData.currentConstruction.state == 'building' ? 'active' : 'stopped'}">
          <div
            style:width={() => {
              constructionPercent() + '%';
            }}
          ></div>
          <span>{constructionPercent()}%</span>
        </div>
        {#if !model.persistentData.currentConstruction.shortfall}
          <p>
            <strong>Time Remaining: {model.persistentData.currentConstruction.timeRemaining}</strong>
          </p>
        {/if}
        {#if model.persistentData.currentConstruction.shortfall}
          <p>
            <strong
              >Production stopped, need more
              {#if model.persistentData.currentConstruction.shortfall.energy}<span class="energy">energy</span>{/if}
              {#if model.persistentData.currentConstruction.shortfall.blood}
                <span class="blood">blood</span>
              {/if}
              {#if model.persistentData.currentConstruction.shortfall.brains}
                <span class="brains">brains</span>
              {/if}
              {#if model.persistentData.currentConstruction.shortfall.bones}
                <span class="bones">bones</span>
              {/if}
              {#if model.persistentData.currentConstruction.shortfall.parts}
                <span class="parts">parts</span>
              {/if}
            </strong>
          </p>
        {/if}
        <button onclick={playPauseConstruction()}>{model.persistentData.currentConstruction.state == 'paused' ? 'Resume' : 'Pause'}</button>
        <button onclick={cancelConstruction()}>Cancel</button>
      </div>
    {/if}
    <div class="upgrades">
      {#each upgrades as upgrade}
        <div class="upgrade">
          <h4>{upgrade.name}</h4>
          <p>{upgrade.description}</p>
          {#if currentRankConstruction(upgrade) < upgrade.cap}
            <label>Time to build: {upgrade.time} seconds</label>
          {/if}
          {#if currentRankConstruction(upgrade) < upgrade.cap}
            <div>
              <label>Total Cost: </label>
              {#if upgrade.costs.energy}
                <label class="energy">{whole(upgrade.costs.energy)} energy ({whole(upgrade.costs.energy / upgrade.time)} per sec)</label>
              {/if}
              {#if upgrade.costs.blood}
                <label class="blood">{whole(upgrade.costs.blood)} blood ({whole(upgrade.costs.blood / upgrade.time)} per sec)</label>
              {/if}
              {#if upgrade.costs.brains}
                <label class="brains">{whole(upgrade.costs.brains)} brains ({whole(upgrade.costs.brains / upgrade.time)} per sec)</label>
              {/if}
              {#if upgrade.costs.bones}
                <label class="bones">{whole(upgrade.costs.bones)} bones ({whole(upgrade.costs.bones / upgrade.time)} per sec)</label>
              {/if}
              {#if upgrade.costs.parts}
                <label class="parts">{whole(upgrade.costs.parts)} parts ({whole(upgrade.costs.parts / upgrade.time)} per sec)</label>
              {/if}
            </div>
          {/if}
          {#if constructionLeadsTo(upgrade)}
            <label>Required for: {constructionLeadsTo(upgrade)}</label>
          {/if}
          {#if currentRankConstruction(upgrade) < upgrade.cap}
            <p>
              Current Rank: {currentRankConstruction(upgrade)} / {upgrade.cap}
            </p>
            <button
              onclick={startConstruction(upgrade)}
              disabled={model.persistentData.currentConstruction}>Begin Construction</button
            >
          {/if}
        </div>
      {/each}
    </div>
  </div>
{/if}
