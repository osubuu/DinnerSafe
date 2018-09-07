import React, { Component } from "react";
import _ from "lodash";
import { Route, Link } from "react-router-dom";
import firebase from "firebase";
import ManageEvents from "./ManageEvents";
import ExistingFriendList from "./ExistingFriendList";
import Simple from "./Simple";

class OverviewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfile: props.userProfile
    };
  }

  render() {
    // return this.state.userProfile !== null &&
    //   this.state.userProfile !== undefined ? (

    return (
      <main className="overview-page">
        <h1>{_.capitalize(this.state.userProfile.user)}</h1>

        {/* Go through parties object and list all the parties and their recipes */}
        {this.state.userProfile.parties === undefined
          ? null
          : this.state.userProfile.parties.map(party => {
              return (
                <div>
                  <h2>{party.title}</h2>
                </div>
              );
            })}

        <Link to="/existing-friend-list">Existing Friend List</Link>
        <Link to="/manage-events">Manage Events</Link>
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
