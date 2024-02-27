import { Part } from "./Part";

export class Motherboard implements Part {
    id: number;
    modelName: string;
    price: number;
    description: string;
    imgAddress: string;
    partClassName: string = "motherboard";
    ramSlots: number;
    maxMemory: number;
    diskConnectors: Map<string, number>;

    constructor(id: number, modelName: string, price: number, description: string, imgAddress: string, ramSlots: number, 
        maxMemory: number, diskConnectors: Map<string, number>) {
        this.id = id;
        this.modelName = modelName;
        this.price = price;
        this.description = description;
        this.imgAddress = imgAddress;
        this.ramSlots = ramSlots;
        this.maxMemory = maxMemory;
        this.diskConnectors = diskConnectors;
    }
}