import React, { Component } from "react";
import "./App.css";
import firebase from "./firebase";

const dbRef = firebase.database().ref();

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>JDK PROJECT!!!</h1>
      </div>
    );
  }
}

export default App;
