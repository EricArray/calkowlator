import { Component } from '@angular/core';
import { format, Fraction, map, MathType, multiply, number, sum } from 'mathjs';
import { DiceRollsService, Melee, rerollAllOnes } from './services/dice-rolls.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  attack = 2
  melee = 4
  elite = false
  defense = 4
  vicious = false
  
  attack2 = 2
  melee2 = 4
  elite2 = false
  defense2 = 4
  vicious2 = false

  result: { hits: number, fraction: string, percent: string }[] | null = null
  difference: { hits: number, fraction: string, percent: string }[] | null = null
  average = 0
  averageFraction = ''
  error = false

  constructor(private diceRollsService: DiceRollsService) {}

  calculate(): void {
    this.error = false
    try {
      const hitsTableA = this.diceRollsService.hitsTable({
        attack: this.attack,
        melee: this.melee as Melee,
        rerollFunctions: this.elite ? [rerollAllOnes()] : []
      })
      const tableA = this.diceRollsService.woundsTable(hitsTableA, this.defense as any, this.vicious ?[rerollAllOnes()] : [])
      
      const hitsTableB = this.diceRollsService.hitsTable({
        attack: this.attack2,
        melee: this.melee2 as Melee,
        rerollFunctions: this.elite2 ? [rerollAllOnes()] : []
      })
      const tableB = this.diceRollsService.woundsTable(hitsTableB, this.defense2 as any, this.vicious2 ?[rerollAllOnes()] : [])

      const table = this.diceRollsService.combineTables(tableA, tableB)
      const difference = this.diceRollsService.differenceTable(tableA, tableB)

      this.result = []
      for (const entry of table.entries()) {
        this.result.push({
          hits: entry[0],
          fraction: format(entry[1]),
          percent: format(number(entry[1] as any * 100)) + '%',
        })
      }
      
      this.difference = []
      for (const entry of difference.entries()) {
        this.difference.push({
          hits: entry[0],
          fraction: format(entry[1]),
          percent: format(number(entry[1] as any * 100)) + '%',
        })
      }

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
