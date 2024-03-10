import React from 'react';
import { isMobile } from 'react-device-detect';
import './styles/style.PartSlot.css';
import chevron from './images/Chevron_right.svg';
import { PartClassName } from './entities/PartClassName.ts';
import { motion, easeOut } from 'framer-motion';
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

  return (
    <motion.div 
      className="PartSlot"
      onClick={() => { setOnClick(partClassName) }}
      initial = 'tap'
      whileHover='hover'
      whileTap= {isMobile ? 'tapMobile' : 'tap'}
    >
      <div className='IconMountLower'>
        <div className='IconMountUpper'>
          <motion.img 
            src={iconAddress} 
            className="Icon"
            alt="Part icon"
            variants={partSlotAnimationVariants}
            transition={{
              duration: 0.08,
              ease: easeOut
            }}
          />
        </div>
      </div>
      <div className="PartInfoHolder">
        <div className="Text PartName">{partName}</div>
        <div className="Text ModelName">{isPartObjectDefined ? computer.getGeneralName(partClassName) : "Не выбрано"}</div>
        <div className="Text PartPrice">{isPartObjectDefined ? computer.getCostByPartClass(partClassName) + "₽" : ""}</div>
      </div>
      <div className="ArrowMount">
        <img src={chevron} className="ArrowIcon" alt="" />
      </div>
    </motion.div>
  );
}

export default PartSlot;
