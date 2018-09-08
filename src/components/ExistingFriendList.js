import React, { Component } from "react";
import { Link, Route, Redirect } from "react-router-dom";
import firebase from "firebase";
import EditFriend from "./EditFriend";

class ExistingFriendList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
      selectedEventIndex: props.selectedEventIndex,
      userProfileFriends: props.userProfile.friends,
      key: null
    };
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

  render() {
    return (
      <section className="manage-friends">
        <h1>FRIENDS</h1>
        <form action="" onSubmit={this.handleSubmit}>
          {this.state.userProfileFriends.map((friend, i) => {
            if (
              friend ===
              this.props.userProfile.parties[this.selectedEventIndex].name
            ) {
              return (
                <div key={i} className="single-friend">
                  <input id={i} type="checkbox" checked />
                  <label htmlFor={i}>{friend.name}</label>
                </div>
              );
            } else {
              return (
                <div key={i} className="single-friend">
                  <input id={i} type="checkbox" />
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
    if (this.state.userProfileFriends !== null) {
      // if there are any changes in the firebase array of parties for the user, update the userProfileParties state
      let dbRef = firebase
        .database()
        .ref(`${this.props.userProfile.id}/friends`);
      dbRef.on("value", snapshot => {
        this.setState({ userProfileFriends: snapshot.val() });
      });
    }
  }
}

{
  /* <ul className="friend-allergies">
                  <h3>Allergies</h3>
                  {friend.allowedAllergy.map(allergy => {
                    return <li>{allergy}</li>;
                  })}
                </ul>

                <ul className="friend-diets">
                  <h3>Diets</h3>
                  {friend.allowedDiet.map(diet => {
                    return <li>{diet}</li>;
                  })}
                </ul>

                <ul className="friend-restricted-ingredients">
                  <h3>Restricted Ingredients</h3>
                  {friend.excludedIngredient.map(ingredient => {
                    return <li>{ingredient}</li>;
                  })}
                </ul>*/
}

{
  /* <button id={i} onClick={this.saveCurrentFriendIndex}>
                  EDIT FRIEND
                </button> */
}

export default ExistingFriendList;
