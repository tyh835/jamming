import React from 'react';
import TrackList from '../TrackList/TrackList';
import style from './Playlist.module.scss';

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
      <button className={style.deleteButton} onClick={this.handleDelete}>
        DELETE PLAYLIST
      </button>
    );
  };

  render() {
    return (
      <div className={style.container}>
        <input
          className={style.nameInput}
          value={this.props.playlistName}
          onChange={this.handleNameChange}
        />
        <TrackList
          tracks={this.props.playlistTracks}
          onRemove={this.props.onRemove}
          isRemoval={true}
        />
        <button href="/" className={style.saveButton} onClick={this.handleSave}>
          <i className="fa fa-spotify" />
          &nbsp;SAVE TO SPOTIFY
        </button>
        {this.props.isNew ? '' : this.renderDelete()}
      </div>
    );
  }
}
