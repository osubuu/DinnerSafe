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
      userProfile: props.userProfile
    };
  }

  render() {
    return (
      <main className="overview-page">

        <Header user={_.capitalize(this.state.userProfile.user)} handleLogout={this.props.handleLogout}/>

        <div className="wrapper">
          
          <div className="events">
            
            <h2 className="page-title">Events</h2>
            
            <Link className="create-new-event" to="/PLACEHOLDER">Create New Event</Link>

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
                          to="/event"onClick={this.props.selectEvent} href="#">{party.title}
                          </Link>
                      </li>
                    );
                  })}
            </ul>

            

          </div>
          {/* End of Events Div */}

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
