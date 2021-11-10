import { Injectable } from '@angular/core';
import { Blast, Brutal, Elite, Rampage, Vicious } from '@app/models/ability';
import { UnitDefinition } from '@app/models/unit-definition';

@Injectable({
  providedIn: 'root'
})
export class FactionsService {

  unitFactions: { factionName: string; units: UnitDefinition[] }[] = [
    // GOBLINS
    {
      factionName: 'Goblins',
      units: [
        {
          name: 'Mawpup upgrade',
          melee: 4,
          defense: 2,
          sizes: [
            {
              size: '1',
              attack: { plus: 6 },
              nerve: { waver: 0, rout: 0 },
            }
          ],
          cs: 1,
          abilities: [],
          affectedBy: {},
          attackerOnly: true,
        },
        {
          name: 'Rabble',
          melee: 5,
          defense: 4,
          sizes: [
            {
              size: 'Regiment',
              attack: { plus: 12 },
              nerve: { waver: 12, rout: 14 },
            },
            {
              size: 'Horde',
              attack: { plus: 25 },
              nerve: { waver: 19, rout: 21 },
            },
            {
              size: 'Legion',
              attack: { plus: 30 },
              nerve: { waver: 25, rout: 27 },
            },
          ],
          abilities: [],
          affectedBy: {
            rampage: true,
          }
        },
        {
          name: 'Fleabag Riders',
          melee: 4,
          defense: 4,
          sizes: [
            {
              size: 'Troop',
              attack: { plus: 7 },
              nerve: { waver: 9, rout: 11 },
            },
            {
              size: 'Regiment',
              attack: { plus: 14 },
              nerve: { waver: 12, rout: 14 },
            },
            {
              size: 'Horde',
              attack: { plus: 28 },
              nerve: { waver: 19, rout: 21 },
            },
          ],
          tc: 1,
          abilities: [ new Vicious() ],
          affectedBy: {
            rampage: true,
          }
        },
      ]
    },

    // OGRES
    {
      factionName: 'Ogres',
      units: [
        {
          name: 'Warriors',
          melee: 3,
          defense: 5,
          sizes: [
            {
              size: 'Regiment',
              attack: { plus: 9 },
              nerve: { waver: 12, rout: 14 },
            },
            {
              size: 'Horde',
              attack: { plus: 18 },
              nerve: { waver: 15, rout: 17 },
            },
            {
              size: 'Legion',
              attack: { plus: 36 },
              nerve: { waver: 22, rout: 24 },
            },
          ],
          cs: 1,
          abilities: [
            new Brutal({ plus: 1 }),
          ],
          affectedBy: {
            slayer: true,
          }
        },
      ]
    },
  ]
  
  constructor() { }
}
