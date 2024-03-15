import React, { ReactElement } from 'react';
import './styles/style.Modal.css';
import { motion } from 'framer-motion';

interface PartSlotProps {
  text: string;
  buttons: Array<ReactElement>;
};

function Modal({text, buttons}: PartSlotProps) {

  return (
    <div className='ModalWindowOverlay'>
        <motion.div 
        className="ModalWindow"
        animate = {{ opacity: 1 }}
        initial = {{ opacity: 0.2 }}
        >
            <div className="ModalText">
                { text }
            </div>
            <div className="ModalButtonHolder">
            { buttons.map((button) => (
                <>{ button }</>
            )) }
            </div>
        </motion.div>
    </div>
  );
}

export default Modal;
