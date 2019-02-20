import React from 'react';
import style from './Track.module.scss';

export default class Track extends React.Component {
  handleAdd = e => {
    e.preventDefault();
    this.props.onAdd(this.props.track);
  };
  handleRemove = e => {
    e.preventDefault();
    this.props.onRemove(this.props.track);
  };

  render() {
    const Add = () => (
      <a href="#" className={style.trackAction} onClick={this.handleAdd}>
        +
      </a>
    );
    const Remove = () => (
      <a href="#" className={style.trackAction} onClick={this.handleRemove}>
        -
      </a>
    );

    return (
      <div className={style.container}>
        <div className={style.trackInfo}>
          <h3 className={style.title}>{this.props.track.name}</h3>
          <p className={style.info}>
            {' '}
            {this.props.track.artist} | {this.props.track.album}{' '}
          </p>
        </div>
        {this.props.isRemoval ? <Remove /> : <Add />}
      </div>
    );
  }
}
