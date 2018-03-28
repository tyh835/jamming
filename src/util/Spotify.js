const CLIENT_ID = "67c415c603714e92a1eb3a2a23d50677";
const REDIRECT_URI = window.location.href;
// Check if the website is the one published on GitHub Pages.
const IS_GITHUB = window.location.href.split('.').some(i => {return i.toLowerCase() === 'github'});

const Spotify = {
  accessToken: undefined,
  expiresIn: undefined,
// This function fetches an authorization token using Spotify's implicit authorization framework.
  getAccessToken() {
    if (this.accessToken) {
      return this.accessToken;
    } else if (window.location.href.match(/access_token=([^&]*)/)) {
      // If no authorization token already saved, this function tries to obtain token from URL.
      this.accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
      // Sets the window timeout once the access token has been obtained.
      this.expiresIn = Number(window.location.href.match(/expires_in=([^&]*)/)[1]);
      window.setTimeout(() => this.accessToken = undefined, this.expiresIn * 1000);
      console.log(this.accessToken);
      console.log(`Token expires in ${this.expiresIn} seconds`);
      IS_GITHUB ? window.history.pushState('Access Token', null, '/jamming') : window.history.pushState('Access Token', null, '/');
      return this.accessToken;
    }
  },

  redirectSpotify() {
      window.location = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&scope=playlist-modify-public+playlist-modify-private+user-top-read&redirect_uri=${REDIRECT_URI}`;
  },
// This function searches Spoify by using GET to "https://api.spotify.com/v1/search"
  async search(term) {
    let accessToken = this.accessToken || this.getAccessToken();
    try {
      let response = await fetch(`https://api.spotify.com/v1/search?type=track&limit=50&q=${term}`, {headers: {Authorization: `Bearer ${accessToken}`}});
      if (response.ok) {
        let jsonResponse = await response.json();
        if (jsonResponse && jsonResponse !== {}) {
          return jsonResponse.tracks.items.map(track => {
            return {
              id: track.id,
              name: track.name,
              artist: track.artists[0].name,
              album: track.album.name,
              uri: track.uri,
              preview: track.preview_url
            }
          })
        }
      } else {
          throw new Error('Search Request Failed!');
      }
    } catch(err) {
      console.log(err);
    }
  },

// This functions returns the User ID of the current user.
  async getUserID() {
     let accessToken = this.accessToken || this.getAccessToken();
     let headers = {Authorization: `Bearer ${accessToken}`};
     let userID;
     try {
       let response = await fetch('https://api.spotify.com/v1/me', {headers: headers});
       if (response.ok) {
         let jsonResponse = await response.json();
         if (jsonResponse) {
           userID = jsonResponse.id;
           return userID;
         }
       } else {
         throw new Error('Request to GET user_id Failed!');
       }
     } catch(err) {
     console.log(err);
   }
 },

// This function gets user's top tracks from Spoify by using GET to "https://api.spotify.com/v1/me/top/tracks"
    async getTopTracks() {
      let accessToken = this.accessToken || this.getAccessToken();
      try {
        let response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=50', {headers: {Authorization: `Bearer ${accessToken}`}});
        if (response.ok) {
          let jsonResponse = await response.json();
          if (jsonResponse && jsonResponse !== {}) {
            return jsonResponse.items.map(track => {
              return {
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri,
                preview: track.preview_url
              }
            })
          }
        } else {
            throw new Error('Request to GET Top Tracks Failed!');
        }
      } catch(err) {
        console.log(err);
      }
    },

// This function gets user_id from Spoify by using this.getUserID,
// then gets user's playlists owned by the user from Spoify by using GET to "https://api.spotify.com/v1/me/playlists"
    async getPlaylists() {
      let accessToken = this.accessToken || this.getAccessToken();
      let headers = {Authorization: `Bearer ${accessToken}`};
      let userID = await this.getUserID();
      //
      try {
        let response = await fetch('https://api.spotify.com/v1/me/playlists?limit=50', {headers: headers});
        if (response.ok) {
          let jsonResponse = await response.json();
          if (jsonResponse && jsonResponse !== {}) {
            console.log(jsonResponse);
            return jsonResponse.items.filter(playlist => playlist.owner.id === userID).map(playlist => {
              return {
                id: playlist.id,
                name: playlist.name,
                tracksURL: playlist.tracks.href,
                image: playlist.images[1],
                uri: playlist.uri,
              }
            });
          }
        } else {
        throw new Error('Request to GET Playlists Failed!');
        }
      } catch(err) {
        console.log(err);
      }
    },

// This function gets playlist's tracks from Spoify by using GET to trackURL
    async getPlaylistTracks(trackURL) {
      let accessToken = this.accessToken || this.getAccessToken();
      try {
        let response = await fetch(trackURL, {headers: {Authorization: `Bearer ${accessToken}`}});
        if (response.ok) {
          let jsonResponse = await response.json();
          if (jsonResponse && jsonResponse !== {}) {
            return jsonResponse.items.map(track => {
              return {
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri,
                preview: track.preview_url
              }
            })
          }
        } else {
            throw new Error('Request to GET Top Tracks Failed!');
        }
      } catch(err) {
        console.log(err);
      }
    },

// This function gets user_id from Spoify by using this.getUserID,
// then POST to "https://api.spotify.com/v1/users/${userID}/playlists" to add new playlist and obtain playlistID,
// then POST to "https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks" to add tracks to newly created playlist.
  async savePlaylist(playlistName, trackURIs) {
    if (!playlistName || !trackURIs[0]) {
      return;
    }
    let accessToken = this.accessToken || this.getAccessToken();
    let headers = {Authorization: `Bearer ${accessToken}`, 'Content-Type': "application/json"};
    let userID = await this.getUserID();
    // POST 1 method
    try {
      let responsePOST1 = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({name: playlistName})
      });
      if (responsePOST1.ok) {
        let jsonResponsePOST1 = await responsePOST1.json();
        if (jsonResponsePOST1) {
          // POST 2 method
          try {
            let playlistID = jsonResponsePOST1.id;
            let responsePOST2 = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks?uris=${trackURIs.join(',')}`, {
              method: 'POST',
              headers: headers});
              if(responsePOST2.ok) {
                setTimeout(alert('Successfully saved to Spotify!'), 1000);
                return;
              } else {
                throw new Error('Request to POST Tracks Failed!');
              }
          } catch(err) {
            console.log(err);
          }
        }
      } else {
        throw new Error('Request to POST Playlist Failed!');
      }
    } catch(err) {
      console.log(err);
    }
  }
};

export default Spotify;
