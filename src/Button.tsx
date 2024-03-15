import React from "react";
import { ReactElement } from "react";
import './styles/style.Button.css';
import { motion } from "framer-motion";
import { isMobile } from 'react-device-detect';
import { whileTapAnimation, whileTapMobileAnimation, whileHoverAnimation } from "./Animations.tsx";

interface ButtonProps {
    content: ReactElement | string;
    btnName?: string;
    callback?: () => void;
    btnWidth?: number;
    btnHeight?: number;
    btnBorderRadius?: number;
}

export function Button({ content, btnName, callback, btnWidth, btnHeight, btnBorderRadius }: ButtonProps) {  
    
    const optionalStyles = {
        width: btnWidth,
        height: btnHeight == undefined ? 42 : btnHeight,
        lineHeight: btnHeight == undefined ? '42px' : btnHeight + 'px',
        padding: btnWidth == undefined ? '0 15px' : '0',
        borderRadius: btnBorderRadius == undefined ? 14 : btnBorderRadius
    };

    const btnClassName = 'Button ' + (btnName == undefined ? '' : btnName);

    return (
        <motion.div 
            className={ btnClassName } 
            onClick={ callback }
            whileHover={whileHoverAnimation}
            whileTap={isMobile ? whileTapMobileAnimation : whileTapAnimation}
            style={ optionalStyles }
        > 
            { content } 
        </motion.div>
    );
}

export default Button;