import { useState, cloneElement, ReactElement } from 'react';
import './styles/style.App.css';
import PartSlot from './PartSlot.tsx';
import PartSelection from './PartsSelection.js';
import ItemCard from './ItemCard.tsx';
import ItemCardHolder from './ItemCardHolder.js';
import { Computer } from './entities/Computer.ts';
import MotherboardIcon from './images/Motherboard.svg';
import CPUIcon from './images/CPU.svg';
import GPUIcon from './images/GPU.svg';
import RAMIcon from './images/RAM.svg';
import PowerIcon from './images/Power.svg';
import HDDIcon from './images/HDD.svg';
import FanIcon from './images/Fan.svg';
import { fetchComponents } from "./Fetcher.ts";
import { Part } from './entities/Part.ts';
import React from 'react';
import { PartClassName } from './entities/PartClassName.ts';
import { Motherboard } from './entities/Motherboard.ts';
import { Case } from './entities/Case.ts';

// export let computer = {};
export let computer = new Computer();
// computer.freeSlots = { CPU: 3 };

function App() {

  const [totalCost, setTotalCost] = useState(0);
  const [itemCardHolderState, setItemCardHolderState] = useState('showNothing');
  const [itemCardList, setItemcardList] = useState<Array<ReactElement>>([]); // todo: вот этот кал не обновляется и всегда возвращает пустой список

  const updatePartSlotByClassName = (partClassName) => {
    for (let i = 0; i < partSlotList.length; i++) {
      if (partSlotList[i].props.partClassName === partClassName) {
        partSlotList[i] = cloneElement(partSlotList[i], { partObject: computer[partClassName] });
      }
    }

    setPartSlotList(partSlotList);
  };

  const onClickPartSlot = async (partClassName: PartClassName) => {
    
    const reply = await fetchComponents(partClassName);
    const parts = reply.castTo(partClassName);
    if (parts.length === 0) {
      setItemCardHolderState('showStub');
      return;
    }
    if (reply.status) {
      const selectedPart = computer[partClassName.toString()];
      const cardList: ReactElement[] = [];
      const partSelectedFlag = typeof selectedPart != 'undefined';
      // if (typeof freeSlotsLeft === 'undefined') { freeSlotsLeft = 0; }
      parts.forEach((part) => {

        let freeSlotsLeft = computer.getFreeSlotsLeft(part);
        let cardSelectedFlag;
        let cardActiveFlag;
        let multipleChoiceFlag = false;
        if (partSelectedFlag) {
          if (Array.isArray(selectedPart)) {
            cardSelectedFlag = selectedPart.map((elem) => elem.id).includes(part.id);
            multipleChoiceFlag = selectedPart.length > 0 && cardSelectedFlag;
          } else {
            cardSelectedFlag = part.id === selectedPart.id;
          }
          cardActiveFlag = (cardSelectedFlag && !multipleChoiceFlag) || freeSlotsLeft;
        } else {
          cardSelectedFlag = false;
          cardActiveFlag = true;
        }
        
        cardList.push((<ItemCard
          key={'0' + part.id}
          partObject={part}
          partClassName={part.partClassName}
          onClickAdd={onClickItemCard}
          selected={cardSelectedFlag}
          active={cardActiveFlag}
          multipleChoice={multipleChoiceFlag} />));
        
      });

      setItemcardList(cardList);
      setItemCardHolderState('showItemCards');

    } else {
      alert("Нет подключения к серверу");
    }

  }

  const onClickItemCard = async (part: Part, addMode: boolean) => {
    // запрашивает список компонентов у бд
    const reply = await fetchComponents(part.partClassName);
    const parts = reply.castTo(part.partClassName);
    if (reply.status) { 

      if (addMode) {
        
        // Костыль, нуждается в доработке
        if (part instanceof Motherboard) {
          let computerCase = new Case(45, "InWin AssPlus 14K", 4587, "Охуенный корпус", '', 2, 
          new Map([
            ['140', 2],
            ['80', 4],
          ]));
          computer = new Computer(computerCase, part);
        } else {
          computer.addPart(part);
        }

      } else {
        
        if (part instanceof Motherboard) {
          computer = new Computer(); 
        } else {
          computer.removePart(part);
        }

      }

      const isSingularFlag = !computer.multipleSelectionAvailable(part);
      const noSlotsLeftFlag = !computer.getFreeSlotsLeft(part);
      const cardList: ReactElement[] = [];

      parts.forEach((part) => {
        let cardSelectedFlag;
        let cardActiveFlag;
        let multipleChoiceFlag;
        const existingPart = computer[part.partClassName.toString()];

        // узнает, выбрана ли карточка
        // figures out if itemCard is chosen by user
        if (typeof existingPart != 'undefined' && existingPart != null) {
          if (Array.isArray(existingPart) && existingPart.length > 0) {
            cardSelectedFlag = existingPart.map((elem) => elem.id).includes(part.id);
          } else {
            cardSelectedFlag = part.id === existingPart.id;
          }
        } 

        multipleChoiceFlag = !isSingularFlag && cardSelectedFlag;

        // узнает, активна ли карточка
        // figures out if itemCard is active
        if (addMode) {
          cardActiveFlag = (cardSelectedFlag && isSingularFlag) || !noSlotsLeftFlag;
        } else {
          cardActiveFlag = true;
        }

        // создает пустой массив, в него ложит карточки с новыми параметрами
        // creates an empty array and fills it with itemCards with new props
        cardList.push((<ItemCard
          key={addMode ? 1 : 2 + part.partClassName.substring(0, 1) + part.id}
          partObject={part}
          partClassName={part.partClassName}
          onClickAdd={onClickItemCard}
          selected={cardSelectedFlag}
          active={cardActiveFlag}
          multipleChoice={multipleChoiceFlag} />));
      });
      // заменяет itemCardList на этот массив
      // replaces itemCardList with that array
      setItemcardList(cardList);
      calculateTotalCost();
      updatePartSlotByClassName(part.partClassName);

    } else {
      alert("Нет подключения к серверу");
    }
  };

  const calculateTotalCost = () => {
    let cost = 0;
    Object.keys(computer).forEach((field) => {
      if (field != 'FreeSlots' && computer[field] != undefined) {
        if (Array.isArray(computer[field])) {
          computer[field].forEach((elem) => { cost += elem.price; })
        } else {
          cost += computer[field].price;
        }
      }
    });
    setTotalCost(cost);
  }

  const [partSlotList, setPartSlotList] = useState(
    [
      (<PartSlot key={1} iconAddress={MotherboardIcon} partClassName={PartClassName.Motherboard} setOnClick={onClickPartSlot} partName={"Материнская плата"}/>),
      (<PartSlot key={2} iconAddress={CPUIcon} partClassName={PartClassName.CPU} setOnClick={onClickPartSlot} partName={"Процессор"}/>),
      (<PartSlot key={3} iconAddress={GPUIcon} partClassName={PartClassName.GPU} setOnClick={onClickPartSlot} partName={"Видеокарта"}/>),
      (<PartSlot key={4} iconAddress={RAMIcon} partClassName={PartClassName.RAM} setOnClick={onClickPartSlot} partName={"Оперативная память"}/>),
      (<PartSlot key={5} iconAddress={PowerIcon} partClassName={PartClassName.PowerUnit} setOnClick={onClickPartSlot} partName={"Блок питания"}/>),
      (<PartSlot key={6} iconAddress={HDDIcon} partClassName={PartClassName.PrimaryStorage} setOnClick={onClickPartSlot} partName={"Диск"}/>),
      (<PartSlot key={7} iconAddress={FanIcon} partClassName={PartClassName.CoolingSystem} setOnClick={onClickPartSlot} partName={"Система охлаждения"}/>)
    ]
  );

  return (
    <div className="App">
      {/* {<SpecsWindow/>} */}
      <PartSelection price={totalCost} partSlotList={partSlotList} />
      <ItemCardHolder itemCardList={itemCardList} itemCardHolderState={itemCardHolderState} />
    </div>
  );

}

export default App;
