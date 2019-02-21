import React from 'react';
import style from './NewPlaylist.module.scss';

const NewPlaylist = ({ resetPlaylist }) => {
  return (
    <button className={style.addButton} onClick={resetPlaylist}>
      {'+ New playlist'}
    </button>
  );
};

export default NewPlaylist;
