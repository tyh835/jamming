import React from 'react';
import Track from './Track/Track';
import style from './TrackList.module.scss';

const TrackList = ({ tracks, addTrack, removeTrack, isRemoval }) =>
  tracks && tracks.length !== 0 ? (
    <div className={style.container}>
      {tracks.map(track => {
        return (
          <Track
            track={track}
            key={track.id}
            addTrack={addTrack}
            removeTrack={removeTrack}
            isRemoval={isRemoval}
          />
        );
      })}
    </div>
  ) : (
    <div className={style.container}>
      <h4 className={style.emptyTracks}>No Tracks</h4>
    </div>
  );

export default TrackList;
