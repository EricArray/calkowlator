import { Fraction } from "mathjs";
import { Charge } from "../charge-input/charge-input.component";
import { NerveTest } from "./nerve-test";

export interface ChargeResult {
    charge: Charge;
    
    hitsTable: Map<number, Fraction>;
    woundsTable: Map<number, Fraction>;
    nerveTest: NerveTest;
}