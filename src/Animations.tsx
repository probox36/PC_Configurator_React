import { easeOut } from "framer-motion";

export const whileTapAnimation = {
    scale: 0.99,
    transition: { 
        duration: 0.07, 
        ease: easeOut
    }
};

export const whileTapMobileAnimation = {
    scale: 0.94,
    boxShadow: '0px 0px 6px 2px rgb(100, 100, 100)',
    transition: { 
        duration: 0.07, 
        ease: easeOut
    }
};

export const whileHoverAnimation = { 
    scale: 1.035, 
    boxShadow: '0px 0px 6px 2px rgb(100, 100, 100)',
    transition: { 
        duration: 0.12, 
        ease: easeOut
    }
};

const partSlotTapTransition = {
    duration: 0.06,
    ease: [0, 0, 0.25, 1]
};

export const partSlotAnimationVariants = {
    tap: {
      y: 0,
      transition: partSlotTapTransition 
    },
    tapMobile: {
      y: 4,
      transition: partSlotTapTransition
    },
    hover: {
      y: -4
    }
};