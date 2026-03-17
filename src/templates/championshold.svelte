
<div class="level-select" ng-if="skeletonMenu.isShown" id="champ-hold">
  <div class="shop-title">
    <h2>Skeleton Champion</h2>
    <button on:click={skeletonMenu.show()}>Close</button>
    <div style="clear: both;"></div>
  </div>
  <div ng-if="skeleton().skeletons == 0" class="ranges">
    <p>The Skeleton Champion respects your strength and is willing to join you.</p>
    <p><em>Give me those trophies of yours as tribute and I will fight for you to scour the humans from this world!</em></p>
    <button on:click={skeletonMenu.acceptOffer()}>Accept the offer</button>
    <button on:click={skeletonMenu.show()}>Reject the offer</button>
  </div>
  <div ng-if="skeletonMenu.anotherOffer()" class="ranges">
    <p>The Skeleton Champion has another offer for you.</p>
    <p><em>Give me some more of those trophies and I'll work twice as hard, I promise!</em></p>
    <button on:click={skeletonMenu.acceptOffer()}>Accept the offer</button>
    <button on:click={skeletonMenu.show()}>Reject the offer</button>
  </div>
  <div ng-if="skeleton().skeletons > 0">
    <div class="inventory">
      <div class="equipped">
        <div class="row" ng-repeat="itemRow in skeletonMenu.equipped track by $index">
          <div class="item {{skeletonMenu.itemClass(item)}} {{skeletonMenu.itemType(item)}} droppable" ng-repeat="item in itemRow track by item.id" onmousemove="moveToolTip(event, this);" 
            droppable-target="true" dropType="{{item.s}}" dropEndCall="skeletonMenu.itemDropped" on:click={item.s != -1 || skeletonMenu.trashAll()}>
            <div class="icon"></div>
              <div class="tooltip">
                <span class="name">{{skeletonMenu.itemName(item)}}</span>
                <span class="desc" ng-if="item.id > -1 || item.s == -1">{{skeletonMenu.itemSubName(item)}}</span>
                <span class="stat" ng-if="item.id > -1" ng-repeat="stat in skeletonMenu.itemStats(item)">{{stat}}</span>
                <span class="effect" ng-if="item.id > -1" ng-repeat="stat in skeletonMenu.itemEffects(item)">{{stat}}</span>
                <span class="xp" ng-if="item.id > -1">Can be destroyed for {{item.l * item.r * 10|whole}} xp</span>
              </div>
            <div class="level" ng-if="item.l">{{item.l}}</div>
          </div>
        </div>
      </div>
      <div class="items">
        <div class="item {{skeletonMenu.itemClass(item)}} {{skeletonMenu.itemType(item)}}" ng-repeat="item in skeletonMenu.inventoryItems() track by item.id" onmousemove="moveToolTip(event, this);" 
          draggable-item="true" drag-object="item" on:click={skeletonMenu.equipItem(item)}>
          <div class="icon"></div>
          <div class="level" ng-if="item.l">{{item.l}}</div>
            <div class="tooltip">
              <span class="name">{{skeletonMenu.itemName(item)}}</span>
              <span class="desc">{{skeletonMenu.itemSubName(item)}}</span>
              <span class="stat" ng-repeat="stat in skeletonMenu.itemStats(item)">{{stat}}</span>
              <span class="effect" ng-repeat="stat in skeletonMenu.itemEffects(item)">{{stat}}</span>
              <span class="xp">Can be destroyed for {{item.l * item.r * 10|whole}} xp</span>
            </div>
        </div>
      </div>
    </div>
    <p>Level: {{skeleton().level}} - {{skeleton().xp|whole}} / {{skeletonMenu.xpForNextLevel()|whole}} xp ({{skeletonMenu.xpRate()}}% xp rate)<br/>Earn xp by killing humans while the Champion is alive, higher level humans reward more xp</p>
    <p>Increases zombie health and damage by {{skeleton().level}}%, all resource generation by {{skeleton().level}}%,<br/>and receive {{skeleton().level}} prestige points when the Skeleton Champion lands a killing blow. (20 second cooldown)</p>
  </div>
</div>