import { TestBed } from '@angular/core/testing';
import { DefenderInputValues } from '@app/models/defender-input-values';
import { equal, typeOf, fraction, multiply, add } from 'mathjs';

import { DiceRollsService } from './dice-rolls.service';

function customEqualityTestForFractions(first: any, second: any): boolean | undefined {
  if (typeOf(first) === 'Fraction' || typeOf(second) === 'Fraction') {
    return equal(first, second) as boolean
  }
  return undefined
}

describe('DiceRollsService', () => {
  let service: DiceRollsService

  beforeEach(() => {
    jasmine.addCustomEqualityTester(customEqualityTestForFractions)
    TestBed.configureTestingModule({})
    service = TestBed.inject(DiceRollsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  describe('probabilityToGetSuccesses', () => {
    describe('1 dice on 3+', () => {
      it('0 success = 2/6', () => {
        expect(service.probabilityToGetSuccesses(1, fraction(4, 6), 0)).toEqual(fraction(2, 6))
      })
      it('1 success = 4/6', () => {
        expect(service.probabilityToGetSuccesses(1, fraction(4, 6), 1)).toEqual(fraction(4, 6))
      })
    })

    describe('2 dice on 4+', () => {
      it('0 success = 1/4', () => {
        expect(service.probabilityToGetSuccesses(2, fraction(3, 6), 0)).toEqual(fraction(1, 4))
      })
      it('1 success = 1/2', () => {
        expect(service.probabilityToGetSuccesses(2, fraction(3, 6), 1)).toEqual(fraction(1, 2))
      })
      it('3 success = 1/4', () => {
        expect(service.probabilityToGetSuccesses(2, fraction(3, 6), 2)).toEqual(fraction(1, 4))
      })
    })
  })


  describe('tableOfProbilitiesToGetSuccesses', () => {
    it('0 dice on 4+', () => {
      expect(service.tableOfProbilitiesToGetSuccesses(0, fraction(3, 6))).toEqual(new Map([
        [0, fraction(1)],
      ]))
    })
    it('1 dice on 3+', () => {
      expect(service.tableOfProbilitiesToGetSuccesses(1, fraction(4, 6))).toEqual(new Map([
        [0, fraction(2, 6)],
        [1, fraction(4, 6)],
      ]))
    })
    it('2 dice on 4+', () => {
      expect(service.tableOfProbilitiesToGetSuccesses(2, fraction(3, 6))).toEqual(new Map([
        [0, fraction(1, 4)],
        [1, fraction(2, 4)],
        [2, fraction(1, 4)],
      ]))
    })
  })

  describe('hitsTable', () => {
    it('attack: 1, melee: 3+', () => {
      expect(service.hitsTable({ attack: { plus: 1 }, melee: 3 })).toEqual(new Map([
        [0, fraction(2, 6)],
        [1, fraction(4, 6)],
      ]))
    })
    it('attack: 1, melee: 3+, elite', () => {
      expect(service.hitsTable({ attack: { plus: 1 }, melee: 3, elite: true})).toEqual(new Map([
        [0, fraction(16, 72)],
        [1, fraction(56, 72)],
      ]))
    })
    it('attack: 2, melee: 4+, reroll up to 1 dice', () => {
      expect(service.hitsTable({ attack: { plus: 2 }, melee: 4, rerollList: [{ amount: { plus: 1 } }] })).toEqual(new Map([
        [0, fraction(1, 8)],
        [1, fraction(3, 8)],
        [2, fraction(4, 8)],
      ]))
    })
    it('attack: 1, melee: 4+, blast D3', () => {
      expect(service.hitsTable({ attack: { plus: 1 }, melee: 4, blast: { dice: 3 } })).toEqual(new Map([
        [0, fraction(1, 2)],
        [1, fraction(1, 6)],
        [2, fraction(1, 6)],
        [3, fraction(1, 6)],
      ]))
    })
    it('attack: 1, melee: 4+, blast D6', () => {
      expect(service.hitsTable({ attack: { plus: 1 }, melee: 4, blast: { dice: 6 } })).toEqual(new Map([
        [0, fraction(1, 2)],
        [1, fraction(1, 12)],
        [2, fraction(1, 12)],
        [3, fraction(1, 12)],
        [4, fraction(1, 12)],
        [5, fraction(1, 12)],
        [6, fraction(1, 12)],
      ]))
    })
    it('attack: 1, melee: 4+, blast D3 + 1', () => {
      expect(service.hitsTable({ attack: { plus: 1 }, melee: 4, blast: { dice: 3, plus: 1 } })).toEqual(new Map([
        [0, fraction(1, 2)],
        [1, fraction(0)],
        [2, fraction(1, 6)],
        [3, fraction(1, 6)],
        [4, fraction(1, 6)],
      ]))
    })
    it('attack: 2, melee: 4+, blast D3', () => {
      expect(service.hitsTable({ attack: { plus: 2 }, melee: 4, blast: { dice: 3 } })).toEqual(new Map([
        [0, fraction(1, 4)],
        [1, fraction(1, 6)],
        [2, fraction(7, 36)],
        [3, fraction(8, 36)],
        [4, fraction(3, 36)],
        [5, fraction(2, 36)],
        [6, fraction(1, 36)],
      ]))
    })
    it('attack: 1, melee: 4+, blast undefined', () => {
      expect(service.hitsTable({ attack: { plus: 1 }, melee: 4, blast: { } })).toEqual(new Map([
        [0, fraction(1, 1)],
      ]))
    })
    it('attack: 1, melee: 4+, blast 1', () => {
      expect(service.hitsTable({ attack: { plus: 1 }, melee: 4, blast: { plus: 1 } })).toEqual(new Map([
        [0, fraction(1, 2)],
        [1, fraction(1, 2)],
      ]))
    })
    it('attack: 1, melee: 4+, blast 2', () => {
      expect(service.hitsTable({ attack: { plus: 1 }, melee: 4, blast: { plus: 2} })).toEqual(new Map([
        [0, fraction(1, 2)],
        [1, fraction(0, 1)],
        [2, fraction(1, 2)],
      ]))
    })
  })
  
  describe('woundsTable', () => {
    it('attack: 1, melee: 4+, defense: 4+', () => {
      const hitsTable = service.hitsTable({ attack: { plus: 1 }, melee: 4 })
      const woundsTable = service.woundsTable({ hitsTable, defense: 4 })
      expect(woundsTable).toEqual(new Map([
        [0, fraction(3, 4)],
        [1, fraction(1, 4)],
      ]))
    })
    it('attack: 2, melee: 4+, defense: 4+', () => {
      const hitsTable = service.hitsTable({ attack: { plus: 2 }, melee: 4 })
      const woundsTable = service.woundsTable({ hitsTable, defense: 4 })
      expect(woundsTable).toEqual(new Map([
        [0, fraction(9, 16)],
        [1, fraction(6, 16)],
        [2, fraction(1, 16)],
      ]))
    })
    it('attack: 2, melee: 4+, defense: 4+', () => {
      const hitsTable = service.hitsTable({ attack: { plus: 2 }, melee: 4 })
      const woundsTable = service.woundsTable({ hitsTable, defense: 4 })
      expect(woundsTable).toEqual(new Map([
        [0, fraction(9, 16)],
        [1, fraction(6, 16)],
        [2, fraction(1, 16)],
      ]))
    })
    it('attack: 3, melee: 6+, defense: 3+, elite and vicious', () => {
      const hitsTable = service.hitsTable({ attack: { plus: 3 }, melee: 6, elite: true})
      const woundsTable = service.woundsTable({ hitsTable, defense: 3, vicious: true })
      expect(woundsTable).toEqual(new Map([
        [0, fraction(20796875, 34012224)],
        [1, fraction(3705625, 11337408)],
        [2, fraction(660275, 11337408)],
        [3, fraction(117649, 34012224)],
      ]))
    })
  })

  describe('combineTables', () => {
    it('combine [50%, 50%] and [50%, 50%]', () => {
      const tableA = new Map([
        [0, fraction(1, 2)],
        [1, fraction(1, 2)],
      ])
      const tableB = new Map([
        [0, fraction(1, 2)],
        [1, fraction(1, 2)],
      ])
      expect(service.combineTwoTables(tableA, tableB)).toEqual(new Map([
        [0, fraction(1, 4)],
        [1, fraction(2, 4)],
        [2, fraction(1, 4)],
      ]))
    })
    it('combine [75%, 25%] and [75%, 25%]', () => {
      const tableA = new Map([
        [0, fraction(3, 4)],
        [1, fraction(1, 4)],
      ])
      const tableB = new Map([
        [0, fraction(3, 4)],
        [1, fraction(1, 4)],
      ])
      expect(service.combineTwoTables(tableA, tableB)).toEqual(new Map([
        [0, fraction(9, 16)],
        [1, fraction(6, 16)],
        [2, fraction(1, 16)],
      ]))
    })
    it('combine [50%, 50%] and [75%, 25%]', () => {
      const tableA = new Map([
        [0, fraction(1, 2)],
        [1, fraction(1, 2)],
      ])
      const tableB = new Map([
        [0, fraction(3, 4)],
        [1, fraction(1, 4)],
      ])
      expect(service.combineTwoTables(tableA, tableB)).toEqual(new Map([
        [0, fraction(3, 8)],
        [1, fraction(4, 8)],
        [2, fraction(1, 8)],
      ]))
    })
  })
  
  describe('differenceTable', () => {
    it('between [50%, 50%] and [50%, 50%]', () => {
      const tableA = new Map([
        [0, fraction(1, 2)],
        [1, fraction(1, 2)],
      ])
      const tableB = new Map([
        [0, fraction(1, 2)],
        [1, fraction(1, 2)],
      ])
      expect(service.differenceTable(tableA, tableB)).toEqual(new Map([
        [0, fraction(0)],
        [1, fraction(0)],
      ]))
    })
    it('between [75%, 25%] and [50%, 50%]', () => {
      const tableA = new Map([
        [0, fraction(3, 4)],
        [1, fraction(1, 4)],
      ])
      const tableB = new Map([
        [0, fraction(1, 2)],
        [1, fraction(1, 2)],
      ])
      expect(service.differenceTable(tableA, tableB)).toEqual(new Map([
        [0, fraction(1, 4)],
        [1, fraction(-1, 4)],
      ]))
    })
  })

  const dwarfIroncladRegiment: DefenderInputValues = {
    name: 'Ironclad Regiment',
    defense: 4,
    nerve: { waver: 14, rout: 16 },
    affectedBy: { rampage: true },
    inspired: false,
  }

  const dwarfIroncladRegiment_inspired: DefenderInputValues = {
    name: 'Ironclad Regiment',
    defense: 4,
    nerve: { waver: 14, rout: 16 },
    affectedBy: { rampage: true },
    inspired: true,
  }

  const dwarfBerserkersRegiment: DefenderInputValues = {
    name: 'Berserkers Regiment',
    defense: 4,
    nerve: { waver: 'fearless', rout: 17 },
    affectedBy: { rampage: true },
    inspired: false,
  }

  const dwarfBerserkersRegiment_inspired: DefenderInputValues = {
    name: 'Berserkers Regiment',
    defense: 4,
    nerve: { waver: 'fearless', rout: 17 },
    affectedBy: { rampage: true },
    inspired: true,
  }

  const gargoylesTroop: DefenderInputValues = {
    name: 'Gargoyles Troop',
    defense: 3,
    nerve: { waver: 8, rout: 10 },
    affectedBy: { rampage: true },
    inspired: false,
  }

  const gargoylesTroop_inspired: DefenderInputValues = {
    name: 'Gargoyles Troop',
    defense: 3,
    nerve: { waver: 8, rout: 10 },
    affectedBy: { rampage: true },
    inspired: true,
  }

  describe('nerveTestWithWounds', () => {
    it('14/16 on 0 wounds', () => {
      expect(service.nerveTestWithWounds(0, dwarfIroncladRegiment)).toEqual({
        steady: fraction(35, 36),
        waver: fraction(1, 36),
        rout: fraction(0),
      })
    })
    
    it('14/16 on 0 wounds, inspired', () => {
      expect(service.nerveTestWithWounds(0, dwarfIroncladRegiment_inspired)).toEqual({
        steady: fraction(35, 36),
        waver: fraction(1, 36),
        rout: fraction(0),
      })
    })
    
    it('14/16 on 1 wounds', () => {
      expect(service.nerveTestWithWounds(1, dwarfIroncladRegiment)).toEqual({
        steady: fraction(35, 36),
        waver: fraction(1, 36),
        rout: fraction(0),
      })
    })
    
    it('14/16 on 1 wounds, inspired', () => {
      expect(service.nerveTestWithWounds(1, dwarfIroncladRegiment_inspired)).toEqual({
        steady: fraction(35, 36),
        waver: fraction(1, 36),
        rout: fraction(0),
      })
    })
    
    it('14/16 on 2 wounds', () => {
      expect(service.nerveTestWithWounds(2, dwarfIroncladRegiment)).toEqual({
        steady: fraction(35, 36),
        waver: fraction(1, 36),
        rout: fraction(0),
      })
    })
    
    it('14/16 on 3 wounds', () => {
      expect(service.nerveTestWithWounds(3, dwarfIroncladRegiment)).toEqual({
        steady: fraction(33, 36),
        waver: fraction(3, 36),
        rout: fraction(0),
      })
    })
    
    it('14/16 on 4 wounds', () => {
      expect(service.nerveTestWithWounds(4, dwarfIroncladRegiment)).toEqual({
        steady: fraction(30, 36),
        waver: fraction(5, 36),
        rout: fraction(1, 36),
      })
    })

    it('14/16 on 5 wounds', () => {
      expect(service.nerveTestWithWounds(5, dwarfIroncladRegiment)).toEqual({
        steady: fraction(26, 36),
        waver: fraction(7, 36),
        rout: fraction(3, 36),
      })
    })
    
    it('14/16 on 6 wounds', () => {
      expect(service.nerveTestWithWounds(6, dwarfIroncladRegiment)).toEqual({
        steady: fraction(21, 36),
        waver: fraction(9, 36),
        rout: fraction(6, 36),
      })
    })
    
    it('14/16 on 6 wounds, inspired', () => {
      expect(service.nerveTestWithWounds(6, dwarfIroncladRegiment_inspired)).toEqual({
        steady: add(fraction(21, 36), multiply(fraction(6, 36), fraction(21, 36))),
        waver: add(fraction(9, 36), multiply(fraction(6, 36), fraction(9, 36))),
        rout: multiply(fraction(6, 36), fraction(6, 36)),
      })
    })
    
    it('-/17 on 0 wounds', () => {
      expect(service.nerveTestWithWounds(0, dwarfBerserkersRegiment)).toEqual({
        steady: fraction(1),
        waver: fraction(0),
        rout: fraction(0),
      })
    })
    
    it('-/17 on 0 wounds, inspired', () => {
      expect(service.nerveTestWithWounds(0, dwarfBerserkersRegiment_inspired)).toEqual({
        steady: fraction(1),
        waver: fraction(0),
        rout: fraction(0),
      })
    })
    
    it('-/17 on 1 wounds', () => {
      expect(service.nerveTestWithWounds(1, dwarfBerserkersRegiment)).toEqual({
        steady: fraction(1),
        waver: fraction(0),
        rout: fraction(0),
      })
    })
    
    it('-/17 on 0 wounds, inspired', () => {
      expect(service.nerveTestWithWounds(1, dwarfBerserkersRegiment_inspired)).toEqual({
        steady: fraction(1),
        waver: fraction(0),
        rout: fraction(0),
      })
    })
    
    it('-/17 on 5 wounds', () => {
      expect(service.nerveTestWithWounds(5, dwarfBerserkersRegiment)).toEqual({
        steady: fraction(35, 36),
        waver: fraction(0),
        rout: fraction(1, 36),
      })
    })
    
    it('-/17 on 5 wounds, inspired', () => {
      expect(service.nerveTestWithWounds(5, dwarfBerserkersRegiment_inspired)).toEqual({
        steady: add(fraction(35, 36), multiply(fraction(1, 36), fraction(35, 36))),
        waver: fraction(0),
        rout: multiply(fraction(1, 36), fraction(1, 36)),
      })
    })
    
    it('-/17 on 10 wounds', () => {
      expect(service.nerveTestWithWounds(10, dwarfBerserkersRegiment)).toEqual({
        steady: fraction(15, 36),
        waver: fraction(0),
        rout: fraction(21, 36),
      })
    })
    
    it('-/17 on 10 wounds, inpsired', () => {
      expect(service.nerveTestWithWounds(10, dwarfBerserkersRegiment_inspired)).toEqual({
        steady: add(fraction(15, 36), multiply(fraction(21, 36), fraction(15, 36))),
        waver: fraction(0),
        rout: multiply(fraction(21, 36), fraction(21, 36)),
      })
    })
  })

  describe('nerveTest', () => {
    it('wounds: [0 => 100%] should not roll nerve', () => {
      const woundsTable = new Map([[0, fraction(1)]])
      const defender: DefenderInputValues = {
        name: '',
        defense: 4,
        inspired: true,
        nerve: { waver: 1, rout: 2 }, // nerve 1/2 would be steady only 1/36 if tested
        affectedBy: {},
      }
      expect(service.nerveTest(woundsTable, defender, [])).toEqual({
        steady: fraction(1),
        waver: fraction(0),
        rout: fraction(0),
      })
    })
    
    it('wounds: [0 => 3/4, 1 => 1/4] against 14/16', () => {
      const woundsTable = new Map([
        [0, fraction(3, 4)],
        [1, fraction(1, 4)],
      ])
      expect(service.nerveTest(woundsTable, dwarfIroncladRegiment, [])).toEqual({
        steady: fraction(36*4 - 1, 36*4),
        waver: fraction(1, 36*4),
        rout: fraction(0),
      })
    })
    
    it('wounds: [0 => 3/4, 1 => 1/4] against 14/16, inspired', () => {
      const woundsTable = new Map([
        [0, fraction(3, 4)],
        [1, fraction(1, 4)],
      ])
      expect(service.nerveTest(woundsTable, dwarfIroncladRegiment_inspired, [])).toEqual({
        steady: fraction(36*4 - 1, 36*4),
        waver: fraction(1, 36*4),
        rout: fraction(0),
      })
    })
    
    it('wounds: [0 => 3/4, 1 => 1/4] against -/17', () => {
      const woundsTable = new Map([
        [0, fraction(3, 4)],
        [1, fraction(1, 4)],
      ])
      expect(service.nerveTest(woundsTable, dwarfBerserkersRegiment, [])).toEqual({
        steady: fraction(1),
        waver: fraction(0),
        rout: fraction(0),
      })
    })
    
    it('wounds: [0 => 3/4, 1 => 1/4] against -/17, inspired', () => {
      const woundsTable = new Map([
        [0, fraction(3, 4)],
        [1, fraction(1, 4)],
      ])
      expect(service.nerveTest(woundsTable, dwarfBerserkersRegiment_inspired, [])).toEqual({
        steady: fraction(1),
        waver: fraction(0),
        rout: fraction(0),
      })
    })
    
    it('wounds: [0 => 3/4, 1 => 1/4] against 8/10', () => {
      const woundsTable = new Map([
        [0, fraction(3, 4)],
        [1, fraction(1, 4)],
      ])
      expect(service.nerveTest(woundsTable, gargoylesTroop, [])).toEqual({
        steady: add(fraction(3, 4), multiply(fraction(1, 4), fraction(15, 36))),
        waver: multiply(fraction(1, 4), fraction(11, 36)),
        rout: multiply(fraction(1, 4), fraction(10, 36)),
      })
    })
    
    it('wounds: [0 => 3/4, 1 => 1/4] against 8/10, inspired', () => {
      const woundsTable = new Map([
        [0, fraction(3, 4)],
        [1, fraction(1, 4)],
      ])
      expect(service.nerveTest(woundsTable, gargoylesTroop_inspired, [])).toEqual({
        steady: fraction(4578, 5184),
        waver: fraction(506, 5184),
        rout: fraction(100, 5184),
      })
    })
    
  })
})
