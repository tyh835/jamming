import React from 'react';
import TrackList from '../TrackList/TrackList';
import style from './SearchResults.module.scss';

const SearchResults = ({ searchResults, addTrack }) => {
  return (
    <div className={style.container}>
      <h2>Search Results</h2>
      <TrackList tracks={searchResults} addTrack={addTrack} isRemoval={false} />
    </div>
  );
};

export default SearchResults;
