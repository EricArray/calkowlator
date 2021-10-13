import { Component, OnInit } from '@angular/core';
import { Melee } from 'src/app/services/dice-rolls.service';

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

  removeAttacker(removeIndex: number): void {
    this.charge.attackers = this.charge.attackers.filter((attacker, index) => index !== removeIndex)
  }

}
