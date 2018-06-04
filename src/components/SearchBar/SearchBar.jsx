import React from 'react';
import './SearchBar.css';

export default class SearchBar extends React.Component {
  state = {term: ''}
  // This method calls the search function in <App /> using the passed down prop.
  handleSearch = () => {
    this.props.onSearch(this.state.term);
  }
  // This method calls the getTopTracks function in <App /> using the passed down prop.
  handleGetTop = () => {
    this.props.onGetTop(0, []);
  }
  // This method changes the search term state whenever the input changes.
  handleTermChange = e => {
    this.setState({term: e.target.value});
  }
  // This method calls the search function in when the enter key is pressed.
  handleKeyPress = e => {
    if (e.key === 'Enter') {
      this.handleSearch();
    }
  }
  // Renders the Spotify icon for connect button before user is authorized
  renderSpotifyIcon = () => {
    return <i className="fa fa-spotify"></i>;
  }
  // Renders the personal tops button after user is authorized
  renderTopButton = () => {
    return <a onClick={this.handleGetTop} style={{width: '10rem', marginLeft: '2.5rem'}}>My Top Songs</a>;
  }
  // Each time the search bar loads, it checks for previously stored value and updates this.state.term
  componentDidMount() {
    if (localStorage.getItem('term')) {
      this.setState({term: localStorage.getItem('term')});
    }
  }
  // Saves the search bar term in the window.name DOM variable.
  componentDidUpdate() {
    localStorage.setItem('term', this.state.term);
  }
  // Renders the search bar, a controlled component.
  render() {
    return (
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} onKeyPress={this.handleKeyPress} value={this.state.term} />
        <div className="Buttons">
          <a onClick={this.handleSearch} style={this.props.isAuthorized ? {} : {width: '12rem'}}>
          {this.props.isAuthorized ? '': this.renderSpotifyIcon()}{this.props.isAuthorized ? 'Search' : ' Connect to Spotify'}
          </a>
          {this.props.isAuthorized? this.renderTopButton() : ''}
        </div>
      </div>
    );
  }
}
