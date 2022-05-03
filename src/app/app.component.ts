import { Component, ViewChild } from '@angular/core';
import { cloneDeep } from 'lodash';
import { format, Fraction, map, MathType, max, multiply, number, sum } from 'mathjs';
import { CHARGE_COLORS } from './colors';
import { ChargeInputComponent } from './components/charge-input/charge-input.component';
import { AttackerInputValues } from './models/attacker-input-values';
import { AttackerInputValuesProcessed } from './models/attacker-input-values-processed';
import { ChargeInputValues } from './models/charge-input-values';
import { ChargeResult } from './models/charge-result';
import { DefenderInputValues } from './models/defender-input-values';
import { DicePlusNumber } from './models/dice-plus-number';
import { DiceRollsService } from './services/dice-rolls.service';

function formatPercent(value: number): string {
  return format(number(value * 100), 2) + '%'
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('charge1') charge1Component?: ChargeInputComponent
  @ViewChild('charge2') charge2Component?: ChargeInputComponent

  CHARGE_COLORS = CHARGE_COLORS

  results: ChargeResult[] = []
  error = false

  isComparing = false;

  get charges(): ChargeInputValues[] {
    if (this.isComparing) {
      return (
        this.charge1Component && this.charge2Component
          ? [
            this.charge1Component?.charge,
            this.charge2Component?.charge,
          ]
          : []
      )
    } else {
      return (
        this.charge1Component
          ? [this.charge1Component?.charge]
          : []
        )
    }
  }

  constructor(private diceRollsService: DiceRollsService) {}

  toggleIsComparing(): void {
    this.isComparing = !this.isComparing
  }
  
  calculate(): void {
    this.error = false
    try {
      this.results = this.charges.map(charge => {
        const modifiedAttackers = charge.attackers
          .map(attacker => this.applyAttackerAbilities(attacker, charge.defender))

        const attackersResults = modifiedAttackers
          .map(attacker => {
            const hitsTable = this.diceRollsService.hitsTable({
              attack: attacker.attack,
              attackModifiers: attacker.attackModifiers,
              melee: attacker.melee,
              elite: attacker.elite,
              rerollList: attacker.rerollToHitList,
              blast: attacker.blast,
            })

            const modifiedDefense = charge.defender.defense - ((attacker.cs ?? 0) + (attacker.tc ?? 0))
            const woundsTable = this.diceRollsService.woundsTable({
              hitsTable,
              defense: modifiedDefense > 6 ? 6 : modifiedDefense < 2 ? 2 : modifiedDefense as any,
              vicious: attacker.vicious,
              rerollList: attacker.rerollToWoundList,
            })

            return {
              attacker,
              hitsTable,
              woundsTable,
            }
          })

        const hitsTables = attackersResults.map(attackerResult => attackerResult.hitsTable)
        const woundsTables = attackersResults.map(attackerResult => attackerResult.woundsTable)

        const hitsTable = this.diceRollsService.combineTables(hitsTables)
        const woundsTable = this.diceRollsService.combineTables(woundsTables)
        
        const nerveModifiers = modifiedAttackers.map(attacker => attacker.brutal).filter(brutal => !!brutal) as DicePlusNumber[]
        const nerveTest = this.diceRollsService.nerveTest(woundsTable, charge.defender, nerveModifiers)

        return <ChargeResult>{
          charge,
          hitsTable,
          woundsTable,
          nerveTest,
        }
      })
    } catch (error) {
      console.error(error)
      this.error = true
    }
  }

  applyAttackerAbilities(attacker: AttackerInputValues, defender: DefenderInputValues): AttackerInputValuesProcessed {
    let attackerProcessed: AttackerInputValuesProcessed = {
      ...attacker,
      attackModifiers: [],
      elite: false,
      vicious: false,
      rerollToHitList: [],
      rerollToWoundList: [],
    }
    for (const ability of attacker.abilities) {
      attackerProcessed = ability.applyModification(attackerProcessed, defender)
    }
    return attackerProcessed
  }

}
