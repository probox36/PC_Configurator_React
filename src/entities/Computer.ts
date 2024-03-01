import { CPU } from "./CPU";
import { Case } from "./Case.ts";
import { GPU } from "./GPU";
import { RAM } from "./RAM.ts";
import { PowerUnit } from "./powerUnit";
import { PrimaryStorage } from "./PrimaryStorage.ts";
import { Motherboard } from "./Motherboard.ts";
import { Part } from "./Part";
import { CaseCooler } from "./CaseCooler.ts";
import { CoolingSystem } from "./CoolingSystem";
import { Slot } from "./Slot.ts";

export class Computer {

    // readonly Case: Case;
    // readonly Motherboard: Motherboard;
    Case: Case;
    Motherboard: Motherboard;
    CPU?: CPU;
    GPU?: GPU;
    PowerUnit?: PowerUnit;
    CoolingSystem?: CoolingSystem;
    RAM: RAM[] = [];
    PrimaryStorage: PrimaryStorage[] = [];
    CaseCoolers: CaseCooler[] = [];
    FreeSlots: Map<Slot, number> = new Map<Slot, number>;

    constructor();
    constructor(computerCase: Case, motherboard: Motherboard);
    constructor (computerCase?: Case, motherboard?: Motherboard) {
        if (computerCase != undefined && motherboard != undefined) {
            this.Motherboard = motherboard;
            this.Case = computerCase;
            this.FreeSlots[Slot.SATA] = motherboard.diskConnectors['SATA'];
            this.FreeSlots[Slot.M2] = motherboard.diskConnectors['M_2'];
            this.FreeSlots[Slot.RAM] = motherboard.ramSlots;
            this.FreeSlots[Slot.HDDMounts] = computerCase.hddMounts;
        }
    }
    
    public getFreeSlotsLeft(part: Part): boolean {

        if (part instanceof CaseCooler) {
            var requiredCoolerSize = (part as CaseCooler).size;
            var freeCaseCoolerSlots = this.Case.caseCoolerMounts[requiredCoolerSize];
            this.CaseCoolers.forEach((cooler) => {
                if (cooler.size == requiredCoolerSize) {
                    freeCaseCoolerSlots--;
                }
            });
            return freeCaseCoolerSlots > 0;
            // Здесь неверный регистр - потенциальный источник ошибок
        } else if (part instanceof PrimaryStorage) {
            var disk = (part as PrimaryStorage);
            if (disk.diskSocket == 'sata' && disk.diskType == 'hdd') {
                return Math.min(this.FreeSlots['sata'], this.FreeSlots[Slot.HDDMounts]) > 0;
            }
            return this.FreeSlots[disk.diskSocket] > 0;
        } else if (part instanceof RAM) {
            return this.FreeSlots['RAM'] > 0;
        } else {
            return true;
        }

    }

    public addPart(part: Part): void {

        if (!this.getFreeSlotsLeft(part)) {
            throw new Error('No slots left for ' + part + '!');
        }

        if (part instanceof RAM) {
            this.FreeSlots[Slot.RAM]--;
            this.RAM.push(part as RAM);
        } else if (part instanceof PrimaryStorage) {
            var disk = (part as PrimaryStorage);
            if (disk.diskSocket == 'sata' && disk.diskType == 'hdd') {
                this.FreeSlots[Slot.HDDMounts]--;
            }
            this.FreeSlots[disk.diskSocket]--;
            this.PrimaryStorage.push(disk);
        } else if (part instanceof CaseCooler) {
            this.CaseCoolers.push(part as CaseCooler);
        } else {
            this[part.partClassName] = part;
        }
        // } else if (part !instanceof Case || part !instanceof Motherboard) {
        //     this[part.partClassName] = part;
        // }
    }

    public removePart(part: Part): void {

        if (part instanceof RAM) {
            this.FreeSlots['RAM']++;
            var index = this.RAM.indexOf(part as RAM);
            this.RAM.splice(index, 1);
        } else if (part instanceof PrimaryStorage) {
            var disk = (part as PrimaryStorage);
            if (disk.diskSocket == 'sata' && disk.diskType == 'hdd') {
                this.FreeSlots[Slot.HDDMounts]++;
            }
            this.FreeSlots[disk.diskSocket]++;
            var index = this.PrimaryStorage.indexOf(disk);
            this.PrimaryStorage.splice(index, 1);
        } else if (part instanceof CaseCooler) {
            var index = this.CaseCoolers.indexOf(part as CaseCooler);
            this.CaseCoolers.splice(index, 1);
        } else {
            this[part.partClassName] = null;
        }

    }

    public multipleSelectionAvailable(part: Part): boolean {

        if (part instanceof RAM) {
            return this.Motherboard.ramSlots > 1;
        } else if (part instanceof PrimaryStorage) {
            var disk = part as PrimaryStorage;
            if (disk.diskType == 'hdd') {
                return Math.min(this.Motherboard.diskConnectors['sata'], this.Case.hddMounts) > 1;
            } else {
                return this.Motherboard.diskConnectors[disk.diskSocket] > 1;
            }
        } else if (part instanceof CaseCooler) {
            return this.Case[(part as CaseCooler).size] > 1;
        } else {
            return false;
        }
        
    }

}