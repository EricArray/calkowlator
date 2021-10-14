// reroll types:
// * all ones
// * up to 1 dice
// * up to 3 ones
// * up to 3 dice
// * up to D3 dice

import { MathType } from "mathjs"

export type RerollFunction = (ones: number, notOnes: number) => { willRerollOnes: number, willRerollNotOnes: number, probability?: MathType }[]

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
