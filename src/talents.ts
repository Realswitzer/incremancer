const skeleton = new Skeleton();
const zombies = new Zombies();
const creatures = new Creatures();
const creatureFactory = new CreatureFactory();
const spells = new Spells();
const golemMastery = "Golem Mastery";
const zombieMastery = "Zombie Mastery";
const skeletonMastery = "Skeleton Mastery";
const spellMastery = "Spell Mastery";
class Talent {
  constructor(
    id: number,
    name: string,
    group: string,
    maxPoints: number,
    apply: () => void,
    description: () => string
  ) {
    this.id = 0;
    this.maxPoints = 0;
    this.active = function () {
      return skeleton.talents[this.id] && skeleton.talents[this.id] > 0;
    };
    this.reset = function () {
      skeleton.talents[this.id] = 0;
    };
    this.max = function () {
      skeleton.talents[this.id] = this.maxPoints;
      if (skeleton.getAvailablePoints() < 0) {
        skeleton.talents[this.id] += skeleton.getAvailablePoints();
      }
    };
    this.set = function (e) {
      skeleton.talents[this.id] ||= 0;
      if (e < 0 || (e > 0 && skeleton.getAvailablePoints() > 0)) {
        skeleton.talents[this.id] += e;
        if (skeleton.talents[this.id] < 0) {
          skeleton.talents[this.id] = 0;
        }
        if (skeleton.talents[this.id] > this.maxPoints) {
          skeleton.talents[this.id] = this.maxPoints;
        }
      }
    };
    this.id = id;
    this.name = name;
    this.description = description;
    this.group = group;
    this.maxPoints = maxPoints;
    this.apply = apply;
  }
}
class vt {
  constructor(group, currency) {
    this.talents = [];
    this.name = group;
    this.class = currency;
  }
}
const Talents = [
  new Talent(
    1,
    "Efficiency",
    golemMastery,
    10,
    function () {
      creatureFactory.creatureCostReduction = 1;
      const e = skeleton.talents[this.id];
      if (e) {
        creatureFactory.creatureCostReduction -= e * 0.05;
      }
    },
    function () {
      const e = skeleton.talents[this.id];
      if (e && e > 0) {
        return `Golem upgrade and summoning cost reduced by ${e * 5}%`;
      } else {
        return "Reduces golem upgrade and summoning cost by 5%";
      }
    }
  ),
  new Talent(
    2,
    "Thrifty",
    golemMastery,
    10,
    function () {
      skeleton.killingBlowParts = 0;
      const e = skeleton.talents[this.id];
      if (e) {
        skeleton.killingBlowParts = e * 5;
      }
    },
    function () {
      const e = skeleton.talents[this.id];
      if (e && e > 0) {
        return `Skeleton killing blows reward ${e * 5} creature parts`;
      } else {
        return "Skeleton killing blows reward 5 creature parts";
      }
    }
  ),
  new Talent(
    3,
    "Fatal Bargain",
    golemMastery,
    10,
    function () {
      creatures.refundChance = 0;
      zombies.refundChance = 0;
      const e = skeleton.talents[this.id];
      if (e) {
        creatures.refundChance = e * 0.05;
        zombies.refundChance = e * 0.05;
      }
    },
    function () {
      const e = skeleton.talents[this.id];
      if (e) {
        return e * 5 + "% chance for parts refund on golem death";
      } else {
        return "Grants 5% chance for parts refund on golem death";
      }
    }
  ),
  new Talent(
    4,
    "Recovery",
    spellMastery,
    10,
    function () {
      spells.cooldownReduction = 1;
      const e = skeleton.talents[this.id];
      if (e) {
        spells.cooldownReduction = 1 - e * 0.05;
      }
    },
    function () {
      const e = skeleton.talents[this.id];
      if (e && e > 0) {
        return `Spell cooldown time reduced by ${e * 5}%`;
      } else {
        return "Reduces spell cooldown time by 5%";
      }
    }
  ),
  new Talent(
    5,
    "Endurance",
    spellMastery,
    10,
    function () {
      spells.timeExtension = 0;
      const e = skeleton.talents[this.id];
      if (e) {
        spells.timeExtension = e;
      }
    },
    function () {
      const e = skeleton.talents[this.id];
      if (e && e > 0) {
        return `Spell duration increased by ${e} seconds`;
      } else {
        return "Increases spell duration by 1 second";
      }
    }
  ),
  new Talent(
    6,
    "Conservation",
    spellMastery,
    10,
    function () {
      spells.costReduction = 0;
      const e = skeleton.talents[this.id];
      if (e) {
        spells.costReduction = e * 5;
      }
    },
    function () {
      const e = skeleton.talents[this.id];
      if (e && e > 0) {
        return `Spell cost reduced by ${e * 5} energy`;
      } else {
        return "Reduces spell cost by 5 energy";
      }
    }
  ),
  new Talent(
    7,
    "Shiny",
    skeletonMastery,
    10,
    function () {
      skeleton.lootChanceMod = 1;
      const e = skeleton.talents[this.id];
      if (e) {
        skeleton.lootChanceMod = 1 + e * 0.1;
      }
    },
    function () {
      const e = skeleton.talents[this.id];
      if (e && e > 0) {
        return `Rare loot chance increased by ${e * 10}%`;
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
    function () {
      skeleton.darkorb = 0;
      const e = skeleton.talents[this.id];
      if (e) {
        skeleton.darkorb = 12 - e;
      }
    },
    function () {
      const e = skeleton.talents[this.id];
      if (e && e > 0) {
        return `Dark orb released every ${12 - e} seconds`;
      } else {
        return "Releases a dark orb of energy every 11 seconds";
      }
    }
  ),
  new Talent(
    9,
    "Bone Shield",
    skeletonMastery,
    10,
    function () {
      skeleton.boneshield = 0;
      const e = skeleton.talents[this.id];
      if (e) {
        skeleton.boneshield = e;
      }
    },
    function () {
      const e = skeleton.talents[this.id];
      if (e && e > 0) {
        return `Gains a shield of ${e} bones every 10 seconds`;
      } else {
        return "Gain a shield of 1 bone to protect the skeleton every 10 seconds";
      }
    }
  ),
  new Talent(
    10,
    "Gigamutagen",
    zombieMastery,
    10,
    function () {
      zombies.gigamutagen = 0;
      const e = skeleton.talents[this.id];
      if (e) {
        zombies.gigamutagen = 16 - e;
      }
    },
    function () {
      const e = skeleton.talents[this.id];
      if (e && e > 0) {
        return `Gigazombie mutation every ${16 - e} seconds`;
      } else {
        return "Mutates a random zombie into a gigazombie every 15 seconds";
      }
    }
  ),
  new Talent(
    11,
    "Blood Pact",
    zombieMastery,
    10,
    function () {
      zombies.bloodpact = 0;
      const e = skeleton.talents[this.id];
      if (e) {
        zombies.bloodpact = e * 0.05;
      }
    },
    function () {
      const e = skeleton.talents[this.id];
      if (e) {
        return e * 5 + "% of zombie damage converted to blood";
      } else {
        return "Converts an additional 5% of zombie damage to blood";
      }
    }
  ),
  new Talent(
    12,
    "Blood Born",
    zombieMastery,
    10,
    function () {
      zombies.bloodborn = 0;
      const e = skeleton.talents[this.id];
      if (e) {
        zombies.bloodborn = e;
      }
    },
    function () {
      const e = skeleton.talents[this.id];
      if (e) {
        return `${e} seconds of additional 50% damage reduction`;
      } else {
        return "Grants 1 second of additional 50% damage reduction to newly spawned zombies";
      }
    }
  ),
];
const Mt = [];
function applyTalents() {
  Talents.forEach((talent) => talent.apply());
}
Talents.forEach((e) => {
  if (Mt.filter((t) => t.name == e.group).length == 0) {
    let t = "blood";
    if (e.group == golemMastery) {
      t = "parts";
    }
    if (e.group == skeletonMastery) {
      t = "bones";
    }
    if (e.group == spellMastery) {
      t = "energy";
    }
    if (e.group == zombieMastery) {
      t = "brains";
    }
    Mt.push(new vt(e.group, t));
  }
  Mt.filter((t) => t.name == e.group)[0].talents.push(e);
  skeleton.talents[e.id] ||= 0;
});
