import { Component } from '@angular/core';
import { Ability, BaneChanted, Blast, Brutal, Elite,  RerollToHit,  RerollToWound,  Vicious, Weakened } from '@models/ability';
import { Attacker, cloneAttacker } from '@models/attacker';
import { cloneDefender, Defender } from '@models/defender';

function defaultAttacker(): Attacker {
  return {
    active: true,
    melee: 4,
    attack: 12,
    elite: false,
    vicious: false,
    facing: 'front',
    abilities: [],
    rerollToHitList: [],
    rerollToWoundList: [],
  }
}

export interface Charge {
  attackers: Attacker[];
  defender: Defender;
}

@Component({
  selector: 'app-charge-input',
  templateUrl: './charge-input.component.html',
  styleUrls: ['./charge-input.component.css'],
})
export class ChargeInputComponent  {
  charge: Charge = {
    attackers: [ defaultAttacker() ],
    defender: {
      defense: 5,
      nerve: {
        waver: 15,
        rout: 17,
      },
      inspired: true,
    },
  }

  abilityOptions: Ability[] = [
    new Elite(),
    new Vicious(),
    new RerollToHit(),
    new RerollToWound(),
    new Blast(),
    new Brutal(),
    new BaneChanted(),
    new Weakened(),
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
          rerollToHitList: [],
          rerollToWoundList: [],
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
          rerollToHitList: [],
          rerollToWoundList: [],
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
          rerollToHitList: [],
          rerollToWoundList: [],
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
          rerollToHitList: [],
          rerollToWoundList: [],
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
          rerollToHitList: [],
          rerollToWoundList: [],
          abilities: [
            new Brutal({ plus: 1 }),
          ],
          facing: 'front'
        },
      ]
    } 
  ]

  loadDefenderFactions: { factionName: string; units: Defender[] }[] = [
    {
      factionName: 'Goblins',
      units: [
        {
          name: 'Rabble',
          defense: 4,
          nerve: {
            waver: 12,
            rout: 14,
          },
          inspired: true,
        },
        {
          name: 'Big Rock Thrower',
          defense: 4,
          nerve: {
            waver: 9,
            rout: 11,
          },
          inspired: true,
        },
      ]
    },
    {
      factionName: 'Abyssal Dwarfs',
      units: [
        {
          name: 'Grog Mortar',
          defense: 5,
          nerve: {
            waver: 10,
            rout: 12,
          },
          inspired: true,
        },
        {
          name: 'Gargoyles',
          defense: 3,
          nerve: {
            waver: 8,
            rout: 10,
          },
          inspired: true,
        },
      ]
    },
    {
      factionName: 'Ogres',
      units: [
        {
          name: 'Warriors',
          defense: 5,
          nerve: {
            waver: 15,
            rout: 17,
          },
          inspired: true,
        },
      ]
    },
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
    if (this.charge.attackers.length === 0) {
      this.addAttacker()
    }
  }

  loadAttacker(loadAttackerOption: Attacker): void {
    const newAttacker = cloneAttacker(loadAttackerOption)
    newAttacker.wasLoaded = true;
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

  disableAbilityOption(attacker: Attacker, abilityOption: Ability): boolean {
    return !abilityOption.stackable && attacker.abilities.some(ability => ability.name === abilityOption.name)
  }

  incompatibleAbilityOption(attacker: Attacker, abilityOption: Ability): Ability | undefined {
    return attacker.abilities.find(attackerAbility =>
      abilityOption.incompatibleAbilityTypes().some(incompatibleAbilityTypes => attackerAbility instanceof incompatibleAbilityTypes)
    )
  }

  loadDefender(defender: Defender): void {
    this.charge.defender = cloneDefender(defender)
    this.charge.defender.wasLoaded = true
  }

}
