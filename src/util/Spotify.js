const CLIENT_ID = "67c415c603714e92a1eb3a2a23d50677";
const REDIRECT_URI = window.location.href;
// Check if the website is the one published on GitHub Pages.
const IS_GITHUB = window.location.href.split('.').some(i => {return i.toLowerCase() === 'github'});

const Spotify = {
  accessToken: undefined,
  expiresIn: undefined,
// This function fetches an authorization token using Spotify's implicit authorization framework/
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
      window.location = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&scope=playlist-modify-public+user-top-read&redirect_uri=${REDIRECT_URI}`;
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
      }
      throw new Error('Search Request Failed!');
    } catch(err) {
      console.log(err);
    }
  },

  // This function gets user's top tracks from  Spoify by using GET to "https://api.spotify.com/v1/me/top/tracks"
    async getTopTracks() {
      let accessToken = this.accessToken || this.getAccessToken();
      try {
        let response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=50', {headers: {Authorization: `Bearer ${accessToken}`}});
        if (response.ok) {
          let jsonResponse = await response.json();
          if (jsonResponse && jsonResponse !== {}) {
            console.log(jsonResponse);
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
        }
        throw new Error('Request to GET Top Tracks Failed!');
      } catch(err) {
        console.log(err);
      }
    },
// This function adds playlist to Spoify by using GET to "https://api.spotify.com/v1/me" to obtain userID,
// POST to "https://api.spotify.com/v1/users/${userID}/playlists" to add new playlist and obtain playlistID,
// POST to "https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks" to add tracks to newly created playlist.
  async savePlaylist(playlistName, trackURIs) {
    if (!playlistName || !trackURIs[0]) {
      return;
    }
    let accessToken = this.accessToken || this.getAccessToken();
    let headers = {Authorization: `Bearer ${accessToken}`};
    let userID;
    // GET method
    try {
      let responseGET = await fetch('https://api.spotify.com/v1/me', {headers: headers});
      if (responseGET.ok) {
        let jsonResponseGET = await responseGET.json();
        if (jsonResponseGET) {
          userID = jsonResponseGET.id;
          // POST 1 method
          try {
            let responsePOST1 = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
              method: 'POST',
              headers: {Authorization: `Bearer ${accessToken}`, 'Content-Type': "application/json"},
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
                    headers: {Authorization: `Bearer ${accessToken}`, 'Content-Type': "application/json"}});
                    if(responsePOST2.ok) {
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
      } else {
        throw new Error('Request to GET user_id Failed!');
      }
    } catch(err) {
      console.log(err);
    }
  }
};

export default Spotify;
