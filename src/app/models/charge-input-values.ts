import { AttackerInputValues } from "./attacker-input-values";
import { DefenderInputValues } from "./defender-input-values";

export interface ChargeInputValues {
    attackers: AttackerInputValues[];
    defender: DefenderInputValues;
}