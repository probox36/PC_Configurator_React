import { Part } from "./Part";
import { PartClassName } from "./PartClassName.ts";

export class Motherboard implements Part {
    id: number;
    modelName: string;
    price: number;
    description: string;
    imgAddress: string;
    partClassName: PartClassName;
    ramSlots: number;
    maxMemory: number;
    diskConnectors: Map<string, number>;

    constructor();
    constructor(id: number, modelName: string, price: number, description: string, imgAddress: string, ramSlots: number, 
        maxMemory: number, diskConnectors: Map<string, number>);
    constructor(id?: number, modelName?: string, price?: number, description?: string, imgAddress?: string, ramSlots?: number, 
        maxMemory?: number, diskConnectors?: Map<string, number>) {
        if (id != undefined && modelName != undefined && price != undefined && description != undefined && 
            imgAddress != undefined && ramSlots != undefined && maxMemory != undefined && diskConnectors != undefined) {
                this.id = id;
                this.modelName = modelName;
                this.price = price;
                this.description = description;
                this.imgAddress = imgAddress;
                this.ramSlots = ramSlots;
                this.maxMemory = maxMemory;
                this.diskConnectors = diskConnectors;
            }
        this.partClassName = PartClassName.Motherboard;
    }
}