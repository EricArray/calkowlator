import { Injectable } from '@angular/core';
import { Blast, Brutal, Elite, Vicious } from '@app/models/ability';
import { Attacker } from '@app/models/attacker';
import { Defender } from '@app/models/defender';

@Injectable({
  providedIn: 'root'
})
export class FactionsService {

  loadAttackerFactions: { factionName: string; units: Attacker[] }[] = [
    {
      factionName: 'Goblins',
      units: [
        {
          name: 'Rabble',
          active: true,
          melee: 5,
          attack: { plus: 12 },
          attackModifiers: [],
          elite: false,
          vicious: false,
          rerollToHitList: [],
          rerollToWoundList: [],
          abilities: [],
          facing: 'front'
        },
        {
          name: 'Mawpup upgrade',
          active: true,
          melee: 4,
          attack: { plus: 6 },
          attackModifiers: [],
          cs: 1,
          elite: false,
          vicious: false,
          rerollToHitList: [],
          rerollToWoundList: [],
          abilities: [],
          facing: 'front'
        },
        {
          name: 'Giant',
          active: true,
          melee: 4,
          attack: { dice: 6, plus: 8 },
          attackModifiers: [],
          cs: 4,
          elite: false,
          vicious: false,
          rerollToHitList: [],
          rerollToWoundList: [],
          abilities: [
            new Brutal({ plus: 1 }),
          ],
          facing: 'front'
        },
        {
          name: 'Big Rock Thrower + Elite',
          active: true,
          melee: 5,
          attack: { plus: 2 },
          attackModifiers: [],
          cs: 3,
          elite: true,
          vicious: false,
          rerollToHitList: [],
          rerollToWoundList: [],
          abilities: [
            new Blast({ dice: 3, plus: 1 }),
            new Elite(),
          ],
          facing: 'front'
        },
      ]
    },
    {
      factionName: 'Abyssal Dwarfs',
      units: [
        {
          name: 'Grog Mortar',
          active: true,
          melee: 5,
          attack: { plus: 2 },
          attackModifiers: [],
          cs: 2,
          elite: false,
          vicious: true,
          rerollToHitList: [],
          rerollToWoundList: [],
          abilities: [
            new Blast({ dice: 3, plus: 1 }),
            new Vicious(),
          ],
          facing: 'front'
        },
      ],
    },
    {
      factionName: 'Ogres',
      units: [
        {
          name: 'Warriors',
          active: true,
          melee: 3,
          attack: { plus: 18 },
          attackModifiers: [],
          cs: 1,
          elite: false,
          vicious: false,
          rerollToHitList: [],
          rerollToWoundList: [],
          abilities: [
            new Brutal({ plus: 1 }),
          ],
          facing: 'front'
        },
      ]
    },
    {
      factionName: 'Undead',
      units: [
        {
          name: 'Zombies Legion',
          active: true,
          melee: 5,
          attack: { plus: 30 },
          attackModifiers: [],
          elite: false,
          vicious: false,
          rerollToHitList: [],
          rerollToWoundList: [],
          abilities: [],
          facing: 'front',
        },
      ]
    },
    {
      factionName: 'Elves',
      units: [
        {
          name: 'Kindred Archers Horde (Melee)',
          active: true,
          melee: 5,
          attack: { plus: 20 },
          attackModifiers: [],
          elite: false,
          vicious: false,
          rerollToHitList: [],
          rerollToWoundList: [],
          abilities: [],
          facing: 'front',
        },
        {
          name: 'Kindred Archers Horde (Shooting)',
          active: true,
          melee: 4,
          attack: { plus: 20 },
          attackModifiers: [],
          elite: true,
          vicious: false,
          rerollToHitList: [],
          rerollToWoundList: [],
          abilities: [
            new Elite(),
          ],
          facing: 'front',
        },
      ]
    },
  ]

  loadDefenderFactions: { factionName: string; units: Defender[] }[] = [
    {
      factionName: 'Goblins',
      units: [
        {
          name: 'Rabble',
          defense: 4,
          nerve: {
            waver: 12,
            rout: 14,
          },
          affectedByRampage: true,
          inspired: true,
        },
        {
          name: 'Big Rock Thrower',
          defense: 4,
          nerve: {
            waver: 9,
            rout: 11,
          },
          inspired: true,
        },
      ]
    },
    {
      factionName: 'Abyssal Dwarfs',
      units: [
        {
          name: 'Grog Mortar',
          defense: 5,
          nerve: {
            waver: 10,
            rout: 12,
          },
          inspired: true,
        },
        {
          name: 'Gargoyles',
          defense: 3,
          nerve: {
            waver: 8,
            rout: 10,
          },
          affectedByRampage: true,
          inspired: true,
        },
      ]
    },
    {
      factionName: 'Ogres',
      units: [
        {
          name: 'Warriors',
          defense: 5,
          nerve: {
            waver: 15,
            rout: 17,
          },
          affectedBySlayer: true,
          inspired: true,
        },
      ]
    },
    {
      factionName: 'Undead',
      units: [
        {
          name: 'Zombies Legion',
          defense: 2,
          nerve: {
            waver: 'fearless',
            rout: 28,
          },
          affectedByRampage: true,
          inspired: true,
        },
      ]
    },
    {
      factionName: 'Elves',
      units: [
        {
          name: 'Kindred Archers Horde',
          defense: 3,
          nerve: {
            waver: 21,
            rout: 23,
          },
          affectedByRampage: true,
          inspired: true,
        },
      ]
    },
  ]
  
  constructor() { }
}
