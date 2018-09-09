import React, { Component } from "react";
import _ from "lodash";
import { Route, Link, Redirect } from "react-router-dom";
import firebase from "firebase";
import ExistingFriendList from "./ExistingFriendList";
import EventPage from "./EventPage/EventPage";
import Header from "./Header";

class OverviewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfile: props.userProfile,
      inputValue: "",
      confirmedEventName: "",
      userID: props.userID
    };
    this.dbRef = firebase.database().ref(`${this.state.userID}`);
  }

  handleChangeAddEvent = e => {
    this.setState({
      inputValue: e.target.value
    });
  };

  // Handling for click create buttons
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
    let tempArr = this.props.userProfile.parties;
    tempArr.push(newEventObj);

    // replace the firebase array with the newly updated array
    this.dbRef.child("/parties").set(tempArr);

    console.log(tempArr);

    this.setState({
      inputValue: ""
    });
  };

  // delete parties
  deleteEvent = (key, eventName) => {
    console.log(key);

    // remove event from parties array
    let tempPartiesArr = this.props.userProfile.parties;
    tempPartiesArr.splice(key, 1);
    this.dbRef.child("/parties").set(tempPartiesArr);

    // remove event from friends
    let tempFriendsArr = this.props.userProfile.friends;

    tempFriendsArr.forEach(friend => {
      if (friend.parties && friend.parties.indexOf(eventName) !== -1) {
        console.log(`${friend.name} is part of ${eventName}`);
      }
    });
  };

  render() {
    return (
      <main className="overview-page">
        <Header user={_.capitalize(this.props.userProfile.user)} handleLogout={this.props.handleLogout} />

        <div className="wrapper">
          <div className="events">
            <h2 className="page-title">Events</h2>

            <Link className="create-new-event" to="/PLACEHOLDER">
              Create New Event
            </Link>

            <ul>
              {/* Go through parties object and list all the parties and their recipes */}
              {this.props.userProfile.parties
                ? this.props.userProfile.parties.map((party, i) => {
                    return (
                      <li key={i}>
                        <Link
                          id={i}
                          className="go-to-event event"
                          to="/event"
                          onClick={this.props.selectEvent}
                          href="#"
                        >
                          {party.title}
                        </Link>
                        <button onClick={() => this.deleteEvent(i, party.title)}>DELETE EVENT</button>
                      </li>
                    );
                  })
                : null}
            </ul>
          </div>
          {/* End of Events Div */}

          <form onSubmit={this.handleSubmitAddEvent} action="">
            <label htmlFor="new-event">Add New Event</label>
            <input
              onChange={this.handleChangeAddEvent}
              id="new-event"
              type="text"
              placeholder="New Event Name"
              value={this.state.inputValue}
            />
            <button onClick={this.handleClickAddEvent}>SUBMIT</button>
          </form>
        </div>
      </main>
    );
  }

  componentDidMount() {
    this.dbRef.on("value", snapshot => {
      this.setState({ userProfile: snapshot.val() }, () => {
        console.log(this.state.userProfile);
      });
    });
  }
}

export default OverviewPage;
