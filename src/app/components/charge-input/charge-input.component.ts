import { Component } from '@angular/core';
import { AttackerInputValues } from '@app/models/attacker-input-values';
import { ChargeInputValues } from '@app/models/charge-input-values';
import { DefenderInputValues } from '@app/models/defender-input-values';
import { FactionsService } from '@app/services/factions.service';
import { Ability, BaneChanted, Blast, Brutal, Elite,  Hindered,  Rampage,  RerollToHit,  RerollToWound,  Slayer,  Vicious, Weakened } from '@models/ability';
import { cloneDeep } from 'lodash';
import { UnitDefinition, UnitSize } from '@models/unit-definition';
import { DicePlusNumber } from '@app/models/dice-plus-number';
import { Nerve } from '@app/models/unit-attributes';

const defaultAttacker: AttackerInputValues = {
  name: '',
  melee: 4,
  attack: { plus: 12 },
  abilities: [],
  facing: 'front',
  hindered: false,
  wasLoaded: false,
}

const defaultDefender: DefenderInputValues = {
  name: '',
  defense: 4,
  nerve: {
    waver: 13,
    rout: 15,
  },
  affectedBy: {},
  inspired: true,
  wasLoaded: false,
}

@Component({
  selector: 'app-charge-input',
  templateUrl: './charge-input.component.html',
  styleUrls: ['./charge-input.component.css'],
})
export class ChargeInputComponent  {
  charge: ChargeInputValues = {
    attackers: [ cloneDeep(defaultAttacker) ],
    defender: cloneDeep(defaultDefender),
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

  unitFactions = this.factionsService.unitFactions

  constructor(private factionsService: FactionsService) { }

  addAttacker(): void {
    this.charge.attackers = [
      ...this.charge.attackers,
      cloneDeep(defaultAttacker)
    ]
  }

  duplicateAttacker(duplicateIndex: number): void {
    const originalAttacker = this.charge.attackers[duplicateIndex]
    const newAttacker = cloneDeep(originalAttacker)
    this.charge.attackers.splice(duplicateIndex + 1, 0, newAttacker)
  }

  removeAttacker(removeIndex: number): void {
    this.charge.attackers = this.charge.attackers.filter((attacker, index) => index !== removeIndex)
    if (this.charge.attackers.length === 0) {
      this.addAttacker()
    }
  }

  loadAttacker(loadAttackerOption: UnitDefinition, sizeOption: { size: UnitSize; attack: DicePlusNumber; nerve: Nerve }): void {
    const newAttacker: AttackerInputValues = {
      name: loadAttackerOption.name + ' ' + sizeOption.size,
      melee: loadAttackerOption.melee,
      attack: cloneDeep(sizeOption.attack),
      cs: loadAttackerOption.cs,
      tc: loadAttackerOption.tc,
      abilities: cloneDeep(loadAttackerOption.abilities),
      facing: 'front',
      hindered: false,
      wasLoaded: true,
    }
    this.charge.attackers = [
      ...this.charge.attackers,
      newAttacker,
    ]
  }

  addAbility(attacker: AttackerInputValues, abilityOption: Ability): void {
    const newAbilityInstance = cloneDeep(abilityOption)
    attacker.abilities.push(newAbilityInstance)
  }

  removeAbility(attacker: AttackerInputValues, abilityToRemove: Ability): void {
    attacker.abilities = attacker.abilities.filter(ability => ability !== abilityToRemove)
  }

  disableAbilityOption(attacker: AttackerInputValues, abilityOption: Ability): boolean {
    return !abilityOption.stackable && attacker.abilities.some(ability => ability.name === abilityOption.name)
  }

  incompatibleAbilityOption(attacker: AttackerInputValues, abilityOption: Ability): Ability | undefined {
    return attacker.abilities.find(attackerAbility =>
      abilityOption.incompatibleAbilityTypes().some(incompatibleAbilityTypes => attackerAbility instanceof incompatibleAbilityTypes)
    )
  }

  loadDefender(defenderDefinition: UnitDefinition, sizeOption: { size: UnitSize; attack: DicePlusNumber; nerve: Nerve }): void {
    const newDefender: DefenderInputValues = {
      name: defenderDefinition.name + ' ' + sizeOption.size,
      defense: defenderDefinition.defense,
      nerve: cloneDeep(sizeOption.nerve),
      inspired: true,
      affectedBy: cloneDeep(defenderDefinition.affectedBy),
      wasLoaded: true,
    }
    this.charge.defender = newDefender
  }

}
