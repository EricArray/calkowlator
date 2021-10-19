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
          attack: 12,
          elite: false,
          vicious: false,
          rerollToHitList: [],
          rerollToWoundList: [],
          abilities: [],
          facing: 'front'
        },
        {
          name: 'Mawpup',
          active: true,
          melee: 4,
          attack: 6,
          cs: 1,
          elite: false,
          vicious: false,
          rerollToHitList: [],
          rerollToWoundList: [],
          abilities: [],
          facing: 'front'
        },
        {
          name: 'Big Rock Thrower + Elite',
          active: true,
          melee: 5,
          attack: 2,
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
          attack: 2,
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
          attack: 18,
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
          attack: 30,
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
          attack: 20,
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
          attack: 20,
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
          inspired: true,
        },
      ]
    },
  ]
  
  constructor() { }
}
