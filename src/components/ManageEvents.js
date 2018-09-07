import React, { Component } from "react";
import firebase from "firebase";
import { Link } from "react-router-dom";

class ManageEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
      confirmedEventName: "",
      userProfileParties: props.userProfile.parties
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
    let tempArr = this.state.userProfileParties;
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
      <section className="manage-events">
        <h1>MANAGE EVENTS</h1>

        {/* DISPLAY LIST OF PARTIES */}
        {this.state.userProfileParties !== null &&
        this.state.userProfileParties !== undefined
          ? this.state.userProfileParties.map((party, i) => {
              return (
                <div key={i}>
                  <h2>{party.title}</h2>
                  <button onClick={() => this.deleteEvent(i)}>
                    DELETE EVENT
                  </button>
                </div>
              );
            })
          : null}

        <form onSubmit={this.handleSubmitManageEvents} action="">
          <label htmlFor="new-event">Add New Event</label>
          <input
            onChange={this.handleChangeManageEvents}
            id="new-event"
            type="text"
          />
          <button onClick={this.handleClickManageEvents}>SUBMIT</button>
        </form>

        <Link to="/Overview">Back to Overview</Link>
      </section>
    );
  }

  componentDidMount() {
    if (this.state.userProfileParties !== null) {
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
