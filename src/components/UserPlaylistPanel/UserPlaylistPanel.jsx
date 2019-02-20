import React from 'react';
import NewPlaylist from './NewPlaylist/NewPlaylist';
import UserPlaylist from './UserPlaylist/UserPlaylist';
import style from './UserPlaylistPanel.module.scss';

export default class UserPlaylistPanel extends React.Component {
  handleNew = e => {
    e.preventDefault();
    this.props.onNew();
  };

  render() {
    if (
      this.props.playlists &&
      this.props.playlists.length !== 0 &&
      this.props.isAuthorized
    ) {
      return (
        <div className={style.container}>
          <h2 className={style.title}>Your Playlists</h2>
          <div className={style.playlists}>
            <NewPlaylist handleNew={this.handleNew} />
            {this.props.playlists.map(playlist => {
              return (
                <UserPlaylist
                  key={playlist.id}
                  activeID={this.props.activeID}
                  playlist={playlist}
                  onGetTracks={this.props.getPlaylistTracks}
                  onReset={this.props.onNew}
                />
              );
            })}
          </div>
        </div>
      );
    } else {
      return (
        <div className={style.container}>
          <h2 className={style.title}>Playlists</h2>
        </div>
      );
    }
  }
}
