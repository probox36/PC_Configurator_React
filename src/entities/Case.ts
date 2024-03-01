import { Part } from "./Part";
import { PartClassName } from "./PartClassName.ts";

export class Case implements Part {
    id: number;
    modelName: string;
    price: number;
    description: string;
    imgAddress: string;
    partClassName: PartClassName;
    hddMounts: number;
    caseCoolerMounts: Map<string, number>;

    constructor(id: number, modelName: string, price: number, description: string, imgAddress: string, hddMounts: number,
        caseCoolerMounts: Map<string, number>) {
        this.id = id;
        this.modelName = modelName;
        this.price = price;
        this.description = description;
        this.imgAddress = imgAddress;
        this.hddMounts = hddMounts;
        this.caseCoolerMounts = caseCoolerMounts;
        this.partClassName = PartClassName.Case;
    }

    
}