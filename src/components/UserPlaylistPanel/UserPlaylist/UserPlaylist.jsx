import React from 'react';
import style from './UserPlaylist.module.scss';

const UserPlaylist = ({ playlist, activeID, onGetTracks, onReset }) => {
  const { id, name, tracksURL } = playlist;

  const handleClick = () => {
    if (id !== activeID) {
      onGetTracks(tracksURL, name, id);
    } else if (id === activeID) {
      onReset();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${style.playlistButton} ${
        id === activeID ? style.active : ''
      }`}
    >
      {name}
    </button>
  );
};

export default UserPlaylist;
