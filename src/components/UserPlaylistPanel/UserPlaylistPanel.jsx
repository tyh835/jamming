import React from 'react';
import NewPlaylist from './NewPlaylist/NewPlaylist';
import UserPlaylist from './UserPlaylist/UserPlaylist';
import style from './UserPlaylistPanel.module.scss';

const UserPlaylistPanel = ({
  activeID,
  getPlaylistTracks,
  isAuthorized,
  onNew,
  playlists,
}) =>
  playlists && playlists.length !== 0 && isAuthorized ? (
    <div className={style.container}>
      <h2 className={style.title}>Your Playlists</h2>
      <div className={style.playlists}>
        <NewPlaylist handleClick={onNew} />
        {playlists.map(playlist => {
          return (
            <UserPlaylist
              key={playlist.id}
              activeID={activeID}
              playlist={playlist}
              onGetTracks={getPlaylistTracks}
              onReset={onNew}
            />
          );
        })}
      </div>
    </div>
  ) : (
    <div className={style.container}>
      <h2 className={style.title}>Playlists</h2>
    </div>
  );

export default UserPlaylistPanel;
