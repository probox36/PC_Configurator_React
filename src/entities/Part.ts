import { PartClassName } from "./PartClassName.ts";

export class Part {
    id: number;
    modelName: string;
    price: number;
    description: string;
    imgAddress: string;
    readonly partClassName: PartClassName;

    public isEqual(part: Part):boolean {
        return this.partClassName == part.partClassName && this.id == part.id;
    }

    constructor(id: number, modelName: string, price: number, description: string, imgAddress: string) {
        this.id = id;
        this.modelName = modelName;
        this.price = price;
        this.description = description;
        this.imgAddress = imgAddress;
    }
}