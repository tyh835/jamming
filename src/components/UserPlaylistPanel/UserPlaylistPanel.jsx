import React from 'react';
import AddPlaylist from './AddPlaylist/AddPlaylist';
import UserPlaylist from './UserPlaylist/UserPlaylist';
import style from './UserPlaylistPanel.module.scss';

export default class UserPlaylistPanel extends React.Component {
  // Handles when add New Playlist is clicked
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
            <AddPlaylist handleNew={this.handleNew} />
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
