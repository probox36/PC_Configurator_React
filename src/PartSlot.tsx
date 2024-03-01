import React, { useRef } from 'react';
import { isMobile } from 'react-device-detect';
import { Part } from './entities/Part';
import './styles/style.PartSlot.css';
import chevron from './images/Chevron_right.svg';
import { PartClassName } from './entities/PartClassName';

interface PartSlotProps {
  iconAddress: string;
  partObject?: Part;
  partClassName: PartClassName;
  partName: string;
  setOnClick: (partClassName: PartClassName) => void;
};

function PartSlot({ iconAddress, partObject, partClassName, partName, setOnClick }: PartSlotProps) {

  const ref = useRef<HTMLImageElement>(null);
  // partObject = typeof partObject === 'undefined' ? {} : partObject;

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
      ref.current.classList.remove("AnimateOnEnter");
      ref.current.classList.add("AnimateOnLeave");
    }
  };

  const mouseEnterAnim = () => {
    if (!isMobile) {
      ref.current.classList.remove("AnimateOnLeave");
      ref.current.classList.add("AnimateOnEnter");
    }
  };

  const mouseDownAnim = () => {
    if (!isMobile) {
      ref.current.classList.add("AnimateOnMouseDown");
      ref.current.classList.remove("AnimateOnMouseEnter");
    }
  };

  const mouseUpAnim = () => {
    if (!isMobile) {
      ref.current.classList.remove("AnimateOnMouseDown");
    }
  }

  const onClickHandler = async () => {
    if (isMobile) {
      ref.current.classList.add("AnimateOnClickMobile");
      setTimeout(() => {
        ref.current.classList.remove("AnimateOnClickMobile");
      }, 120);
    }

    setOnClick(partClassName);
  };

  let isPartObjectDefined;

  if (typeof partObject != 'undefined' && partObject != null) {
    if (Array.isArray(partObject)) {
      isPartObjectDefined = partObject.length > 0;
    } else {
      isPartObjectDefined = typeof partObject.id != 'undefined';
    }
  } else {
    isPartObjectDefined = false;
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
          <img src={iconAddress} className="Icon" ref={ref} alt="Part icon" />
        </div>
      </div>
      <div className="PartInfoHolder">
        <div className="Text PartName">{partName}</div>
        <div className="Text ModelName">{isPartObjectDefined ? getGeneralName(partObject) : "Не выбрано"}</div>
        <div className="Text PartPrice">{isPartObjectDefined ? getGeneralPrice(partObject) + "₽" : ""}</div>
      </div>
      <div className="ArrowMount">
        <img src={chevron} className="ArrowIcon" alt="" />
      </div>
    </div>
  );
}

export default PartSlot;
