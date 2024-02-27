import { Part } from "./Part";

export class CaseCooler implements Part {
    id: number;
    modelName: string;
    price: number;
    description: string;
    imgAddress: string;
    partClassName: string = "caseCooler";
    size: string;

    constructor(id: number, modelName: string, price: number, description: string, imgAddress: string, size: string) {
        this.id = id;
        this.modelName = modelName;
        this.price = price;
        this.description = description;
        this.imgAddress = imgAddress;
        this.size = size;
    }
}