import { Component, ViewChild } from '@angular/core';
import { format, Fraction, map, MathType, max, multiply, number, sum } from 'mathjs';
import { Charge, ChargeInputComponent } from './charge-input/charge-input.component';
import { Attacker } from './models/attacker';
import { ChargeResult } from './models/charge-result';
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

  results: ChargeResult[] = []
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
      this.results = this.charges.map(charge => {
        const modifiedAttackers = charge.attackers
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

            return <Attacker>{
              ...attacker,
              attack: modifiedAttack
            }
          })


        const attackersResults = modifiedAttackers
          .map(attacker => {
            const rerollFunctionsToHit = [...attacker.rerolls['to-hit']]
            // TODO: remove elite and vicious variables, and use rerollFunctions
            if (attacker.elite) {
              rerollFunctionsToHit.push(rerollAllOnes())
            }
            const hitsTable = this.diceRollsService.hitsTable({
              attack: attacker.attack,
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
            const woundsTable = this.diceRollsService.woundsTable(
              hitsTable,
              modifiedDefense > 6 ? 6 : modifiedDefense < 2 ? 2 : modifiedDefense as any,
              rerollFunctionsToWound,
            )

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
        
        return <ChargeResult>{
          charge,
          hitsTable,
          woundsTable,
          average: this.getAverage(woundsTable)
        }
      })
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
