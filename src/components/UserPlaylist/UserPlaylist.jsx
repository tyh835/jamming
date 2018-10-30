import React from 'react';
import './UserPlaylist.css';

export default class UserPlaylist extends React.Component {
  // This method handles clicking of playlistListElements. Calls getPlaylistTracks method of <App /> if no playlist is loaded. Calls newPlaylist method if it is currently active.
  handleClick = e => {
    e.preventDefault();
    if (this.props.playlist.id !== this.props.activeID) {
      this.props.onGetTracks(
        this.props.playlist.tracksURL,
        this.props.playlist.name,
        this.props.playlist.id
      );
    } else if (this.props.playlist.id === this.props.activeID) {
      this.props.onReset();
    }
  };
  // Renders the PlaylistListElement component
  render() {
    return (
      <a
        href="/"
        onClick={this.handleClick}
        className={
          this.props.playlist.id === this.props.activeID ? 'active' : ''
        }
      >
        {this.props.playlist.name}
      </a>
    );
  }
}
