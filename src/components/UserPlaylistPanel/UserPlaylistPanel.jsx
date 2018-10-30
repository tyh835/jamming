import React from 'react';
import './UserPlaylistPanel.css';
import UserPlaylist from '../UserPlaylist/UserPlaylist';

export default class UserPlaylistPanel extends React.Component {
  // Handles when add New Playlist is clicked
  handleNew = e => {
    e.preventDefault();
    this.props.onNew();
  };
  // Renders the PlaylistList component
  render() {
    if (
      this.props.playlists &&
      this.props.playlists.length !== 0 &&
      this.props.isAuthorized
    ) {
      // Render each playlist as clickable components.
      return (
        <div className="PlaylistList">
          <h2>Your Playlists</h2>
          <div className="playlists">
            <a href="/" className="add" onClick={this.handleNew}>
              {'+ New playlist'}
            </a>
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
        <div className="PlaylistList">
          <h2>Playlists</h2>
        </div>
      );
    }
  }
}
