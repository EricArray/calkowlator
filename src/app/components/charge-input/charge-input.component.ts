import { Component, OnInit } from '@angular/core';
import { Ability, Blast, Brutal, Elite, Vicious } from '@models/ability';
import { Attacker } from '@models/attacker';
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

  abilityOptions = [
    { name: 'Elite', create: () => new Elite() },
    { name: 'Vicious', create: () => new Vicious() },
    // { name: 'Reroll', create: () => new Reroll() },
    { name: 'Blast', create: () => new Blast() },
    // { name: 'Brutal', create: () => new Brutal() },
  ]

  constructor() { }

  addAttacker(): void {
    this.charge.attackers = [
      ...this.charge.attackers,
      defaultAttacker()
    ]
  }

  duplicateAttacker(duplicateIndex: number): void {
    const newAttacker = { ...this.charge.attackers[duplicateIndex] }
    this.charge.attackers.splice(duplicateIndex + 1, 0, newAttacker)
  }

  removeAttacker(removeIndex: number): void {
    this.charge.attackers = this.charge.attackers.filter((attacker, index) => index !== removeIndex)
  }

  addAbility(attacker: Attacker, abilityOption: any): void {
    const newAbilityInstance = abilityOption.create()
    attacker.abilities.push(newAbilityInstance)
  }

  removeAbility(attacker: Attacker, abilityToRemove: Ability): void {
    attacker.abilities = attacker.abilities.filter(ability => ability !== abilityToRemove)
  }

  disableAbilityOption(attacker: Attacker, abilityOption: any): boolean {
    return attacker.abilities.some(ability => ability.name === abilityOption.name)
  }

}
