import './styles/style.PartsSelection.css';
import React from 'react';
import withAnimation from './hoc/withAnimation.tsx';
import { Button } from './Button.tsx';

const PriceDisplay = ({ price }) => {
  return (
    <div className='TotalCostHolder'>
      <div className="PartSelectionText CostLabel">Стоимость:</div>
      <div className="TotalCostMount">
        <div className='PartSelectionText TotalCost'>{price + '₽'}</div>
      </div>
    </div>
  );
}

function PartSelection({ price, partSlotList }) {
  return (
    <div className="PartSelectionCard">
      <PriceDisplay price={price} />
      <div className="PartSlotHolder">
        {partSlotList.map((slot) => (
          <>{slot}</>
        ))}
      </div>
      <div className="OrderButtonHolder">
        <Button content={'Сделать заказ'} btnName='OrderButton' btnWidth={290}/>
      </div>
    </div>
  );
}

export default PartSelection;
