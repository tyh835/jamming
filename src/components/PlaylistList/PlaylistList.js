import React from 'react';
import './PlaylistList.css';
import {PlaylistListElement} from '../PlaylistListElement/PlaylistListElement.js';

export class PlaylistList extends React.Component {
  constructor(props) {
    super(props);
    this.handleAdd = this.handleAdd.bind(this);
  }
// Handles when add New Playlist is clicked
  handleAdd(e) {
    console.log(this);
  }
// Renders the PlaylistList component
  render() {
    if (this.props.playlists && this.props.playlists.length !== 0 && this.props.isAuthorized) {
      let playlists = this.props.playlists.map(playlist => playlist);
    // Render each playlist as clickable components.
      return (
        <div className="PlaylistList">
          <h2>Your Playlists</h2>
          <div className="playlists">
            <a className="add" onClick={this.handleAdd} >{'+ New playlist'}</a>
            {playlists.map(playlist => {
            return <PlaylistListElement key={playlist.id} playlist={playlist} />
            })}
          </div>
        </div>
      );
    } else {
      return (<div className="PlaylistList" style={{marginTop: "5.35rem"}}><h2>Playlists</h2></div>);
    }
  }
}
