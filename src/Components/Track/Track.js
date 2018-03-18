import React from 'react';
import './Track.css';

export class Track extends React.Component {

  renderAction(isRemoval) {
    return isRemoval ? <a className="Track-action">-</a> : <a className="Track-action">+</a>;
  }

  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          //<h3> track name will go here </h3>
          //<p> track artist will go here |  track album will go here </p>
        </div>
        {this.renderAction(true)}
      </div>
    );
  }
}
