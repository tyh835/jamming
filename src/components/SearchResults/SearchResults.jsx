import React from 'react';
import TrackList from '../TrackList/TrackList';
import style from './SearchResults.module.scss';

const SearchResults = ({ searchResults, onAdd }) => {
  return (
    <div className={style.container}>
      <h2>Search Results</h2>
      <TrackList tracks={searchResults} onAdd={onAdd} isRemoval={false} />
    </div>
  );
};

export default SearchResults;
