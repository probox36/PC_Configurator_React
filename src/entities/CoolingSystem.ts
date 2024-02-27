import { Part } from "./Part";

export class CoolingSystem implements Part {
    id: number;
    modelName: string;
    price: number;
    description: string;
    imgAddress: string;
    partClassName: string = "coolingSystem";

    constructor(id: number, modelName: string, price: number, description: string, imgAddress: string) {
        this.id = id;
        this.modelName = modelName;
        this.price = price;
        this.description = description;
        this.imgAddress = imgAddress;
    }
}