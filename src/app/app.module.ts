import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChargeInputComponent } from './charge-input/charge-input.component';
import { ModifierChipComponent } from './modifier-chip/modifier-chip.component';

@NgModule({
  declarations: [
    AppComponent,
    ChargeInputComponent,
    ModifierChipComponent
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
