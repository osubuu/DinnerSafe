import React, { Component } from "react";
import _ from "lodash";
import { Route, Link, Redirect } from "react-router-dom";
import firebase from "firebase";
import ManageEvents from "./ManageEvents";
import ExistingFriendList from "./ExistingFriendList";
import EventPage from "./EventPage/EventPage";

class OverviewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfile: props.userProfile,
      inputValue: "",
      confirmedEventName: ""
    };
    this.dbRef = firebase.database().ref(`${props.userProfile.id}`);
  }

  handleChangeAddEvent = e => {
    this.setState({
      inputValue: e.target.value
    });
  };

  // Handling for click of either sign in or create buttons
  handleClickAddEvent = e => {
    this.setState({
      confirmedEventName: this.state.inputValue
    });
  };

  // Handling for form submit
  handleSubmitAddEvent = e => {
    e.preventDefault();

    // create new event object, because the firebase parties array holds objects of each event
    let newEventObj = {
      title: this.state.confirmedEventName,
      recipes: []
    };

    // create temp array (clone of current firebase parties array) and add new object to it
    let tempArr = this.state.userProfile.parties;
    tempArr.push(newEventObj);

    // replace the firebase array with the newly updated array
    this.dbRef.child("/parties").set(tempArr);

    console.log(tempArr);
  };

  // delete parties
  deleteEvent = key => {
    console.log(key);

    let tempArr = this.state.userProfile.parties;
    tempArr.splice(key, 1);

    this.dbRef.child("/parties").set(tempArr);
  };

  render() {
    return (
      <main className="overview-page">
        <div className="wrapper">
          <div className="current-user">
            <h1>{_.capitalize(this.state.userProfile.user)}</h1>
            <Link onClick={this.props.handleLogout} to="/">
              Log Out
            </Link>
          </div>

          {/* Go through parties object and list all the parties and their recipes */}
          {this.state.userProfile.parties
            ? this.state.userProfile.parties.map((party, i) => {
                return (
                  <div key={i}>
                    <h2
                      onClick={this.props.selectEvent}
                      id={i}
                      className="go-to-event"
                      to="/event"
                    >
                      {party.title}
                    </h2>
                    <button onClick={() => this.deleteEvent(i)}>
                      DELETE EVENT
                    </button>
                  </div>
                );
              })
            : null}

          <form onSubmit={this.handleSubmitAddEvent} action="">
            <label htmlFor="new-event">Add New Event</label>
            <input
              onChange={this.handleChangeAddEvent}
              id="new-event"
              type="text"
            />
            <button onClick={this.handleClickAddEvent}>SUBMIT</button>
          </form>
        </div>
      </main>
    );
  }

  componentDidMount() {
    this.dbRef.on("value", snapshot => {
      this.setState({ userProfile: snapshot.val() });
    });
  }
}

export default OverviewPage;
