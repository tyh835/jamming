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

      searchResultsCache: [],

      playlistName: "New Playlist",

      playlistTracks: [],

      authorized: false,

      isNewPlaylist: true
    };
    // Binds the methods of <App /> to this component.
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.updatePlaylistBool = this.updatePlaylistBool.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.getTopTracks = this.getTopTracks.bind(this);
    this.isAuthorized = this.isAuthorized.bind(this);
  }
// This method calls the asynchronous search function from the Spotify module. It is passed down to <SearchBar /> as a prop.
  async search(term) {
    this.isAuthorized();
    if (this.state.authorized) {
      let searchResults = await Spotify.search(term);
      this.setState({searchResults: searchResults, searchResultsCache: searchResults});
    }
  }
// This method calls the asynchronous getTopTracks function from the Spotify module. It is passed down to <SearchBar /> as a prop.
  async getTopTracks() {
    this.isAuthorized();
    if (this.state.authorized) {
      let searchResults = await Spotify.getTopTracks();
      this.setState({searchResults: searchResults, searchResultsCache: searchResults});
    }
  }
// This methods adds a track to <App />'s playistTracks state. It is passed down to <Track /> as a prop.
  addTrack(track) {
    if (this.state.playlistTracks.every(addedTrack => {return addedTrack.id !== track.id})) {
      let newPlaylistTracks = this.state.playlistTracks;
      let newSearchResults = this.state.searchResults.filter(foundTrack => foundTrack.id !== track.id);;
      newPlaylistTracks.push(track);
      this.setState({playlistTracks: newPlaylistTracks, searchResults: newSearchResults});
    }
  }
// This methods removes a track from <App />'s playistTracks state. It is passed down to <Track /> as a prop.
  removeTrack(track) {
    if (this.state.playlistTracks.some(addedTrack => {return addedTrack.id === track.id})) {
      let newPlaylistTracks = this.state.playlistTracks.filter(addedTrack => addedTrack.id !== track.id);
      let newSearchResults = this.state.searchResults;
      if (this.state.searchResultsCache.some(foundTrack => foundTrack.id === track.id)) {
        newSearchResults.unshift(track);
      }
      this.setState({playlistTracks: newPlaylistTracks, searchResults: newSearchResults});
    }
  }
// This methods updates <App />'s playistName state. It is passed down to <Playlist /> as a prop.
  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }
// This methods updates <App />'s isPlayistNew state. It is passed down to <Playlist /> as a prop.
  updatePlaylistBool(bool) {
    this.setState({isNewPlaylist: bool});
  }
// This method calls the savePlaylist function from the Spotify module. It is passed down to <Playlist /> as a prop.
  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({playlistName: "New Playlist", searchResults: [], searchResultsCache: []});
  }
// This method checks if user has authorized with Spotify, or else redirects user when button is pressed
  isAuthorized() {
    if (Spotify.accessToken) {
      this.setState({authorized: true});
    } else if (!Spotify.accessToken){
      Spotify.getAccessToken();
      if (!Spotify.accessToken) {
        Spotify.redirectSpotify();
      }
    }
  }
// This lifecycle method checks if user has authorized with this Spotify account each time the app renders
  componentWillMount() {
    if (this.state.authorized === true && !Spotify.accessToken) {
      this.setState({authorized: false});
    }
    if (!Spotify.accessToken) {
      Spotify.getAccessToken();
    }
    if (Spotify.accessToken) {
      this.isAuthorized();
    }
  }
// Renders <App />, which contains all of the components.
  render() { 
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} onGetTop={this.getTopTracks} isAuthorized={this.state.authorized} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack}
            onNameChange={this.updatePlaylistName} onBoolChange={this.updatePlaylistBool} onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
