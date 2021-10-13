import { Component, OnInit } from '@angular/core';
import { Melee } from 'src/app/services/dice-rolls.service';

interface Attacker {
  name?: string;
  active: boolean;
  melee: Melee;
  attack: number;
  cs?: number,
  tc?: number,
  elite: boolean;
  vicious: boolean;
  reroll1hit?: boolean;
  blastDice?: 3 | 6;
  blastPlus?: number;
  facing: 'front' | 'flank' | 'rear';
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

export interface Charge {
  attackers: Attacker[];
  defender: Defender;
}

@Component({
  selector: 'app-charge-input',
  templateUrl: './charge-input.component.html',
  styleUrls: ['./charge-input.component.css']
})
export class ChargeInputComponent  {
  charge: Charge = {
    attackers: [ defaultAttacker() ],
    defender: {
      defense: 4,
    },
  }

  constructor() { }

  addAttacker(): void {
    this.charge.attackers = [
      ...this.charge.attackers,
      defaultAttacker()
    ]
  }

  duplicateAttacker(duplicateIndex: number): void {
    const newAttacker = { ...this.charge.attackers[duplicateIndex] }
    this.charge.attackers.splice(duplicateIndex + 1, 0, newAttacker)
  }

  removeAttacker(removeIndex: number): void {
    this.charge.attackers = this.charge.attackers.filter((attacker, index) => index !== removeIndex)
  }

}
