import {
  CreatureFactory,
  Creatures,
  Skeleton,
  Spells,
  Zombies,
} from "./internal";

const skeleton = new Skeleton();
const zombies = new Zombies();
const creatures = new Creatures();
const creatureFactory = new CreatureFactory();
const spells = new Spells();
const golemMastery = "Golem Mastery" as const;
const zombieMastery = "Zombie Mastery" as const;
const skeletonMastery = "Skeleton Mastery" as const;
const spellMastery = "Spell Mastery" as const;

export class Talent {
  id: number;
  name: string;
  group: string;
  maxPoints: number;
  apply: (this: Talent) => void;
  description: (this: Talent) => string;
  active: () => boolean;
  full: (this: Talent) => boolean;
  reset: () => void;
  max: () => void;
  set: (rank: number) => void;

  constructor(
    id: number,
    name: string,
    group: string,
    maxPoints: number,
    apply: () => void,
    description: () => string
  ) {
    this.id = id;
    this.name = name;
    this.group = group;
    this.maxPoints = maxPoints;

    this.active = function (this: Talent) {
      return !!(skeleton.talents[this.id] && skeleton.talents[this.id] > 0);
    };
    this.full = function (this: Talent) {
      return !!(skeleton.talents[this.id] && skeleton.talents[this.id] === 10);
    };
    this.reset = function (this: Talent) {
      skeleton.talents[this.id] = 0;
    };
    this.max = function (this: Talent) {
      skeleton.talents[this.id] = this.maxPoints;
      if (skeleton.getAvailablePoints() < 0) {
        skeleton.talents[this.id] += skeleton.getAvailablePoints();
      }
    };
    this.set = function (rank) {
      skeleton.talents[this.id] ||= 0;
      if (rank < 0 || (rank > 0 && skeleton.getAvailablePoints() > 0)) {
        skeleton.talents[this.id] += rank;
        if (skeleton.talents[this.id] < 0) {
          skeleton.talents[this.id] = 0;
        }
        if (skeleton.talents[this.id] > this.maxPoints) {
          skeleton.talents[this.id] = this.maxPoints;
        }
      }
    };
    this.apply = apply;
    this.description = description;
  }
}
type mastery =
  | typeof golemMastery
  | typeof zombieMastery
  | typeof skeletonMastery
  | typeof spellMastery;
type currency = "blood" | "bones" | "energy" | "parts" | "brains";

class TalentUpgrade {
  talents: Talent[];
  name: mastery;
  class: currency;
  constructor(group: mastery, currency: currency) {
    this.talents = [];
    this.name = group;
    this.class = currency;
  }
}
export const TalentData = [
  new Talent(
    1,
    "Efficiency",
    golemMastery,
    12,
    function (this: Talent) {
      creatureFactory.creatureCostReduction = 1;
      const rank = skeleton.talents[this.id];
      if (rank && rank > 0) {
        creatureFactory.creatureCostReduction -= rank * 0.075;
      }
    },
    function (this: Talent) {
      const rank = skeleton.talents[this.id];
      if (rank && rank > 0) {
        return `Golem upgrade and summoning cost reduced by ${rank * 7.5}%`;
      } else {
        return "Reduces golem upgrade and summoning cost by 7.5%";
      }
    }
  ),
  new Talent(
    2,
    "Thrifty",
    golemMastery,
    12,
    function (this: Talent) {
      skeleton.killingBlowParts = 0;
      const rank = skeleton.talents[this.id];
      if (rank && rank > 0) {
        skeleton.killingBlowParts = 10 * rank;
      }
    },
    function (this: Talent) {
      const rank = skeleton.talents[this.id];
      if (rank && rank > 0) {
        return `Skeleton killing blows reward ${rank * 10}x of your current parts per second`;
      } else {
        return "Skeleton killing blows reward 10x of your current parts per second";
      }
    }
  ),
  new Talent(
    3,
    "Fatal Bargain",
    golemMastery,
    12,
    function (this: Talent) {
      creatures.refundChance = 0;
      zombies.refundChance = 0;
      const rank = skeleton.talents[this.id];
      if (rank && rank > 0) {
        creatures.refundChance = rank * 0.08;
        zombies.refundChance = rank * 0.08;
      }
    },
    function (this: Talent) {
      const rank = skeleton.talents[this.id];
      if (rank && rank > 0) {
        return rank * 8 + "% parts refund on golem death";
      } else {
        return "Grants 8% parts refund on golem death";
      }
    }
  ),
  new Talent(
    4,
    "Recovery",
    spellMastery,
    12,
    function (this: Talent) {
      spells.cooldownReduction = 1;
      const rank = skeleton.talents[this.id];
      if (rank && rank > 0) {
        spells.cooldownReduction = 1 - rank * 0.05;
      }
    },
    function (this: Talent) {
      const rank = skeleton.talents[this.id];
      if (rank && rank > 0) {
        return `Spell cooldown time reduced by ${rank * 5}%`;
      } else {
        return "Reduces spell cooldown time by 5%";
      }
    }
  ),
  new Talent(
    5,
    "Endurance",
    spellMastery,
    12,
    function (this: Talent) {
      spells.timeExtension = 0;
      const rank = skeleton.talents[this.id];
      if (rank && rank > 0) {
        spells.timeExtension = rank;
      }
    },
    function (this: Talent) {
      const rank = skeleton.talents[this.id];
      if (rank && rank > 0) {
        return `Spell duration increased by ${rank} seconds`;
      } else {
        return "Increases spell duration by 1 second";
      }
    }
  ),
  // NOTE: CM replaced Conservation (reduced energy for spell) with Opportunist (increase spell chance from gear)
  // I've opted to keep Conservation here.
  // new Talent(
  //   6,
  //   "Conservation",
  //   spellMastery,
  //   10,
  //   function (this: Talent) {
  //     spells.costReduction = 0;
  //     const rank = skeleton.talents[this.id];
  //     if (rank && rank > 0) {
  //       spells.costReduction = rank * 5;
  //     }
  //   },
  //   function (this: Talent) {
  //     const rank = skeleton.talents[this.id];
  //     if (rank && rank > 0) {
  //       return `Spell cost reduced by ${rank * 5} energy`;
  //     } else {
  //       return "Reduces spell cost by 5 energy";
  //     }
  //   },
  // ),
  new Talent(
    6,
    "Opportunist",
    spellMastery,
    12,
    function () {
      spells.costReduction = 0;
      skeleton.increaseChance = 0;
      const rank = skeleton.talents[this.id];
      if (rank && rank > 0) {
        skeleton.increaseChance = rank * 0.02;
      }
    },
    function () {
      const rank = skeleton.talents[this.id];
      if (rank && rank > 0) {
        return `Gear spell activation chance increased by ${e * 2}%`;
      } else {
        return "Increases spell activation chance by 2%";
      }
    }
  ),
  new Talent(
    7,
    "Shiny",
    skeletonMastery,
    12,
    function (this: Talent) {
      skeleton.lootChanceMod = 1;
      const rank = skeleton.talents[this.id];
      if (rank && rank > 0) {
        skeleton.lootChanceMod = 1 + rank * 0.1;
      }
    },
    function (this: Talent) {
      const rank = skeleton.talents[this.id];
      if (rank && rank > 0) {
        return `Rare loot chance increased by ${rank * 10}%`;
      } else {
        return "Increases the chance for rare loot by 10%";
      }
    }
  ),
  new Talent(
    8,
    "Dark Orb",
    skeletonMastery,
    10,
    function (this: Talent) {
      skeleton.darkorb = 0;
      const rank = skeleton.talents[this.id];
      if (rank && rank > 0) {
        skeleton.darkorb = 12 - rank;
      }
    },
    function (this: Talent) {
      const rank = skeleton.talents[this.id];
      if (rank && rank > 0) {
        return `Dark orb released every ${12 - rank} seconds`;
      } else {
        return "Releases a dark orb of energy every 11 seconds";
      }
    }
  ),
  new Talent(
    9,
    "Bone Shield",
    skeletonMastery,
    12,
    function (this: Talent) {
      skeleton.boneshield = 0;
      const rank = skeleton.talents[this.id];
      if (rank && rank > 0) {
        skeleton.boneshield = rank;
      }
    },
    function (this: Talent) {
      const rank = skeleton.talents[this.id];
      if (rank && rank > 0) {
        return `Gains a shield of ${rank} bones every 10 seconds`;
      } else {
        return "Gain a shield of 1 bone to protect the skeleton every 10 seconds";
      }
    }
  ),
  new Talent(
    10,
    "Gigamutagen",
    zombieMastery,
    12,
    function (this: Talent) {
      zombies.gigamutagen = 0;
      const rank = skeleton.talents[this.id];
      if (rank && rank > 0) {
        zombies.gigamutagen = 14 - rank;
      }
    },
    function (this: Talent) {
      const rank = skeleton.talents[this.id];
      if (rank && rank > 0) {
        return `Gigazombie mutation every ${14 - rank} seconds`;
      } else {
        return "Mutates a random zombie into a gigazombie every 13 seconds";
      }
    }
  ),
  new Talent(
    11,
    "Blood Pact",
    zombieMastery,
    12,
    function (this: Talent) {
      zombies.bloodpact = 0;
      const rank = skeleton.talents[this.id];
      if (rank && rank > 0) {
        zombies.bloodpact = rank * 0.05;
      }
    },
    function (this: Talent) {
      const rank = skeleton.talents[this.id];
      if (rank && rank > 0) {
        return rank * 5 + "% of zombie damage converted to blood";
      } else {
        return "Converts an additional 5% of zombie damage to blood";
      }
    }
  ),
  new Talent(
    12,
    "Blood Born",
    zombieMastery,
    12,
    function (this: Talent) {
      zombies.bloodborn = 0;
      const rank = skeleton.talents[this.id];
      if (rank && rank > 0) {
        zombies.bloodborn = rank;
      }
    },
    function (this: Talent) {
      const rank = skeleton.talents[this.id];
      if (rank && rank > 0) {
        return `${rank} seconds of additional 50% damage reduction`;
      } else {
        return "Grants 1 second of additional 50% damage reduction to newly spawned zombies";
      }
    }
  ),
];
export const TalentUpgrades: TalentUpgrade[] = [];
export function applyTalents(): void {
  TalentData.forEach((talent) => {
    const rank = skeleton.talents[talent.id];
    if (rank && rank < 0) {
      skeleton.talents[talent.id] = 0;
    }
  });
  if (skeleton.talentPoints < skeleton.getUsedPoints()) {
    resetTalents();
  }
  TalentData.forEach((talent) => talent.apply());
}
export function resetTalents(): void {
  if (skeleton.persistent.talentReset) {
    TalentData.forEach((talent) => talent.reset());
    skeleton.persistent.talentReset = false;
  }
}
TalentData.forEach((talent) => {
  if (
    TalentUpgrades.filter((talentUpg) => talentUpg.name == talent.group)
      .length == 0
  ) {
    let type = "blood" as currency;
    let group = talent.group as mastery;
    if (group == golemMastery) {
      type = "parts";
    }
    if (group == skeletonMastery) {
      type = "bones";
    }
    if (group == spellMastery) {
      type = "energy";
    }
    if (group == zombieMastery) {
      type = "brains";
    }

    TalentUpgrades.push(new TalentUpgrade(group, type));
  }
  TalentUpgrades.filter(
    (talentUpg) => talentUpg.name == talent.group
  )[0].talents.push(talent);
  skeleton.talents[talent.id] ||= 0;
});
