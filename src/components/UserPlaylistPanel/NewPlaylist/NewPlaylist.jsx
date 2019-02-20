import React from 'react';
import style from './NewPlaylist.module.scss';

const AddPlaylist = ({ handleNew }) => {
  return (
    <a href="/" className={style.addButton} onClick={handleNew}>
      {'+ New playlist'}
    </a>
  );
};

export default AddPlaylist;
