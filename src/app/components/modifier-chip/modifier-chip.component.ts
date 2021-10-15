import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ability, Elite } from '@models/ability';

@Component({
  selector: 'app-modifier-chip',
  templateUrl: './modifier-chip.component.html',
  styleUrls: ['./modifier-chip.component.css']
})
export class ModifierChipComponent  {
  @Input() ability: Ability = new Elite(); // initialize with something, so tests don't break
  @Output() remove = new EventEmitter<void>()

}
