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
			<td>{model.stats.zombie.count | whole}</td>
			<th>Civilians</th>
			<td>{model.stats.human.count | whole}</td>
			<th ng-if="model.stats.police.show">Police</th>
			<td ng-if="model.stats.police.show">{model.stats.police.count | whole}</td>
			<th ng-if="model.stats.army.show">Army</th>
			<td ng-if="model.stats.army.show">{model.stats.army.count | whole}</td>
		</tr>
		<tr>
			<th>Health</th>
			<td
				colspan="2"
				ng-if="model.stats.skeleton.show">{model.stats.skeleton.health | whole}</td
			>
			<td colspan="2">{model.stats.zombie.health | whole}</td>
			<td colspan="2">{model.stats.human.health | whole}</td>
			<td
				colspan="2"
				ng-if="model.stats.police.show">{model.stats.police.health | whole}</td
			>
			<td
				colspan="2"
				ng-if="model.stats.army.show">{model.stats.army.health | whole}</td
			>
		</tr>
		<tr>
			<th>Damage</th>
			<td
				colspan="2"
				ng-if="model.stats.skeleton.show">{model.stats.skeleton.damage | whole}</td
			>
			<td colspan="2">{model.stats.zombie.damage | whole}</td>
			<td colspan="2">{model.stats.human.damage | whole}</td>
			<td
				colspan="2"
				ng-if="model.stats.police.show">{model.stats.police.damage | whole}</td
			>
			<td
				colspan="2"
				ng-if="model.stats.army.show">{model.stats.army.damage | whole}</td
			>
		</tr>
		<tr>
			<th>Speed</th>
			<td
				colspan="2"
				ng-if="model.stats.skeleton.show">{model.stats.skeleton.speed | whole}</td
			>
			<td colspan="2">{model.stats.zombie.speed | whole}</td>
			<td colspan="2">{model.stats.human.speed | whole}</td>
			<td
				colspan="2"
				ng-if="model.stats.police.show">{model.stats.police.speed | whole}</td
			>
			<td
				colspan="2"
				ng-if="model.stats.army.show">{model.stats.army.speed | whole}</td
			>
		</tr>
	</table>
</div>
