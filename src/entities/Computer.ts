import { CPU } from "./CPU";
import { Case } from "./Case";
import { GPU } from "./GPU";
import { RAM } from "./RAM";
import { PowerUnit } from "./powerUnit";
import { Storage } from "./Storage";
import { Motherboard } from "./Motherboard";

export class Computer {

    readonly computerCase: Case;
    readonly motherboard: Motherboard;
    cpu?: CPU;
    gpu?: GPU;
    ram?: RAM[];
    powerUnit?: PowerUnit;
    storage?: Storage[];

    constructor (computerCase: Case, motherboard: Motherboard) {
        this.motherboard = motherboard;
        this.computerCase = computerCase;
    }

}