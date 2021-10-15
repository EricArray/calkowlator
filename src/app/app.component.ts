import { Component, ViewChild } from '@angular/core';
import { format, Fraction, map, MathType, max, multiply, number, sum } from 'mathjs';
import { Charge, ChargeInputComponent } from './components/charge-input/charge-input.component';
import { Attacker } from './models/attacker';
import { ChargeResult } from './models/charge-result';
import { Defender } from './models/defender';
import { NerveTest } from './models/nerve-test';
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
            const hitsTable = this.diceRollsService.hitsTable({
              attack: attacker.attack,
              melee: attacker.melee,
              elite: attacker.elite,
              rerollFunctions: attacker.rerolls['to-hit'],
              blast: attacker.blast
            })

            const modifiedDefense = charge.defender.defense - ((attacker.cs ?? 0) + (attacker.tc ?? 0))
            const woundsTable = this.diceRollsService.woundsTable({
              hitsTable,
              defense: modifiedDefense > 6 ? 6 : modifiedDefense < 2 ? 2 : modifiedDefense as any,
              vicious: attacker.vicious,
              rerollFunctions: attacker.rerolls['to-wound'],
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
        
        const nerveTest = this.diceRollsService.nerveTest(woundsTable, charge.defender)

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

  applyAttackerAbilities(attacker: Attacker, defender: Defender): Attacker {
    let modifiedAttacker = attacker
    for (const ability of attacker.abilities) {
      modifiedAttacker = ability.applyModification(modifiedAttacker, defender)
    }
    return modifiedAttacker
  }

}
