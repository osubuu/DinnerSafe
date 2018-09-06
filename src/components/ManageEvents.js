import React, { Component } from "react";
import firebase from "firebase";

class ManageEvents extends Component {
  constructor() {
    super();
    this.state = {
      inputValue: "",
      confirmedEventName: "",
      userProfileParties: null
    };
  }

  handleChangeManageEvents = e => {
    this.setState({
      inputValue: e.target.value
    });
  };

  // Handling for click of either sign in or create buttons
  handleClickManageEvents = e => {
    this.setState({
      confirmedEventName: this.state.inputValue
    });
  };

  // Handling for form submit
  handleSubmitManageEvents = e => {
    e.preventDefault();

    // create new event object, because the firebase parties array holds objects of each event
    let newEventObj = {
      title: this.state.confirmedEventName,
      recipes: []
    };

    // create temp array (clone of current firebase parties array) and add new object to it
    let tempArr = this.props.userProfile.parties;
    tempArr.push(newEventObj);

    // replace the firebase array with the newly updated array
    firebase
      .database()
      .ref(`${this.props.userProfile.id}/parties`)
      .set(tempArr);

    console.log(tempArr);
  };

  // delete parties
  deleteEvent = key => {
    console.log(key);

    let tempArr = this.state.userProfileParties;
    tempArr.splice(key, 1);

    const dbRef = firebase
      .database()
      .ref(`${this.props.userProfile.id}/parties`);

    dbRef.set(tempArr);
  };

  render() {
    return (
      <div className="manage-events">
        <h1>MANAGE EVENTS</h1>
        <h2>Add Event</h2>

        {/* DISPLAY LIST OF PARTIES */}
        {this.state.userProfileParties !== null &&
        this.state.userProfileParties !== undefined
          ? this.state.userProfileParties.map((party, i) => {
              return (
                <h2 key={i} onClick={() => this.deleteEvent(i)}>
                  {party.title}
                </h2>
              );
            })
          : null}

        <form onSubmit={this.handleSubmitManageEvents} action="">
          <label htmlFor="new-event" />
          <input
            onChange={this.handleChangeManageEvents}
            id="new-event"
            type="text"
          />
          <button onClick={this.handleClickManageEvents}>SUBMIT</button>
        </form>
      </div>
    );
  }

  componentDidMount() {
    // assign to the userProfileParties state the original party from the App.js parent
    if (this.props.userProfile !== null) {
      this.setState({
        userProfileParties: this.props.userProfile.parties
      });

      // if there are any changes in the firebase array of parties for the user, update the userProfileParties state
      let dbRef = firebase
        .database()
        .ref(`${this.props.userProfile.id}/parties`);
      dbRef.on("value", snapshot => {
        this.setState({
          userProfileParties: snapshot.val()
        });
      });
    }
  }
}

export default ManageEvents;
