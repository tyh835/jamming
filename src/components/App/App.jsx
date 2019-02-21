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

  deletePlaylist = async playlistID => {
    const deleted = await Spotify.deletePlaylist(playlistID);
    if (deleted) {
      this.resetPlaylist();
      this.getUserPlaylists();
    }
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

  getTopTracks = async () => {
    await this.authenticate();
    if (this.state.isAuthorized) {
      const response = await Spotify.getTopTracks(0);
      let searchResults = [...response];
      if (response.length === 50) {
        const nextResponse = await Spotify.getTopTracks(49);
        searchResults = [...searchResults, ...nextResponse];
      }

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

  resetPlaylist = () => {
    this.setState({
      playlistName: 'New Playlist',
      isNewPlaylist: true,
      playlistTracks: [],
      playlistID: null,
    });
  };

  savePlaylist = async playlistName => {
    await this.authenticate();
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    if (this.state.isNewPlaylist) {
      const id = await Spotify.savePlaylist(playlistName, trackURIs);
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

  updatePlaylistName = name => {
    this.setState({
      playlistName: name,
    });
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
    const {
      isAuthorized,
      isNewPlaylist,
      playlistID,
      playlistName,
      playlistTracks,
      searchResults,
      userPlaylists,
    } = this.state;

    return (
      <div>
        <Header />
        <div className={style.container}>
          <SearchBar
            isAuthorized={isAuthorized}
            searchSpotify={this.searchSpotify}
            getTopTracks={this.getTopTracks}
          />
          <UserPlaylistPanel
            activeID={playlistID}
            isAuthorized={isAuthorized}
            userPlaylists={userPlaylists}
            getPlaylistTracks={this.getPlaylistTracks}
            resetPlaylist={this.resetPlaylist}
          />
          <div className={style.trackLists}>
            <SearchResults
              searchResults={searchResults}
              addTrack={this.addTrack}
            />
            <Playlist
              isNewPlaylist={isNewPlaylist}
              playlistID={playlistID}
              playlistName={playlistName}
              playlistTracks={playlistTracks}
              deletePlaylist={this.deletePlaylist}
              removeTrack={this.removeTrack}
              savePlaylist={this.savePlaylist}
              updatePlaylistName={this.updatePlaylistName}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
