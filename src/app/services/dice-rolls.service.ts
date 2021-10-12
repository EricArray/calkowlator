import { Injectable } from '@angular/core';
import { add, factorial, fraction, MathType, max, multiply, pow, round, subtract } from 'mathjs';
import { fromTo, fromZeroTo } from '../util';

export type Melee = 2 | 3 | 4 | 5 | 6;

export interface HitsParams {
  attack: number;
  melee: Melee;
  rerollFunctions?: RerollFunction[];
}

// reroll types:
// * all ones
// * up to 3 ones
// * up to 1 dice
// * up to 3 dice
// * up to D3 dice

type RerollFunction = (ones: number, notOnes: number) => { willRerollOnes: number, willRerollNotOnes: number, probability?: MathType }[]

export function rerollAllOnes(): RerollFunction {
  return (ones, notOnes) => [{ willRerollOnes: ones, willRerollNotOnes: 0 }]
}
export function rerollUpToOneDice(): RerollFunction {
  return (ones, notOnes) => {
    if (notOnes >= 1) {
      return [{ willRerollOnes: 0, willRerollNotOnes: 1 }]
    } else if (ones >= 1) {
      return [{ willRerollOnes: 1, willRerollNotOnes: 0 }]
    } else {
      return [{ willRerollOnes: 0, willRerollNotOnes: 0 }]
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class DiceRollsService {

  constructor() { }

  probabilityToGetSuccesses(diceRolled: number, diceSuccessProbability: MathType, amountOfSuccesses: number): MathType {
    const amountOfMisses = diceRolled - amountOfSuccesses
    const diceMissProbability = subtract(fraction(1), diceSuccessProbability)
    // round this because the factorial() gets rounding errors
    const a = round(factorial(diceRolled) / factorial(amountOfSuccesses) / factorial(amountOfMisses))
    const b = multiply(pow(diceSuccessProbability, amountOfSuccesses), pow(diceMissProbability, amountOfMisses))
    return multiply(a, b)
  }

  tableOfProbilitiesToGetSuccesses(diceRolled: number, diceSuccessProbability: MathType): Map<number, MathType> {
    // reserve an array from 0 to #diceRolled
    const entries = new Array(diceRolled + 1)
    for (const amountOfSuccesses of fromZeroTo(diceRolled)) {
      entries[amountOfSuccesses] = [amountOfSuccesses, this.probabilityToGetSuccesses(diceRolled, diceSuccessProbability, amountOfSuccesses)]
    }
    return new Map(entries)
  }

  hitsTable(params: HitsParams): Map<number, MathType> {
    let table = this.tableOfProbilitiesToGetSuccesses(params.attack, fraction(7 - params.melee, 6))
    if (params.rerollFunctions && params.rerollFunctions.length > 0) {
      table = this.applyRerollFunctions(table, params.attack, params.melee, params.rerollFunctions)
    }
    return table
  }
  
  applyRerollFunctions(table: Map<number, MathType>, attack: number, melee: Melee, rerollFunctions: RerollFunction[]): Map<number, MathType> {
    const successChanceTableWithRerolls = []
    for (const wantedHits of fromZeroTo(attack)) {
      let chance = fraction(0) as MathType
      for (const normalHits of fromZeroTo(wantedHits)) {
        const requiredRerollHits = wantedHits - normalHits
        const missedDice = attack - normalHits
        chance = add(
          chance, 
          multiply(
            table.get(normalHits) ?? fraction(0),
            this.getChanceOfExactRerollHits(melee, requiredRerollHits, missedDice, rerollFunctions)
          )
        )
      }
      successChanceTableWithRerolls[wantedHits] = chance
    }
    return new Map(successChanceTableWithRerolls.entries())
  }
  
  getChanceOfExactRerollHits(melee: Melee, rerollHits: number, missedDice: number,  rerollFunctions: RerollFunction[]): MathType {
    const probabilityOfGettingOneOnFailedDice = fraction(1, (melee - 1))
    let chance = fraction(0) as any
    for (const ones of fromTo(rerollHits, missedDice)) {
      const probabilityToGetThisAmountOfOnes = this.probabilityToGetSuccesses(missedDice, probabilityOfGettingOneOnFailedDice, ones)
      const whatWillBeRerolled = this.whatWillBeRerolled(ones, missedDice - ones, rerollFunctions)
      for (const whatWillBeRerolledItem of whatWillBeRerolled) {
        const subChance = this.probabilityToGetSuccesses(whatWillBeRerolledItem.willRerollOnes + whatWillBeRerolledItem.willRerollNotOnes, fraction(7 - melee, 6), rerollHits)
        chance = add(chance, multiply(multiply(probabilityToGetThisAmountOfOnes, subChance), whatWillBeRerolledItem.probability))
      }
    }
    return chance
  }

  whatWillBeRerolled(remainingOnes: number, remainingNotOnes: number, rerollFunctions: RerollFunction[]): { willRerollOnes: number, willRerollNotOnes: number, probability: MathType }[] {
    if (rerollFunctions.length === 0) {
      return [{ willRerollOnes: 0, willRerollNotOnes: 0, probability: fraction(1) }]
    } else {
      const finalResult: { willRerollOnes: number, willRerollNotOnes: number, probability: MathType }[] = []
      const rerollProbabilities = rerollFunctions[0](remainingOnes, remainingNotOnes)
      for (const rerollProbability of rerollProbabilities) {
        const innerRerollProbabilities = this.whatWillBeRerolled(
          remainingOnes - rerollProbability.willRerollOnes,
          remainingNotOnes - rerollProbability.willRerollNotOnes,
          rerollFunctions.slice(1),
        )
        finalResult.push(...innerRerollProbabilities.map(innerRerollProbability => ({
          willRerollOnes: innerRerollProbability.willRerollOnes + rerollProbability.willRerollOnes,
          willRerollNotOnes: innerRerollProbability.willRerollNotOnes + rerollProbability.willRerollNotOnes,
          probability: multiply(innerRerollProbability.probability, rerollProbability.probability ?? fraction(1)),
        })))
      }
      return finalResult
    }
  }

  woundsTable(hitsTable: Map<number, MathType>, defense: 2|3|4|5|6, rerollFunctions: RerollFunction[]): Map<number, MathType> {
    const woundsTable = new Map<number, MathType>()

    for (const [hits, hitsProbability] of hitsTable) {
      const woundsTableForThisHits = this.hitsTable({
        attack: hits,
        melee: defense,
        rerollFunctions,
      })
      for (const [wounds, woundsPartialProbibility] of woundsTableForThisHits) {
        woundsTable.set(
          wounds,
          add(
            multiply(hitsProbability, woundsPartialProbibility),
            woundsTable.get(wounds) ?? fraction(0),
          )
        )
      }
    }

    return woundsTable
  }

  combineTables(tableA: Map<number, MathType>, tableB: Map<number, MathType>): Map<number, MathType> {
    const combinedTable = new Map<number, MathType>()

    for (const entryA of tableA) {
      for (const entryB of tableB) {
        const wounds = entryA[0] + entryB[0]
        const probability = multiply(entryA[1], entryB[1])
        combinedTable.set(wounds, add(probability, combinedTable.get(wounds) ?? fraction(0)))
      }
    }

    return combinedTable
  }

  differenceTable(tableA: Map<number, MathType>, tableB: Map<number, MathType>): Map<number, MathType> {
    const differenceTable = new Map<number, MathType>()
    const maxWounds = max(...tableA.keys(), ...tableB.keys())
    for (let wounds of fromZeroTo(maxWounds)) {
      const probabilityDifference = subtract(
        tableA.get(wounds) ?? fraction(0),
        tableB.get(wounds) ?? fraction(0),
      )
      differenceTable.set(wounds, probabilityDifference)
    }
    return differenceTable
  }
}
