import React from 'react';
import './Playlist.css';
import {TrackList} from '../TrackList/TrackList.js';

export class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
  }
// This method changes <App />'s playlistName state whenever the input changes.
  handleNameChange(e) {
    this.props.onNameChange(e.target.value);
  }
// Renders playlists save in a <App />'s playlistTracks state.
  render() {
    return (
      <div className="Playlist">
        <input value={this.props.playlistName} onChange={this.handleNameChange} />
        <TrackList tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval={true} />
        <a className="Playlist-save" onClick={this.props.onSave}><i className="fa fa-spotify"></i> SAVE TO SPOTIFY</a>
      </div>
    );
  }
}
