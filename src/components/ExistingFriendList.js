import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase from "firebase";
import _ from "lodash";

class ExistingFriendList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
      selectedEvent: props.userProfile.parties[props.selectedEventIndex].title,
      key: null
    };
    this.dbRef = firebase.database().ref(`${this.props.userProfile.id}/friends`);
  }

  // Handle Submit of toggling friends from event
  handleSubmit = e => {
    e.preventDefault();
  };

  // Save current friend index
  saveCurrentFriendIndex = e => {
    this.setState({
      key: e.target.id
    });
  };

  // Function for toggling friend directly into firebase
  toggleFriend = e => {
    let tempArr = this.props.userProfile.friends;
    let friendIndex = _.findIndex(this.props.userProfile.friends, ["name", e.target.value]);

    // create copy of current friend profile
    let friendProfile = tempArr[friendIndex];

    if (!friendProfile.parties) {
      friendProfile.parties = [];
    }

    // the friend should be added to the party if newly checked
    if (e.target.checked === true) {
      friendProfile.parties.push(this.state.selectedEvent);

      this.dbRef.child(`/${friendIndex}`).set(friendProfile);
    }
    // else, remove party from parties array of friend
    else {
      friendProfile.parties.splice(friendProfile.parties.indexOf(e.target.value), 1);
      this.dbRef.child(`/${friendIndex}`).set(friendProfile);
    }
  };

  render() {
    return (
      <section className="manage-friends">
        <h1>FRIENDS</h1>
        <form action="" onSubmit={this.handleSubmit}>
          {this.props.userProfile.friends.map((friend, i) => {
            if (friend.parties && friend.parties.indexOf(this.state.selectedEvent) !== -1) {
              return (
                <div key={i} className="single-friend">
                  <input onClick={this.toggleFriend} id={i} value={friend.name} type="checkbox" defaultChecked />
                  <label htmlFor={i}>{friend.name}</label>
                </div>
              );
            } else {
              return (
                <div key={i} className="single-friend">
                  <input onClick={this.toggleFriend} id={i} value={friend.name} type="checkbox" />
                  <label htmlFor={i}>{friend.name}</label>
                </div>
              );
            }
          })}
        </form>

        <Link to="/event">Back to Event</Link>
      </section>
    );
  }
}

export default ExistingFriendList;
