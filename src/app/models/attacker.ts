import { Melee } from "../services/dice-rolls.service";
import { Ability } from "./ability";
import { DicePlusNumber } from "./dice-plus-number";
import { RerollFunction } from "./reroll-function";

export interface Attacker {
  wasLoaded?: boolean;
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
  blast?: DicePlusNumber;
  brutal?: DicePlusNumber;
  abilities: Ability[];
  facing: 'front' | 'flank' | 'rear';
}

export function cloneAttacker(originalAttacker: Attacker): Attacker {
  return {
    ...originalAttacker,
    abilities: originalAttacker.abilities.map(ability => ability.clone()),
  }
}