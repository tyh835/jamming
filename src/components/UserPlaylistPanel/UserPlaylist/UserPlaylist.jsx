import React from 'react';
import style from './UserPlaylist.module.scss';

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
    const {
      playlist: { id, name },
      activeID,
    } = this.props;

    return (
      <a
        href="/"
        onClick={this.handleClick}
        className={`${style.button} ${id === activeID ? style.active : ''}`}
      >
        {name}
      </a>
    );
  }
}
