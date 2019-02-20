import React from 'react';
import TrackList from '../TrackList/TrackList';
import './Playlist.scss';

export default class Playlist extends React.Component {
  handleNameChange = e => {
    this.props.onNameChange(e.target.value);
  };

  handleSave = e => {
    e.preventDefault();
    this.props.onSave();
  };

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

  renderDelete = () => {
    return (
      <a href="/" className="Playlist-delete" onClick={this.handleDelete}>
        DELETE PLAYLIST
      </a>
    );
  };

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
