import { Injectable } from '@angular/core';
import { add, factorial, fraction, MathType, max, multiply, pow, round, subtract } from 'mathjs';
import { Defender } from '../models/defender';
import { NerveTest } from '../models/nerve-test';
import { RerollFunction } from '../models/reroll-function';
import { fromTo, fromZeroTo } from '../util';

export type Melee = 2 | 3 | 4 | 5 | 6;

export function diceProbability(required: 1 | 2 | 3 | 4 | 5 | 6): MathType {
  return fraction(7 - required, 6)
}

export interface HitsParams {
  attack: number;
  melee: Melee;
  elite: boolean;
  rerollFunctions?: RerollFunction[];
  blast?: {
    dice?: 3 | 6;
    plus?: number;
  }
}

export interface WoundsParams {
  hitsTable: Map<number, MathType>;
  defense: 2|3|4|5|6;
  vicious: boolean;
  rerollFunctions: RerollFunction[];
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
    let hitProbability = diceProbability(params.melee)
    if (params.elite) {
      // rerolling ones is the same as having 7/6 chance to hit each dice
      hitProbability = multiply(hitProbability, fraction(7, 6))
    }
    let table = this.tableOfProbilitiesToGetSuccesses(params.attack, hitProbability)
    // TODO: rerolls
    // if (params.rerollFunctions && params.rerollFunctions.length > 0) {
    //   table = this.applyRerollFunctions(table, params.attack, params.melee, params.rerollFunctions)
    // }
    if (params.blast) {
      table = this.applyBlast(table, params.attack, params.blast)
    }
    return table
  }
  
  applyRerollFunctions(tableBeforeRerolls: Map<number, MathType>, attack: number, melee: Melee, rerollFunctions: RerollFunction[]): Map<number, MathType> {
    const newTable = new Map<number, MathType>()

    const probabilityOfGettingOneOnFailedDice = fraction(1, (melee - 1))

    for (const [hitsBeforeRerolls, probabilityBeforeRerolls] of tableBeforeRerolls) {
      const missedBeforeRerolls = attack - hitsBeforeRerolls
      
      for (const ones of fromTo(0, missedBeforeRerolls)) {
        // a 'success' here would be to get a 1 (on a dice that already missed)
        const probabilityToGetThisAmountOfOnes = this.probabilityToGetSuccesses(missedBeforeRerolls, probabilityOfGettingOneOnFailedDice, ones)

        const whatWillBeRerolled = this.whatWillBeRerolled(ones, missedBeforeRerolls - ones, rerollFunctions)

        for (const whatWillBeRerolledItem of whatWillBeRerolled) {
          const rerollsTable = this.tableOfProbilitiesToGetSuccesses(
            whatWillBeRerolledItem.willRerollOnes + whatWillBeRerolledItem.willRerollNotOnes,
            diceProbability(melee)
          )
          for (const [rerollHits, rerollHitsProbability] of rerollsTable) {
            const newTotalHits = hitsBeforeRerolls + rerollHits
            const newTotalProbability =
              multiply(
                probabilityBeforeRerolls,
                multiply(
                  rerollHitsProbability,
                  multiply(
                    whatWillBeRerolledItem.probability,
                    probabilityToGetThisAmountOfOnes
                  )
                )
              )
            newTable.set(
              newTotalHits,
              add(newTotalProbability, newTable.get(newTotalHits) ?? fraction(0)),
            )
          }
        }
      }
    }

    return newTable
  }
  
  getChanceOfExactRerollHits(melee: Melee, rerollHits: number, missedDice: number,  rerollFunctions: RerollFunction[]): MathType {
    console.log('getChanceOfExactRerollHits', { melee, rerollHits, missedDice })
    const probabilityOfGettingOneOnFailedDice = fraction(1, (melee - 1))
    let chance = fraction(0) as any
    for (const ones of fromTo(rerollHits, missedDice)) {
      const probabilityToGetThisAmountOfOnes = this.probabilityToGetSuccesses(missedDice, probabilityOfGettingOneOnFailedDice, ones)
      const whatWillBeRerolled = this.whatWillBeRerolled(ones, missedDice - ones, rerollFunctions)
      console.log({ ones, whatWillBeRerolled })
      for (const whatWillBeRerolledItem of whatWillBeRerolled) {
        const totalRerolled = whatWillBeRerolledItem.willRerollOnes + whatWillBeRerolledItem.willRerollNotOnes
        const subChance = this.probabilityToGetSuccesses(totalRerolled, diceProbability(melee), rerollHits)
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

  applyBlast(hitsTable: Map<number, MathType>, attack: number, blast: { dice?: 3 | 6, plus?: number }): Map<number, MathType> {
    const maxHitsAfterBlastPossible = attack * ((blast?.dice ?? 0) + (blast.plus ?? 0))
    const blastTable = Array(maxHitsAfterBlastPossible + 1).fill(0)
    blastTable[0] = hitsTable.get(0)
    for (const hits of fromTo(1, attack)) {
      const blastDiceSumTable = this.getDiceSumTable(hits, blast.dice ?? 0)
      for (const [blastDiceSum, blastDiceSumChance] of blastDiceSumTable.entries()) {
        const hitsAfterBlast = blastDiceSum + (blast.plus ?? 0) * hits
        blastTable[hitsAfterBlast] = add(
          blastTable[hitsAfterBlast],
          multiply(hitsTable.get(hits) ?? fraction(0), blastDiceSumChance),
        )
      }
    }
    return new Map(blastTable.entries())
  }

  getDiceSumTable(diceCount: number, diceMaxSide: number): MathType[] {
    if (diceCount <= 0 || diceMaxSide <= 0) {
      return [fraction(1)]
    }

    const sides = fromTo(1, diceMaxSide)
    let numerators = [1] // start at 0 dice; 100% of getting 0
    for (const die of fromTo(1, diceCount)) {
      const maxSum = diceMaxSide * die
      const newNumerators = Array(maxSum + 1).fill(0)
      for (const i of numerators.keys()) {
        for (const side of sides) {
          const sum = i + side
          newNumerators[sum] += numerators[i]
        }
      }
      numerators = newNumerators
    }
    const denominator = diceMaxSide ** diceCount
    return numerators.map(numerator => fraction(numerator, denominator))
  }

  woundsTable(params: WoundsParams): Map<number, MathType> {
    const woundsTable = new Map<number, MathType>()

    for (const [hits, hitsProbability] of params.hitsTable) {
      const woundsTableForThisHits = this.hitsTable({
        attack: hits,
        melee: params.defense,
        elite: params.vicious,
        rerollFunctions: params.rerollFunctions,
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
  
  combineTables(tables: Map<number, MathType>[]): Map<number, MathType> {
    if (tables.length === 0) {
      return new Map()
    } else if (tables.length === 1) {
      return tables[0]
    } else {
      return this.combineTwoTables(tables[0], this.combineTables(tables.slice(1)))
    }
  }

  combineTwoTables(tableA: Map<number, MathType>, tableB: Map<number, MathType>): Map<number, MathType> {
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

  nerveTest(woundsTable: Map<number, MathType>, defender: Defender): NerveTest {
    const nerveTest = <NerveTest>{
      steady: fraction(0),
      waver: fraction(0),
      rout: fraction(0),
    }

    for (const [wounds, woundsProbability] of woundsTable) {
      const { steady, waver, rout } = this.nerveTestWithWounds(wounds, defender)
      nerveTest.steady = add(nerveTest.steady, multiply(woundsProbability, steady))
      nerveTest.waver = add(nerveTest.waver, multiply(woundsProbability, waver))
      nerveTest.rout = add(nerveTest.rout, multiply(woundsProbability, rout))
    }

    return nerveTest
  }

  private nerveTestWithWounds(wounds: number, defender: Defender): NerveTest {
    const sumTable2d6 = this.getDiceSumTable(2, 6)

    const toRout = defender.nerve.rout - wounds
    const toWaver =
      defender.nerve.waver === 'fearless' || defender.nerve.waver === 0
        ? 'fearless'
        : defender.nerve.waver - wounds
    
    const nerve = <NerveTest>{
      steady: fraction(0),
      waver: fraction(0),
      rout: fraction(0),
    }

    for (const [sum2d6, sum2d6probability] of sumTable2d6.entries()) {
      if (sum2d6 >= toRout) {
        nerve.rout = add(nerve.rout, sum2d6probability)
      } else if (toWaver !== 'fearless' && (sum2d6 >= toWaver || sum2d6 === 12)) {
        nerve.waver = add(nerve.waver, sum2d6probability)
      } else {
        nerve.steady = add(nerve.steady, sum2d6probability)
      }
    }

    return nerve
  }

}
