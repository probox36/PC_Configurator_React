import './styles/style.SpecsWindow.css';
import React from 'react';
import { useEffect } from 'react';
import CloseIcon from './images/CloseWhite.svg';
import Button from "./Button.tsx";
import { Part } from './entities/Part';
import { motion } from 'framer-motion';

interface SpecsWindowProps {
  partObject: Part;
  addCallback: () => void;
  closeCallback: () => void;
  addMode: boolean;
}

function SpecsWindow({partObject, addCallback, closeCallback, addMode}: SpecsWindowProps) {

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Escape') {
        closeCallback();
      }
    };
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);
    
  return (

    <div className="specsWindowOverlay">
        <motion.div 
          className="window"
          animate = {{ opacity: 1, scale: 1 }}
          initial = {{ opacity: 0.2, scale: 0.85 }} >
            <div className="leftPane">
                <img className="productImage" src={ partObject.imgAddress } alt={ 'Фото ' + partObject.modelName } />
                <div className="productNameHolder">
                  <div className="bean"></div>
                  <div className="innerProductNameHolder">
                    <div className="title windowProductName">{ partObject.modelName }</div>
                    <div className="title windowPrice"> { partObject.price + '₽' } </div>
                  </div>
                </div>
                <Button 
                  content={addMode ? 'Добавить' : 'Убрать'} 
                  callback={addCallback}
                  btnName='windowAddButton' 
                  btnWidth={310} >
                </Button>
            </div>
            <div className="rightPane">
              <div className="header">
                <div className="title windowTitle">Описание:</div>
                <div className="closeButton" onClick={ closeCallback }>
                  <img className="cross" src={ CloseIcon } alt="Закрыть"/>
                </div>
              </div>
              <div className="description">
                { partObject.description }  
              </div>
            </div>
        </motion.div>
    </div>

  );
}

export default SpecsWindow;
