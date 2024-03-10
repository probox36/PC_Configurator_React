import { Part } from "./Part.ts";
import { PartClassName } from "./PartClassName.ts";

export class PrimaryStorage extends Part {
    partClassName: PartClassName;
    diskType: string;
    diskSocket: string;

    constructor(id: number, modelName: string, price: number, description: string, imgAddress: string, diskType: string,
        diskSocket: string) {
        super(id, modelName, price, description, imgAddress);
        this.diskType = diskType;
        this.diskSocket = diskSocket;
        this.partClassName = PartClassName.PrimaryStorage;
    }
}