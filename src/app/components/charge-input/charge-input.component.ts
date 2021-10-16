import { Component, OnInit } from '@angular/core';
import { Ability, Blast, Brutal, Elite, Vicious } from '@models/ability';
import { Attacker, cloneAttacker } from '@models/attacker';
import { Defender } from '@models/defender';

function defaultAttacker(): Attacker {
  return {
    active: true,
    melee: 4,
    attack: 12,
    elite: false,
    vicious: false,
    facing: 'front',
    abilities: [],
    rerolls: {
      "to-hit": [],
      "to-wound": [],
    },
  }
}

export interface Charge {
  attackers: Attacker[];
  defender: Defender;
}

@Component({
  selector: 'app-charge-input',
  templateUrl: './charge-input.component.html',
  styleUrls: ['./charge-input.component.css']
})
export class ChargeInputComponent  {
  charge: Charge = {
    attackers: [ defaultAttacker() ],
    defender: {
      defense: 5,
      nerve: {
        waver: 15,
        rout: 17,
      }
    },
  }

  abilityOptions: Ability[] = [
    new Elite(),
    new Vicious(),
    // new Reroll(),
    new Blast(),
    // new Brutal(),
  ]

  loadAttackerFactions: { factionName: string; units: Attacker[] }[] = [
    {
      factionName: 'Goblins',
      units: [
        {
          name: 'Rabble',
          active: true,
          melee: 5,
          attack: 12,
          elite: false,
          vicious: false,
          rerolls: {
            'to-hit': [],
            'to-wound': [],
          },
          abilities: [],
          facing: 'front'
        },
        {
          name: 'Mawpup',
          active: true,
          melee: 4,
          attack: 6,
          cs: 1,
          elite: false,
          vicious: false,
          rerolls: {
            'to-hit': [],
            'to-wound': [],
          },
          abilities: [],
          facing: 'front'
        },
        {
          name: 'Big Rock Thrower + Elite',
          active: true,
          melee: 5,
          attack: 2,
          cs: 3,
          elite: true,
          vicious: false,
          rerolls: {
            'to-hit': [],
            'to-wound': [],
          },
          abilities: [
            new Blast({ dice: 3, plus: 1 }),
            new Elite(),
          ],
          facing: 'front'
        },
      ]
    },
    {
      factionName: 'Abyssal Dwarfs',
      units: [
        {
          name: 'Grog Mortar',
          active: true,
          melee: 5,
          attack: 2,
          cs: 2,
          elite: false,
          vicious: true,
          rerolls: {
            'to-hit': [],
            'to-wound': [],
          },
          abilities: [
            new Blast({ dice: 3, plus: 1 }),
            new Vicious(),
          ],
          facing: 'front'
        },
      ],
    },
    {
      factionName: 'Ogres',
      units: [
        {
          name: 'Warriors',
          active: true,
          melee: 3,
          attack: 18,
          cs: 1,
          elite: false,
          vicious: false,
          rerolls: {
            'to-hit': [],
            'to-wound': [],
          },
          abilities: [],
          facing: 'front'
        },
      ]
    } 
  ]

  constructor() { }

  addAttacker(): void {
    this.charge.attackers = [
      ...this.charge.attackers,
      defaultAttacker()
    ]
  }

  duplicateAttacker(duplicateIndex: number): void {
    const originalAttacker = this.charge.attackers[duplicateIndex]
    const newAttacker = cloneAttacker(originalAttacker)
    this.charge.attackers.splice(duplicateIndex + 1, 0, newAttacker)
  }

  removeAttacker(removeIndex: number): void {
    this.charge.attackers = this.charge.attackers.filter((attacker, index) => index !== removeIndex)
  }

  loadAttacker(loadAttackerOption: Attacker): void {
    const newAttacker = cloneAttacker(loadAttackerOption)
    this.charge.attackers = [
      ...this.charge.attackers,
      newAttacker,
    ]
  }

  addAbility(attacker: Attacker, abilityOption: Ability): void {
    const newAbilityInstance = abilityOption.clone()
    attacker.abilities.push(newAbilityInstance)
  }

  removeAbility(attacker: Attacker, abilityToRemove: Ability): void {
    attacker.abilities = attacker.abilities.filter(ability => ability !== abilityToRemove)
  }

  disableAbilityOption(attacker: Attacker, abilityOption: any): boolean {
    return attacker.abilities.some(ability => ability.name === abilityOption.name)
  }

}
