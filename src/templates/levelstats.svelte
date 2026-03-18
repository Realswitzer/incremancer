{#if model.stats && showStats}
  <div class="level-stats {model.persistentData.zoomButtons ? 'zoom' : ''}">
    <table>
      <tr>
        <td></td>
        {#if model.stats.skeleton.show}
          <th>Skeleton</th>
          <td></td>
        {/if}
        <th>Zombies</th>
        <td>{whole(model.stats.zombie.count)}</td>
        <th>Civilians</th>
        <td>{whole(model.stats.human.count)}</td>
        {#if model.stats.police.show}
          <th>Police</th>
          <td>{whole(model.stats.police.count)}</td>
        {/if}
        {#if model.stats.army.show}
          <th>Army</th>
          <td>{whole(model.stats.army.count)}</td>
        {/if}
      </tr>
      <tr>
        <th>Health</th>
        {#if model.stats.skeleton.show}
          <td colspan="2">{whole(model.stats.skeleton.health)}</td>
        {/if}
        <td colspan="2">{whole(model.stats.zombie.health)}</td>
        <td colspan="2">{whole(model.stats.human.health)}</td>
        {#if model.stats.police.show}
          <td colspan="2">{whole(model.stats.police.health)}</td>
        {/if}
        {#if model.stats.army.show}
          <td colspan="2">{whole(model.stats.army.health)}</td>
        {/if}
      </tr>
      <tr>
        <th>Damage</th>
        {#if model.stats.skeleton.show}
          <td colspan="2">{whole(model.stats.skeleton.damage)}</td>
        {/if}
        <td colspan="2">{whole(model.stats.zombie.damage)}</td>
        <td colspan="2">{whole(model.stats.human.damage)}</td>
        {#if model.stats.police.show}
          <td colspan="2">{whole(model.stats.police.damage)}</td>
        {/if}
        {#if model.stats.army.show}
          <td colspan="2">{whole(model.stats.army.damage)}</td>
        {/if}
      </tr>
      <tr>
        <th>Speed</th>
        {#if model.stats.skeleton.show}
          <td colspan="2">{whole(model.stats.skeleton.speed)}</td>
        {/if}
        <td colspan="2">{whole(model.stats.zombie.speed)}</td>
        <td colspan="2">{whole(model.stats.human.speed)}</td>
        {#if model.stats.police.show}
          <td colspan="2">{whole(model.stats.police.speed)}</td>
        {/if}
        {#if model.stats.army.show}
          <td colspan="2">{whole(model.stats.army.speed)}</td>
        {/if}
      </tr>
    </table>
  </div>
{/if}
