import React from 'react';
import TrackList from '../TrackList/TrackList';
import './SearchResults.scss';

const SearchResults = props => {
  // Renders search results obtained from Spotify API in a <Tracklist /> component.
  return (
    <div className="SearchResults">
      <h2>Search Results</h2>
      <TrackList
        tracks={props.searchResults}
        onAdd={props.onAdd}
        isRemoval={false}
      />
    </div>
  );
};

export default SearchResults;
