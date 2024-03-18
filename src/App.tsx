import React from 'react';
import { useState, ReactElement } from 'react';
import './styles/style.App.css';
import PartSelection from './PartsSelection.tsx';
import ItemCard from './ItemCard.tsx';
import ItemCardHolder from './ItemCardHolder.tsx';
import SpecsWindow from './SpecsWindow.tsx'
import { Computer } from './entities/Computer.ts';
import { Part } from './entities/Part.ts';
import { PartClassName } from './entities/PartClassName.ts';
import { Motherboard } from './entities/Motherboard.ts';
import { Case } from './entities/Case.ts';
import { predefinedPartSlotList, predefinedModalPromise} from './PredefinedValues.tsx';
import { fetchCompatibleComponents, fetchComponents, ApiResponse } from './Fetcher.ts';
import AuthenticationForm from './AuthenticationForm.tsx';

function App() {

  const [totalCost, setTotalCost] = useState(0);
  const [itemCardHolderState, setItemCardHolderState] = useState('showNothing');
  const [itemCardList, setItemcardList] = useState<Array<ReactElement>>([]);
  const [modal, setModal] = useState<ReactElement | undefined>(undefined);
  const [specsWindow, setSpecsWindow] = useState<ReactElement | undefined>(undefined);
  
  let areCaseAndBoardDefined = false;
  let currentPartList = new Map<PartClassName, Array<Part>>;  
  let computer = new Computer();

  const displayPartSelectionModal = async () => {
    const result = await predefinedModalPromise(setModal);
    setModal(undefined);
    return result;
  };

  const displaySpecsWindow = (part: Part, addMode: boolean) => {
    setSpecsWindow(
    <SpecsWindow
      partObject={part}
      addCallback={ () => { onClickItemCard(part, addMode); setTimeout(() => { setSpecsWindow(undefined) }, 80); } }
      closeCallback={ () => { setSpecsWindow(undefined); } }
      addMode = { addMode } >
    </SpecsWindow>);
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
        onSpecsBtnClick={ () => {displaySpecsWindow(part, multipleChoiceFlag ? cardActiveFlag : !cardSelectedFlag)} }
        selected={cardSelectedFlag}
        active={cardActiveFlag}
        multipleChoice={multipleChoiceFlag}
        quantity={quantity} />));
    });

    setItemcardList(cardList);
  };

  const getCompatibleComponents = async (partClass: PartClassName): Promise<Array<Part>> => {
    let reply: Promise<ApiResponse>;
    
    if (areCaseAndBoardDefined) {
      reply = fetchCompatibleComponents(partClass, computer);
    } else if (partClass == PartClassName.Motherboard || partClass == PartClassName.Case) {

      if (computer.Case != undefined && partClass == PartClassName.Motherboard) {
        reply = fetchCompatibleComponents(partClass, computer.Case);
      } else if (computer.Motherboard != undefined && partClass == PartClassName.Case) {
        reply = fetchCompatibleComponents(partClass, computer.Motherboard);
      } else {
        reply = fetchComponents(partClass);
      }

    } else {
      throw new Error("Нельзя запросить список совместимых компонентов если компьютер не инициализирован");
    }

    if (!(await reply).status) {
      throw new Error("Нет подключения к серверу");
    } else {
      return (await reply).castTo(partClass);
    }
  }

  const onClickPartSlot = async (partClass: PartClassName) => {
    
    let parts: Array<Part>;
    if (currentPartList[partClass] == undefined) {
      currentPartList[partClass] = await getCompatibleComponents(partClass);
    }

    parts = currentPartList[partClass];
    if (currentPartList[partClass].length === 0) { 
      setItemCardHolderState('showStub');
      return;
    }
    displayItemCards(currentPartList[partClass]);
    setItemCardHolderState('showItemCards');

  }

  const onClickItemCard = async (part: Part, addMode: boolean) => {

    const parts = (currentPartList[part.partClassName]);
    
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
          currentPartList = new Map<PartClassName, Array<Part>>;
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
            currentPartList = new Map<PartClassName, Array<Part>>;
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
    if (areCaseAndBoardDefined) { 
    }

  };

  const [partSlotList, setPartSlotList] = useState(
    predefinedPartSlotList(areCaseAndBoardDefined, computer, onClickPartSlot)
  );

  return (
    <div className="App">
      <AuthenticationForm></AuthenticationForm>
      { specsWindow }
      { modal }
      <PartSelection price={totalCost} partSlotList={partSlotList} />
      <ItemCardHolder itemCardList={itemCardList} itemCardHolderState={itemCardHolderState} /> 
    </div>
  );

}

export default App;
