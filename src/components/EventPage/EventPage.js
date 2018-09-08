// Event page for a single event

import React, { Component } from "react";
import DisplayMatchingRecipes from "../DisplayMatchingRecipes/DisplayMatchingRecipes";
import { Route, Link } from "react-router-dom";
import EditFriend from "../EditFriend";
import firebase from "../../firebase";
import _ from "lodash";

class EventPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfile: props.userProfile
    };
    this.dbRef = firebase.database().ref(`${props.userProfile.id}`);
  }

  removeFriendFromEvent = e => {
    console.log(e.target.id);

    this.dbRef.child("friends").once("value", snapshot => {
      // find index of current friend on firebase
      let tempFriendIndex = _.findIndex(snapshot.val(), ["name", e.target.id]);

      // make temporary array of the parties array of the current friend
      let tempFriendParties = _.find(snapshot.val(), ["name", e.target.id])
        .parties;

      // remove current party from current friend
      tempFriendParties.splice(
        tempFriendParties.indexOf(this.props.selectedEvent.title),
        1
      );

      // set new party array to firebase
      this.dbRef
        .child(`/friends/${tempFriendIndex}/parties`)
        .set(tempFriendParties);
    });
  };

  addNewFriendToEvent = e => {};

  addExistingGuestToEvent = e => {};

  render() {
    return (
      <div className="event-page">
        <Link onClick={this.props.handleBackToOverview} to="/Overview">
          Back to Overview
        </Link>

        <h2>{this.props.selectedEvent.title}</h2>

        <div className="guestList">
          <ul className="guests">
            {this.props.userProfile.friends.map((friend, i) => {
              if (
                friend.parties.indexOf(this.props.selectedEvent.title) !== -1
              ) {
                return (
                  <li className="guest">
                    {/* Edit the guests restrictions */}
                    {/* <a href="#placeholderToEditGuestRestrictions"> */}
                    <p>{friend.name}</p>

                    {/* Fake button to make it clear you can click on the guest to edit them */}
                    <div className="fakeButton">
                      <h2 id={friend.name} onClick={this.props.selectFriend}>
                        EDIT FRIEND
                      </h2>
                    </div>
                    {/* </a> */}

                    {/* Removes guest from the event */}
                    <button
                      id={friend.name}
                      onClick={this.removeFriendFromEvent}
                    >
                      Remove From Event
                    </button>
                  </li>
                );
              }
            })}
          </ul>
          <Link to="existing-friend-list">Add Existing Guest</Link>
          <a href="#AddExistingGuest">Add New Guest</a>
        </div>

        <DisplayMatchingRecipes
          userProfile={this.props.userProfile}
          eventName={this.props.selectedEvent.title}
        />
      </div>
    );
  }
}

export default EventPage;
