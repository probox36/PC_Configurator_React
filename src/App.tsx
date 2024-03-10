import { useState, cloneElement, ReactElement } from 'react';
import './styles/style.App.css';
import PartSelection from './PartsSelection.tsx';
import ItemCard from './ItemCard.tsx';
import ItemCardHolder from './ItemCardHolder.tsx';
import { Computer } from './entities/Computer.ts';
import { fetchComponents } from "./Fetcher.ts";
import { Part } from './entities/Part.ts';
import React from 'react';
import { PartClassName } from './entities/PartClassName.ts';
import { Motherboard } from './entities/Motherboard.ts';
import { Case } from './entities/Case.ts';
import { predefinedPartSlotList } from './PredefinedValues.tsx';

export let computer = new Computer();

function App() {

  const [totalCost, setTotalCost] = useState(0);
  const [itemCardHolderState, setItemCardHolderState] = useState('showNothing');
  const [itemCardList, setItemcardList] = useState<Array<ReactElement>>([]);
  
  const countSimilarParts = (part: Part, existingPart: Part | Array<Part>): number => {
    let count = 0;
    if (Array.isArray(existingPart)) {
      existingPart.forEach((elem) => {
        if (elem.isEqual(part)) {
          count++;
        }
      });
    } else {
      existingPart = existingPart as Part;
      if (existingPart.isEqual(part)) { count++; }
    }
    return count;
  };

  const displayItemCards = (parts: Array<Part>) => {
    const cardList: ReactElement[] = [];
    
    parts.forEach((part) => {

      let existingPart = computer[part.partClassName.toString()];
      let cardSelectedFlag = false;
      let quantity = 0;

      if (existingPart != undefined) {
        quantity = countSimilarParts(part, existingPart);
        cardSelectedFlag = quantity > 0;
      } 

      const isSingularFlag = !computer.multipleSelectionAvailable(part);
      const multipleChoiceFlag = !isSingularFlag && cardSelectedFlag;
      const cardActiveFlag = (cardSelectedFlag && isSingularFlag) || computer.getFreeSlotsLeft(part);

      cardList.push((<ItemCard
        key={1 + part.partClassName.substring(0, 1) + part.id}
        partObject={part}
        onClickAdd={onClickItemCard}

        selected={cardSelectedFlag}
        active={cardActiveFlag}
        multipleChoice={multipleChoiceFlag}
        quantity={quantity} />));
    });

    setItemcardList(cardList);
  };

  const onClickPartSlot = async (partClassName: PartClassName) => {
    
    const reply = await fetchComponents(partClassName);
    const parts = reply.castTo(partClassName);
    if (parts.length === 0) {
      setItemCardHolderState('showStub');
      return;
    }
    if (reply.status) {
      displayItemCards(parts);
      setItemCardHolderState('showItemCards');
    } else {
      alert("Нет подключения к серверу");
    }

  }

  const onClickItemCard = async (part: Part, addMode: boolean) => {
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
        
        if (part instanceof Motherboard || part instanceof Case) {
          // на этом этапе должен появляться modal
          computer = new Computer(); 
        } else {
          computer.removePart(part);
        }

      }

      displayItemCards(parts);
      setTotalCost(computer.calculateTotalCost());
      setPartSlotList(predefinedPartSlotList(computer, onClickPartSlot))

    } else {
      alert("Нет подключения к серверу");
    }
  };

  const [partSlotList, setPartSlotList] = useState(predefinedPartSlotList(computer, onClickPartSlot));

  return (
    <div className="App">
      {/* {<SpecsWindow/>} */}
      <PartSelection price={totalCost} partSlotList={partSlotList} />
      <ItemCardHolder itemCardList={itemCardList} itemCardHolderState={itemCardHolderState} /> 
    </div>
  );

}

export default App;
