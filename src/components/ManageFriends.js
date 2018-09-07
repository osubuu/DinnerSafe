import React, { Component } from "react";
import TableRow from "./TableRow.js";
import { Link } from "react-router-dom";
import firebase from "firebase";

class ManageFriends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
      confirmedEventName: "",
      userProfileFriends: props.userProfile.friends
    };
  }

  render() {
    return (
      <section class="manage-friends">
        <h1>FRIENDS</h1>
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>Friend</th>
                <th>Allergies</th>
                <th>Diets</th>
                <th>Restricted Ingredients</th>
                <th>Events</th>
              </tr>
            </thead>
            <tbody>
              {this.state.userProfileFriends.map(friend => {
                return <TableRow friendData={friend} />;
              })}

              {/* props.rows.map(Row => {
                return (
                  <TableRow
                    key={Row.key}
                    deleteRow={props.deleteRow}
                    rowData={Row}
                    pushToFirebase={props.pushToFirebase}
                    categories={props.categories}
                  />
                );
              } */}
            </tbody>
          </table>
        </div>
        <button className="add-row">Add Row</button>
        <Link to="/Overview">Back to Overview</Link>
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

export default ManageFriends;
