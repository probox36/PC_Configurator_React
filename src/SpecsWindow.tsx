import './styles/style.SpecsWindow.css';
import React from 'react';
import CloseIcon from './images/CloseWhite.svg';
import Cooler from './images/Cooler.jpg';

function SpecsWindow({partObject}) {
    
  return (
    
    // <div className="Overlay">
    //     <div className="Window">
    //         <div className="LeftPane">
    //             <img src={ partObject.imgAddress } alt={ "Фото " + partObject.id } />
    //             <div className="windowProductName">{ partObject.modelName }</div>
    //             <div className="windowAddButton">Добавить</div>
    //         </div>
    //         <div className="windowTitle">Характеристики</div>
    //         <div className="closeButton"></div>
    //         <div className="description"></div>
    //     </div>
    // </div>

    <div className="specsWindowOverlay">
        <div className="window">
            <div className="leftPane">
                <img className="productImage" src={ Cooler } alt={ "Фото моего члена" } />
                <div className="productNameHolder">
                  <div className="bean"></div>
                  <div className="title windowProductName">{ "Intel Core i5-12400F" }</div>
                </div>
                <div className="title windowAddButton">Добавить</div>
            </div>
            <div className="rightPane">
              <div className="header">
                <div className="title windowTitle">Характеристики:</div>
                <div className="closeButton">
                  <img className="cross" src={ CloseIcon } alt="Закрыть" />
                </div>
              </div>
              <div className="description">
                {"Из помощников здесь есть: информирование о слепых зонах, помощь в движении задним ходом, камера 360°, а также предупреждение об опасности при открытии дверей. А вот круиз-контроль здесь неадаптивный. Никаких автоматических экстренных торможений и активного удержания в полосе не имеется, но я бы и не сказал, что это какой-то критический момент, по сути это уже больше блажь. Вообще, интерьер выглядит приятно, тот же свежий лаймовый цвет. Да, это не премиум-материалы, но, опять же, это больше к любителям всё жамкать. Но при этом здесь приятная эргономика классического формата и пара любопытных решений как в меню, так и в интерьере, о которых я уже упомянул."}
              </div>
            </div>
        </div>
    </div>

  );
}

export default SpecsWindow;
