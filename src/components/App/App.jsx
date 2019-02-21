import React, { Component } from 'react';
import Header from '../Header/Header';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import UserPlaylistPanel from '../UserPlaylistPanel/UserPlaylistPanel';
import Spotify from '../../api/Spotify';
import style from './App.module.scss';

class App extends Component {
  state = {
    searchResults: [],
    searchResultsCache: [],
    playlistName: 'New Playlist',
    playlistTracks: [],
    playlistID: null,
    userPlaylists: null,
    isAuthorized: false,
    isNewPlaylist: true,
  };

  searchSpotify = async term => {
    await this.authenticate();
    if (this.state.isAuthorized) {
      let searchResults = await Spotify.search(term);
      this.setState({
        searchResults: searchResults,
        searchResultsCache: searchResults,
      });
    }
  };

  getTopTracks = async (offset, cache) => {
    await this.authenticate();
    if (this.state.isAuthorized) {
      const response = await Spotify.getTopTracks(offset);
      let searchResults = cache.concat(response);
      if (response.length === 50) {
        this.getTopTracks(offset + 49, searchResults);
      } else if (searchResults) {
        const uniqueSearchResults = searchResults.filter((track, index) => {
          return searchResults
            .slice(0, index)
            .every(otherTrack => track.id !== otherTrack.id);
        });
        this.setState({
          searchResults: uniqueSearchResults,
          searchResultsCache: uniqueSearchResults,
        });
      }
    }
  };

  getUserPlaylists = async () => {
    const userPlaylists = await Spotify.getPlaylists();
    if (userPlaylists === undefined) return false;
    if (userPlaylists && userPlaylists.length !== 0) {
      this.setState({
        userPlaylists: userPlaylists,
      });
    } else {
      this.setState({
        userPlaylists: [],
      });
    }
    return true;
  };

  getPlaylistTracks = async (tracksURL, name, id) => {
    const tracks = await Spotify.getPlaylistTracks(tracksURL);
    this.setState({
      playlistTracks: tracks,
      playlistName: name,
      playlistID: id,
      isNewPlaylist: false,
    });
  };

  addTrack = track => {
    if (
      this.state.playlistTracks.every(addedTrack => {
        return addedTrack.id !== track.id;
      })
    ) {
      const newPlaylistTracks = this.state.playlistTracks;
      const newSearchResults = this.state.searchResults.filter(
        foundTrack => foundTrack.id !== track.id
      );
      newPlaylistTracks.push(track);
      this.setState({
        playlistTracks: newPlaylistTracks,
        searchResults: newSearchResults,
      });
    }
  };

  removeTrack = track => {
    if (
      this.state.playlistTracks.some(addedTrack => {
        return addedTrack.id === track.id;
      })
    ) {
      const newPlaylistTracks = this.state.playlistTracks.filter(
        addedTrack => addedTrack.id !== track.id
      );
      const newSearchResults = this.state.searchResults;
      if (
        this.state.searchResultsCache.some(
          foundTrack => foundTrack.id === track.id
        )
      ) {
        newSearchResults.unshift(track);
      }
      this.setState({
        playlistTracks: newPlaylistTracks,
        searchResults: newSearchResults,
      });
    }
  };

  updatePlaylistName = name => {
    this.setState({
      playlistName: name,
    });
  };

  resetPlaylist = () => {
    this.setState({
      playlistName: 'New Playlist',
      isNewPlaylist: true,
      playlistTracks: [],
      playlistID: null,
    });
  };

  savePlaylist = async () => {
    await this.authenticate();
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    if (this.state.isNewPlaylist) {
      const id = await Spotify.savePlaylist(this.state.playlistName, trackURIs);
      if (id) {
        this.setState({
          playlistID: id,
          isNewPlaylist: false,
          searchResults: [],
          searchResultsCache: [],
        });
        this.getUserPlaylists();
      } else {
        setTimeout(() => alert('Unable to save playlist!'), 1000);
        this.resetPlaylist();
      }
    } else if (!this.state.isNewPlaylist) {
      await Spotify.updatePlaylist(
        this.state.playlistName,
        this.state.playlistID,
        trackURIs
      );
      this.setState({
        searchResults: [],
        searchResultsCache: [],
      });
      this.getUserPlaylists();
    }
  };

  deletePlaylist = async () => {
    const deleted = await Spotify.deletePlaylist(this.state.playlistID);
    if (deleted) {
      this.resetPlaylist();
      this.getUserPlaylists();
    }
  };

  authenticate = async () => {
    if (Spotify.accessToken && this.state.userPlaylists === null) {
      const success = await this.getUserPlaylists();
      if (success) {
        this.setState({
          isAuthorized: true,
        });
      } else {
        this.setState({
          isAuthorized: false,
        });
      }
    } else if (Spotify.accessToken) {
      this.setState({
        isAuthorized: true,
      });
    } else if (!Spotify.accessToken) {
      Spotify.getAccessToken();
      if (!Spotify.accessToken) {
        Spotify.redirectSpotify();
      }
    }
  };

  componentDidMount() {
    if (!Spotify.accessToken) {
      Spotify.getAccessToken();
    }
    if (Spotify.accessToken) {
      this.authenticate();
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div className={style.container}>
          <SearchBar
            searchSpotify={this.searchSpotify}
            getTopTracks={this.getTopTracks}
            isAuthorized={this.state.isAuthorized}
          />
          <UserPlaylistPanel
            activeID={this.state.playlistID}
            isAuthorized={this.state.isAuthorized}
            userPlaylists={this.state.userPlaylists}
            getPlaylistTracks={this.getPlaylistTracks}
            resetPlaylist={this.resetPlaylist}
          />
          <div className={style.trackLists}>
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}
            />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
              onDelete={this.deletePlaylist}
              isNew={this.state.isNewPlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
