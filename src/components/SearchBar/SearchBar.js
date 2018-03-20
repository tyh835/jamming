import React from 'react';
import './SearchBar.css';

export class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {term: ""};
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
  }
// This method calls the search function in <App /> using the passed down prop.
  search() {
    this.props.onSearch(this.state.term);
  }
// This method changes the search term state whenever the input changes.
  handleTermChange(e) {
    this.setState({term: e.target.value});
  }
// Renders the search bar, a controlled component.
  render() {
    return (
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} />
        <a onClick={this.search}>SEARCH</a>
      </div>
    );
  }
}
