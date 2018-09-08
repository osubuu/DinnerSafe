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
      userProfile: props.userProfile
    };
  }

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
          {this.state.userProfile.parties === undefined
            ? null
            : this.state.userProfile.parties.map((party, i) => {
                return (
                  <h2
                    onClick={this.props.selectEvent}
                    id={i}
                    className="go-to-event"
                    to="/event"
                  >
                    {party.title}
                  </h2>
                );
              })}
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
