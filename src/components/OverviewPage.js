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
      hideOverviewList: false,
      selectedEventIndex: -1
    };
  }

  toggleOverviewList = e => {
    console.log(e.target.className);
    console.log(this.state.selectedEventIndex);
    console.log(Number(e.target.id));
    if (e.target.className === "go-to-event") {
      this.setState({
        hideOverviewList: true,
        selectedEventIndex: Number(e.target.id)
      });
    } else {
      this.setState({
        hideOverviewList: false,
        selectedEventIndex: -1
      });
    }
  };

  singleEvent = () => {
    console.log("got into this function");
    return (
      <EventPage
        userProfile={this.state.userProfile}
        selectedEvent={
          this.state.userProfile.parties[this.state.selectedEventIndex]
        }
        toggleOverviewList={this.toggleOverviewList}
      />
    );
  };

  render() {
    return (
      <main className="overview-page">
        <div className="wrapper">
          <div className="current-user">
            <h1>{_.capitalize(this.state.userProfile.user)}</h1>
            <Link to="/login">Log Out</Link>
          </div>

          {/* Go through parties object and list all the parties and their recipes */}
          {this.state.userProfile.parties === undefined ||
          this.state.hideOverviewList === true
            ? null
            : this.state.userProfile.parties.map((party, i) => {
                return (
                  <div key={i}>
                    {/* <Link onClick={this.toggleOverviewList} to="/overview/event"> */}
                    <h2
                      onClick={this.toggleOverviewList}
                      id={i}
                      className="go-to-event"
                    >
                      {party.title}
                    </h2>
                    {/* </Link> */}
                  </div>
                );
              })}

          <Route
            exact
            path="/overview"
            render={() => {
              return this.state.selectedEventIndex !== -1 ? (
                <Redirect to="/overview/event" />
              ) : null;
            }}
          />

          {/* <Link to="/existing-friend-list">Existing Friend List</Link> */}
          {/* <Link to="/manage-events">Manage Events</Link> */}
          <Route exact path="/overview/event" render={this.singleEvent} />
        </div>
      </main>
    );
  }

  componentDidMount() {
    if (this.state.userProfile !== null) {
      let dbRef = firebase.database().ref(`${this.state.userProfile.id}`);
      dbRef.on("value", snapshot => {
        this.setState({ userProfile: snapshot.val() });
      });
    }
  }
}

export default OverviewPage;
