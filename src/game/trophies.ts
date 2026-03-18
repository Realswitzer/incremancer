import { gameModel } from './gameModel';
import { default as upgrades } from './upgrades';

export interface TrophyStat {
  type: string;
  value: number;
  percentage?: boolean;
}

export class Trophies {
  trophyStats: TrophyStat[] = [
    { type: upgrades.types.health, value: 50 },
    { type: upgrades.types.damage, value: 7 },
    { type: upgrades.types.energyCap, value: 10 },
    { type: upgrades.types.energyRate, value: 0.5 },
    { type: upgrades.types.boneCollectorCapacity, value: 15 },
    { type: upgrades.types.plagueDamage, value: 50 },
    { type: upgrades.types.bloodCap, value: 5000 },
    { type: upgrades.types.brainsRate, value: 2 },
    { type: upgrades.types.zombieHealthPC, value: 0.02, percentage: true },
    { type: upgrades.types.bonesRate, value: 2 },
    { type: upgrades.types.zombieDmgPC, value: 0.02, percentage: true }
  ];

  isPercentage(type: string): boolean {
    const stat = this.trophyStats.find((s) => s.type === type);
    return stat?.percentage === true;
  }

  doesLevelHaveTrophy(level: number): boolean {
    const data = gameModel.persistentData;

    if (data.vipEscaped?.includes(level)) return false;
    if (data.trophies?.includes(level)) return false;

    return level % 5 === 0;
  }

  createTrophy(level: number, owned: boolean, escaped?: boolean) {
    const trophyId = Math.round(level / 5) - 1;
    const multiplier = Math.floor(trophyId / this.trophyStats.length);
    const trophy = this.trophyStats[trophyId % this.trophyStats.length];

    return {
      level,
      type: trophy.type,
      effect: trophy.value * (multiplier + 1),
      rank: 1,
      owned,
      escaped
    };
  }

  trophyAquired(level: number) {
    const data = gameModel.persistentData;

    if (!data.trophies) data.trophies = [];

    if (!data.trophies.includes(level)) {
      data.trophies.push(level);
      data.trophies.sort();
      gameModel.saveData();
      upgrades.applyUpgrades();

      gameModel.sendMessage('The VIP has been killed! - New Trophy Acquired');
    } else {
      gameModel.sendMessage('The VIP has been killed!');
    }
  }

  getTrophyList() {
    const data = gameModel.persistentData;

    if (!data.trophies) data.trophies = [];
    if (!data.vipEscaped) data.vipEscaped = [];

    let max = data.allTimeHighestLevel + 5;

    for (const t of data.trophies) {
      if (t > max) max = t;
    }

    const trophies = [];
    for (let i = 5; i <= max; i += 5) {
      trophies.push(this.createTrophy(i, data.trophies.includes(i), data.vipEscaped.includes(i)));
    }

    return trophies;
  }

  getTrophyTotals() {
    const collected = this.getTrophyList().filter((t) => t.owned);
    const totals: any[] = [];

    for (const t of collected) {
      const existing = totals.find((x) => x.type === t.type);

      if (!existing) {
        totals.push({ ...t });
      } else {
        if (this.isPercentage(t.type)) {
          existing.effect = (existing.effect + 1) * (1 + t.effect) - 1;
        } else {
          existing.effect += t.effect;
        }
      }
    }

    return totals;
  }

  getAquiredTrophyList() {
    const data = gameModel.persistentData;

    if (!data.trophies) data.trophies = [];

    return data.trophies.map((level) => this.createTrophy(level, true));
  }
}
