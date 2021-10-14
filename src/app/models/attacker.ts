import { Melee } from "../services/dice-rolls.service";
import { Ability } from "./ability";
import { RerollFunction } from "./reroll-function";

export interface Attacker {
  name?: string;
  active: boolean;
  melee: Melee;
  attack: number;
  cs?: number,
  tc?: number,
  elite: boolean;
  vicious: boolean;
  rerolls: {
    'to-hit': RerollFunction[];
    'to-wound': RerollFunction[];
  }
  blast?: {
    dice?: 3 | 6;
    plus?: number;
  }
  brutal?: {
    dice?: 3 | 6;
    plus?: number;
  }
  abilities: Ability[];
  facing: 'front' | 'flank' | 'rear';
}
