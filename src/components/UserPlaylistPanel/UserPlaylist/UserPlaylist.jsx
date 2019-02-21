import React from 'react';
import style from './UserPlaylist.module.scss';

const UserPlaylist = ({
  playlist,
  activeID,
  getPlaylistTracks,
  resetPlaylist,
}) => {
  const { id, name, tracksURL } = playlist;

  const handleClick = () => {
    id !== activeID ? getPlaylistTracks(tracksURL, name, id) : resetPlaylist();
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
