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
    this.active = function (): boolean {
      // ...
    };
    this.reset = function (): void {
      // ...
    };
    this.max = function (): void {
      // ...
    };
    this.set = function (e): void {
      // ...
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
      // ...
    },
    function () {
      // ...
    }
  ),
  // ...
];
const Mt = [];
function applyTalents() {
  Talents.forEach((talent) => talent.apply());
}
Talents.forEach((talent: Talent) => {
  if (Mt.filter((t) => t.name == talent.group).length == 0) {
    let t = "blood";
    if (talent.group == golemMastery) {
      t = "parts";
    }
    if (talent.group == skeletonMastery) {
      t = "bones";
    }
    if (talent.group == spellMastery) {
      t = "energy";
    }
    if (talent.group == zombieMastery) {
      t = "brains";
    }
    Mt.push(new vt(talent.group, t));
  }
  Mt.filter((t) => t.name == talent.group)[0].talents.push(talent);
  skeleton.talents[talent.id] ||= 0;
});
