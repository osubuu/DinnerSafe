import React, { Component } from "react";
import _ from "lodash";
import { Route, Link, Redirect } from "react-router-dom";
import firebase from "firebase";
import ManageEvents from "./ManageEvents";
import ExistingFriendList from "./ExistingFriendList";
import EventPage from "./EventPage/EventPage";
import Header from "./Header";

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
    let tempArr = this.state.userProfile.parties;
    tempArr.push(newEventObj);

    // replace the firebase array with the newly updated array
    this.dbRef.child("/parties").set(tempArr);

    console.log(tempArr);

    this.setState({
      inputValue: ""
    })
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
        <Header
          user={_.capitalize(this.state.userProfile.user)}
          handleLogout={this.props.handleLogout}
        />

        <div className="wrapper">
          <div className="events">
            <h2 className="page-title">Events</h2>

            <Link className="create-new-event" to="/PLACEHOLDER">
              Create New Event
            </Link>

            <ul>
              {/* Go through parties object and list all the parties and their recipes */}
              {this.state.userProfile.parties === undefined
                ? null
                : this.state.userProfile.parties.map((party, i) => {
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
                        <button onClick={() => this.deleteEvent(i)}>
                          DELETE EVENT
                        </button>
                      </li>
                    );
                  })}
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
      this.setState({ userProfile: snapshot.val() });
    });
  }
}

export default OverviewPage;
