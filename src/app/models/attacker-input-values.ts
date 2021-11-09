import { Ability } from "./ability";
import { DicePlusNumber } from "./dice-plus-number";
import { Melee } from "./unit-attributes";

export interface AttackerInputValues {
    name: string;
    melee: Melee;
    attack: DicePlusNumber;
    cs?: number;
    tc?: number;
    abilities: Ability[];
    facing: 'front' | 'flank' | 'rear';
    hindered: boolean;
    wasLoaded: boolean;
}