const CLIENT_ID = process.env.REACT_APP_SPOTIFY_ID || 'SPOTIFY_CLIENT_ID';

const Spotify = {
  accessToken: localStorage.getItem('access_token'),
  expiresIn: null,
  redirectURI: window.location.href,
  // This function fetches an authorization token using Spotify's implicit authorization framework.
  getAccessToken() {
    if (this.accessToken) {
      localStorage.setItem('access_token', this.accessToken);
      return this.accessToken;
    } else if (window.location.href.match(/access_token=([^&]*)/)) {
      // If no authorization token already saved, this function tries to obtain token from URL.
      this.accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
      // Sets the window timeout once the access token has been obtained.
      this.expiresIn = Number(
        window.location.href.match(/expires_in=([^&]*)/)[1]
      );
      window.setTimeout(() => (this.accessToken = null), this.expiresIn * 1000);
      console.log(`Access expires in ${this.expiresIn} seconds`);
      window.history.pushState('Access Token', null, '/');
      localStorage.setItem('access_token', this.accessToken);
      return this.accessToken;
    } else if (window.location.href.match(/error=access_denied/)) {
      window.history.pushState('Access Token', null, '/');
      this.redirectURI = window.location.href;
    }
  },

  redirectSpotify() {
    window.location = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&scope=playlist-modify-public+playlist-modify-private+user-top-read&redirect_uri=${
      this.redirectURI
    }&show_dialog=true`;
  },
  // This function searches Spotify by using GET to "https://api.spotify.com/v1/search"
  async search(term) {
    const accessToken = this.accessToken || this.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    // GET method
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?type=track&limit=50&q=${term}`,
        { headers: headers }
      );
      if (response.ok) {
        const jsonResponse = await response.json();
        if (jsonResponse && jsonResponse !== {}) {
          return jsonResponse.tracks.items.map(track => {
            return {
              id: track.id,
              name: track.name,
              artist: track.artists[0].name,
              album: track.album.name,
              uri: track.uri,
              preview: track.preview_url,
            };
          });
        }
      } else {
        throw new Error('Search Request Failed!');
      }
    } catch (err) {
      this.authFailed();
      console.log(err);
    }
  },

  // This functions returns the User ID of the current user.
  async getUserID() {
    const accessToken = this.accessToken || this.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    // GET method
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: headers,
      });
      if (response.ok) {
        const jsonResponse = await response.json();
        if (jsonResponse && jsonResponse.id) {
          return jsonResponse.id;
        }
      } else {
        throw new Error('Request to GET user_id Failed!');
      }
    } catch (err) {
      this.authFailed();
      console.log(err);
    }
  },

  // This function gets user's top tracks from Spotify by using GET to "https://api.spotify.com/v1/me/top/tracks"
  async getTopTracks(offset) {
    const accessToken = this.accessToken || this.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    // GET method
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=long_term&offset=${offset}`,
        { headers: headers }
      );
      if (response.ok) {
        const jsonResponse = await response.json();
        if (jsonResponse && jsonResponse !== {}) {
          return jsonResponse.items.map(track => {
            return {
              id: track.id,
              name: track.name,
              artist: track.artists[0].name,
              album: track.album.name,
              uri: track.uri,
              preview: track.preview_url,
            };
          });
        }
      } else {
        return [];
      }
    } catch (err) {
      this.authFailed();
      console.log(err);
    }
  },

  // This function gets user_id from Spotify by using this.getUserID,
  // then gets user's playlists owned by the user from Spotify by using GET to "https://api.spotify.com/v1/me/playlists"
  async getPlaylists() {
    const accessToken = this.accessToken || this.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    const userID = await this.getUserID();
    //GET method
    try {
      const response = await fetch(
        'https://api.spotify.com/v1/me/playlists?limit=50',
        { headers: headers }
      );
      if (response.ok) {
        const jsonResponse = await response.json();
        if (jsonResponse && jsonResponse !== {}) {
          return jsonResponse.items
            .filter(playlist => playlist.owner.id === userID)
            .map(playlist => {
              return {
                id: playlist.id,
                name: playlist.name,
                tracksURL: playlist.tracks.href,
                image: playlist.images[1],
                uri: playlist.uri,
              };
            });
        }
      } else {
        throw new Error('Request to GET Playlists Failed!');
      }
    } catch (err) {
      this.authFailed();
      console.log(err);
    }
  },

  // This function gets playlist's tracks from Spotify by using GET to trackURL
  async getPlaylistTracks(trackURL) {
    const accessToken = this.accessToken || this.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    // GET method
    try {
      const response = await fetch(trackURL, { headers: headers });
      if (response.ok) {
        const jsonResponse = await response.json();
        if (jsonResponse && jsonResponse !== {}) {
          return jsonResponse.items.map(track => {
            return {
              id: track.track.id,
              name: track.track.name,
              artist: track.track.artists[0].name,
              album: track.track.album.name,
              uri: track.track.uri,
              preview: track.track.preview_url,
            };
          });
        }
      } else {
        throw new Error('Request to GET Top Tracks Failed!');
      }
    } catch (err) {
      this.authFailed();
      console.log(err);
    }
  },

  // This function gets user_id from Spotify by using this.getUserID,
  // then POST to "https://api.spotify.com/v1/users/${userID}/playlists" to add new playlist and obtain playlistID,
  // then POST to "https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks" to add tracks to newly created playlist.
  async savePlaylist(playlistName, trackURIs) {
    if (!playlistName) {
      return;
    }
    const accessToken = this.accessToken || this.getAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    const userID = await this.getUserID();
    // POST 1 method
    try {
      const responsePOST1 = await fetch(
        `https://api.spotify.com/v1/users/${userID}/playlists`,
        {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({ name: playlistName }),
        }
      );
      if (responsePOST1.ok) {
        const jsonResponsePOST1 = await responsePOST1.json();
        if (jsonResponsePOST1) {
          // POST 2 method
          try {
            const playlistID = jsonResponsePOST1.id;
            const responsePOST2 = await fetch(
              `https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks?uris=${trackURIs.join(
                ','
              )}`,
              {
                method: 'POST',
                headers: headers,
              }
            );
            if (responsePOST2.ok) {
              setTimeout(alert('Successfully saved to Spotify!'), 1000);
              return playlistID;
            } else {
              setTimeout(alert('Created empty playlist!'), 1000);
              return playlistID;
            }
          } catch (err) {
            console.log(err);
          }
        }
      } else {
        throw new Error('Request to POST Playlist Failed!');
      }
    } catch (err) {
      this.authFailed();
      console.log(err);
    }
  },

  // This function gets user_id from Spotify by using this.getUserID,
  // then PUT to "https://api.spotify.com/v1/users/${userID}/playlists/{playlist_id}" to update playlist name.
  // then PUT to "https://api.spotify.com/v1/users/${userID}/playlists/{playlist_id}/tracks" to update playlist.
  async updatePlaylist(playlistName, playlistID, trackURIs) {
    if (!playlistName || !playlistID) {
      return;
    }
    const accessToken = this.accessToken || this.getAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    const userID = await this.getUserID();
    // PUT 1 method
    try {
      const responsePUT1 = await fetch(
        `https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}`,
        {
          method: 'PUT',
          headers: headers,
          body: JSON.stringify({ name: playlistName }),
        }
      );
      if (responsePUT1.ok) {
        //PUT 2 method
        try {
          const responsePUT2 = await fetch(
            `https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks?uris=${trackURIs.join(
              ','
            )}`,
            {
              method: 'PUT',
              headers: headers,
            }
          );
          if (responsePUT2.ok) {
            setTimeout(
              alert('Successfully updated playlist in Spotify!'),
              1000
            );
            return;
          } else {
            throw new Error('Request to PUT Tracks Failed!');
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        throw new Error('Request to PUT PlaylistName Failed!');
      }
    } catch (err) {
      this.authFailed();
      console.log(err);
    }
  },

  // This function deletes/unfollows the playlist from Spotify by using DELETE to https://api.spotify.com/v1/users/{owner_id}/playlists/{playlist_id}/followers
  async deletePlaylist(playlistID) {
    const accessToken = this.accessToken || this.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    const userID = await this.getUserID();
    // DELETE method
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/followers`,
        {
          method: 'DELETE',
          headers: headers,
        }
      );
      if (response.ok) {
        setTimeout(alert('Playlist Deleted.'), 1000);
        return true;
      } else {
        throw new Error('Request to DELETE Playlist Failed!');
      }
    } catch (err) {
      this.authFailed();
      console.log(err);
    }
  },

  authFailed() {
    this.accessToken = null;
    localStorage.removeItem('access_token');
  },
};

export default Spotify;
