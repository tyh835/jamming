import React, { Component } from 'react';
import SpotifyIcon from './SpotifyIcon';
import style from './SearchBar.module.scss';

class SearchBar extends Component {
  state = { term: '' };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentDidMount() {
    if (localStorage.getItem('search_term')) {
      this.setState({ term: localStorage.getItem('search_term') });
    }
  }

  componentDidUpdate() {
    localStorage.setItem('search_term', this.state.term);
  }

  render() {
    const { isAuthorized, getTopTracks, searchSpotify } = this.props;
    const { term } = this.state;

    const GetTopButton = () => (
      <button
        className={style.searchButton}
        onClick={getTopTracks}
        style={{ width: '10rem', marginLeft: '2.5rem' }}
      >
        My Top Songs
      </button>
    );

    return (
      <div className={style.container}>
        <input
          className={style.searchInput}
          name="term"
          placeholder="Enter A Song, Album, or Artist"
          onChange={this.handleChange}
          onKeyPress={e => e.key === 'Enter' && searchSpotify(term)}
          value={term}
        />
        <div className={style.buttonContainer}>
          <button
            className={style.searchButton}
            onClick={() => searchSpotify(term)}
            style={isAuthorized ? {} : { minWidth: '13rem' }}
          >
            {isAuthorized || <SpotifyIcon />}
            {isAuthorized ? 'Search' : 'Connect to Spotify'}
          </button>
          {isAuthorized && <GetTopButton />}
        </div>
      </div>
    );
  }
}

export default SearchBar;
