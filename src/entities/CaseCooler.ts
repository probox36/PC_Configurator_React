import { Part } from "./Part.ts";
import { PartClassName } from "./PartClassName.ts";

export class CaseCooler extends Part {
    partClassName: PartClassName ;
    size: string;

    constructor(id: number, modelName: string, price: number, description: string, imgAddress: string, size: string) {
        super(id, modelName, price, description, imgAddress);
        this.size = size;
        this.partClassName = PartClassName.CaseCooler;
    }
}