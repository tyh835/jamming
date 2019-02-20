import React from 'react';
import style from './Header.module.scss';

const Header = () => {
  return (
    <header className={style.container}>
      <h1 className={style.title}>
        Ja
        <span className={style.highlight}>mm</span>
        ing
      </h1>
    </header>
  );
};

export default Header;
