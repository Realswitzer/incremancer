<div
  class="level-stats {model.persistentData.zoomButtons ? 'zoom' : ''}"
  ng-if="model.stats && showStats"
>
  <table>
    <tr>
      <td></td>
      <th ng-if="model.stats.skeleton.show">Skeleton</th>
      <td ng-if="model.stats.skeleton.show"></td>
      <th>Zombies</th>
      <td>{whole(model.stats.zombie.count)}</td>
      <th>Civilians</th>
      <td>{whole(model.stats.human.count)}</td>
      <th ng-if="model.stats.police.show">Police</th>
      <td ng-if="model.stats.police.show">{whole(model.stats.police.count)}</td>
      <th ng-if="model.stats.army.show">Army</th>
      <td ng-if="model.stats.army.show">{whole(model.stats.army.count)}</td>
    </tr>
    <tr>
      <th>Health</th>
      <td
        colspan="2"
        ng-if="model.stats.skeleton.show">{whole(model.stats.skeleton.health)}</td
      >
      <td colspan="2">{whole(model.stats.zombie.health)}</td>
      <td colspan="2">{whole(model.stats.human.health)}</td>
      <td
        colspan="2"
        ng-if="model.stats.police.show">{whole(model.stats.police.health)}</td
      >
      <td
        colspan="2"
        ng-if="model.stats.army.show">{whole(model.stats.army.health)}</td
      >
    </tr>
    <tr>
      <th>Damage</th>
      <td
        colspan="2"
        ng-if="model.stats.skeleton.show">{whole(model.stats.skeleton.damage)}</td
      >
      <td colspan="2">{whole(model.stats.zombie.damage)}</td>
      <td colspan="2">{whole(model.stats.human.damage)}</td>
      <td
        colspan="2"
        ng-if="model.stats.police.show">{whole(model.stats.police.damage)}</td
      >
      <td
        colspan="2"
        ng-if="model.stats.army.show">{whole(model.stats.army.damage)}</td
      >
    </tr>
    <tr>
      <th>Speed</th>
      <td
        colspan="2"
        ng-if="model.stats.skeleton.show">{whole(model.stats.skeleton.speed)}</td
      >
      <td colspan="2">{whole(model.stats.zombie.speed)}</td>
      <td colspan="2">{whole(model.stats.human.speed)}</td>
      <td
        colspan="2"
        ng-if="model.stats.police.show">{whole(model.stats.police.speed)}</td
      >
      <td
        colspan="2"
        ng-if="model.stats.army.show">{whole(model.stats.army.speed)}</td
      >
    </tr>
  </table>
</div>
