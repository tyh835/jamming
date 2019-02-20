import React from 'react';
import style from './NewPlaylist.module.scss';

const NewPlaylist = ({ handleClick }) => {
  return (
    <button className={style.addButton} onClick={handleClick}>
      {'+ New playlist'}
    </button>
  );
};

export default NewPlaylist;
