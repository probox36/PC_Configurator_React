import { Part } from "./Part";

export class Case implements Part {
    id: number;
    modelName: string;
    price: number;
    description: string;
    imgAddress: string;
    partClassName: string = "case";
    hddMounts: number;

    constructor(id: number, modelName: string, price: number, description: string, imgAddress: string, hddMounts: number) {
        this.id = id;
        this.modelName = modelName;
        this.price = price;
        this.description = description;
        this.imgAddress = imgAddress;
        this.hddMounts = hddMounts;
    }
}