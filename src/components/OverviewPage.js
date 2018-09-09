import React, { Component } from "react";
import _ from "lodash";
import { Link } from "react-router-dom";
import firebase from "firebase";
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

  // Handle input for new event name
  handleChangeAddEvent = e => {
    this.setState({
      inputValue: e.target.value
    });
  };

  // Handling for when new event is submitted
  handleClickAddEvent = e => {
    this.setState({
      confirmedEventName: this.state.inputValue
    });
  };

  // Handling for form submit of new event creations
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

    this.setState({
      inputValue: ""
    });
  };

  // Function to delete a party from parties list AND individual friends' parties array
  deleteEvent = (key, eventName) => {
    // remove event from parties array
    let tempPartiesArr = this.props.userProfile.parties;
    tempPartiesArr.splice(key, 1);
    this.dbRef.child("/parties").set(tempPartiesArr);

    // remove event from friends
    let tempFriendsArr = this.props.userProfile.friends;

    // go through all the friends and check if party is in their parties array
    tempFriendsArr.forEach(friend => {
      if (friend.parties && friend.parties.indexOf(eventName) !== -1) {
        friend.parties.splice(friend.parties.indexOf(eventName), 1);
      }
    });

    this.dbRef.child("/friends").set(tempFriendsArr);
  };

  render() {
    return (
      <main className="overview-page">
        <Header user={_.capitalize(this.props.userProfile.user)} handleLogout={this.props.handleLogout} />

        <div className="wrapper">
          <div className="events">
            <h2 className="page-title">Events</h2>

            <form className="create-new-event clearfix" onSubmit={this.handleSubmitAddEvent} action="">
              <label className="new-event-label" htmlFor="new-event">
                Add New Event
              </label>
              <input
                className="new-event-name-input"
                onChange={this.handleChangeAddEvent}
                id="new-event"
                type="text"
                placeholder="New Event Name"
                value={this.state.inputValue}
              />
              <button className="new-event-button" onClick={this.handleClickAddEvent}>
                Submit
              </button>
            </form>

            <ul>
              {/* Go through parties object and list all the parties and their recipes */}
              {this.props.userProfile.parties
                ? this.props.userProfile.parties.map((party, i) => {
                    return (
                      <li className="clearfix event" key={i}>
                        <Link id={i} className="go-to-event" to="/event" onClick={this.props.selectEvent} href="#">
                          {party.title}
                        </Link>
                        <button className="delete-button" onClick={() => this.deleteEvent(i, party.title)}>
                          <i className="fas fa-times" />
                        </button>
                      </li>
                    );
                  })
                : null}
            </ul>
          </div>
          {/* End of Events Div */}
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
