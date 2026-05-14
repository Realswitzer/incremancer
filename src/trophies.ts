import { GameModel, Upgrades } from "./internal";

export type Trophy = {
  level:number;
  type:string;
  effect:number;
  rank:number;
  owned:boolean;
  escaped:boolean;
}

export class Trophies {

  private static instance : Trophies;

  constructor() {
    if (Trophies.instance)
      return Trophies.instance;
    Trophies.instance = this;
  }

  gameModel = GameModel.getInstance();
  upgrades = new Upgrades();

  trophyStats = [
    {
      type:this.upgrades.types.health,
      value:50, percentage:false
    },
    {
      type:this.upgrades.types.damage,
      value:7, percentage:false
    },
    {
      type:this.upgrades.types.energyCap,
      value:10, percentage:false
    },
    {
      type:this.upgrades.types.energyRate,
      value:0.5, percentage:false
    },
    {
      type:this.upgrades.types.boneCollectorCapacity,
      value:15, percentage:false
    },
    {
      type:this.upgrades.types.plagueDamage,
      value:50, percentage:false
    },
    {
      type:this.upgrades.types.bloodCap,
      value:5000, percentage:false
    },
    {
      type:this.upgrades.types.brainsRate,
      value:2, percentage:false
    },
    {
      type:this.upgrades.types.zombieHealthPC,
      value:0.02,
      percentage:true
    },
    {
      type:this.upgrades.types.bonesRate,
      value:2, percentage:false
    },
    {
      type:this.upgrades.types.zombieDmgPC,
      value:0.02,
      percentage:true
    }
  ]

  isPercentage(type : string) : boolean {
    for (let i = 0; i < this.trophyStats.length; i++) {
      if (this.trophyStats[i].type == type) {
        return this.trophyStats[i].percentage == true;
      }
    }
  }

  doesLevelHaveTrophy(level : number) : boolean {
    if (this.gameModel.persistentData.vipEscaped) {
      if (this.gameModel.persistentData.vipEscaped.indexOf(level) > -1) {
        return false;
      }
    }
    if (this.gameModel.persistentData.trophies) {
      if (this.gameModel.persistentData.trophies.indexOf(level) > -1) {
        return false;
      }
    }
    return level % 5 == 0;
  }

  createTrophy(level : number, owned : boolean, escaped : boolean) : Trophy {
    const trophyId = Math.round(level / 5) - 1;
    const multiplier = Math.floor(trophyId / this.trophyStats.length);
    const trophy = this.trophyStats[trophyId - (multiplier * this.trophyStats.length)];
    return {
      level:level,
      type:trophy.type,
      effect:trophy.value * (multiplier + 1),
      rank:1,
      owned:owned,
      escaped:escaped
    };
  }

  trophyAquired(level : number) : void {
    if (!this.gameModel.persistentData.trophies) {
      this.gameModel.persistentData.trophies = [];
    }
    if (this.gameModel.persistentData.trophies.indexOf(level) == -1) {
      this.gameModel.persistentData.trophies.push(level);
      this.gameModel.persistentData.trophies.sort();
      this.gameModel.saveData();
      this.upgrades.applyUpgrades();
      if (window.kongregate) {
        window.kongregate.stats.submit("trophies", this.gameModel.persistentData.trophies.length);
      }
      this.gameModel.sendMessage("The VIP has been killed! - New Trophy Aquired");
    } else {
      this.gameModel.sendMessage("The VIP has been killed!");
    }
  }

  getTrophyList() : Trophy[] {
    if (!this.gameModel.persistentData.trophies) {
      this.gameModel.persistentData.trophies = [];
    }
    if (!this.gameModel.persistentData.vipEscaped) {
      this.gameModel.persistentData.vipEscaped = [];
    }
    const trophies : Trophy[] = [];
    let maxTrophyToCreate = this.gameModel.persistentData.allTimeHighestLevel + 5;
    for (let i = 0; i < this.gameModel.persistentData.trophies.length; i++) {
      if (this.gameModel.persistentData.trophies[i] > maxTrophyToCreate) {
        maxTrophyToCreate = this.gameModel.persistentData.trophies[i];
      }
    }

    for (let i=5; i <= maxTrophyToCreate; i += 5) {
      trophies.push(this.createTrophy(i, this.gameModel.persistentData.trophies.indexOf(i) > -1, this.gameModel.persistentData.vipEscaped.indexOf(i) > -1));
    }
    return trophies;
  }

  getTrophyTotals() : Trophy[] {
    const trophiesCollected = this.getTrophyList().filter(trophy => trophy.owned);
    const trophies : Trophy[] = [];
    for (let i = 0; i < trophiesCollected.length; i++) {
      if (trophies.filter(trophy => trophy.type == trophiesCollected[i].type).length == 0) {
        trophies.push(trophiesCollected[i]);
      } else {
        if (this.isPercentage(trophiesCollected[i].type)) {
          trophies.filter(trophy => trophy.type == trophiesCollected[i].type)[0].effect = 
            ((trophies.filter(trophy => trophy.type == trophiesCollected[i].type)[0].effect + 1) * (1 + trophiesCollected[i].effect)) - 1;
        } else {
          trophies.filter(trophy => trophy.type == trophiesCollected[i].type)[0].effect += trophiesCollected[i].effect;
        }
        
      }
    }
    return trophies;
  }

  getAquiredTrophyList() : Trophy[] {
    if (!this.gameModel.persistentData.trophies) {
      this.gameModel.persistentData.trophies = [];
    }
    const trophies : Trophy[] = [];
    for (let i=0; i < this.gameModel.persistentData.trophies.length; i++) {
      trophies.push(this.createTrophy(this.gameModel.persistentData.trophies[i], true, false));
    }
    return trophies;
  }
}