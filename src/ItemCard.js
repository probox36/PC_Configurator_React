import React, { useRef } from 'react';
import { isMobile } from 'react-device-detect';
import './styles/style.ItemCard.css';
import InfoIcon from './images/Info.svg';
import addIcon from './images/Add.svg';
import removeIcon from './images/Remove.svg';
import addIconBlack from './images/Add_black.svg';

function ItemCard({ partObject, selected, active, partClassName, onClickAdd, multipleChoice, quantity = 0 }) {

  const RemoveButton = useRef(null);
  const AddButton = useRef(null);
  const SpecsButton = useRef(null);

  // const [quantity, setQuantity] = useState(0);

  const modelName = partObject.modelName;
  const price = partObject.price;
  const image = partObject.imgAddress;

  const mouseLeaveAnim = (ref) => {
    if (!isMobile) {
      ref.current.classList.remove("AnimateOnEnter");
      ref.current.classList.add("AnimateOnLeave");
    }
  };

  const mouseEnterAnim = (ref) => {
    if (!isMobile) {
      ref.current.classList.remove("AnimateOnLeave");
      ref.current.classList.add("AnimateOnEnter");
    }
  };

  const mouseDownAnim = (ref) => {
    if (!isMobile) {
      ref.current.classList.add("AnimateOnMouseDown");
      ref.current.classList.remove("AnimateOnMouseEnter");
    }
  };

  const mouseUpAnim = (ref) => {
    if (!isMobile) {
      ref.current.classList.remove("AnimateOnMouseDown");
    }
  }

  const onBtnClickAnim = (ref) => {
    if (isMobile) {
      ref.current.classList.add("AnimateOnClickMobile");
      setTimeout(() => {
        ref.current.classList.remove("AnimateOnClickMobile");
      }, 200);
    }
  };

  const onRemoveBtnClick = (ref) => {
    onBtnClickAnim(ref);
    onClickAdd(partClassName, partObject, false);
  }

  const onAddBtnClick = (ref) => {
    onBtnClickAnim(ref);
    if (!selected || multipleChoice) {
      onClickAdd(partClassName, partObject, true);
    } else {
      onRemoveBtnClick(ref);
    }
  };

  const onSpecsBtnClick = (ref) => {
    alert("Это кнопочка характеристики");
  };

  const blank = () => { }

  return (

    <div className="Card">

      <div className="Mount">
        <div className="ImgHolderContent ImgHolder">
          {quantity > 0
            ? <div className={"ImgHolderContent ItemCardOverlay"}> {"x" + quantity} </div>
            : <></>
          }
          <img className='ImgHolderContent Image' src={image} alt={"Фото " + modelName} />
        </div>
        <div className="ItemCardText ItemCardModelName">{partObject.modelName}</div>
      </div>

      <div className="ButtonHolder">
        {multipleChoice ?
          (<div className="RemoveButton" ref={RemoveButton}
            onMouseLeave={() => { mouseLeaveAnim(RemoveButton); }}
            onMouseEnter={() => { mouseEnterAnim(RemoveButton); }}
            onMouseDown={() => { mouseDownAnim(RemoveButton); }}
            onMouseUp={() => { mouseUpAnim(RemoveButton); }}
            onClick={() => { onRemoveBtnClick(SpecsButton); }}>
            <img src={removeIcon} className='InfoIcon' alt="" />
          </div>) : ""}

        <div
          // i'll get rid of this ternary atrocity in the future
          className={"ItemCardText AddButton" +
            (multipleChoice ? (active ? " Minimized" : " Minimized GreyedOutGreen")
              : (!active ? " GreyedOutWhite" : (selected ? " Selected" : "")))}
          ref={AddButton}
          onMouseLeave={active ? () => { mouseLeaveAnim(AddButton) } : blank}
          onMouseEnter={active ? () => { mouseEnterAnim(AddButton) } : blank}
          onMouseDown={active ? () => { mouseDownAnim(AddButton) } : blank}
          onMouseUp={active ? () => { mouseUpAnim(AddButton) } : blank}
          onClick={active ? () => { onAddBtnClick(AddButton) } : blank}
        >
          {multipleChoice ? (<img src={active ? addIcon : addIconBlack} className='InfoIcon' alt="" />)
            : (selected ? "Выбрано" : ("+" + price + "₽"))}
        </div>

        <div className="SpecsButton" ref={SpecsButton}
          onMouseLeave={() => { mouseLeaveAnim(SpecsButton); }}
          onMouseEnter={() => { mouseEnterAnim(SpecsButton); }}
          onMouseDown={() => { mouseDownAnim(SpecsButton); }}
          onMouseUp={() => { mouseUpAnim(SpecsButton); }}
          onClick={() => { onSpecsBtnClick(SpecsButton); }}
        >
          <img src={InfoIcon} className='InfoIcon' alt="" />
        </div>

      </div>
    </div>
  );
}

export default ItemCard;
