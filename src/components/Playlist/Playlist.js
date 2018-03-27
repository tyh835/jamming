import React from 'react';
import './Playlist.css';
import {TrackList} from '../TrackList/TrackList.js';

export class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
// This method changes <App />'s playlistName state whenever the input changes.
  handleNameChange(e) {
    this.props.onNameChange(e.target.value);

  }
// This method calls <App />'s savePlaylist function and sets isNewPlaylist state when Save to Spotify button is clicked.
  handleClick(e) {
    this.props.onBoolChange(true);
    this.props.onSave();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isNew === false) {
      this.setState({isNew: false});
    }
  }
// Renders playlists save in a <App />'s playlistTracks state.
  render() {
    return (
      <div className="Playlist">
        <input value={this.props.playlistName} onChange={this.handleNameChange} />
        <TrackList tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval={true} />
        <a className="Playlist-save" onClick={this.handleClick}><i className="fa fa-spotify"></i> SAVE TO SPOTIFY</a>
      </div>
    );
  }
}
