import React from 'react';
import './TrackList.css';
import {Track} from '../Track/Track.js';

export class TrackList extends React.Component {
  render() {
    console.log(this.props.tracks);
    if (this.props.tracks && this.props.tracks.length !== 0) {
      let tracks = this.props.tracks.map(track => track);
      return (
        <div className="TrackList">
          {tracks.map(track => {
            return <Track track={track} key={track.id} onAdd={this.props.onAdd} onRemove={this.props.onRemove} action={this.props.isRemoval} />
          })}
        </div>
      );
    } else {
      return (
        <div className="TrackList">
          <h4>No Tracks</h4>
          </div>
      );
    }
  }
}
