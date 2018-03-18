import React from 'react';
import './App.css';
import {SearchBar} from '../SearchBar/SearchBar.js';
import {SearchResults} from '../SearchResults/SearchResults.js';
import {Playlist} from '../Playlist/Playlist.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [{id:0, name: "Portland", artist: "Tony the Pussy Destoryer", album: "Rockabye"}],

      playlistName: "Sexy Times",

      playlistTracks: [{id:1, name: "Bang Boogie", artist: "Tony the Pussy Destoryer", album: "Rockabye"}]
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }

  addTrack(track) {
    if (this.state.playlistTracks.every(addedTrack => {return addedTrack.id !== track.id})) {
      this.setState({playlistTracks: this.state.playlistTracks.push(track)});
    }
  }

  removeTrack(track) {
    if (this.state.playlistTracks.some(addedTrack => {return addedTrack.id === track.id})) {
      this.setState({playlistTracks: this.state.playlistTracks.filter(addedTrack => {return addedTrack.id !== track.id})});
    }
  }

  render() { 
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
