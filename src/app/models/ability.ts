import { Attacker } from "./attacker";
import { Defender } from "./defender";
import { RerollFunction } from "./reroll-function";

export abstract class Ability {
    constructor(
        public name: string,
        public valueType: 'no-value' | 'number' | 'dice-plus-number' | 'reroll',

        // when the value is an object, it is mandatory to initialize it, because
        // some inputs access it
        public value: any,
    ) {}

    abstract applyModification(attacker: Attacker, defender: Defender): Attacker
}

export class Elite extends Ability {
    constructor() { super('Elite', 'no-value', undefined); }
    applyModification(attacker: Attacker, defender: Defender): Attacker {
        return {
            ...attacker,
            elite: true,
        }
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
    constructor() { super('Blast', 'dice-plus-number', {}); }
    applyModification(attacker: Attacker, defender: Defender): Attacker {
        return {
            ...attacker,
            blast: this.value,
        }
    }
}

export class Brutal extends Ability {
    constructor() { super('Brutal', 'dice-plus-number', {}); }
    applyModification(attacker: Attacker, defender: Defender): Attacker {
        return {
            ...attacker,
            brutal: this.value,
        }
    }
}

