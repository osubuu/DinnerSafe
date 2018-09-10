// Event page for a single event
import React, { Component } from "react";
import DisplayMatchingRecipes from "../DisplayMatchingRecipes/DisplayMatchingRecipes";
import { Link } from "react-router-dom";
import firebase from "../../firebase";
import _ from "lodash";
import Header from "../Header";

class EventPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
      confirmedNewName: ""
    };
    this.dbRef = firebase.database().ref(`${props.userProfile.id}`);
  }

  // Function to remove specific friend from the current event
  removeFriendFromEvent = e => {
    let friendName = e.target.id;

    this.dbRef.child("friends").once("value", snapshot => {
      // find index of current friend on firebase
      let tempFriendIndex = _.findIndex(snapshot.val(), ["name", friendName]);

      if (_.find(snapshot.val(), ["name", friendName]).parties) {
        // make temporary array of the parties array of the current friend
        let tempFriendParties = _.find(snapshot.val(), ["name", friendName]).parties;

        // remove current party from current friend
        tempFriendParties.splice(tempFriendParties.indexOf(this.props.selectedEvent.title), 1);

        // set new party array to firebase
        this.dbRef.child(`/friends/${tempFriendIndex}/parties`).set(tempFriendParties);
      }
    });
  };

  // Handle input value for new friend to add
  handleChangeAddFriend = e => {
    this.setState({
      inputValue: e.target.value
    });
  };

  // Handle form submit of new friend
  handleSubmitAddFriend = e => {
    e.preventDefault();
    let doesFriendToAddExistYet = false;

    this.props.userProfile.friends.forEach(friend => {
      if (friend.name === this.state.confirmedNewName) {
        doesFriendToAddExistYet = true;
        alert("Friend name already exists. Please add a new friend.");
      }
    });

    if (doesFriendToAddExistYet === false) {
      let newFriendObj = {
        name: this.state.confirmedNewName,
        allowedAllergy: [],
        allowedDiet: [],
        excludedIngredient: [],
        parties: [this.props.selectedEvent.title]
      };

      // create temp array (clone of current firebase friend array) and add new object to it
      let tempArr = this.props.userProfile.friends;
      tempArr.push(newFriendObj);

      // replace the firebase array with the newly updated array
      this.dbRef.child("/friends").set(tempArr);
    }
  };

  // Handle click of new friend
  handleClickAddFriend = e => {
    this.setState({
      confirmedNewName: this.state.inputValue
    });
  };

  render() {
    return (
      <div className="event-page">
        <Header user={_.capitalize(this.props.userProfile.user)} handleLogout={this.props.handleLogout} />

        <div className="wrapper">
          <Link onClick={this.props.handleBackToOverview} to="/home">
            Back to Main Page
          </Link>

          <h2>{this.props.selectedEvent.title}</h2>

          <div className="guestList">
            <ul className="guests">
              {this.props.userProfile.friends
                ? this.props.userProfile.friends.map((friend, i) => {
                    if (friend.parties && friend.parties.indexOf(this.props.selectedEvent.title) !== -1) {
                      return (
                        <li key={i} className="guest">
                          {/* Edit the guests restrictions */}
                          <p>{friend.name}</p>

                          {/* Fake button to make it clear you can click on the guest to edit them */}
                          <div className="fakeButton">
                            <h2 id={friend.name} onClick={this.props.selectFriend}>
                              EDIT FRIEND
                            </h2>
                          </div>

                          {/* Removes guest from the event */}
                          <button id={friend.name} onClick={this.removeFriendFromEvent}>
                            Remove From Event
                          </button>
                        </li>
                      );
                    }
                  })
                : null}
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
}

export default EventPage;
