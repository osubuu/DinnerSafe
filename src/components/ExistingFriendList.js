import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import firebase from "firebase";
import _ from "lodash";
import swal from "sweetalert2";
import Header from "./Header";

class ExistingFriendList extends Component {
  constructor(props) {
    super(props);
    if (props.userProfile) {
      this.state = {
        inputValue: "",
        selectedEvent: props.userProfile.parties[props.selectedEventIndex].title,
        key: null
      };
      this.dbRef = firebase.database().ref(`${this.props.userProfile.id}/friends`);
    } else {
      props.getRedirected(true);
    }
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

  // Function to delete friend permanently
  deleteFriend = friendName => {
    swal({
      type: "warning",
      title: "Are you sure?",
      text: "This will remove your friend permanently from all your events and from your existing friend list. ",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(result => {
      if (result.value) {
        swal("Removed!", "Your friend has been removed.", "success");
        let tempArr = this.props.userProfile.friends;
        console.log(tempArr);

        let indexPosition = _.findIndex(this.props.userProfile.friends, ["name", friendName]);

        tempArr.splice(indexPosition, 1);
        console.log(tempArr);

        this.dbRef.set(tempArr);
      }
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
      <div>
        <Header user={this.props.userProfile.user} handleLogout={this.props.handleLogout} />

        {this.props.userProfile ? (
          <div>
            <div className="edit-all-guests-subheader">
              <div className="wrapper clearfix edit-all-guests-sub-subheader">
                <h2 className="edit-all-guests-title">Contact List</h2>

                <div className="edit-guest-save-div clearfix">
                  <Link className="edit-all-guests-save" onClick={this.props.handleBackToEvent} to="/event">
                    Save and Return to Event
                  </Link>
                </div>
              </div>
            </div>
              
            <div className="wrapper">
              <section className="manage-friends">
                <h3 className="edit-all-guests-section-header">Add and Remove Guests</h3>
                <form className="edit-all-guests-form clearfix" action="" onSubmit={this.handleSubmit}>
                  {this.props.userProfile.friends.map((friend, i) => {
                    if (friend.parties && friend.parties.indexOf(this.state.selectedEvent) !== -1) {
                      return (
                        <div key={i} className="single-friend">
                          <input onClick={this.toggleFriend} id={i} value={friend.name} type="checkbox" defaultChecked />
                          <label htmlFor={i}><div className="stylish-checkbox">
                                <i class="fas fa-check" />
                              </div>{friend.name}</label>
                          {/* {friend.name !== this.props.userProfile.user ? (
                            <button id={friend.name} onClick={() => this.deleteFriend(friend.name)}>
                              DELETE FRIEND FROM EXISTING FRIENDS
                            </button>
                          ) : null} */}
                        </div>
                      );
                    } else {
                      return (
                        <div key={i} className="single-friend">
                          <input onClick={this.toggleFriend} id={i} value={friend.name} type="checkbox" />
                          <label htmlFor={i}><div className="stylish-checkbox">
                                <i class="fas fa-check" />
                              </div>{friend.name}</label>
                          {/* {friend.name !== this.props.userProfile.user ? (
                            <button id={friend.name} onClick={() => this.deleteFriend(friend.name)}>
                              DELETE FRIEND FROM EXISTING FRIENDS
                            </button>
                          ) : null} */}
                        </div>
                      );
                    }
                  })}
                </form>

              </section>
            </div>
            {/* End of Wrapper */}

          </div>
        ) : (
          <Redirect from="/event" to="/" />
        )}
      </div>
    );
  }
}

export default ExistingFriendList;
