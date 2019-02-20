import React, { Component } from 'react';
import style from './SearchBar.module.scss';

export default class SearchBar extends Component {
  state = { term: '' };

  handleSearch = e => {
    e.preventDefault();
    this.props.onSearch(this.state.term);
  };

  handleGetTop = e => {
    e.preventDefault();
    this.props.onGetTop(0, []);
  };

  handleTermChange = e => {
    this.setState({ term: e.target.value });
  };

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      this.handleSearch(e);
    }
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
    const SpotifyIcon = () => (
      <>
        <i className="fa fa-spotify" />
        &nbsp;
      </>
    );
    const TopButton = () => (
      <a
        className={style.button}
        href="/"
        onClick={this.handleGetTop}
        style={{ width: '10rem', marginLeft: '2.5rem' }}
      >
        My Top Songs
      </a>
    );

    const { isAuthorized } = this.props;
    return (
      <div className={style.container}>
        <input
          className={style.searchInput}
          placeholder="Enter A Song, Album, or Artist"
          onChange={this.handleTermChange}
          onKeyPress={this.handleKeyPress}
          value={this.state.term}
        />
        <div className={style.searchButtons}>
          <a
            className={style.button}
            href="/"
            onClick={this.handleSearch}
            style={this.props.isAuthorized ? {} : { width: '12rem' }}
          >
            {isAuthorized || <SpotifyIcon />}
            {isAuthorized ? 'Search' : 'Connect to Spotify'}
          </a>
          {isAuthorized && <TopButton />}
        </div>
      </div>
    );
  }
}
