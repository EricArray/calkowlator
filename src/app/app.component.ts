import { Component, ViewChild } from '@angular/core';
import { format, Fraction, map, MathType, max, multiply, number, sum } from 'mathjs';
import { Charge, ChargeInputComponent } from './charge-input/charge-input.component';
import { DiceRollsService, Melee, rerollAllOnes, rerollUpToOneDice } from './services/dice-rolls.service';

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
          .map(attacker => {
            let modifiedAttack = attacker.attack;
            if (attacker.facing === 'flank') {
              modifiedAttack *= 2
            }
            if (attacker.facing === 'rear') {
              modifiedAttack *= 3
            }
            const rerollFunctions = []
            if (attacker.elite) {
              rerollFunctions.push(rerollAllOnes())
            }
            if (attacker.reroll1hit) {
              rerollFunctions.push(rerollUpToOneDice())
            }
            const hitsTable = this.diceRollsService.hitsTable({
              attack: modifiedAttack,
              melee: attacker.melee,
              rerollFunctions,
              blast: attacker.blastDice ? { dice: attacker.blastDice, plus: attacker.blastPlus } : undefined
            })

            const modifiedDefense = charge.defender.defense - ((attacker.cs ?? 0) + (attacker.tc ?? 0))
            return this.diceRollsService.woundsTable(
              hitsTable,
              modifiedDefense > 6 ? 6 : modifiedDefense < 2 ? 2 : modifiedDefense as any,
              attacker.vicious ? [rerollAllOnes()] : [])
          })

        return this.diceRollsService.combineTables(woundsTables)
      })

      this.results = chargeTables.map(chargeTable => {
        const average = this.getAverage(chargeTable)

        const displayTable = []
        for (const entry of chargeTable) {
          displayTable.push({
            hits: entry[0],
            fraction: format(entry[1]),
            percent: format(number(entry[1] as any * 100)) + '%',
          })
        }
        
        return {
          average,
          displayTable
        }
      })

      const differenceTable = this.diceRollsService.differenceTable(chargeTables[0], chargeTables[1])
      
      this.averageDifference = this.getAverage(differenceTable)
      this.difference = []
      for (const entry of differenceTable) {
        this.difference.push({
          hits: entry[0],
          fraction: format(entry[1]),
          percent: format(number(entry[1] as any * 100)) + '%',
        })
      }
    } catch (error) {
      console.error(error)
      this.error = true
    }
  }

  getAverage(result: Map<number, MathType>): number {
    const v: Fraction[] = [...result.entries()].map(([hits, probability]) => multiply(hits, probability) as Fraction)
    return sum(...v)
  }

}
