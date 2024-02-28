import React, { useRef } from 'react';
import { isMobile } from 'react-device-detect';

const withAnimation = (WrappedComponent) => {
    return (props) => {
        const ref = useRef<HTMLDivElement>(null);

        const mouseLeaveAnim = () => {
            if (!isMobile && ref.current) {
                ref.current.classList.remove("AnimateOnEnter");
                ref.current.classList.add("AnimateOnLeave");
            }
        };

        const mouseEnterAnim = () => {
            if (!isMobile && ref.current) {
                ref.current.classList.remove("AnimateOnLeave");
                ref.current.classList.add("AnimateOnEnter");
            }
        };

        const mouseDownAnim = () => {
            if (!isMobile && ref.current) {
                ref.current.classList.add("AnimateOnMouseDown");
                ref.current.classList.remove("AnimateOnMouseEnter");
            }
        };

        const mouseUpAnim = () => {
            if (!isMobile && ref.current) {
                ref.current.classList.remove("AnimateOnMouseDown");
            }
        }

        const clickMobileAnim = () => {
            if (isMobile && ref.current) {
                ref.current.classList.add("AnimateOnClickMobile");
                setTimeout(() => {
                    ref.current?.classList.remove("AnimateOnClickMobile");
                }, 200);
            }
        };

        return (
            <div
                ref={ref}
                onMouseEnter={mouseEnterAnim}
                onMouseLeave={mouseLeaveAnim}
                onMouseDown={mouseDownAnim}
                onMouseUp={mouseUpAnim}
                onClick={clickMobileAnim}
            >
                <WrappedComponent {...props} />
            </div>
        );
    };
};

export default withAnimation;
