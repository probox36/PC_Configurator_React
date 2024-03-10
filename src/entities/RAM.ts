import { Part } from "./Part.ts";
import { PartClassName } from "./PartClassName.ts";

export class RAM extends Part {
    partClassName: PartClassName;

    constructor(id: number, modelName: string, price: number, description: string, imgAddress: string) {
        super(id, modelName, price, description, imgAddress);
        this.partClassName = PartClassName.RAM;
    }
}