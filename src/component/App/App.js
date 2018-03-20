import React from 'react';
import './App.css';
import {SearchBar} from '../SearchBar/SearchBar.js';
import {SearchResults} from '../SearchResults/SearchResults.js';
import {Playlist} from '../Playlist/Playlist.js';
import Spotify from '../../util/Spotify.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],

      playlistName: "New Playlist",

      playlistTracks: []
    };
    // Binds the methods of <App /> to this component.
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
// This method calls the asynchronous search function from the Spotify module. It is passed down to <SearchBar /> as a prop.
  async search(term) {
    let searchResults = await Spotify.search(term);
    this.setState({searchResults: searchResults});
  }
// This methods adds a track to <App />'s playistTracks state. It is passed down to <Track /> as a prop.
  addTrack(track) {
    if (this.state.playlistTracks.every(addedTrack => {return addedTrack.id !== track.id})) {
      let newPlaylistTracks = this.state.playlistTracks;
      newPlaylistTracks.push(track);
      this.setState({playlistTracks: newPlaylistTracks});
    }
  }
// This methods removes a track from <App />'s playistTracks state. It is passed down to <Track /> as a prop.
  removeTrack(track) {
    if (this.state.playlistTracks.some(addedTrack => {return addedTrack.id === track.id})) {
      let newPlaylistTracks = this.state.playlistTracks.filter(addedTrack => addedTrack.id !== track.id);
      this.setState({playlistTracks: newPlaylistTracks});
    }
  }
// This methods updates <App />'s playistName state. It is passed down to <Playlist /> as a prop.
  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }
// This method calls the savePlaylist function from the Spotify module. It is passed down to <Playlist /> as a prop.
  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({playlistName: "New Playlist", searchResults: []});
  }
// Renders <App />, which contains all of the components.
  render() { 
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack}
            onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
