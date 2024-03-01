import { Part } from "./Part";
import { PartClassName } from "./PartClassName.ts";

export class CaseCooler implements Part {
    id: number;
    modelName: string;
    price: number;
    description: string;
    imgAddress: string;
    partClassName: PartClassName ;
    size: string;

    constructor(id: number, modelName: string, price: number, description: string, imgAddress: string, size: string) {
        this.id = id;
        this.modelName = modelName;
        this.price = price;
        this.description = description;
        this.imgAddress = imgAddress;
        this.size = size;
        this.partClassName = PartClassName.CaseCooler;
    }
}