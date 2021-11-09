import { max, min } from "mathjs";
import { AttackerInputValuesProcessed } from "./attacker-input-values-processed";
import { DefenderInputValues } from "./defender-input-values";
import { DicePlusNumber } from "./dice-plus-number";

export abstract class Ability {
    constructor(
        public name: string,
        public valueType: 'no-value' | 'number' | 'dice-plus-number' | 'reroll',

        // when the value is an object, it is mandatory to initialize it, because
        // some inputs access it
        public value: any,
    ) {}

    get stackable(): boolean { return false }
    abstract applyModification(attacker: AttackerInputValuesProcessed, defender: DefenderInputValues): AttackerInputValuesProcessed
    
    // must return a list of classes derived from Ability
    // example: return [Elite]
    incompatibleAbilityTypes(): any[] { return [] }
}

export class Elite extends Ability {
    constructor() { super('Elite', 'no-value', undefined) }
    applyModification(attacker: AttackerInputValuesProcessed, defender: DefenderInputValues): AttackerInputValuesProcessed {
        return {
            ...attacker,
            elite: true,
        }
    }
    incompatibleAbilityTypes() { return [RerollToHit] }
}

export class Vicious extends Ability {
    constructor() { super('Vicious', 'no-value', undefined) }
    applyModification(attacker: AttackerInputValuesProcessed, defender: DefenderInputValues): AttackerInputValuesProcessed {
        return {
            ...attacker,
            vicious: true,
        }
    }
    incompatibleAbilityTypes() { return [RerollToWound] }
}

export class RerollToHit extends Ability {
    constructor(value: DicePlusNumber) { super('Reroll to Hit', 'dice-plus-number', value) }
    get stackable(): boolean { return true }
    applyModification(attacker: AttackerInputValuesProcessed, defender: DefenderInputValues): AttackerInputValuesProcessed {
        return {
            ...attacker,
            rerollToHitList: [
                ...attacker.rerollToHitList,
                {
                    amount: this.value,
                    onlyOnes: false,
                }
            ]
        }
    }
    incompatibleAbilityTypes() { return [Elite] }
}

export class RerollToWound extends Ability {
    constructor(value: DicePlusNumber) { super('Reroll to Wound', 'dice-plus-number', value) }
    get stackable(): boolean { return true }
    applyModification(attacker: AttackerInputValuesProcessed, defender: DefenderInputValues): AttackerInputValuesProcessed {
        return {
            ...attacker,
            rerollToWoundList: [
                ...attacker.rerollToWoundList,
                {
                    amount: this.value,
                    onlyOnes: false,
                }
            ]
        }
    }
    incompatibleAbilityTypes() { return [Vicious] }
}

export class Blast extends Ability {
    constructor(value: DicePlusNumber) { super('Blast', 'dice-plus-number', value) }
    applyModification(attacker: AttackerInputValuesProcessed, defender: DefenderInputValues): AttackerInputValuesProcessed {
        return {
            ...attacker,
            blast: this.value,
        }
    }
}

export class Brutal extends Ability {
    constructor(value: DicePlusNumber) { super('Brutal', 'dice-plus-number', value) }
    applyModification(attacker: AttackerInputValuesProcessed, defender: DefenderInputValues): AttackerInputValuesProcessed {
        return {
            ...attacker,
            brutal: this.value,
        }
    }
}

export class Slayer extends Ability {
    constructor(value: DicePlusNumber) { super('Slayer', 'dice-plus-number', value) }
    applyModification(attacker: AttackerInputValuesProcessed, defender: DefenderInputValues): AttackerInputValuesProcessed {
        if (defender.affectedBy.slayer) {
            return {
                ...attacker,
                attackModifiers: [ ...attacker.attackModifiers, this.value ]
            }
        } else {
            return attacker
        }
    }
}

export class Rampage extends Ability {
    constructor(value: DicePlusNumber) { super('Rampage', 'dice-plus-number', value) }
    applyModification(attacker: AttackerInputValuesProcessed, defender: DefenderInputValues): AttackerInputValuesProcessed {
        if (defender.affectedBy.rampage) {
            return {
                ...attacker,
                attackModifiers: [ ...attacker.attackModifiers, this.value ]
            }
        } else {
            return attacker
        }
    }
}

export class BaneChanted extends Ability {
    constructor() { super('Bane Chanted', 'no-value', undefined) }
    applyModification(attacker: AttackerInputValuesProcessed, defender: DefenderInputValues): AttackerInputValuesProcessed {
        return {
            ...attacker,
            cs: (attacker.cs ?? 0) + 1,
        }
    }
}

export class Weakened extends Ability {
    constructor() { super('Weakened', 'no-value', undefined) }
    applyModification(attacker: AttackerInputValuesProcessed, defender: DefenderInputValues): AttackerInputValuesProcessed {
        return {
            ...attacker,
            cs: (attacker.cs ?? 0) - 1,
        }
    }
}

export class Hindered extends Ability {
    constructor() { super('Hindered', 'no-value', undefined) }
    applyModification(attacker: AttackerInputValuesProcessed, defender: DefenderInputValues): AttackerInputValuesProcessed {
        return {
            ...attacker,
            hindered: true,
            // TODO: hit on 7+
            melee: min(6, attacker.melee + 1),
            tc: max(0, (attacker.tc ?? 0) - 1),
        }
    }
}
