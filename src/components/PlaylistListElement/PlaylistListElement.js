import React from 'react';
import './PlaylistListElement.css';

export class PlaylistListElement extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
// This method handles clicking of playlistListElements. Calls getPlaylistTracks method of <App /> if no playlist is loaded. Calls newPlaylist method if it is currently active.
  handleClick(e) {
    console.log(this.props.playlist.id !== this.props.activeID);
    if (this.props.playlist.id !== this.props.activeID) {
      let playlist = this.props.playlist;
      this.props.onGetTracks(playlist.tracksURL, playlist.name, playlist.id);
    } else if (this.props.playlist.id === this.props.activeID) {
      this.props.onReset();
    }
  }
// Renders the PlaylistListElement component
  render() {
      return <a onClick={this.handleClick} className={this.props.playlist.id === this.props.activeID ? 'active' : ''}>{this.props.playlist.name}</a>;
  }
}
