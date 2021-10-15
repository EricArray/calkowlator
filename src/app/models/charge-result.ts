import { Fraction } from "mathjs";
import { Charge } from "../charge-input/charge-input.component";

export interface ChargeResult {
    charge: Charge;
    
    hitsTable: Map<number, Fraction>;
    woundsTable: Map<number, Fraction>;
    average: number;
}