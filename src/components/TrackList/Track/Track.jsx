import React from 'react';
import style from './Track.module.scss';

const Track = ({ track, addTrack, removeTrack, isRemoval }) => {
  const Add = () => (
    <span className={style.trackAction} onClick={() => addTrack(track)}>
      +
    </span>
  );
  const Remove = () => (
    <span className={style.trackAction} onClick={() => removeTrack(track)}>
      -
    </span>
  );

  return (
    <div className={style.container}>
      <div className={style.trackInfo}>
        <h3 className={style.title}>{track.name}</h3>
        <p className={style.info}>
          {' '}
          {track.artist} | {track.album}{' '}
        </p>
        {track.preview && (
          <audio controls>
            <source src={track.preview} type="audio/mp3" />
            Your browser does not support audio preview.
          </audio>
        )}
      </div>
      {isRemoval ? <Remove /> : <Add />}
    </div>
  );
};

export default Track;
