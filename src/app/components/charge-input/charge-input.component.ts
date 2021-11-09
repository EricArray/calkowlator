import { Component } from '@angular/core';
import { FactionsService } from '@app/services/factions.service';
import { Ability, BaneChanted, Blast, Brutal, Elite,  Hindered,  Rampage,  RerollToHit,  RerollToWound,  Slayer,  Vicious, Weakened } from '@models/ability';
import { Attacker, cloneAttacker } from '@models/attacker';
import { cloneDefender, Defender } from '@models/defender';

function defaultAttacker(): Attacker {
  return {
    active: true,
    melee: 4,
    attack: { plus: 12 },
    attackModifiers: [],
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
    new Slayer(),
    new Rampage(),
    new BaneChanted(),
    new Weakened(),
    new Hindered(),
  ]

  loadAttackerFactions = this.factionsService.loadAttackerFactions
  loadDefenderFactions = this.factionsService.loadDefenderFactions

  constructor(private factionsService: FactionsService) { }

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
