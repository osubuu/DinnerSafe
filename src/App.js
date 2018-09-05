import React, { Component } from "react";
import "./App.css";
import firebase from "./firebase";

//COMPONENTS//
import apiCall from "./components/apiCall";

const dbRef = firebase.database().ref();

class App extends Component {
  constructor () {
    super();
    this.state = {
      allowedAllergies: [],
      allowedDiet: [],
    }
  }
  
  render() {
    return (
      <div className="App">
        <h1>JDK PROJECT!!!</h1>
      </div>
    );
  }
}

export default App;
