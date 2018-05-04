import React from 'react';
import './TrackList.css';
import {Track} from '../Track/Track';

export class TrackList extends React.Component {
  render() {
    if (this.props.tracks && this.props.tracks.length !== 0) {
// Map all tracks from the prop onto new variable.
      let tracks = this.props.tracks.map(track => track);
// Render each track as <Track /> components.
      return (
        <div className="TrackList">
          {tracks.map(track => {
            return <Track track={track} key={track.id} onAdd={this.props.onAdd} onRemove={this.props.onRemove} action={this.props.isRemoval} />
          })}
        </div>
      );
    } else {
// Renders h4 to show when there is no tracks in the list.
      return (
        <div className="TrackList">
          <h4>No Tracks</h4>
        </div>
      );
    }
  }
}
