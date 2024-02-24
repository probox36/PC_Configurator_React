import { useState, cloneElement } from 'react';
import './styles/style.App.css';
import PartSlot from './PartSlot';
import PartSelection from './PartsSelection';
import ItemCard from './ItemCard';
import SpecsWindow from './SpecsWindow.js';
import ItemCardHolder from './ItemCardHolder';
import MotherboardIcon from './images/Motherboard.svg';
import CPUIcon from './images/CPU.svg';
import GPUIcon from './images/GPU.svg';
import RAMIcon from './images/RAM.svg';
import PowerIcon from './images/Power.svg';
import HDDIcon from './images/HDD.svg';
import FanIcon from './images/Fan.svg';
import { fetchComponents } from "./Fetcher.js";

export let computer = {};
computer.freeSlots = {CPU: 3};
 
function App() {

  const [totalCost, setTotalCost] = useState(0);
  const [itemCardHolderState, setItemCardHolderState] = useState('showNothing');
  const [itemCardList, setItemcardList] = useState([]); // todo: вот этот кал не обновляется и всегда возвращает пустой список

  const getFreeSlots = (partClassName) => {
    if (computer.freeSlots[partClassName] === 'undefined') {
      computer.freeSlots[partClassName] = 1;
    }
    return computer.freeSlots[partClassName];
  };
  
  const multipleSelectionAvailable = (partClassName) => {
    if (computer.freeSlots[partClassName] === 'undefined') {
      computer.freeSlots[partClassName] = 1;
    }
    return computer.freeSlots[partClassName] > 1 || Array.isArray(computer[partClassName]);
  };

  const addPart = (partClassName, part) => {
    if (typeof computer[partClassName] == 'undefined') {
      if (multipleSelectionAvailable(partClassName)) {
        computer[partClassName] = [part];
      } else {
        computer[partClassName] = part;
      }
    } else if (Array.isArray(computer[partClassName])) {
      computer[partClassName].push(part);
    } else {
      computer[partClassName] = part;
    }
    computer.freeSlots[partClassName] -= 1; 
  };

  const removePart = (partClassName, part) => {
    const existingPart = computer[partClassName];
    if (Array.isArray(existingPart)) {
      for (let i = 0; i < existingPart.length; i++) {
        if (existingPart[i].id === part.id) {
          existingPart.splice(i, 1);
          break;
        }
      }
    } else {
      delete computer[partClassName];
    }
    computer.freeSlots[partClassName] += 1; 
  }

  const updatePartSlots = () => {
    Object.keys(computer).forEach((key) => {
      partSlotList.forEach((slot) => {
        if (slot.props.partClassName === key) {
          slot.partObject = computer[key];
        }
      });
    });
    setPartSlotList(partSlotList);
  };

  const updatePartSlotByClassName = (partClassName) => {
    for (let i = 0; i < partSlotList.length; i++) {
      if (partSlotList[i].props.partClassName === partClassName) {
        partSlotList[i] = cloneElement(partSlotList[i], { partObject: computer[partClassName] });
      }  
    }

    setPartSlotList(partSlotList);
  };

  const onClickPartSlot = async (partClassName) => {
    const {status, json} = await fetchComponents(partClassName);
    if (json.length === 0) { 
      setItemCardHolderState('showStub');
      return;
    }
    if (status) {
      const selectedPart = computer[partClassName];
      const cardList = [];
      
      const partSelectedFlag = typeof selectedPart != 'undefined';
      let freeSlotsLeft = computer.freeSlots[partClassName];
      if (typeof freeSlotsLeft === 'undefined') { freeSlotsLeft = 0; }
      
      json.forEach((part) => {
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
          cardActiveFlag = cardSelectedFlag && !multipleChoiceFlag || freeSlotsLeft > 0;
        } else {
          cardSelectedFlag = false;
          cardActiveFlag = true;
        }
        cardList.push((<ItemCard 
          key={'0' + part.id} 
          partObject={part} 
          partClassName={partClassName} 
          onClickAdd={onClickItemCard}
          selected={cardSelectedFlag}
          active={cardActiveFlag}
          multipleChoice={multipleChoiceFlag}/>));
      });
      
      setItemcardList(cardList);
      setItemCardHolderState('showItemCards');

    } else {
      alert("Нет подключения к серверу");
    }

    console.log("computer = " + computer);
  } 

  const getSlotByClassName = (partClassNameArg) => {
    partSlotList.forEach((slot) => {
      if (slot.props.partClassName === partClassNameArg) {
        return slot;
      }
    });
  };

  // const setSlotByClassName = (partClassNameArg, newSlot) => {
  //   for (let i = 0; i < partSlotList.length; i++) {
  //     if (partSlotList[i].props.partClassName === partClassNameArg) {
  //       partSlotList[i] = newSlot;
  //       break;
  //     }
  //   }
  //   setPartSlotList(partSlotList);
  // };

  const onClickItemCard = async (partClassName, chosenPart, addMode) => {
    // запрашивает список компонентов у бд
    const {status, json} = await fetchComponents(partClassName);
    if (status) {

      if (addMode) {
        addPart(partClassName, chosenPart);       
      } else {
        removePart(partClassName, chosenPart);
      }

      const isSingularFlag = !multipleSelectionAvailable(partClassName);
      const noSlotsLeftFlag = computer.freeSlots[partClassName] < 1;
      const cardList = [];  
      console.log("itemCardList = " + itemCardList);
      json.forEach((part) => {
        let cardSelectedFlag;
        let cardActiveFlag;
        let multipleChoiceFlag;
        const existingPart = computer[partClassName];
        
        // узнает, выбрана ли карточка
        if (typeof existingPart != 'undefined') {
          if (Array.isArray(existingPart) && existingPart.length > 0) {
            cardSelectedFlag = existingPart.map((elem) => elem.id).includes(part.id);
          } else {
            cardSelectedFlag = part.id === existingPart.id;
          }
        }

        multipleChoiceFlag = !isSingularFlag && cardSelectedFlag;
        
        // узнает, активна ли карточка
        if (addMode) {
            cardActiveFlag = cardSelectedFlag && isSingularFlag || !noSlotsLeftFlag;
        } else {
            cardActiveFlag = true;
        }

        // console.log("Перебираю " + part.modelName);
        // console.log("noSlotsLeftFlag = " + noSlotsLeftFlag);
        // console.log("cardActiveFlag = " + cardActiveFlag);
        // console.log("cardSelectedFlag = " + cardSelectedFlag);
        // console.log("multipleChoiceFlag = " + multipleChoiceFlag);

        // создает пустой массив, в него ложит карточки с новыми параметрами
        cardList.push((<ItemCard 
          key={addMode ? 1 : 2 + partClassName.substring(0, 1) + part.id} 
          partObject={part} 
          partClassName={partClassName} 
          onClickAdd={onClickItemCard}
          selected={cardSelectedFlag}
          active={cardActiveFlag}
          multipleChoice={multipleChoiceFlag}/>));
      });
      // заменяет itemCardList на этот массив
      setItemcardList(cardList);
      calulateTotalCost();
      updatePartSlotByClassName(partClassName); 
      console.log(computer);

    } else { 
      alert("Нет подключения к серверу"); 
    }
  };

  // const calulateTotalCost = () => {
  //   let cost = 0;
  //   Object.keys(computer).forEach((key) => {
  //     console.log(computer[key].price);
  //     if (typeof computer[key].price != 'undefined') {
  //       console.log("Прибавляем к " + cost + " " + computer[key].price);
  //       cost += computer[key].price;
  //     }
  //   });
  //   setTotalCost(cost);
  // }

  const calulateTotalCost = () => {
    let cost = 0;
    Object.keys(computer).forEach((key) => {
      if (key === 'freeSlots') { return; }
      if (Array.isArray(computer[key])) {
        computer[key].forEach((elem) => { cost += elem.price; })
      } else {
        cost += computer[key].price;
      }
    });
    setTotalCost(cost);
  }

  const [partSlotList, setPartSlotList] = useState(
    [
      (<PartSlot key={1} iconAddress={MotherboardIcon} partClassName={"Motherboard"} setOnClick={onClickPartSlot} partName={"Материнская плата"} modelName={"Не выбрано"} price={0}/>),
      (<PartSlot key={2} iconAddress={CPUIcon} partClassName={"CPU"} setOnClick={onClickPartSlot} partName={"Процессор"} modelName={"Не выбрано"} price={0}/>),
      (<PartSlot key={3} iconAddress={GPUIcon} partClassName={"GPU"} setOnClick={onClickPartSlot} partName={"Видеокарта"} modelName={"Не выбрано"} price={0}/>),
      (<PartSlot key={4} iconAddress={RAMIcon} partClassName={"RAM"} setOnClick={onClickPartSlot} partName={"Оперативная память"} modelName={"Не выбрано"} price={0}/>),
      (<PartSlot key={5} iconAddress={PowerIcon} partClassName={"PowerUnit"} setOnClick={onClickPartSlot} partName={"Блок питания"} modelName={"Не выбрано"} price={0}/>),
      (<PartSlot key={6} iconAddress={HDDIcon} partClassName={"PrimaryStorage"} setOnClick={onClickPartSlot} partName={"Диск"} modelName={"Не выбрано"} price={0}/>),
      (<PartSlot key={7} iconAddress={FanIcon} partClassName={"CoolingSystem"} setOnClick={onClickPartSlot} partName={"Система охлаждения"} modelName={"Не выбрано"} price={0}/>)
    ]
  );

  return (
    <div className="App">
      {/* {<SpecsWindow/>} */}
      <PartSelection price={totalCost} partSlotList={partSlotList}/>  
      <ItemCardHolder itemCardList={itemCardList} itemCardHolderState={itemCardHolderState} />
    </div>
  );

}

export default App;

/* <div style={{display: "flex", msFlexDirection: "row", gap: "20px"}}></div> */
