import React from 'react';
import Button from './Button.tsx';
import './styles/style.AuthenticationForm.css';
import CloseIcon from './images/CloseWhite.svg';
import { motion } from 'framer-motion';

interface AuthenticationFormArgs {
    closeCallback?: () => void;
    signInCallback?: () => void;
}

function AuthenticationForm({closeCallback, signInCallback}: AuthenticationFormArgs) {

  return (
    <div className='AuthWindowOverlay'>
        <motion.div 
        className="AuthWindow"
        animate = {{ opacity: 1, scale: 1 }}
        initial = {{ opacity: 0.2, scale: 0.85 }}
        >
            <img className="Cross" src={ CloseIcon } onClick={closeCallback} alt="Закрыть"/>
            <label htmlFor="username">Имя пользователя:</label>
            <input type="text" id="username" required></input>
            <label htmlFor="password">Пароль:</label>
            <input type="password" id="password" required></input>
            <Button content={'Войти'} btnName='AuthButton' callback={signInCallback}></Button>
        </motion.div>
    </div>
  );
}

export default AuthenticationForm;
