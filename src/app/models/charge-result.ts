import { Fraction } from "mathjs";
import { ChargeInputValues } from "./charge-input-values";
import { NerveTest } from "./nerve-test";

export interface ChargeResult {
    charge: ChargeInputValues;
    
    hitsTable: Map<number, Fraction>;
    woundsTable: Map<number, Fraction>;
    nerveTest: NerveTest;
}