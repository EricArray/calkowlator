import { Ability } from "./ability";
import { DicePlusNumber } from "./dice-plus-number";
import { Defense, Melee, Nerve } from "./unit-attributes";

export type UnitSize = '1' | 'Troop' | 'Regiment' | 'Horde' | 'Legion'

export interface UnitDefinition {
    name: string;
    melee: Melee;
    defense: Defense;
    sizes: {
        size: UnitSize;
        attack: DicePlusNumber;
        nerve: Nerve;
    }[];
    cs?: number;
    tc?: number;
    abilities: Ability[];
    affectedBy: {
        slayer?: boolean;
        rampage?: boolean;
        duelist?: boolean;
    };
    attackerOnly?: boolean;
}