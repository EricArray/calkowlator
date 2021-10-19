import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChargeInputComponent } from './components/charge-input/charge-input.component';
import { ModifierChipComponent } from './components/modifier-chip/modifier-chip.component';
import { ChargeOutputComponent } from './components/charge-output/charge-output.component';
import { BootstrapTooltipDirective } from './directives/bootstrap-tooltip.directive';

@NgModule({
  declarations: [
    AppComponent,
    ChargeInputComponent,
    ModifierChipComponent,
    ChargeOutputComponent,
    BootstrapTooltipDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
