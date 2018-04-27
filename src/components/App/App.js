import React from 'react';
import './App.css';
import {SearchBar} from '../SearchBar/SearchBar.js';
import {SearchResults} from '../SearchResults/SearchResults.js';
import {Playlist} from '../Playlist/Playlist.js';
import {PlaylistList} from '../PlaylistList/PlaylistList.js';
import Spotify from '../../util/Spotify.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      searchResultsCache: [],
      playlistName: 'New Playlist',
      playlistTracks: [],
      playlistID: null,
      playlistList: null,
      authorized: false,
      isNewPlaylist: true
    };
  }
  // This method calls the asynchronous search function from the Spotify module. It is passed down to <SearchBar /> as a prop.
  searchSpotify = async (term) => {
    this.isAuthorized();
    if (this.state.authorized) {
      let searchResults = await Spotify.search(term);
      this.setState({searchResults: searchResults, searchResultsCache: searchResults});
    }
  }
  // This method calls the asynchronous getTopTracks function from the Spotify module. It is passed down to <SearchBar /> as a prop.
  getTopTracks = async (offset, cache) => {
    this.isAuthorized();
    if (this.state.authorized) {
      const response = await Spotify.getTopTracks(offset);
      let searchResults = cache.concat(response);
      if (response.length === 50) {
        this.getTopTracks((offset + 49), searchResults);
      } else if (searchResults) {
        // Filters searchResults to only songs with unique ids, the reverse() method is so that the first instance of a song is preserved.
        let uniqueSearchResults = searchResults.filter((track, index) => {
          return searchResults.slice(0, index).every(otherTrack => track.id !== otherTrack.id)
        });
        console.log(uniqueSearchResults);
        this.setState({searchResults: uniqueSearchResults, searchResultsCache: uniqueSearchResults});
      }
    }
  }

  // This method calls the asynchronous getPlaylists function from the Spotify module and displays playlist in <Playlist />.
  getPlaylists = async () => {
    let playlists = await Spotify.getPlaylists();
    if (playlists && playlists.length !== 0) {
      this.setState({playlistList: playlists});
    } else {
      this.setState({playlistList: []});
    }
  }

  // This method calls the asynchronous getPlaylistTracks function from the Spotify module and displays playlist in <Playlist />.
  getPlaylistTracks = async (tracksURL, name, id) => {
    let tracks = await Spotify.getPlaylistTracks(tracksURL);
    this.setState({playlistTracks: tracks, playlistName: name, playlistID: id, isNewPlaylist: false});
  }

  // This methods adds a track to <App />'s playlistTracks state. It is passed down to <Track /> as a prop.
  addTrack = (track) => {
    if (this.state.playlistTracks.every(addedTrack => {
      return addedTrack.id !== track.id
    })) {
      let newPlaylistTracks = this.state.playlistTracks;
      let newSearchResults = this.state.searchResults.filter(foundTrack => foundTrack.id !== track.id);;
      newPlaylistTracks.push(track);
      this.setState({playlistTracks: newPlaylistTracks, searchResults: newSearchResults});
    }
  }

  // This methods removes a track from <App />'s playlistTracks state. It is passed down to <Track /> as a prop.
  removeTrack = (track) => {
    if (this.state.playlistTracks.some(addedTrack => {
      return addedTrack.id === track.id
    })) {
      let newPlaylistTracks = this.state.playlistTracks.filter(addedTrack => addedTrack.id !== track.id);
      let newSearchResults = this.state.searchResults;
      if (this.state.searchResultsCache.some(foundTrack => foundTrack.id === track.id)) {
        newSearchResults.unshift(track);
      }
      this.setState({playlistTracks: newPlaylistTracks, searchResults: newSearchResults});
    }
  }

  // This methods updates <App />'s playlistName state. It is passed down to <Playlist /> as a prop.
  updatePlaylistName = (name) => {
    this.setState({playlistName: name});
  }

  // This methods resets states relevant to the playlist. It is passed down to <PlaylistList /> as a prop.
  newPlaylist = () => {
    this.setState({playlistName: 'New Playlist', isNewPlaylist: true, playlistTracks: [], playlistID: null});
  }

  // This method calls the savePlaylist or updatePlaylist function from the Spotify module. It is passed down to <Playlist /> as a prop.
  savePlaylist = async () => {
    await this.isAuthorized();
    let trackURIs = this.state.playlistTracks.map(track => track.uri);
    if (this.state.isNewPlaylist) {
      const id = await Spotify.savePlaylist(this.state.playlistName, trackURIs);
      if (id) {
        this.setState({playlistID: id, isNewPlaylist: false, searchResults: [], searchResultsCache: []});
        this.getPlaylists();
      } else {
        setTimeout(alert('Unable to save playlist!'), 1000);
        this.newPlaylist();
      }

    } else if (!this.state.isNewPlaylist) {
      await Spotify.updatePlaylist(this.state.playlistName, this.state.playlistID, trackURIs);
      this.setState({searchResults: [], searchResultsCache: []});
      this.getPlaylists();
    }
  }

  // This method calls the deletePlaylist function from the Spotify module. It is passed down to <Playlist /> as a prop.
  deletePlaylist = async () => {
    const deleted = await Spotify.deletePlaylist(this.state.playlistID);
    if (deleted) {
      this.newPlaylist();
      this.getPlaylists();
    }
  }

  // This method checks if user has authorized with Spotify, or else redirects user when button is pressed
  isAuthorized = () => {
    if (Spotify.accessToken && this.state.playlistList === null) {
      this.setState({authorized: true});
      this.getPlaylists();
    } else if (Spotify.accessToken) {
      this.setState({authorized: true});
    } else if (!Spotify.accessToken) {
      Spotify.getAccessToken();
      if (!Spotify.accessToken) {
        Spotify.redirectSpotify();
      }
    }
  }

  // This lifecycle method checks if user has authorized with this Spotify account each time the app renders
  componentDidMount() {
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
        <SearchBar onSearch={this.searchSpotify} onGetTop={this.getTopTracks} isAuthorized={this.state.authorized}/>
        <PlaylistList isAuthorized={this.state.authorized} playlists={this.state.playlistList} onNew={this.newPlaylist} activeID={this.state.playlistID} getPlaylistTracks={this.getPlaylistTracks}/>
        <div className="App-playlist">
          <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
          <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} onDelete={this.deletePlaylist} isNew={this.state.isNewPlaylist}/>
        </div>
      </div>
    </div>);
  }
}

export default App;
