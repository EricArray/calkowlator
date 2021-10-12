import { Component } from '@angular/core';
import { format, Fraction, map, MathType, multiply, number, sum } from 'mathjs';
import { DiceRollsService, Melee, rerollAllOnes } from './services/dice-rolls.service';

interface Attacker {
  active: boolean;
  melee: Melee;
  attack: number;
  elite: boolean;
  vicious: boolean;
}
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  attackers: Attacker[] = [
    {
      active: true,
      melee: 4,
      attack: 2,
      elite: false,
      vicious: false,
    },
    {
      active: true,
      melee: 4,
      attack: 2,
      elite: false,
      vicious: false,
    }
  ]
  defense: 2|3|4|5|6 = 4

  result: { hits: number, fraction: string, percent: string }[] | null = null
  difference: { hits: number, fraction: string, percent: string }[] | null = null
  average = 0
  averageFraction = ''
  error = false

  constructor(private diceRollsService: DiceRollsService) {}

  addAttacker(): void {
    this.attackers = [
      ...this.attackers,
      {
        active: true,
        melee: 4,
        attack: 2,
        elite: false,
        vicious: false,
      }
    ]
  }

  removeAttacker(removeIndex: number): void {
    this.attackers = this.attackers.filter((attacker, index) => index !== removeIndex)
  }

  calculate(): void {
    this.error = false
    try {
      const woundsTables = this.attackers
        .filter(attacker => attacker.active)
        .map(attacker => {
          const hitsTable = this.diceRollsService.hitsTable({
            attack: attacker.attack,
            melee: attacker.melee,
            rerollFunctions: attacker.elite ? [rerollAllOnes()] : []
          })

          return this.diceRollsService.woundsTable(
            hitsTable,
            this.defense,
            attacker.vicious ?[rerollAllOnes()] : [])
        })

      const table = this.diceRollsService.combineTables(woundsTables)
      // const difference = this.diceRollsService.differenceTable(tableA, tableB)

      this.result = []
      for (const entry of table.entries()) {
        this.result.push({
          hits: entry[0],
          fraction: format(entry[1]),
          percent: format(number(entry[1] as any * 100)) + '%',
        })
      }
      
      // this.difference = []
      // for (const entry of difference.entries()) {
      //   this.difference.push({
      //     hits: entry[0],
      //     fraction: format(entry[1]),
      //     percent: format(number(entry[1] as any * 100)) + '%',
      //   })
      // }

      this.average = this.getAverage(table)
      this.averageFraction = format(this.average)
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
