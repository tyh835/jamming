import React from 'react';
import './Playlist.css';
import {TrackList} from '../TrackList/TrackList.js';

export class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.renderDelete = this.renderDelete.bind(this);
  }
// This method changes <App />'s playlistName state whenever the input changes.
  handleNameChange(e) {
    this.props.onNameChange(e.target.value);

  }
// This method calls <App />'s savePlaylist function when Save to Spotify button is clicked.
  handleSave(e) {
    this.props.onSave();
  }
// This method calls <App />'s deletePlaylist function when Delete Playlist is clicked.
  handleDelete(e) {
    const name = this.props.playlistName;
    if(window.confirm(`Are you sure you want to delete ${name}? Note: it is possible to manually restore deleted playlists through Spotify Account Services.`)) {
      console.log(this);
    }
  }
// This method renders the delete button if the playlist currently exists
  renderDelete() {
    return <a className="Playlist-delete" onClick={this.handleDelete}>DELETE PLAYLIST</a>;
  }

// Renders playlists save in a <App />'s playlistTracks state.
  render() {
    return (
      <div className="Playlist">
        <input value={this.props.playlistName} onChange={this.handleNameChange} />
        <TrackList tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval={true} />
        <a className="Playlist-save" onClick={this.handleSave}><i className="fa fa-spotify"></i> SAVE TO SPOTIFY</a>
        {this.props.isNew ? '' : this.renderDelete()}
      </div>
    );
  }
}
