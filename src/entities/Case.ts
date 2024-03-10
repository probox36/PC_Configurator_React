import { Part } from "./Part.ts";
import { PartClassName } from "./PartClassName.ts";

export class Case extends Part {
    partClassName: PartClassName;
    hddMounts: number;
    caseCoolerMounts: Map<string, number>;

    constructor(id: number, modelName: string, price: number, description: string, imgAddress: string, hddMounts: number,
        caseCoolerMounts: Map<string, number>) {
        super(id, modelName, price, description, imgAddress);
        // this.id = id;
        // this.modelName = modelName;
        // this.price = price;
        // this.description = description;
        // this.imgAddress = imgAddress;
        this.hddMounts = hddMounts;
        this.caseCoolerMounts = caseCoolerMounts;
        this.partClassName = PartClassName.Case;
    }
    
}