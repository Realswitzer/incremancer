import { GameModel, Humans, Skeleton, Zombies } from "./internal";

class Spell {
  id: number;
  name: string;
  tooltip: string;
  itemText: string;
  cooldown: number;
  duration: number;
  energyCost: number;
  start: () => void;
  end: () => void;
  onCooldown: boolean;
  active: boolean;
  cooldownLeft: number;
  timer: number;
  unlocked: boolean;
  constructor(
    id: number,
    name: string,
    tooltip: string,
    itemText: string,
    cooldown: number,
    duration: number,
    energyCost: number,
    start: () => void,
    end: () => void,
  ) {
    this.id = id;
    this.name = name;
    this.tooltip = tooltip;
    this.itemText = itemText;
    this.cooldown = cooldown;
    this.duration = duration;
    this.energyCost = energyCost;
    this.start = start;
    this.end = end;
    this.timer = 0;
    this.onCooldown = false;
    this.active = false;
    this.cooldownLeft = 0;
  }
}

export class Spells {
  private static instance: Spells;
  constructor() {
    if (Spells.instance) return Spells.instance;
    Spells.instance = this;
    this.spells.forEach((s) => this.spellMap.set(s.id, s));
  }

  skeleton = new Skeleton();
  zombies = new Zombies();
  humans = new Humans();
  spellMap = new Map<number, Spell>();
  spells = [
    new Spell(
      1,
      "Time Warp",
      "Speed up the flow of time for 30 seconds",
      "",
      120,
      30,
      0,
      function () {
        GameModel.getInstance().gameSpeed = 2;
      },
      function () {
        GameModel.getInstance().gameSpeed = 1;
      },
    ),
    new Spell(
      2,
      "Energy Charge",
      "5x Energy rate for 20 seconds, cost 50 energy",
      "",
      180,
      20,
      50,
      function () {
        GameModel.getInstance().energySpellMultiplier = 5;
      },
      function () {
        GameModel.getInstance().energySpellMultiplier = 1;
      },
    ),
    new Spell(
      3,
      "Detonate",
      "Explode your zombies into clouds of plague, cost 69 energy... nice",
      "",
      120,
      3,
      69,
      function () {
        new Spells().zombies.detonate = true;
      },
      function () {
        new Spells().zombies.detonate = false;
      },
    ),
    new Spell(
      4,
      "Earth Freeze",
      "Freeze all humans in place preventing them from moving for 15 seconds, cost 75 energy",
      "",
      60,
      15,
      75,
      function () {
        new Spells().humans.frozen = true;
      },
      function () {
        new Spells().humans.frozen = false;
      },
    ),
    new Spell(
      5,
      "Gigazombies",
      "For 5 seconds any zombies spawned will be giants with 10x health and attack damage, cost 100 energy",
      "",
      300,
      5,
      100,
      function () {
        new Spells().zombies.super = true;
      },
      function () {
        new Spells().zombies.super = false;
      },
    ),
    new Spell(
      6,
      "Incinerate",
      "Burns humans near the skeleton champion",
      "Has a chance to cast Incinerate when attacking, burning all humans within a large radius of the Skeleon",
      1,
      10,
      10,
      function () {
        new Spells().skeleton.incinerate();
      },
      function () {
        //
      },
    ),
    new Spell(
      7,
      "Pandemic",
      "Causes plague to spread",
      "Has a chance to cast Pandemic when attacking, causing infected humans to spread the plague to each other for 20 seconds",
      10,
      20,
      10,
      function () {
        new Spells().humans.pandemic = true;
      },
      function () {
        new Spells().humans.pandemic = false;
      },
    ),
  ];

  lockAllSpells(): void {
    for (let i = 0; i < this.spells.length; i++) {
      this.spells[i].unlocked = false;
    }
  }

  unlockSpell(spellId: number): void {
    this.spellMap.get(spellId).unlocked = true;
  }

  getSpell(spellId: number): Spell {
    return this.spellMap.get(spellId);
  }

  getUnlockedSpells(): Spell[] {
    return this.spells.filter((spell) => spell.unlocked);
  }

  castSpell(spell: Spell): void {
    const model = GameModel.getInstance();
    if (spell.onCooldown || spell.active || !spell.unlocked) return;

    if (spell.energyCost > model.energy) return;

    model.energy -= spell.energyCost;
    spell.onCooldown = true;
    spell.cooldownLeft = spell.cooldown;
    spell.active = true;
    spell.timer = spell.duration;
    spell.start();
    model.sendMessage(spell.name);
  }

  castSpellNoMana(spellId: number): void {
    const spellList = this.spells.filter((sp) => sp.id == spellId);
    if (spellList.length > 0) {
      const spell = spellList[0];
      if (spell.onCooldown || spell.active) return;

      spell.active = true;
      spell.timer = spell.duration;
      spell.start();
      GameModel.getInstance().sendMessage(spell.name);
    }
  }

  updateSpells(timeDiff: number): void {
    for (let i = 0; i < this.spells.length; i++) {
      const spell = this.spells[i];

      if (spell.onCooldown) {
        spell.cooldownLeft -= timeDiff;
        if (spell.cooldownLeft <= 0) {
          spell.onCooldown = false;
        }
      }

      if (spell.active) {
        spell.timer -= timeDiff;
        if (spell.timer <= 0) {
          spell.active = false;
          spell.end();
        }
      }
    }
  }
}
