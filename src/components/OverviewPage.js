import React, { Component } from "react";
import { Link, Route, Redirect } from "react-router-dom";
import firebase from "firebase";
import Header from "./Header";
import swal from "sweetalert2";
import Loader from "./Loader";

class OverviewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
      confirmedEventName: ""
    };

    if (props.userProfile) {
      this.dbRef = firebase.database().ref(`${this.props.userID}`);
    } else {
      props.getRedirected(true);
    }
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

    if (this.state.confirmedEventName) {
      let newEventObj = {
        title: this.state.confirmedEventName,
        recipes: []
      };

      // create temp array (clone of current firebase parties array) and add new object to it
      let tempArr = this.props.userProfile;

      // if no parties array, initialize one
      if (!tempArr.parties) {
        tempArr.parties = [];
      }

      // push new event object to array
      tempArr.parties.push(newEventObj);

      // replace the firebase array with the newly updated array
      this.dbRef.set(tempArr);

      this.setState({
        inputValue: ""
      });
    }
    // create new event object, because the firebase parties array holds objects of each event
  };

  // Function to delete a party from parties list AND individual friends' parties array
  deleteEvent = (key, eventName) => {
    swal({
      type: "warning",
      title: "Are you sure?",
      text: "This will remove your event permanently.",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!"
    }).then(result => {
      if (result.value) {
        swal("Removed!", "Your event has been removed.", "success");
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
      }
    });
  };

  render() {
    return (
      <div>
        {this.props.userProfile ? (
          <main className="overview-page">
            <Header user={this.props.userProfile.user} handleLogout={this.props.handleLogout} />

            <div className="wrapper">
              <div className="events">
                {/* <Loader /> */}
                <h3 className="section-header">Create Event</h3>
                <form className="create-new-event clearfix" onSubmit={this.handleSubmitAddEvent} action="">
                  <label className="new-event-label" htmlFor="new-event">
                    Event Name
                  </label>
                  <input
                    className="new-event-name-input"
                    onChange={this.handleChangeAddEvent}
                    id="new-event"
                    type="text"
                    value={this.state.inputValue}
                  />
                  <button className="new-event-button" onClick={this.handleClickAddEvent}>
                    Submit
                  </button>
                </form>

                <h3 className="section-header">Event List</h3>
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
        ) : (
          <Redirect from="/home" to="/" redirected={true} />
        )}
      </div>
    );
  }
}

export default OverviewPage;
