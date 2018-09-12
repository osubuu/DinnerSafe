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
            {/* <Header user={this.props.userProfile.user} handleLogout={this.props.handleLogout} /> */}

            <header>
              <div className="event-subheader">
                <div className="wrapper clearfix event-sub-subheader">
                  
                  <div className="event-header-left clearfix">
                    <h1 className="app-name">DinnerSafe</h1>

                    <div className="event-title-div">
                      <p className="event-title">{this.props.userProfile.parties[this.props.selectedEventIndex].title}</p>
                    </div>
                  </div>
                  
                  <div className="right user clearfix">
                    <h2>{this.props.userProfile.user}</h2>
                    <Link className="log-out" onClick={this.props.handleLogout} to="/">Log Out</Link>
                  </div>

                  <input type="checkbox" id="toggle" name="toggle" className="hidden-checkbox"></input>

                  <div className="big-mac-icon clearfix">
                    <label className="hamburger" htmlFor="toggle">
                      <i class="fas fa-bars"></i>
                    </label>
                  </div>

                  <div className="big-mac">
                    <ul>
                      <li className="ham-li">
                        <Link className="log-out" onClick={this.props.handleLogout} to="/">Log Out</Link>
                      </li>

                      <li className="ham-li">
                        <Link className="event-main-page" onClick={this.props.handleBackToEvent} to="/home">
                          Main Page
                        </Link>
                      </li>
                      
                      <li className="ham-li">
                        <a href="#add-guest">Manage Event Guests</a>
                      </li>

                      <li className="ham-li">
                        <a href="#display-matching-recipes">Search & Save Recipes</a>
                      </li>


                    </ul>
                  </div>
                </div>
              </div>
            </header>

            <div className="wrapper body clearfix">

              <div className="event-main-page-div body clearfix">
                <Link className="event-main-page" onClick={this.props.handleBackToEvent} to="/home">
                  Main Page
                </Link>
              </div>

              <div id="add-guest" className="guestList clearfix">
                <form onSubmit={this.handleSubmitAddFriend} action="">
                  <label className="add-new-friend-label" htmlFor="add-new-friend">
                    Add New Guest
                  </label>
                  <input
                    id={"add-new-friend"}
                    value={this.state.inputValue}
                    onChange={this.handleChangeAddFriend}
                    type="text"
                    autoComplete="off"
                    className="add-new-friend-input"
                  />
                  <button className="add-friend-button" onClick={this.handleClickAddFriend}>
                    Add
                  </button>
                </form>
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
                            <li key={i} className="guest clearfix">
                              {/* Edit the guests restrictions */}
                              <p>{friend.name}</p>

                              {/* Fake button to make it clear you can click on the guest to edit them */}
                              <div className="fakeButton">
                                {/* <h2 > */}
                                <i id={friend.name} onClick={this.props.selectFriend} className="fas fa-user-edit" />
                                {/* </h2> */}
                              </div>

                              {/* Removes guest from the event */}
                              <button
                                className="remove-friend-button"
                                id={friend.name}
                                onClick={this.removeFriendFromEvent}
                              >
                                <i className="fas fa-times" />
                              </button>
                            </li>
                          );
                        }
                      })
                    : null}
                </ul>
                <Link to="existing-guest-list">Add Existing Guest</Link>

                {/* <form onSubmit={this.handleSubmitAddFriend} action="">
                  <label className="add-new-friend-label" htmlFor="add-new-friend">
                    Add New Guest
                  </label>
                  <input
                    id={"add-new-friend"}
                    value={this.state.inputValue}
                    onChange={this.handleChangeAddFriend}
                    type="text"
                    autoComplete="off"
                    className="add-new-friend-input"
                  />
                  <button className="add-friend-button" onClick={this.handleClickAddFriend}>
                    Add
                  </button>
                </form> */}
              </div>

              {this.checkCurrentEventForGuests() === true ? (
                <div id="display-matching-recipes">
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
