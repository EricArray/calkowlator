import { Component } from '@angular/core';
import { format, Fraction, map, MathType, max, multiply, number, sum } from 'mathjs';
import { DiceRollsService, Melee, rerollAllOnes } from './services/dice-rolls.service';

interface Attacker {
  active: boolean;
  melee: Melee;
  attack: number;
  cs?: number,
  tc?: number,
  elite: boolean;
  vicious: boolean;
  facing: 'front' | 'flank' | 'rear'
}

function defaultAttacker(): Attacker {
  return {
    active: true,
    melee: 4,
    attack: 2,
    elite: false,
    vicious: false,
    facing: 'front',
  }
}

interface Defender {
  defense: 2 | 3 | 4 | 5 | 6;
}

interface Charge {
  attackers: Attacker[];
  defender: Defender;
}
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  charges: Charge[] = [
    {
      attackers: [ defaultAttacker() ],
      defender: {
        defense: 4,
      },
    },
    {
      attackers: [ defaultAttacker() ],
      defender: {
        defense: 4,
      },
    },
  ]

  results: {
    average: number;
    displayTable: { hits: number, fraction: string, percent: string }[];
  }[] = []
  averageDifference: number = 0;
  difference: { hits: number, fraction: string, percent: string }[] | null = null
  error = false

  constructor(private diceRollsService: DiceRollsService) {}

  addAttacker(charge: Charge): void {
    charge.attackers = [
      ...charge.attackers,
      defaultAttacker()
    ]
  }

  removeAttacker(charge: Charge, removeIndex: number): void {
    charge.attackers = charge.attackers.filter((attacker, index) => index !== removeIndex)
  }

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
            const hitsTable = this.diceRollsService.hitsTable({
              attack: modifiedAttack,
              melee: attacker.melee,
              rerollFunctions: attacker.elite ? [rerollAllOnes()] : []
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
