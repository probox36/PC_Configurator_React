import React from 'react';
import { isMobile } from 'react-device-detect';
import './styles/style.PartSlot.css';
import chevron from './images/Chevron_right.svg';
import { PartClassName } from './entities/PartClassName.ts';
import { motion, easeOut, color } from 'framer-motion';
import { partSlotAnimationVariants } from './Animations.tsx';
import { Computer } from './entities/Computer.ts';

interface PartSlotProps {
  isActive?: boolean;
  iconAddress: string;
  computer: Computer;
  partClassName: PartClassName;
  partName: string;
  setOnClick: (partClassName: PartClassName) => void;
};

function PartSlot({ isActive, iconAddress, computer, partClassName, partName, setOnClick }: PartSlotProps) {
  
  const partObject = computer[partClassName];
  let isPartObjectDefined;

  if (Array.isArray(partObject)) {
    isPartObjectDefined = partObject.length > 0;
  } else {
    isPartObjectDefined = partObject != undefined;
  }

  const inactivePartSlotStyle = isActive ? undefined : { cursor: 'auto' };
  const inactiveIconHolderStyle = isActive ? undefined : { backgroundColor: '#939393' };
  const inactivePartNameStyle = isActive ? undefined : { color: '#bbbbbb' };
  const inactiveTextStyle = isActive ? undefined : { color: '#6f6f6f' };

  return (
    <motion.div 
      className="PartSlot"
      onClick={ isActive ? () => { setOnClick(partClassName) } : undefined }
      initial = 'tap'
      whileHover={isActive ? 'hover' : undefined}
      whileTap= {isActive ? (isMobile ? 'tapMobile' : 'tap') : undefined}
      style={ inactivePartSlotStyle }
    >

      <div className='IconMountLower'>

        <div className='IconMountUpper' style = { inactiveIconHolderStyle  }>

          <motion.img
            src={iconAddress} 
            className="Icon"
            alt="Part icon"
            variants={ partSlotAnimationVariants }
            transition={{
              duration: 0.08,
              ease: easeOut
            }}
          />

        </div>

      </div>

      <div className="PartInfoHolder">

        <div className="PartSlotText PartName" style={ inactivePartNameStyle }>
          {partName}
        </div>

        <div className="PartSlotText ModelName" style={ inactiveTextStyle }>
          {isPartObjectDefined ? computer.getGeneralNameOfPartClass(partClassName) : "Не выбрано"}
        </div>

        <div className="PartSlotText PartPrice" style={ inactiveTextStyle }>
          {isPartObjectDefined ? computer.getCostByPartClass(partClassName) + "₽" : ""}
        </div>

      </div>

      <div className="ArrowMount">
        <img src={chevron} className="ArrowIcon" alt="" />
      </div>

    </motion.div>
  );
}

export default PartSlot;
