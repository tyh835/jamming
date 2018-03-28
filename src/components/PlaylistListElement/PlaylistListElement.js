import React from 'react';
import './PlaylistListElement.css';

export class PlaylistListElement extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    console.log(this);
  }
// Renders the PlaylistListElement component
  render() {
      return <a onClick={this.handleClick}>{this.props.playlist.name}</a>;
  }
}
