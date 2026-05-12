{#if levelSelect.shown}
  <div class="level-select scroll">
    <label>Level Select</label>
    <p>You can go directly to any level previously completed, but only after the preceding boss level has been beaten.</p>
    <div class="ranges">
      {#each levelSelect.levelRanges as range}
        <button
          class={levelSelect.start == range ? 'active' : null}
          onclick={() => levelSelect.selectRange(range)}
        >
          Levels {range} to {range + levelSelect.levelsPerPage - 1}
        </button>
      {/each}
    </div>
    <div class="levels">
      {#each levelSelect.levels as level}
        <button
          onclick={levelSelect.select(level)}
          class={[
            level.trophy && 'trophy',
            level.completed && 'completed',
            level.bossStage && 'boss',
            levelSelect.level.level == level.level && 'active'
          ]}
          disabled={level.locked}>{level.level}</button
        >
      {/each}
    </div>
    <div class="clear start">
      {#if levelSelect.level.completed}
        <label>Level {levelSelect.level.level} already completed. No prestige points will be rewarded.</label>
      {:else}
        <label>Level {levelSelect.level.level} has yet to be completed. {levelSelect.level.level} prestige points are available.</label>
      {/if}
      {#if levelSelect.level.bossStage}
        <label
          >Warning: Level {levelSelect.level.level} is a boss level. On boss levels your graveyard can be attacked. The health of your graveyard
          is increased by upgrading your zombie health.</label
        >
      {/if}
      {#if levelSelect.level.trophy}
        <label>A trophy is available on this level.</label>
      {/if}
      {#if levelSelect.level}
        <button
          onclick={levelSelect.startLevel()}
          class="clear">Start Level {levelSelect.level.level}</button
        >
      {/if}
      <button
        onclick={levelSelect.show()}
        class="clear">Cancel</button
      >
    </div>
  </div>
{/if}
