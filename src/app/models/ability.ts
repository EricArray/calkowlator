import { max, min } from "mathjs";
import { Attacker } from "./attacker";
import { Defender } from "./defender";

export abstract class Ability {
    constructor(
        public name: string,
        public valueType: 'no-value' | 'number' | 'dice-plus-number' | 'reroll',

        // when the value is an object, it is mandatory to initialize it, because
        // some inputs access it
        public value: any,
    ) {}

    get stackable(): boolean { return false }
    abstract applyModification(attacker: Attacker, defender: Defender): Attacker
    abstract clone(): Ability
    incompatibleAbilityTypes(): (typeof Ability)[] { return [] }
}

export class Elite extends Ability {
    constructor() { super('Elite', 'no-value', undefined) }
    applyModification(attacker: Attacker, defender: Defender): Attacker {
        return {
            ...attacker,
            elite: true,
        }
    }
    clone(): Ability {
        return new Elite()
    }
    incompatibleAbilityTypes() { return [RerollToHit] }
}

export class Vicious extends Ability {
    constructor() { super('Vicious', 'no-value', undefined) }
    applyModification(attacker: Attacker, defender: Defender): Attacker {
        return {
            ...attacker,
            vicious: true,
        }
    }
    clone(): Ability {
        return new Vicious()
    }
    incompatibleAbilityTypes() { return [RerollToWound] }
}

export class RerollToHit extends Ability {
    constructor(value = {}) { super('Reroll to Hit', 'dice-plus-number', value) }
    get stackable(): boolean { return true }
    applyModification(attacker: Attacker, defender: Defender): Attacker {
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
    clone(): Ability {
        return new RerollToHit(this.value)
    }
    incompatibleAbilityTypes() { return [Elite] }
}

export class RerollToWound extends Ability {
    constructor(value = {}) { super('Reroll to Wound', 'dice-plus-number', value) }
    get stackable(): boolean { return true }
    applyModification(attacker: Attacker, defender: Defender): Attacker {
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
    clone(): Ability {
        return new RerollToWound(this.value)
    }
    incompatibleAbilityTypes() { return [Vicious] }
}

export class Blast extends Ability {
    constructor(value = {}) { super('Blast', 'dice-plus-number', value) }
    applyModification(attacker: Attacker, defender: Defender): Attacker {
        return {
            ...attacker,
            blast: this.value,
        }
    }
    clone(): Ability {
        return new Blast({ ... this.value })
    }
}

export class Brutal extends Ability {
    constructor(value = {}) { super('Brutal', 'dice-plus-number', value) }
    applyModification(attacker: Attacker, defender: Defender): Attacker {
        return {
            ...attacker,
            brutal: this.value,
        }
    }
    clone(): Ability {
        return new Brutal({ ... this.value })
    }
}

export class Slayer extends Ability {
    constructor(value = {}) { super('Slayer', 'dice-plus-number', value) }
    applyModification(attacker: Attacker, defender: Defender): Attacker {
        if (defender.affectedBySlayer) {
            return {
                ...attacker,
                attackModifiers: [ ...attacker.attackModifiers, this.value ]
            }
        } else {
            return attacker
        }
    }
    clone(): Ability {
        return new Slayer({ ... this.value })
    }
}

export class Rampage extends Ability {
    constructor(value = {}) { super('Rampage', 'dice-plus-number', value) }
    applyModification(attacker: Attacker, defender: Defender): Attacker {
        if (defender.affectedByRampage) {
            return {
                ...attacker,
                attackModifiers: [ ...attacker.attackModifiers, this.value ]
            }
        } else {
            return attacker
        }
    }
    clone(): Ability {
        return new Rampage({ ... this.value })
    }
}

export class BaneChanted extends Ability {
    constructor() { super('Bane Chanted', 'no-value', undefined) }
    applyModification(attacker: Attacker, defender: Defender): Attacker {
        return {
            ...attacker,
            cs: (attacker.cs ?? 0) + 1,
        }
    }
    clone(): Ability {
        return new BaneChanted()
    }
}

export class Weakened extends Ability {
    constructor() { super('Weakened', 'no-value', undefined) }
    applyModification(attacker: Attacker, defender: Defender): Attacker {
        return {
            ...attacker,
            cs: (attacker.cs ?? 0) - 1,
        }
    }
    clone(): Ability {
        return new Weakened()
    }
}

export class Hindered extends Ability {
    constructor() { super('Hindered', 'no-value', undefined) }
    applyModification(attacker: Attacker, defender: Defender): Attacker {
        return {
            ...attacker,
            hindered: true,
            // TODO: hit on 7+
            melee: min(6, attacker.melee + 1),
            tc: max(0, (attacker.tc ?? 0) - 1),
        }
    }
    clone(): Ability {
        return new Hindered()
    }
}
