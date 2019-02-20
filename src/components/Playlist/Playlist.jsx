import React from 'react';
import TrackList from '../TrackList/TrackList';
import './Playlist.scss';

export default class Playlist extends React.Component {
  // This method changes <App />'s playlistName state whenever the input changes.
  handleNameChange = e => {
    this.props.onNameChange(e.target.value);
  };
  // This method calls <App />'s savePlaylist function when Save to Spotify button is clicked.
  handleSave = e => {
    e.preventDefault();
    this.props.onSave();
  };
  // This method calls <App />'s deletePlaylist function when Delete Playlist is clicked.
  handleDelete = e => {
    e.preventDefault();
    const name = this.props.playlistName;
    if (
      window.confirm(
        `Are you sure you want to delete ${name}? Note: it is possible to manually restore deleted playlists through Spotify Account Services.`
      )
    ) {
      this.props.onDelete();
    }
  };
  // This method renders the delete button if the playlist currently exists
  renderDelete = () => {
    return (
      <a href="/" className="Playlist-delete" onClick={this.handleDelete}>
        DELETE PLAYLIST
      </a>
    );
  };
  // Renders playlists save in a <App />'s playlistTracks state.
  render() {
    return (
      <div className="Playlist">
        <input
          value={this.props.playlistName}
          onChange={this.handleNameChange}
        />
        <TrackList
          tracks={this.props.playlistTracks}
          onRemove={this.props.onRemove}
          isRemoval={true}
        />
        <a href="/" className="Playlist-save" onClick={this.handleSave}>
          <i className="fa fa-spotify" />
          &nbsp;SAVE TO SPOTIFY
        </a>
        {this.props.isNew ? '' : this.renderDelete()}
      </div>
    );
  }
}
