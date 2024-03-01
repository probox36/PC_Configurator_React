import { Part } from "./Part";
import { PartClassName } from "./PartClassName.ts";

export class PrimaryStorage implements Part {
    id: number;
    modelName: string;
    price: number;
    description: string;
    imgAddress: string;
    partClassName: PartClassName;
    diskType: string;
    diskSocket: string;

    constructor(id: number, modelName: string, price: number, description: string, imgAddress: string, diskType: string,
        diskSocket: string) {
        this.id = id;
        this.modelName = modelName;
        this.price = price;
        this.description = description;
        this.imgAddress = imgAddress;
        this.diskType = diskType;
        this.diskSocket = diskSocket;
        this.partClassName = PartClassName.PrimaryStorage;
    }
}