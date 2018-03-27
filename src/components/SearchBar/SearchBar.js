import React from 'react';
import './SearchBar.css';

export class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {term: "", authorized: false};
    this.spotifyIcon = (<i className="fa fa-spotify"></i>);
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.buttonStyle = {backgroundColor: 'hsl(141, 73%, 42%)', width: '11rem', filter: 'saturate(2.22) brightness(0.56)', color: '#333333'}
  }
// This method calls the search function in <App /> using the passed down prop.
  search() {
    this.props.onSearch(this.state.term);
  }
// This method changes the search term state whenever the input changes.
  handleTermChange(e) {
    this.setState({term: e.target.value});
  }
// This method calls the search function in when the enter key is pressed.
  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.search();
    }
  }

// Renders the search bar, a controlled component.
  render() {
    return (
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} onKeyPress={this.handleKeyPress} />
        <a onClick={this.search} style={this.props.isAuthorized ? {} : {width: '12rem'}}>
        {this.props.isAuthorized ? '': this.spotifyIcon }{this.props.isAuthorized ? 'Search' : ' Connect to Spotify'}
        </a>
      </div>
    );
  }
}
