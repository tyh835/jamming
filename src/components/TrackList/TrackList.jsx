import React from 'react';
import Track from '../Track/Track';
import style from './TrackList.module.scss';

const TrackList = ({ tracks, onAdd, onRemove, isRemoval }) =>
  tracks && tracks.length !== 0 ? (
    <div className={style.container}>
      {tracks.map(track => {
        return (
          <Track
            track={track}
            key={track.id}
            onAdd={onAdd}
            onRemove={onRemove}
            isRemoval={isRemoval}
          />
        );
      })}
    </div>
  ) : (
    <div className="TrackList">
      <h4 className={style.emptyTracks}>No Tracks</h4>
    </div>
  );

export default TrackList;
