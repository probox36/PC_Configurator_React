import { PartClassName } from "./PartClassName.ts";

export interface Part {
    id: number;
    modelName: string;
    price: number;
    description: string;
    imgAddress: string;
    readonly partClassName: PartClassName;
}