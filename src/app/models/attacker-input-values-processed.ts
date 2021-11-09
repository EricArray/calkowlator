import { AttackerInputValues } from "./attacker-input-values";
import { DicePlusNumber } from "./dice-plus-number";

export interface AttackerInputValuesProcessed extends AttackerInputValues {
    attackModifiers: DicePlusNumber[];
    elite: boolean;
    vicious: boolean;
    rerollToHitList: { amount: DicePlusNumber, onlyOnes: boolean }[];
    rerollToWoundList: { amount: DicePlusNumber, onlyOnes: boolean }[];
    blast?: DicePlusNumber;
    brutal?: DicePlusNumber;
}