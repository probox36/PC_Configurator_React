import { CPU } from "./entities/CPU.ts";
import { Case } from "./entities/Case.ts";
import { CaseCooler } from "./entities/CaseCooler.ts";
import { CoolingSystem } from "./entities/CoolingSystem.ts";
import { GPU } from "./entities/GPU.ts";
import { Motherboard } from "./entities/Motherboard.ts";
import { Part } from "./entities/Part.ts";
import { plainToClass } from 'class-transformer';
import { PowerUnit } from "./entities/PowerUnit.ts";
import { PrimaryStorage } from "./entities/PrimaryStorage.ts";
import { RAM } from "./entities/RAM.ts";
import { PartClassName } from "./entities/PartClassName.ts";
import { Computer } from "./entities/Computer.ts";

export class ApiResponse {
  status: boolean;
  json: Array<Part>;

  constructor(status: boolean, json: Array<Part>) {
    this.status = status
    this.json = json
  }

  public castTo = (className: PartClassName): Array<Part> => {
    switch (className) {
      case PartClassName.Case: {
        return plainToClass(Case, this.json);
      }
      case PartClassName.CaseCooler: {
        return plainToClass(CaseCooler, this.json);
      }
      case PartClassName.CoolingSystem: {
        return plainToClass(CoolingSystem, this.json);
      }
      case PartClassName.CPU: {
        return plainToClass(CPU, this.json);
      }
      case PartClassName.GPU: {
        return plainToClass(GPU, this.json);
      }
      case PartClassName.Motherboard: {
        return plainToClass(Motherboard, this.json);
      }
      case PartClassName.PowerUnit: {
        return plainToClass(PowerUnit, this.json);
      }
      case PartClassName.PrimaryStorage: {
        return plainToClass(PrimaryStorage, this.json);
      }
      case PartClassName.RAM: {
        return plainToClass(RAM, this.json);
      }
      default: throw new Error('No such class! (' + className + ')');
    }
  }

}

export async function fetchComponents(partClassName: PartClassName): Promise<ApiResponse> {
  
  let partClassString: string = partClassName.toString();
  let status = false;
  let json: Array<Part> = [];
  let cache = sessionStorage.getItem(partClassString);

  if (cache != null) {

    json = JSON.parse(cache);
    status = true;

  } else {

    let response = await fetch('http://localhost:3001/getCatalog/' + partClassString).catch(
      err => {
        console.log("Tried to fetch " + partClassString + ": " + err.message);
      }
    )

    if (typeof response !== 'undefined') {
      if (response.ok) {
        json = await response.json();
        sessionStorage.setItem(partClassString, JSON.stringify(json));
        status = true;
      } else {
        console.log("HTTP error: " + response.status)
      }
    }

  }

  return new ApiResponse(status, json);
}

export async function fetchCompatibleComponents(requiredPartClass: PartClassName, computer: Computer): Promise<ApiResponse>;
export async function fetchCompatibleComponents(requiredPartClass: PartClassName, part: Part): Promise<ApiResponse>;
export async function fetchCompatibleComponents(requiredPartClass: PartClassName, computerOrPart: Computer | Part): Promise<ApiResponse> {
  
  const queryObject = {
    requiredPartClass: requiredPartClass.toString(),
  };

  let endPoint: string;

  console.log(computerOrPart);

  if (computerOrPart instanceof Computer) {
    console.log('byComputer');
    queryObject['computer'] = (computerOrPart as Computer).toPlainObject();
    endPoint = 'http://localhost:3001/getCompatibleComponentsByComputer';
  } else if (computerOrPart instanceof Part) {
    console.log('byPart');
    queryObject['part'] = (computerOrPart as Part).toPlainObject();
    endPoint = 'http://localhost:3001/getCompatibleComponentsByPart';
  } else {
    throw new Error('Не указан компонент/компьютер, для которого ищем совместимые компоненты');
  }

  console.log(JSON.stringify(queryObject));
  
  let response = await fetch(endPoint, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(queryObject)
  });

  let parts: Array<Part> = await response.json();
  console.log('>>> ');
  console.log(parts);

  return new ApiResponse(true, parts);

}
