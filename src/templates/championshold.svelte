{#if skeletonMenu.isShown}
  <div
    class="level-select"
    id="champ-hold"
  >
    <div class="shop-title">
      <h2>Skeleton Champion</h2>
      <button on:click={skeletonMenu.show()}>Close</button>
      <div style="clear: both;"></div>
    </div>
    {#if skeleton().skeletons == 0}
      <div class="ranges">
        <p>The Skeleton Champion respects your strength and is willing to join you.</p>
        <p>
          <em>Give me those trophies of yours as tribute and I will fight for you to scour the humans from this world!</em>
        </p>
        <button on:click={skeletonMenu.acceptOffer()}>Accept the offer</button>
        <button on:click={skeletonMenu.show()}>Reject the offer</button>
      </div>
    {/if}
    {#if skeletonMenu.anotherOffer()}
      <div class="ranges">
        <p>The Skeleton Champion has another offer for you.</p>
        <p><em>Give me some more of those trophies and I'll work twice as hard, I promise!</em></p>
        <button on:click={skeletonMenu.acceptOffer()}>Accept the offer</button>
        <button on:click={skeletonMenu.show()}>Reject the offer</button>
      </div>
    {/if}
    {#if skeleton().skeletons > 0}
      <div>
        <div class="inventory">
          <div class="equipped">
            {#each skeletonMenu.equipped as itemRow}
              <div class="row">
                {#each itemRow as item, i (item.id)}
                  <div
                    class="item {skeletonMenu.itemClass(item)} {skeletonMenu.itemType(item)} droppable"
                    onmousemove={moveToolTip(event, this)}
                    droppable-target="true"
                    dropType={item.s}
                    dropEndCall="skeletonMenu.itemDropped"
                    on:click={item.s != -1 || skeletonMenu.trashAll()}
                  >
                    <div class="icon"></div>
                    <div class="tooltip">
                      <span class="name">{skeletonMenu.itemName(item)}</span>
                      {#if item.id > -1 || item.s === -1}
                        <span class="desc">{skeletonMenu.itemSubName(item)}</span>
                      {/if}
                      {#if item.id > -1}
                        {#each skeletonMenu.itemStats(item) as stat}
                          <span class="stat">{stat}</span>
                        {/each}
                        {#each skeletonMenu.itemEffects(item) as stat}
                          <span class="effect">{stat}</span>
                        {/each}
                        <span class="xp">Can be destroyed for {whole(item.l * item.r * 10)} xp</span>
                      {/if}
                    </div>
                    {#if item.l}
                      <div class="level">
                        {item.l}
                      </div>
                    {/if}
                  </div>
                {/each}
              </div>
            {/each}
          </div>
          <div class="items">
            {#each skeletonMenu.inventoryItems() as item, i (item.id)}
              <div
                class="item {skeletonMenu.itemClass(item)} {skeletonMenu.itemType(item)}"
                use:draggable={item.id}
                on:mousemove={(e) => moveToolTip(e, e.currentTarget)}
                on:click={() => skeletonMenu.equipItem(item)}
              >
                <div class="icon"></div>
                {#if item.l}
                  <div class="level">
                    {item.l}
                  </div>
                {/if}
                <div class="tooltip">
                  <span class="name">{skeletonMenu.itemName(item)}</span>
                  <span class="desc">{skeletonMenu.itemSubName(item)}</span>
                  {#each skeletonMenu.itemStats(item) as stat}
                    <span class="stat">{stat}</span>
                  {/each}
                  {#each skeletonMenu.itemEffects(item) as stat}
                    <span class="effect">{stat}</span>
                  {/each}
                  <span class="xp">Can be destroyed for {whole(item.l * item.r * 10)} xp</span>
                </div>
              </div>
            {/each}
          </div>
        </div>
        <p>
          Level: {skeleton().level} - {whole(skeleton().xp)} / {whole(skeletonMenu.xpForNextLevel())} xp ({skeletonMenu.xpRate()}% xp rate)<br
          />Earn xp by killing humans while the Champion is alive, higher level humans reward more xp
        </p>
        <p>
          Increases zombie health and damage by {skeleton().level}%, all resource generation by {skeleton().level}%,<br />and receive {skeleton()
            .level} prestige points when the Skeleton Champion lands a killing blow. (20 second cooldown)
        </p>
      </div>
    {/if}
  </div>
{/if}
