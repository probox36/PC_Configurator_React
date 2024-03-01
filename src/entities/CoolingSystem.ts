import { Part } from "./Part";
import { PartClassName } from "./PartClassName.ts";

export class CoolingSystem implements Part {
    id: number;
    modelName: string;
    price: number;
    description: string;
    imgAddress: string;
    partClassName: PartClassName;

    constructor(id: number, modelName: string, price: number, description: string, imgAddress: string) {
        this.id = id;
        this.modelName = modelName;
        this.price = price;
        this.description = description;
        this.imgAddress = imgAddress;
        this.partClassName = PartClassName.CoolingSystem;
    }
}