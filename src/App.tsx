import React from 'react';
import { useState, ReactElement } from 'react';
import './styles/style.App.css';
import PartSelection from './PartsSelection.tsx';
import ItemCard from './ItemCard.tsx';
import ItemCardHolder from './ItemCardHolder.tsx';
// import SpecsWindow from './SpecsWindow.tsx'
import { Computer } from './entities/Computer.ts';
import { fetchComponents } from "./Fetcher.ts";
import { Part } from './entities/Part.ts';
import { PartClassName } from './entities/PartClassName.ts';
import { Motherboard } from './entities/Motherboard.ts';
import { Case } from './entities/Case.ts';
import { predefinedPartSlotList, predefinedModalPromise } from './PredefinedValues.tsx';

export let computer = new Computer();

function App() {

  const [totalCost, setTotalCost] = useState(0);
  const [itemCardHolderState, setItemCardHolderState] = useState('showNothing');
  const [itemCardList, setItemcardList] = useState<Array<ReactElement>>([]);
  const [modal, setModal] = useState<ReactElement | undefined>(undefined);
  let areCaseAndBoardDefined = false;

  const displayPartSelectionModal = async () => {
    const result = await predefinedModalPromise(setModal);
    setModal(undefined);
    return result;
  };

  const displayItemCards = (parts: Array<Part>) => {
    const cardList: ReactElement[] = [];
    
    parts.forEach((part) => {

      let existingPart = computer[part.partClassName.toString()];
      let cardSelectedFlag = false;
      let quantity = 0;

      if (existingPart != undefined) {
        quantity = computer.countSimilarParts(part);
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

      if (areCaseAndBoardDefined) {
        
        if (part instanceof Motherboard || part instanceof Case) {
          if (computer.wasSomethingAdded()) {
            if (!await displayPartSelectionModal()) {
              return;
            }
          }
          if (addMode) {
            computer.addPart(part);
            computer = new Computer(computer.Case, computer.Motherboard);
          } else {
            computer.removePart(part);
            if (part.partClassName == PartClassName.Motherboard) {
              part = computer.Case;
            } else {
              part = computer.Motherboard;
            }
            computer = new Computer();
            computer.addPart(part);
            areCaseAndBoardDefined = false;
          }
        } else {
          if (addMode) {
            computer.addPart(part);
          } else {
            computer.removePart(part);
          }
        }

      } else {

        if (part instanceof Motherboard || part instanceof Case) {
          if (addMode) {
            computer.addPart(part);
            if (computer.Case != undefined && computer.Motherboard != undefined) {
              computer = new Computer(computer.Case, computer.Motherboard);
              areCaseAndBoardDefined = true;
            }
          } else {
            computer.removePart(part);
          }
        } else {
          throw new Error('Нельзя добавлять компоненты в компьютер без корпуса и матплаты');
        }
      }

      displayItemCards(parts);
      setTotalCost(computer.calculateTotalCost());
      setPartSlotList(predefinedPartSlotList(areCaseAndBoardDefined, computer, onClickPartSlot))

    } else {
      alert("Нет подключения к серверу");
    }
  };

  const [partSlotList, setPartSlotList] = useState(
    predefinedPartSlotList(areCaseAndBoardDefined, computer, onClickPartSlot)
  );

  return (
    <div className="App">
      { modal }
      <PartSelection price={totalCost} partSlotList={partSlotList} />
      <ItemCardHolder itemCardList={itemCardList} itemCardHolderState={itemCardHolderState} /> 
    </div>
  );

}

export default App;
