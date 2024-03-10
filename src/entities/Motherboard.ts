import { Part } from "./Part.ts";
import { PartClassName } from "./PartClassName.ts";

export class Motherboard extends Part {
    partClassName: PartClassName;
    ramSlots: number;
    maxMemory: number;
    diskConnectors: Map<string, number>;

    constructor(id: number, modelName: string, price: number, description: string, imgAddress: string, ramSlots: number, 
        maxMemory: number, diskConnectors: Map<string, number>) {
        super(id, modelName, price, description, imgAddress);
        this.ramSlots = ramSlots;
        this.maxMemory = maxMemory;
        this.diskConnectors = diskConnectors;
        this.partClassName = PartClassName.Motherboard;
    }
}