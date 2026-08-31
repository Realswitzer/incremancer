# items reference

<!--incremancer/docs/modding/reference/items.md-->

All information comes from `skeleton.ts` (DM)

Requests for update or extra information in the table can be put in the issues.

Last updated: August 31, 2026

Contents

- [lootPositions](#lootpositions)
- [rarity](#rarity)
- [prefixes](#prefixes)
  - [Common](#common)
  - [Rare](#rare)
  - [Epic](#epic)
  - [Legendary](#legendary)
  - [Ancient (CM)](#ancient-cm)
  - [Divine (CM)](#divine-cm)
  - [Chaos (DM)](#chaos-dm)
- [stats](#stats)

## lootPositions

`Skeleton.lootPositions`

| ID  | Name   |
| --- | ------ |
| 1   | Helmet |
| 2   | Chest  |
| 3   | Legs   |
| 4   | Gloves |
| 5   | Boots  |
| 6   | Sword  |
| 7   | Shield |

## rarity

`Skeleton.rarity`

Rarity determines the amount of effects, and in DM, sometimes determines stat generation. For more information, see [stats](#stats).

| ID  | Rarity (Mod) |
| --- | ------------ |
| 1   | Common       |
| 2   | Rare         |
| 3   | Epic         |
| 4   | Legendary    |
| 5   | Ancient (CM) |
| 6   | Divine (CM)  |
| 7   | Chaos (DM)   |

## prefixes

`Skeleton.prefixes`

### Common

`Skeleton.prefixes.commonQuality`

| Index | Prefix   |
| ----- | -------- |
| 0     | Wooden   |
| 1     | Sturdy   |
| 2     | Rigid    |
| 3     | Iron     |
| 4     | Rusty    |
| 5     | Flimsy   |
| 6     | Battered |
| 7     | Damaged  |
| 8     | Used     |
| 9     | Stained  |
| 10    | Training |

### Rare

`Skeleton.prefixes.rareQuality`

| Index | Prefix     |
| ----- | ---------- |
| 0     | Steel      |
| 1     | Shiny      |
| 2     | Polished   |
| 3     | Forged     |
| 4     | Plated     |
| 5     | Bronze     |
| 6     | Reinforced |
| 7     | Veteran's  |
| 8     | Reliable   |

### Epic

`Skeleton.prefixes.epicQuality`

| Index | Prefix        |
| ----- | ------------- |
| 0     | Antique       |
| 1     | Ancient       |
| 2     | Famous        |
| 3     | Bejeweled     |
| 4     | Notorious     |
| 5     | Historic      |
| 6     | Mythical      |
| 7     | Extraordinary |

### Legendary

`Skeleton.prefixes.legendaryQuality`

| Index | Prefix     |
| ----- | ---------- |
| 0     | Monstrous  |
| 1     | Diabolical |
| 2     | Withering  |
| 3     | Terrible   |
| 4     | Demoniacal |

### Ancient (CM)

`Skeleton.prefixes.ancientQuality`

| Index | Prefix    |
| ----- | --------- |
| 0     | Grim      |
| 1     | Miserable |
| 2     | Luxurious |

### Divine (CM)

`Skeleton.prefixes.divineQuality`

| Index | Prefix |
| ----- | ------ |
| 0     | Divine |

### Chaos (DM)

`Skeleton.prefixes.chaosQuality`

| Index | Prefix    |
| ----- | --------- |
| 0     | Chaotic   |
| 1     | Corrupted |
| 2     | Fractured |
| 3     | Twisted   |

## Stats

`Skeleton.stats`

For most rarities, stat generation involves picking `zombieHealth` or `zombieDamage`, then picking (without duplicates) stats until `r`, where `r` represents the item's rarity.

In DM, Chaos armor uses a different logic branch that will pick 5 stats, including duplicates.

| Key             | ID  | Scaling | Scales by level? |
| --------------- | --- | ------- | ---------------- |
| respawnTime     | 1   | 1       | No               |
| speed           | 2   | 1       | No               |
| zombieHealth    | 3   | 24      | Yes              |
| zombieDamage    | 4   | 3       | Yes              |
| zombieSpeed     | 5   | 1       | No               |
| harpySpeed (DM) | 6   | 1       | No               |
