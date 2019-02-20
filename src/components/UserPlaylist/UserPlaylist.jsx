import React from 'react';
import './UserPlaylist.scss';

export default class UserPlaylist extends React.Component {
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

  render() {
    return (
      <a
        href="/"
        onClick={this.handleClick}
        className={`UserPlaylist ${
          this.props.playlist.id === this.props.activeID ? 'active' : ''
        }`}
      >
        {this.props.playlist.name}
      </a>
    );
  }
}
