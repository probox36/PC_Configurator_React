import React from 'react';
import { isMobile } from 'react-device-detect';
import { Part } from './entities/Part';
import './styles/style.ItemCard.css';
import InfoIcon from './images/Info.svg';
import addIcon from './images/Add.svg';
import removeIcon from './images/Remove.svg';
import addIconBlack from './images/Add_black.svg';
import { Button } from './Button.tsx';
import { motion } from 'framer-motion';
import { whileHoverAnimation, whileTapAnimation, whileTapMobileAnimation } from './Animations.tsx';

interface ItemCardProps {
  partObject: Part;
  selected: boolean;
  active: boolean;
  onClickAdd: (part: Part, addMode: boolean) => void;
  onSpecsBtnClick: (part: Part) => void;
  multipleChoice: boolean;
  quantity: number;
}

function ItemCard({ partObject, selected, active, onClickAdd, onSpecsBtnClick, multipleChoice, quantity }: ItemCardProps) {

  // const [quantity, setQuantity] = useState(0);

  const modelName = partObject.modelName;
  const price = partObject.price;
  const image = partObject.imgAddress;

  const addButtonStyle = () => {
    if (multipleChoice) {
      if (active) {
        return " Minimized";
      } else {
        return " Minimized GreyedOutGreen";
      }
    } else {
      if (!active) {
        return " GreyedOutWhite";
      } else if (selected) {
        return " Selected";
      } else {
        return "";
      }
    }
  };

  const addButtonContent = () => {
    if (multipleChoice) {
      return <img src={active ? addIcon : addIconBlack} className='InfoIcon' alt="Add icon" />;
    } else if (selected) {
      return "Выбрано";
    } else {
      return `+${price}₽`;
    }
  };

  const getButtonWhileClickAnim = () => {
    if (active) {
      if (isMobile) {
        return whileTapMobileAnimation;
      } else {
        return whileTapAnimation;
      }
    } else {
      return {};
    }
  };

  const onAddBtnClick = () => {
    if (!selected || multipleChoice) {
      onClickAdd(partObject, true);
    } else {
      onClickAdd(partObject, false);
    }
  };

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

        { 
          multipleChoice ?
          (<motion.div 
            className="RemoveButton" 
            whileHover={ whileHoverAnimation }
            whileTap={ isMobile ? whileTapMobileAnimation : whileTapAnimation }
            onClick={ () => {onClickAdd(partObject, false)} }>
              <img src={removeIcon} className='InfoIcon' alt="" />
          </motion.div>) : ''
        }

        <motion.div
          className={"ItemCardText AddButton" + addButtonStyle()}
          whileHover={ active ? whileHoverAnimation : {} }
          whileTap={ getButtonWhileClickAnim() }
          onClick={ active ? onAddBtnClick : () => {} }          
        >
          { addButtonContent() }
        </motion.div>

        <Button 
          content={<img src={InfoIcon} className='InfoIcon' alt="" />} 
          callback={() => {onSpecsBtnClick(partObject)}} 
          btnName='SpecsButton' 
          btnWidth={80} 
          btnHeight={38} 
          btnBorderRadius={9}>
        </Button>

      </div>

    </div>
  );
}

export default ItemCard;
