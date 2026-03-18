{#if sidePanels.runesmith}
  <div class="shop">
    <div class="shop-title">
      <h2>Runesmith</h2>
      <button on:click={closeSidePanels()}>Close</button>
    </div>
    <p>
      The runesmith enchants your zombies with magical symbols of life and death. These runes can be infused with resources to increase
      their power.
    </p>
    <div class="tabs">
      <strong>Amount: </strong>
      <button
        on:click={() => {
          infusionAmount = 1000;
          infusionMax = false;
        }}
        class={infusionMax != true && infusionAmount == 1000 ? 'active' : ''}>1K</button
      >
      <button
        on:click={() => {
          infusionAmount = 10000;
          infusionMax = false;
        }}
        class={infusionMax != true && infusionAmount == 10000 ? 'active' : ''}>10K</button
      >
      <button
        on:click={() => {
          infusionAmount = 100000;
          infusionMax = false;
        }}
        class={infusionMax != true && infusionAmount == 100000 ? 'active' : ''}>100K</button
      >
      <button
        on:click={() => {
          infusionAmount = 1000000;
          infusionMax = false;
        }}
        class={infusionMax != true && infusionAmount == 1000000 ? 'active' : ''}>1M</button
      >
      <button
        on:click={() => {
          infusionMax = true;
        }}
        class={infusionMax == true ? 'active' : ''}>Max</button
      >
    </div>
    <div class="upgrades">
      <div class="upgrade">
        <h4>Rune of Life</h4>
        <p>The rune of life increases your zombies defensive capabilities</p>
        <div class="row blood">
          <div class="col">
            <label>Blood: {decimal(model.persistentData.runes.life.blood)}</label>
            <label>{(100 * (1 - model.runeEffects.damageReduction)) | decimal}% Damage Reduction</label>
          </div>
          <div class="col">
            <button
              on:click={infuseRune('life', 'blood')}
              disabled={infusionMax != true && model.persistentData.blood < infusionAmount}>Infuse {infuseButtonText()} Blood</button
            >
          </div>
        </div>
        <div class="row brains">
          <div class="col">
            <label>Brains: {decimal(model.persistentData.runes.life.brains)}</label>
            <label>{100 * decimal(model.runeEffects.healthRegen)}% Health Regen / 5 secs</label>
          </div>
          <div class="col">
            <button
              on:click={infuseRune('life', 'brains')}
              disabled={infusionMax != true && model.persistentData.brains < infusionAmount}>Infuse {infuseButtonText()} Brains</button
            >
          </div>
        </div>
        <div class="row bones">
          <div class="col">
            <label>Bones: {decimal(model.persistentData.runes.life.bones)}</label>
            <label>{100 * decimal(model.runeEffects.damageReflection)}% Damage Reflection</label>
          </div>
          <div class="col">
            <button
              on:click={infuseRune('life', 'bones')}
              disabled={infusionMax != true && model.persistentData.bones < infusionAmount}>Infuse {infuseButtonText()} Bones</button
            >
          </div>
        </div>
        <div class="row blood">
          <div class="col">
            <label>Blood Sated: {shatterPercent(model.persistentData.runes.life)}%</label>
          </div>
          <div class="col">
            <button
              disabled={model.persistentData.blood < shatterBloodCost(model.persistentData.runes.life)}
              on:click={shatterSatiate('life', model.persistentData.runes.life)}
              >Infuse {whole(shatterBloodCost(model.persistentData.runes.life))} Blood</button
            >
          </div>
        </div>
      </div>
      <div class="upgrade">
        <h4>Rune of Death</h4>
        <p>The rune of death increases your zombies offensive capabilities</p>
        <div class="row blood">
          <div class="col">
            <label>Blood: {decimal(model.persistentData.runes.death.blood)}</label>
            <label>{(100 * (1 - model.runeEffects.attackSpeed)) | decimal}% Attack Speed</label>
          </div>
          <div class="col">
            <button
              on:click={infuseRune('death', 'blood')}
              disabled={infusionMax != true && model.persistentData.blood < infusionAmount}>Infuse {infuseButtonText()} Blood</button
            >
          </div>
        </div>
        <div class="row brains">
          <div class="col">
            <label>Brains: {decimal(model.persistentData.runes.death.brains)}</label>
            <label>{100 * decimal(model.runeEffects.critChance)}% Critical Chance</label>
          </div>
          <div class="col">
            <button
              on:click={infuseRune('death', 'brains')}
              disabled={infusionMax != true && model.persistentData.brains < infusionAmount}>Infuse {infuseButtonText()} Brains</button
            >
          </div>
        </div>
        <div class="row bones">
          <div class="col">
            <label>Bones: {decimal(model.persistentData.runes.death.bones)}</label>
            <label>{100 * decimal(model.runeEffects.critDamage)}% Critical Damage</label>
          </div>
          <div class="col">
            <button
              on:click={infuseRune('death', 'bones')}
              disabled={infusionMax != true && model.persistentData.bones < infusionAmount}>Infuse {infuseButtonText()} Bones</button
            >
          </div>
        </div>
        <div class="row blood">
          <div class="col">
            <label>Blood Sated: {shatterPercent(model.persistentData.runes.death)}%</label>
          </div>
          <div class="col">
            <button
              disabled={model.persistentData.blood < shatterBloodCost(model.persistentData.runes.death)}
              on:click={shatterSatiate('death', model.persistentData.runes.death)}
              >Infuse {whole(shatterBloodCost(model.persistentData.runes.death))} Blood</button
            >
          </div>
        </div>
      </div>
      <div class="upgrade">
        <h4>Rune Shatter</h4>
        <p>
          When both runes contain enough blood they can be shattered to increase zombie health and damage by 10%. This also increases zombie
          summoning cost by 1 energy and resets both runes.
        </p>
        <label class="blood">Shatters: {model.persistentData.runeshatter}</label>
        <label class="blood">Effect: {shatterEffect() | decimal}% Health/Damage</label>
        <label class="blood">Zombie Summon Cost: {whole(model.zombieCost)} energy</label>
        <button
          on:click={doShatter()}
          disabled={!canShatter()}>Shatter</button
        >
        <button
          on:click={(model.autoShatter = !model.autoShatter)}
          class={model.autoShatter ? 'active' : ''}>Auto Shatter {model.autoShatter ? 'On' : 'Off'}</button
        >
      </div>
    </div>
  </div>
{/if}
