import React, { Component } from "react";
import logo from './baddoglogo.svg';
import './App.css';
import hash from "./hash.js"
import $ from "jquery";
import Player from "./Player";

// error message test has been blocked by CORS policy: Response to preflight request doesn't pass access control check: Redirect is not allowed for a preflight request.

export const authEndpoint = 'https://accounts.spotify.com/authorize';

const clientId= "d433a2314c9547a987c04c5516cbefe6";
const redirectUri = "http://localhost:3000/";
const scopes = [
  "user-top-read",
  "user-read-currently-playing",
  "user-read-playback-state",
];

class App extends Component {
  constructor() {
    super();
    this.state = {
      token: null,
    item: {
      album: {
        images: [{url : ""}]
      },
      name: "",
      artists: [{ name: "" }],
      duration_ms: 0
    },
    is_playing: "Paused",
    progress_ms: 0,
    no_data: false,
  };

  this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
  this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    let _token = hash.access_token;
    if (_token) {
      this.setState({
        token : _token
      });
      this.getCurrentlyPlaying(_token);
    }

    this.interval = setInterval(() => this.tick(), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick() {
    if(this.state.token) {
      this.getCurrentlyPlaying(this.state.token);
    }
  }

  getCurrentlyPlaying(token) {
  $.ajax({
    url: "https://api.spotify.com/v1/me/player",
    type: "GET",
    beforeSend: (xhr) => {
      xhr.setRequestHeader("Authorization", "Bearer " + token);
    },
    success: (data) => {
      if(!data) { 
        this.setState({
          no_data: true,
        });
        return;
      }

      this.setState({
        item: data.item,
        is_playing: data.is_playing,
        progress_ms: data.progress_ms,
        no_data: false
      });
    }
  });
  }


    render() {
      return (
        <div className="App">
          <header className="App-Header">
            <img src={logo} className="App-logo" alt="logo" />
            {!this.state.token && (
              <a
                className="btn btn--loginApp-link"
                href=
                {`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}
                  >
                    Login To Spotify!
                  </a>
            )}
            {this.state.token && !this.state.no_data && ( 
              <Player
              item={this.state.item}
              is_playing={this.state.is_playing}
              progress_ms={this.progress_ms}
              />
            )}
            {this.state.no_data && (
              <p>
                You need to be playing a song on spotify
              </p>
            )}
            </header>
            </div>
      );
    }
}

export default App;
