const CLIENT_ID = "67c415c603714e92a1eb3a2a23d50677";
const REDIRECT_URI = window.location.href;

const Spotify = {
  accessToken: undefined,
  expiresIn: undefined,
  endsWithJamming: window.location.href.split('/')[-1] === "jamming",

  getAccessToken() {
    if (this.accessToken) {
      return this.accessToken;
    } else if (window.location.href.match(/access_token=([^&]*)/)) {
      this.accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
      this.expiresIn = Number(window.location.href.match(/expires_in=([^&]*)/)[1]);
      window.setTimeout(() => this.accessToken = '', this.expiresIn * 1000);
      this.endsWithJamming ? window.history.pushState('Access Token', null, '/jamming') : window.history.pushState('Access Token', null, '/');
      return this.accessToken;
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${REDIRECT_URI}`;
    }
  },

  async search(term) {
    let accessToken = this.accessToken || this.getAccessToken();
    try {
      let response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {headers: {Authorization: `Bearer ${accessToken}`}});
      if (response.ok) {
        let jsonResponse = await response.json();
        if (jsonResponse && jsonResponse !== {}) {
          return jsonResponse.tracks.items.map(track => {
            return {
              id: track.id,
              name: track.name,
              artist: track.artists[0].name,
              album: track.album.name,
              uri: track.uri
            }
          })
        }
      }
      throw new Error('Request Failed!');
    } catch(err) {
      console.log(err);
    }
  },

  async savePlaylist(playlistName, trackURIs) {
    if (!playlistName || !trackURIs[0]) {
      return;
    }
    let accessToken = this.accessToken || this.getAccessToken();
    let headers = {Authorization: `Bearer ${accessToken}`};
    let userID;

    try {
      let responseGET = await fetch('https://api.spotify.com/v1/me', {headers: headers});
      if (responseGET.ok) {
        let jsonResponseGET = await responseGET.json();
        if (jsonResponseGET) {
          userID = jsonResponseGET.id;

          try {
            let responsePOST1 = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
              method: 'POST',
              headers: {Authorization: `Bearer ${accessToken}`, 'Content-Type': "application/json"},
              body: JSON.stringify({name: playlistName})
            });
            if (responsePOST1.ok) {
              let jsonResponsePOST1 = await responsePOST1.json();
              if (jsonResponsePOST1) {

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
