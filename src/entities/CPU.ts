import { Part } from "./Part";

export class CPU implements Part {
    id: number;
    modelName: string;
    price: number;
    description: string;
    imgAddress: string;
    partClassName: string = "cpu";

    constructor(id: number, modelName: string, price: number, description: string, imgAddress: string) {
        this.id = id;
        this.modelName = modelName;
        this.price = price;
        this.description = description;
        this.imgAddress = imgAddress;
    }
}