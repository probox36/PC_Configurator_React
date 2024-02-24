import './styles/style.ItemCardHolder.css';
import Sad from './images/Sentiment_sad.svg';

function ItemCardHolder({itemCardList, itemCardHolderState}) {

  const renderSwitch = () => {
    switch (itemCardHolderState) {
      case 'showItemCards': {
        return itemCardList.map((card) => (
          <>{card}</>
        ))
      }
      case 'showStub':
        return <div className="catalogEmptyNotification">
          <img src={Sad} className='sentimentSadImg' alt="Sentiment sad image" />
          <div className="catalogEmptyCaption">Здесь ничего нет</div>
          </div>;              
      default:
        return <></>;
    }
  }
  
  return (
    <div className="ItemCardHolder">
          { renderSwitch() }   
    </div>
  );
}

export default ItemCardHolder;
