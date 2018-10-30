import React from 'react';
import './Track.css';

export default class Track extends React.Component {
  // This methods uses the prop passed down from <App /> to update Apps's playistTracks state.
  handleAdd = e => {
    e.preventDefault();
    this.props.onAdd(this.props.track);
  };
  // This methods uses the prop passed down from <App /> to update Apps's playistTracks state.
  handleRemove = e => {
    e.preventDefault();
    this.props.onRemove(this.props.track);
  };
  // This method determines whether a + or - is shown as the action on the track, which calls addTrack() and removeTrack() respectively.
  renderAction = isRemoval => {
    return isRemoval ? (
      <a href="/" className="Track-action" onClick={this.handleRemove}>
        -
      </a>
    ) : (
      <a href="/" className="Track-action" onClick={this.handleAdd}>
        +
      </a>
    );
  };
  // This method renders a preview of the track if there is a preview snippet provided by Spotify.
  renderPreview = () => {
    if (this.props.track.preview) {
      return (
        <audio controls>
          <source src={this.props.track.preview} type="audio/mp3" />
          Your browser does not support audio preview.
        </audio>
      );
    } else {
      return;
    }
  };
  // Renders <Track /> with information obtained from Spotify API passed down from props.
  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          <h3>{this.props.track.name}</h3>
          <p>
            {' '}
            {this.props.track.artist} | {this.props.track.album}{' '}
          </p>
          {this.renderPreview()}
        </div>
        {this.renderAction(this.props.action)}
      </div>
    );
  }
}
