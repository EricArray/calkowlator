import { Component, ViewChild } from '@angular/core';
import { format, Fraction, map, MathType, max, multiply, number, sum } from 'mathjs';
import { Charge, ChargeInputComponent } from './charge-input/charge-input.component';
import { Attacker } from './models/attacker';
import { Defender } from './models/defender';
import { rerollAllOnes } from './models/reroll-function';
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

  results: {
    average: number;
    displayTable: { hits: number, fraction: string, percent: string }[];
  }[] = []
  averageDifference: number = 0;
  averageDifferencePercent: string = '';
  difference: { hits: number, fraction: string, percent: string }[] | null = null
  error = false

  get charges(): Charge[] {
    return (
      this.charge1Component && this.charge2Component
        ? [
          this.charge1Component?.charge,
          this.charge2Component?.charge,
        ]
        : []
    )
  }

  constructor(private diceRollsService: DiceRollsService) {}

  calculate(): void {
    this.error = false
    try {
      const chargeTables = this.charges.map(charge => {
        const woundsTables = charge.attackers
          .filter(attacker => attacker.active)
          .map(attacker => this.applyAttackerAbilities(attacker, charge.defender))
          .map(attacker => {
            let modifiedAttack = attacker.attack;
            if (attacker.facing === 'flank') {
              modifiedAttack *= 2
            }
            if (attacker.facing === 'rear') {
              modifiedAttack *= 3
            }

            console.log('modified attacker', attacker.name, attacker)

            const rerollFunctionsToHit = [...attacker.rerolls['to-hit']]
            // TODO: remove elite and vicious variables, and use rerollFunctions
            if (attacker.elite) {
              rerollFunctionsToHit.push(rerollAllOnes())
            }
            const hitsTable = this.diceRollsService.hitsTable({
              attack: modifiedAttack,
              melee: attacker.melee,
              rerollFunctions: rerollFunctionsToHit,
              blast: attacker.blast
            })

            const modifiedDefense = charge.defender.defense - ((attacker.cs ?? 0) + (attacker.tc ?? 0))
            const rerollFunctionsToWound = [...attacker.rerolls['to-wound']]
            // TODO: remove elite and vicious variables, and use rerollFunctions
            if (attacker.vicious) {
              rerollFunctionsToWound.push(rerollAllOnes())
            }
            return this.diceRollsService.woundsTable(
              hitsTable,
              modifiedDefense > 6 ? 6 : modifiedDefense < 2 ? 2 : modifiedDefense as any,
              rerollFunctionsToWound,
            )
          })

        return this.diceRollsService.combineTables(woundsTables)
      })

      this.results = chargeTables.map(chargeTable => {
        const average = this.getAverage(chargeTable)

        const displayTable = []
        for (const entry of chargeTable) {
          displayTable.push({
            hits: entry[0],
            fraction: format(entry[1], 2),
            percent: formatPercent(entry[1] as any),
          })
        }
        
        return {
          average,
          displayTable
        }
      })

      const differenceTable = this.diceRollsService.differenceTable(chargeTables[0], chargeTables[1])
      
      this.averageDifference = this.getAverage(differenceTable)

      const differenceRelativeToCharge1 = (this.results[0].average - this.results[1].average) / (this.results[1].average)
      this.averageDifferencePercent = formatPercent(differenceRelativeToCharge1 as any),

      this.difference = []
      for (const entry of differenceTable) {
        this.difference.push({
          hits: entry[0],
          fraction: format(entry[1], 2),
          percent: formatPercent(entry[1] as any),
        })
      }
    } catch (error) {
      console.error(error)
      this.error = true
    }
  }

  applyAttackerAbilities(attacker: Attacker, defender: Defender): Attacker {
    let modifiedAttacker = attacker
    for (const ability of attacker.abilities) {
      modifiedAttacker = ability.applyModification(modifiedAttacker, defender)
    }
    return modifiedAttacker
  }

  getAverage(result: Map<number, MathType>): number {
    const v: Fraction[] = [...result.entries()].map(([hits, probability]) => multiply(hits, probability) as Fraction)
    return sum(...v)
  }

}
