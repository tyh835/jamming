import React from 'react';
import './Track.css';

export class Track extends React.Component {
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.renderAction = this.renderAction.bind(this);
    this.renderPreview = this.renderPreview.bind(this);
  }
// This methods uses the prop passed down from <App /> to update Apps's playistTracks state.
  addTrack() {
    this.props.onAdd(this.props.track);
  }
// This methods uses the prop passed down from <App /> to update Apps's playistTracks state.
  removeTrack() {
    this.props.onRemove(this.props.track);
  }
// This method determines whether a + or - is shown as the action on the track, which calls addTrack() and removeTrack() respectively.
  renderAction(isRemoval) {
    return isRemoval ? <a className="Track-action" onClick={this.removeTrack}>-</a> : <a className="Track-action" onClick={this.addTrack}>+</a>;
  }
// This method renders a preview of the track if there is a preview snippet provided by Spotify.
  renderPreview() {
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
  }
// Renders <Track /> with information obtained from Spotify API passed down from props.
  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          <h3>{this.props.track.name}</h3>
          <p> {this.props.track.artist} |  {this.props.track.album} </p>
          {this.renderPreview()}
        </div>
        {this.renderAction(this.props.action)}
      </div>
    );
  }
}
