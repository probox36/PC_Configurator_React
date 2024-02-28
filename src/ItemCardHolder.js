import './styles/style.ItemCardHolder.css';
import sadSentiment from './images/Sentiment_sad.svg';

function ItemCardHolder({ itemCardList, itemCardHolderState }) {

  const renderSwitch = () => {
    switch (itemCardHolderState) {
      case 'showItemCards': {
        return itemCardList.map((card) => (
          <>{card}</>
        ))
      }
      case 'showStub':
        return <div className="catalogEmptyNotification">
          <img src={sadSentiment} className='sentimentSadImg' alt="Sad Face" />
          <div className="catalogEmptyCaption">Здесь ничего нет</div>
        </div>;
      default:
        return <></>;
    }
  }

  return (
    <div className="ItemCardHolder">
      {renderSwitch()}
    </div>
  );
}

export default ItemCardHolder;
