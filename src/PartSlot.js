import { useRef } from 'react';
import { isMobile } from 'react-device-detect';
import './styles/style.PartSlot.css';
import chevron from './images/Chevron_right.svg';

function PartSlot({ iconAddress, partObject, partName, setOnClick, partClassName }) {

  const IconRef = useRef(null);
  partObject = typeof partObject === 'undefined' ? {} : partObject;

  const getGeneralName = (partObject) => {

    if (!Array.isArray(partObject)) { return partObject.modelName; }

    let partNames = {};
    let generalName = "";

    partObject.forEach(part => {
      if (partNames[part.modelName] === undefined) {
        partNames[part.modelName] = 1;
      } else {
        partNames[part.modelName] += 1;
      }
    });

    let keys = Object.keys(partNames);

    for (let i = 0; i < keys.length; i++) {
      let key = Object.keys(partNames)[i];
      if (partNames[key] === 1) {
        generalName += key;
      } else {
        generalName = generalName + key + " x" + partNames[key];
      }
      if (i !== keys.length - 1) {
        generalName += ", "
      }
    }

    return generalName;
  };

  const getGeneralPrice = (partObject) => {

    const getPartPrice = (part) => {
      return typeof part.price != 'undefined' ? part.price : 0;
    };

    if (!Array.isArray(partObject)) { return getPartPrice(partObject); }

    let price = 0;
    partObject.forEach((part) => {
      price += getPartPrice(part);
    });
    return price;
  };

  const mouseLeaveAnim = () => {
    if (!isMobile) {
      IconRef.current.classList.remove("AnimateOnEnter");
      IconRef.current.classList.add("AnimateOnLeave");
    }
  };

  const mouseEnterAnim = () => {
    if (!isMobile) {
      IconRef.current.classList.remove("AnimateOnLeave");
      IconRef.current.classList.add("AnimateOnEnter");
    }
  };

  const mouseDownAnim = () => {
    if (!isMobile) {
      IconRef.current.classList.add("AnimateOnMouseDown");
      IconRef.current.classList.remove("AnimateOnMouseEnter");
    }
  };

  const mouseUpAnim = () => {
    if (!isMobile) {
      IconRef.current.classList.remove("AnimateOnMouseDown");
    }
  }

  const onClickHandler = async () => {
    if (isMobile) {
      IconRef.current.classList.add("AnimateOnClickMobile");
      setTimeout(() => {
        IconRef.current.classList.remove("AnimateOnClickMobile");
      }, 120);
    }

    setOnClick(partClassName, partObject);
  };

  let isDefined;

  if (typeof partObject != 'undefined') {
    if (Array.isArray(partObject)) {
      isDefined = partObject.length > 0;
    } else {
      isDefined = typeof partObject.id != 'undefined';
    }
  } else {
    isDefined = false;
  }

  return (
    <div className="PartSlot"
      onMouseLeave={mouseLeaveAnim}
      onMouseEnter={mouseEnterAnim}
      onMouseUp={mouseUpAnim}
      onMouseDown={mouseDownAnim}
      onClick={onClickHandler}>

      <div className='IconMountLower'>
        <div className='IconMountUpper'>
          <img src={iconAddress} className="Icon" ref={IconRef} alt="Part icon" />
        </div>
      </div>
      <div className="PartInfoHolder">
        <div className="Text PartName">{partName}</div>
        <div className="Text ModelName">{isDefined ? getGeneralName(partObject) : "Не выбрано"}</div>
        <div className="Text PartPrice">{isDefined ? getGeneralPrice(partObject) + "₽" : ""}</div>
      </div>
      <div className="ArrowMount">
        <img src={chevron} className="ArrowIcon" alt="" />
      </div>
    </div>
  );
}

export default PartSlot;
