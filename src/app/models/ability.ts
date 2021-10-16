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

    abstract applyModification(attacker: Attacker, defender: Defender): Attacker
    abstract clone(): Ability
}

export class Elite extends Ability {
    constructor() { super('Elite', 'no-value', undefined); }
    applyModification(attacker: Attacker, defender: Defender): Attacker {
        return {
            ...attacker,
            elite: true,
        }
    }
    clone(): Ability {
        return new Elite()
    }
}

export class Vicious extends Ability {
    constructor() { super('Vicious', 'no-value', undefined); }
    applyModification(attacker: Attacker, defender: Defender): Attacker {
        return {
            ...attacker,
            vicious: true,
        }
    }
    clone(): Ability {
        return new Vicious()
    }
}

// export class Reroll extends Ability {
//     constructor() { super('Reroll', 'reroll', {}); }
//     applyModification(attacker: Attacker, defender: Defender): Attacker {
//         if (this.value.when === 'to-hit') {
//             return {
//                 ...attacker,
//                 rerollFunctionsToHit: [...attacker.rerollFunctionsToHit, ]
//             }
//         }
//     }
// }

export class Blast extends Ability {
    constructor(value = {}) { super('Blast', 'dice-plus-number', value); }
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
    constructor(value = {}) { super('Brutal', 'dice-plus-number', value); }
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

