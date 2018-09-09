// Event page for a single event

import React, { Component } from "react";
import DisplayMatchingRecipes from "../DisplayMatchingRecipes/DisplayMatchingRecipes";
import { Route, Link } from "react-router-dom";
import firebase from "../../firebase";
import _ from "lodash";
import Header from "../Header";

class EventPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfile: props.userProfile,
      inputValue: "",
      confirmedNewName: ""
    };
    this.dbRef = firebase.database().ref(`${props.userProfile.id}`);
  }

  removeFriendFromEvent = e => {
    console.log(e.target.id);

    this.dbRef.child("friends").once("value", snapshot => {
      // find index of current friend on firebase
      let tempFriendIndex = _.findIndex(snapshot.val(), ["name", e.target.id]);

      // make temporary array of the parties array of the current friend
      let tempFriendParties = _.find(snapshot.val(), ["name", e.target.id]).parties;

      // remove current party from current friend
      tempFriendParties.splice(tempFriendParties.indexOf(this.props.selectedEvent.title), 1);

      // set new party array to firebase
      this.dbRef.child(`/friends/${tempFriendIndex}/parties`).set(tempFriendParties);
    });
  };

  addExistingFriendToEvent = () => {
    this.props.updateAppUserProfile(this.state.userProfile);
  };

  handleChangeAddFriend = e => {
    this.setState({
      inputValue: e.target.value
    });
  };

  handleSubmitAddFriend = e => {
    e.preventDefault();

    let newFriendObj = {
      name: this.state.confirmedNewName,
      allowedAllergy: [],
      allowedDiet: [],
      excludedIngredient: [],
      parties: [this.props.selectedEvent.title]
    };

    // create temp array (clone of current firebase friend array) and add new object to it
    let tempArr = this.state.userProfile.friends;
    tempArr.push(newFriendObj);
    console.log(tempArr);

    // replace the firebase array with the newly updated array
    this.dbRef.child("/friends").set(tempArr);

    console.log(tempArr);
  };

  handleClickAddFriend = e => {
    this.setState({
      confirmedNewName: this.state.inputValue
    });
  };

  render() {
    return (
      <div className="event-page">
        <Header user={_.capitalize(this.state.userProfile.user)} handleLogout={this.props.handleLogout} />

        <div className="wrapper">
          <Link onClick={this.props.handleBackToOverview} to="/Overview">
            Back to Overview
          </Link>

          <h2>{this.props.selectedEvent.title}</h2>

          <div className="guestList">
            <ul className="guests">
              {this.state.userProfile.friends.map((friend, i) => {
                if (friend.parties.indexOf(this.props.selectedEvent.title) !== -1) {
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
                      <button id={friend.name} onClick={this.removeFriendFromEvent}>
                        Remove From Event
                      </button>
                    </li>
                  );
                }
              })}
            </ul>
            <Link to="existing-friend-list">Add Existing Guest</Link>

            <form onSubmit={this.handleSubmitAddFriend} action="">
              <label htmlFor="add-new-friend">Add New Guest</label>
              <input id={"add-new-friend"} onChange={this.handleChangeAddFriend} type="text" />
              <button onClick={this.handleClickAddFriend}>ADD</button>
            </form>
          </div>

          <DisplayMatchingRecipes userProfile={this.props.userProfile} eventName={this.props.selectedEvent.title} />
        </div>
        {/* End of Wrapper */}
      </div>
    );
  }

  componentDidMount() {
    console.log("Inside ComponentDidMount of EventPage.js");

    this.dbRef.on("value", snapshot => {
      console.log(snapshot.val());
      this.setState({ userProfile: snapshot.val() });
    });
  }
}

export default EventPage;
