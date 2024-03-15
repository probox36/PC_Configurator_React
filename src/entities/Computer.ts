import { CPU } from "./CPU";
import { Case } from "./Case.ts";
import { GPU } from "./GPU";
import { RAM } from "./RAM.ts";
import { PowerUnit } from "./powerUnit";
import { PrimaryStorage } from "./PrimaryStorage.ts";
import { Motherboard } from "./Motherboard.ts";
import { Part } from "./Part.ts";
import { CaseCooler } from "./CaseCooler.ts";
import { CoolingSystem } from "./CoolingSystem";
import { Slot } from "./Slot.ts";
import { PartClassName } from "./PartClassName.ts";

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
    }

    public removePart(part: Part): void {

        if (part instanceof RAM) {
            this.FreeSlots['RAM']++;
            this.removeFromArray(part as RAM);
        } else if (part instanceof PrimaryStorage) {
            var disk = (part as PrimaryStorage);
            if (disk.diskSocket == 'sata' && disk.diskType == 'hdd') {
                this.FreeSlots[Slot.HDDMounts]++;
            }
            this.FreeSlots[disk.diskSocket]++;
            this.removeFromArray(disk);
        } else if (part instanceof CaseCooler) {
            this.removeFromArray(part as CaseCooler);
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

    public removeFromArray(part: Part):void {
        
        if (part instanceof RAM || part instanceof PrimaryStorage || part instanceof CaseCooler) {
            const array = this[part.partClassName];
            let indexToRemove = -1;
            for (let i = 0; i < array.length; i++) {
                if (array[i].id == part.id) {
                    indexToRemove = i;
                    break;
                }
            }
            if (indexToRemove != -1) {
                array.splice(indexToRemove, 1);
            } else {
                throw Error(`Can't remove object of type ${part.partClassName} with id = ${part.id}: no such object`);
            }
        }

    }

    public calculateTotalCost():number {
        let price = 0;
        Object.values(PartClassName).forEach((partClass) => {
            price += this.getCostByPartClass(partClass);
        });
        return price;
    }

    public getCostByPartClass(partClass: PartClassName):number {
        const part: Part = this[partClass];
        let price = 0;
        if (part != undefined) {
            if (Array.isArray(part)) {
                part.forEach((element: Part) => {
                    price += element.price;
                });
            } else {
                price = part.price;
            }
        }
        return price;
    }

    public getGeneralNameOfPartClass(partClass: PartClassName) {

        const part = this[partClass];

        if (!Array.isArray(part)) { return part.modelName; }
    
        let partNames = {};
        let generalName = "";
    
        part.forEach(part => {
          if (partNames[part.modelName] === undefined) {
            partNames[part.modelName] = 1;
          } else {
            partNames[part.modelName] += 1;
          }
        });
    
        let keys = Object.keys(partNames);
    
        for (let i = 0; i < keys.length; i++) {
          let key = Object.keys(partNames)[i];
          if (partNames[key] === 1) {
            generalName += key;
          } else {
            generalName = generalName + key + " x" + partNames[key];
          }
          if (i !== keys.length - 1) {
            generalName += ", "
          }
        }
    
        return generalName;
      };

    public countSimilarParts(part: Part): number {
        let existingPart = this[part.partClassName];
        let count = 0;
        if (Array.isArray(existingPart)) {
          existingPart.forEach((elem) => {
            if (elem.isEqual(part)) {
              count++;
            }
          });
        } else {
          existingPart = existingPart as Part;
          if (existingPart.isEqual(part)) { count++; }
        }
        return count;
    };

    public isSlotEmpty(partClass: PartClassName): boolean {
        const existingPart = this[partClass];
        return !(existingPart instanceof Array && existingPart.length > 0
        || existingPart instanceof Map && existingPart.size > 0
        || !(existingPart instanceof Map) && !(existingPart !instanceof Array) && existingPart != undefined);
    }

    public wasSomethingAdded(): boolean {
        let result = false;
        Object.values(PartClassName).forEach((partClass) => {
            if (partClass != PartClassName.Motherboard 
                && partClass != PartClassName.Case 
                && !this.isSlotEmpty(partClass)) {
                    result = true;
            }
        });
        return result;
    }

}