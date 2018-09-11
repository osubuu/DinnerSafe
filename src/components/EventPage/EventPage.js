// Event page for a single event
import React, { Component } from "react";
import DisplayMatchingRecipes from "../DisplayMatchingRecipes/DisplayMatchingRecipes";
import { Link, Redirect } from "react-router-dom";
import firebase from "../../firebase";
import _ from "lodash";
import Header from "../Header";
import swal from "sweetalert2";
import DisplaySavedRecipes from "../DisplayMatchingRecipes/DisplaySavedRecipes";
import Loader from "../Loader";

class EventPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
      confirmedNewName: "",
      APICallDone: false
    };
    if (props.userProfile) {
      this.dbRef = firebase.database().ref(`${props.userProfile.id}`);
    } else {
      props.getRedirected(true);
    }
  }

  // Function to track when API call is done
  checkIfAPICallDone = () => {
    this.setState({
      APICallDone: true
    });
  };

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
        tempFriendParties.splice(
          tempFriendParties.indexOf(this.props.userProfile.parties[this.props.selectedEventIndex].title),
          1
        );

        // set new party array to firebase
        this.dbRef.child(`/friends/${tempFriendIndex}/parties`).set(tempFriendParties);
      }
    });
  };

  // Function to check if current event has any guests already
  checkCurrentEventForGuests = () => {
    let condition = false;

    this.props.userProfile.friends.forEach(friend => {
      if (
        friend.parties &&
        friend.parties.indexOf(this.props.userProfile.parties[this.props.selectedEventIndex].title) !== -1
      ) {
        condition = true;
      }
    });
    return condition;
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

    this.setState({
      inputValue: ""
    });

    if (this.state.confirmedNewName) {
      let doesFriendToAddExistYet = false;

      this.props.userProfile.friends.forEach(friend => {
        if (friend.name === this.state.confirmedNewName) {
          doesFriendToAddExistYet = true;
          swal({
            type: "warning",
            title: "That friend already exists!",
            text: `Please add a new friend."`
          });
        }
      });

      if (doesFriendToAddExistYet === false) {
        let newFriendObj = {
          name: this.state.confirmedNewName,
          allowedAllergy: [],
          allowedDiet: [],
          excludedIngredient: [],
          parties: [this.props.userProfile.parties[this.props.selectedEventIndex].title]
        };

        // create temp array (clone of current firebase friend array) and add new object to it
        let tempArr = this.props.userProfile.friends;
        tempArr.push(newFriendObj);

        // replace the firebase array with the newly updated array
        this.dbRef.child("/friends").set(tempArr);
      }
    } else {
      return null;
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
      <div>
        {this.props.userProfile ? (
          <div className="event-page">
            <Header user={this.props.userProfile.user} handleLogout={this.props.handleLogout} />

            <div className="wrapper clearfix">
              <div className="event-title">
                <h2>{this.props.userProfile.parties[this.props.selectedEventIndex].title}</h2>
                <Link onClick={this.props.handleBackToOverview} to="/home">
                  Back to Main Page
                </Link>
              </div>

              <div className="guestList clearfix">
                <ul className="guests">
                  {this.props.userProfile.friends
                    ? this.props.userProfile.friends.map((friend, i) => {
                        if (
                          friend.parties &&
                          friend.parties.indexOf(
                            this.props.userProfile.parties[this.props.selectedEventIndex].title
                          ) !== -1
                        ) {
                          return (
                            <li key={i} className="guest">
                              {/* Edit the guests restrictions */}
                              <p>{friend.name}</p>

                              {/* Fake button to make it clear you can click on the guest to edit them */}
                              <div className="fakeButton">
                                {/* <h2 > */}
                                <i id={friend.name} onClick={this.props.selectFriend} className="fas fa-user-edit" />
                                {/* </h2> */}
                              </div>

                              {/* Removes guest from the event */}
                              <button className="remove-friend" id={friend.name} onClick={this.removeFriendFromEvent}>
                                <i className="fas fa-times" />
                              </button>
                            </li>
                          );
                        }
                      })
                    : null}
                </ul>
                <Link to="existing-guest-list">Add Existing Guest</Link>

                <form onSubmit={this.handleSubmitAddFriend} action="">
                  <label htmlFor="add-new-friend">Add New Guest</label>
                  <input
                    className="add-friend"
                    id={"add-new-friend"}
                    value={this.state.inputValue}
                    onChange={this.handleChangeAddFriend}
                    type="text"
                    autoComplete="off"
                  />
                  <button onClick={this.handleClickAddFriend}>ADD</button>
                </form>
              </div>

              {this.checkCurrentEventForGuests() === true ? (
                <div>
                  <DisplayMatchingRecipes
                    toggleRecipe={this.props.toggleRecipe}
                    userProfile={this.props.userProfile}
                    eventName={this.props.userProfile.parties[this.props.selectedEventIndex].title}
                    checkIfAPICallDone={this.checkIfAPICallDone}
                    savedRecipes={this.props.savedRecipes}
                  />
                </div>
              ) : null}
            </div>
            {/* End of Wrapper */}
          </div>
        ) : (
          <div>
            <Loader />
            <Redirect from="/event" to="/" />
          </div>
        )}
      </div>
    );
  }
}

export default EventPage;
