import React, { Component } from "react";
import { Link, Route, Redirect } from "react-router-dom";
import firebase from "firebase";
import _ from "lodash";

class ExistingFriendList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
      selectedEvent: props.userProfile.parties[props.selectedEventIndex].title,
      userProfileFriends: props.userProfile.friends,
      key: null
    };
    this.dbRef = firebase.database().ref(`${this.props.userProfile.id}/friends`);
  }

  handleSubmit = e => {
    e.preventDefault();
  };

  saveCurrentFriendIndex = e => {
    console.log(e.target);
    this.setState({
      key: e.target.id
    });
  };

  toggleFriend = e => {
    let tempArr = this.state.userProfileFriends;
    let friendIndex = _.findIndex(this.state.userProfileFriends, ["name", e.target.value]);

    tempArr = tempArr[friendIndex].parties;

    // the friend should be added to the party if newly checked
    if (e.target.checked === true) {
      tempArr.push(this.state.selectedEvent);

      this.dbRef.child(`/${friendIndex}/parties`).set(tempArr);
    }
    // else, remove party from parties array of friend
    else {
      tempArr.splice(tempArr.indexOf(e.target.value), 1);
      this.dbRef.child(`/${friendIndex}/parties`).set(tempArr);
    }
  };

  render() {
    return (
      <section className="manage-friends">
        <h1>FRIENDS</h1>
        <form action="" onSubmit={this.handleSubmit}>
          {this.state.userProfileFriends.map((friend, i) => {
            if (friend.parties.indexOf(this.state.selectedEvent) !== -1 && friend.parties !== undefined) {
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

  componentDidMount() {
    if (this.state.userProfileFriends) {
      this.dbRef.on("value", snapshot => {
        this.setState({ userProfileFriends: snapshot.val() });
      });
    }
  }
}

export default ExistingFriendList;
