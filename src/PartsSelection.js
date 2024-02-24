import { useRef } from 'react';
import { isMobile } from 'react-device-detect';
import './styles/style.PartsSelection.css';

function PartSelection({price, partSlotList}) {

  const OrderButton = useRef(null);

  const mouseLeaveAnim = () => {
    if (!isMobile) {
      OrderButton.current.classList.remove("AnimateOnEnter");
      OrderButton.current.classList.add("AnimateOnLeave");
    }
  };

  const mouseEnterAnim = () => {
    if (!isMobile) {
      OrderButton.current.classList.remove("AnimateOnLeave");
      OrderButton.current.classList.add("AnimateOnEnter");
    }
  };

  const mouseDownAnim = () => {
    if (!isMobile) {
      OrderButton.current.classList.add("AnimateOnMouseDown");   
      OrderButton.current.classList.remove("AnimateOnMouseEnter");
    }
  };

  const mouseUpAnim = () => {
    if (!isMobile) {
      OrderButton.current.classList.remove("AnimateOnMouseDown");
    }
  }

  const clickMobileAnim = () => {
    if (isMobile) {
      OrderButton.current.classList.add("AnimateOnClickMobile");   
      setTimeout(() => {
        OrderButton.current.classList.remove("AnimateOnClickMobile");
      }, 200);
    }
  };

  return (
    <div className="PartSelectionCard">
        <div className="Text TotalCost">Стоимость:</div>
        <div className="PriceMount">
            <div className="Text Price">{price + '₽'}</div>
        </div>
        {partSlotList.map((slot) => (
          <>{slot}</>
        ))}
        <div className='Text OrderButton' ref={OrderButton}
        onMouseEnter={mouseEnterAnim}
        onMouseLeave={mouseLeaveAnim}
        onMouseDown={mouseDownAnim}
        onMouseUp={mouseUpAnim}
        onClick={clickMobileAnim}
        >Сделать заказ</div>
    </div>
  );
}

export default PartSelection;
