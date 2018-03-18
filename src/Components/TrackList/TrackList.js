import React from 'react';
import './TrackList.css';
import {Track} from '../Track/Track.js';

export class TrackList extends React.Component {
  render() {
    return (

      <div className="TrackList">
        {(this.props.tracks && this.props.tracks.length !== 0) ?
          this.props.tracks.map(track => {
            return <Track track={track} key={track.id} onAdd={this.props.onAdd} onRemove={this.props.onRemove} />
        }): <h3>No Tracks</h3>}
      </div>
    );
  }
}
