import React from 'react';
import './SearchResults.css';
import {TrackList} from '../TrackList/TrackList.js'

export class SearchResults extends React.Component {
// Renders search results obtained from Spotify API in a <Tracklist /> component.
  render() {
    return (
      <div className="SearchResults">
        <h2>Search Results</h2>
        <TrackList tracks={this.props.searchResults} onAdd={this.props.onAdd} isRemoval={false} />
      </div>
    );
  }
}
