import { Ability } from "./ability";
import { Defense, Nerve } from "./unit-attributes";

export interface DefenderInputValues {
    name: string;
    defense: Defense;
    nerve: Nerve;
    // abilities: Ability[];
    inspired: boolean;
    affectedBy: {
        slayer?: boolean;
        rampage?: boolean;
        duelist?: boolean;
    };
    wasLoaded?: boolean;
}