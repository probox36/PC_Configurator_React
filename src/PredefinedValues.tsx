import PartSlot from "./PartSlot.tsx";
import React, { ReactElement, cloneElement } from "react";
import MotherboardIcon from './images/Motherboard.svg';
import CPUIcon from './images/CPU.svg';
import GPUIcon from './images/GPU.svg';
import RAMIcon from './images/RAM.svg';
import PowerIcon from './images/Power.svg';
import HDDIcon from './images/HDD.svg';
import FanIcon from './images/Fan.svg';
import { PartClassName } from "./entities/PartClassName.ts";
import { Computer } from "./entities/Computer.ts";

export const predefinedPartSlotList = (isActive: boolean, computer: Computer, onClickPartSlot: (partClassName: PartClassName) => void): Array<ReactElement> => {
    return [
        (<PartSlot key={1} isActive={true} iconAddress={MotherboardIcon} partClassName={PartClassName.Motherboard} computer={computer} setOnClick={onClickPartSlot} partName={"Материнская плата"}/>),
        (<PartSlot key={2} isActive={true} iconAddress={FanIcon} partClassName={PartClassName.Case} computer={computer} setOnClick={onClickPartSlot} partName={"Корпус"}/>),
        (<PartSlot key={3} isActive={isActive} iconAddress={CPUIcon} partClassName={PartClassName.CPU} computer={computer} setOnClick={onClickPartSlot} partName={"Процессор"}/>),
        (<PartSlot key={4} isActive={isActive} iconAddress={GPUIcon} partClassName={PartClassName.GPU} computer={computer} setOnClick={onClickPartSlot} partName={"Видеокарта"}/>),
        (<PartSlot key={5} isActive={isActive} iconAddress={RAMIcon} partClassName={PartClassName.RAM} computer={computer} setOnClick={onClickPartSlot} partName={"Оперативная память"}/>),
        (<PartSlot key={6} isActive={isActive} iconAddress={PowerIcon} partClassName={PartClassName.PowerUnit} computer={computer} setOnClick={onClickPartSlot} partName={"Блок питания"}/>),
        (<PartSlot key={7} isActive={isActive} iconAddress={HDDIcon} partClassName={PartClassName.PrimaryStorage} computer={computer} setOnClick={onClickPartSlot} partName={"Диск"}/>),
        (<PartSlot key={8} isActive={isActive} iconAddress={FanIcon} partClassName={PartClassName.CaseCooler} computer={computer} setOnClick={onClickPartSlot} partName={"Система охлаждения"}/>)
      ]
};