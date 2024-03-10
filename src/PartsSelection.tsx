import './styles/style.PartsSelection.css';
import React from 'react';
import withAnimation from './hoc/withAnimation.tsx';
import { Button } from './Button.tsx';

const PriceDisplay = ({ price }) => {
  return (
    <>
      <div className="PartSelectionText TotalCost">Стоимость:</div>
      <div className="PriceMount">
        <div className='PartSelectionText Price'>{price + '₽'}</div>
      </div>
    </>
  );
}
const OrderButton = withAnimation(() => {
  return (
    <div className='Text OrderButton'>Сделать заказ</div>
  );
});

function PartSelection({ price, partSlotList }) {
  return (
    <div className="PartSelectionCard">
      <PriceDisplay price={price} />
      {partSlotList.map((slot) => (
        <>{slot}</>
      ))}
      <Button content={'Сделать заказ'} btnName='OrderButton' btnWidth={290}/>
    </div>
  );
}

export default PartSelection;
