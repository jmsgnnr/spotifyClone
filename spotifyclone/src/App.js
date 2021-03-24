import React, { Component } from "react";
import logo from './logo.svg';
import './App.css';
import hash from "./hash.js"
import $ from "jquery";
// import Player from "./Player";

export const authEndpoint = 'https://accounts.spotify.com/authorize';

const clientId= "d433a2314c9547a987c04c5516cbefe6";
const redirectUri = "http://localhost:3000";
const scopes = [
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
      artists: [{name: ""}],
      duration_ms: 0,
    },
    is_playing: "Paused",
    progress_ms: 0,    
  };

  this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
  }

  getCurrentlyPlaying(token) {
  $.ajax({
    url: "https://spotify.com/v1/me/player",
    type: "GET",
    beforeSend: (xhr) => {
      xhr.setRequestHeader("Authorization", "Bearer " + token);
    },
    success: (data) => {
      this.setState({
        item: data.item,
        is_playing: data.is_playing,
        progress_ms: data.progress_ms,
      });
    }
  });
  }
    componentDidMount() {
      let _token = hash.access_token;
      if (_token) {
        this.setState({
          token : _token
        });
      }
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
                {`${authEndpoint}client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}
                  >
                    Login To Spotify!
                  </a>
            )}
            {/* {this.state.token && (
              // spotify player will go here. 
            )} */}
            </header>
            </div>
      );
    }
}

export default App;
