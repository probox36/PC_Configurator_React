import './styles/style.PartsSelection.css';
import withAnimation from './hoc/withAnimation.tsx';
import { Button } from './Button.tsx';

const PriceDisplay = ({ price }) => {
  return (
    <>
      <div className="Text TotalCost">Стоимость:</div>
      <div className="PriceMount">
        <div className='Text Price'>{price + '₽'}</div>
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
      <Button className='OrderButton' content={'Сделать заказ'} btnName='OrderButton' btnWidth={290}/>
    </div>
  );
}

export default PartSelection;
