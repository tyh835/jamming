import React, { Component } from 'react';
import TrackList from '../TrackList/TrackList';
import style from './Playlist.module.scss';

class Playlist extends Component {
  handleDelete = () => {
    const { playlistName, playlistID, deletePlaylist } = this.props;
    if (
      window.confirm(
        `Are you sure you want to delete ${playlistName}? Note: it is possible to manually restore deleted playlists through Spotify Account Services.`
      )
    ) {
      deletePlaylist(playlistID);
    }
  };

  render() {
    const {
      isNewPlaylist,
      playlistName,
      playlistTracks,
      removeTrack,
      savePlaylist,
      updatePlaylistName,
    } = this.props;

    return (
      <div className={style.container}>
        <input
          className={style.nameInput}
          value={playlistName}
          onChange={e => updatePlaylistName(e.target.value)}
        />
        <TrackList
          tracks={playlistTracks}
          removeTrack={removeTrack}
          isRemoval={true}
        />
        <button
          className={style.saveButton}
          onClick={() => savePlaylist(playlistName)}
        >
          <i className="fa fa-spotify" />
          &nbsp;SAVE TO SPOTIFY
        </button>
        {isNewPlaylist || (
          <button className={style.deleteButton} onClick={this.handleDelete}>
            DELETE PLAYLIST
          </button>
        )}
      </div>
    );
  }
}

export default Playlist;
