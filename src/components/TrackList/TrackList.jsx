import React from 'react';
import './TrackList.css';
import Track from '../Track/Track';

const TrackList = (props) => {
  if (props.tracks && props.tracks.length !== 0) {
    // Render each track as <Track /> components.
    return (
      <div className="TrackList">
        {props.tracks.map(track => {
          return <Track track={track} key={track.id} onAdd={props.onAdd} onRemove={props.onRemove} action={props.isRemoval} />
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

export default TrackList;