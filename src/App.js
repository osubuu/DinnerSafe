import React, { Component } from "react";
import "./App.css";
import firebase from "./firebase";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import _ from "lodash";

//COMPONENTS//

import EventPage from "./components/EventPage/EventPage";
import OverviewPage from "./components/OverviewPage";
import EditFriend from "./components/EditFriend";

// FUNCTIONS
import matchingRecipes from "./components/matchingRecipes";

//COMPONENTS
import DisplayMatchingRecipes from "./components/DisplayMatchingRecipes/DisplayMatchingRecipes";
import ExistingFriendList from "./components/ExistingFriendList";
import { timingSafeEqual } from "crypto";

const dbRef = firebase.database().ref();

/* ===================
TEST STUFF BELOW THAT CAN BE DELETED WHEN DONE
==================== */
let user = "Christine";
let friends = [
  {
    name: "Stefan",
    allowedAllergy: ["393^Gluten-Free", "394^Peanut-Free"],
    allowedDiet: ["388^Lacto vegetarian", "389^Ovo vegetarian"],
    excludedIngredient: ["Peanut", "Banana"],
    parties: ["sept3"]
  },
  {
    name: "Ben",
    allowedAllergy: ["400^Soy-Free", "395^Tree Nut-Free"],
    allowedDiet: ["387^Lacto-ovo vegetarian", "403^Paleo"],
    excludedIngredient: ["Arugula", "Bread"],
    parties: ["sept3", "nov1"]
  }
];

let parties = [
  {
    title: "sept3",
    recipes: []
  },
  {
    title: "nov1",
    recipes: []
  }
];

// let newkey = dbRef.push(user).key;
// dbRef.child(newkey).set({ user, friends, parties });

/* ===================
TEST STUFF ABOVE THAT CAN BE DELETED WHEN DONE
==================== */

class App extends Component {
  constructor() {
    super();
    this.state = {
      userProfile: null,
      selectedEventIndex: null,
      selectedFriend: null,
      loggedIn: false,
      // // Test user profile so that there is already a userprofile when DisplayMatchingRecipes mounts
      // userProfile: {
      //   parties: [
      //     {title: "sept3"},
      //     {title: "nov1"}
      //   ],
      //   friends: [
      //     {
      //       allowedAllergy: ["393^Gluten-Free", "394^Peanut-Free"],
      //       allowedDiet: ["388^Lacto vegetarian", "389^Ovo vegetarian"],
      //       excludedIngredient: ["Peanut", "Banana"],
      //       parties: ["sept3"]
      //     },
      //     {
      //       allowedAllergy: ["400^Soy-Free", "395^Tree Nut-Free"],
      //       allowedDiet: ["387^Lacto-ovo vegetarian", "403^Paleo"],
      //       excludedIngredient: ["Arugala", "Bread"],
      //       parties: ["sept3", "nov1"]
      //     }
      //   ]
      // },
      user: "",
      currentTextValue: "",
      loginPurpose: "",
      key: ""
    };
  }

  // // this.state.dietaryRestrictions object format
  // {
  //   allergies: [],
  //   diets: [],
  //   excludeIngredients: []
  // }
  // // Examples
  // // Example 1
  // {
  //   allergies: ["394^Peanut-Free", "396^Dairy-Free"],
  //   diets: ["390^Pescetarian"],
  //   excludeIngredients: ["tomato", "arugala", "peach"]
  // }
  // // Example 2 - all arrays are optional
  // {
  //   allergies: [],
  //   diets: ["390^Pescetarian"],
  //   excludeIngredients: []
  // }

  // Function for create button
  checkIfUserExists = snapshot => {
    // if userInput is blank, leave the function
    if (this.state.user.length === 0) {
      return;
    }

    let counter = 0;
    let currentInfoFromFirebase = Object.values(snapshot);
    // console.log(currentInfoFromFirebase);

    currentInfoFromFirebase.map(userObject => {
      console.log(userObject);
      // If the user input is found within the current firebase and the user clicked "CREATE", reset user state to "" so nothing displays
      if (
        this.state.loginPurpose === "create" &&
        userObject.user === this.state.user
      ) {
        this.setState({
          user: "",
          userProfile: null
        });
        alert(
          "Name already exists. Please create an account with another name."
        );
        return;
      }

      // when person is found
      if (
        this.state.loginPurpose === "sign-in" &&
        userObject.user === this.state.user
      ) {
        this.setState({ userProfile: userObject, loggedIn: true });
        return;
      }

      // If the user input is not found within the current firebase object, increment the counter by 1
      if (userObject.user !== this.state.user) {
        counter++;
      }

      // If this conditional is true, then the userInput does not exist yet and will be added to firebase
      if (counter === currentInfoFromFirebase.length) {
        let user = this.state.user;
        let friends = [];
        let parties = [];

        // if user clicked create button, create new user on firebase
        if (this.state.loginPurpose === "create") {
          let id = dbRef.push(this.state.user).key;
          dbRef.child(id).set({ user, friends, parties, id });

          this.setState({
            userProfile: { user: this.state.user }
          });
        } else {
          alert("You should create an account!");
          this.setState({ user: "", userProfile: null });
        }
      }
    });
  };

  // Handling for form submit
  handleSubmitLogin = e => {
    e.preventDefault();
    // e.target.reset();

    //create user on firebase
    this.setState(
      {
        user: this.state.currentTextValue.trim().toLowerCase()
      },
      () => {
        // dbRef.remove();
        dbRef.once("value", snapshot => {
          // console.log(snapshot.val());
          this.checkIfUserExists(snapshot.val());
        });
      }
    );
  };

  // Handling for text input
  handleChangeLogin = e => {
    this.setState({
      currentTextValue: e.target.value
    });
  };

  // Handling for click of either sign in or create buttons
  handleClickLogin = e => {
    this.setState({
      loginPurpose: e.target.value
    });
  };

  handleLogout = e => {
    this.setState({
      userProfile: null,
      selectedEventIndex: null,
      selectedFriend: null,
      loggedIn: false,
      user: "",
      currentTextValue: "",
      loginPurpose: "",
      key: ""
    });
  };

  selectEvent = e => {
    console.log(e.target.id);
    this.setState({
      selectedEventIndex: Number(e.target.id)
    });
  };

  singleEvent = () => {
    return (
      <EventPage
        userProfile={this.state.userProfile}
        selectedEvent={
          this.state.userProfile.parties[this.state.selectedEventIndex]
        }
        handleBackToOverview={this.handleBackToOverview}
        selectFriend={this.selectFriend}
      />
    );
  };

  handleBackToOverview = e => {
    this.setState({
      selectedEventIndex: null
    });
  };

  handleBackToEvent = e => {
    this.setState({
      selectedFriend: null
    });
  };

  selectFriend = e => {
    this.setState(
      {
        selectedFriend: e.target.id
      },
      () => {
        let friendProfile = this.state.userProfile.friends[
          _.findIndex(this.state.userProfile.friends, [
            "name",
            this.state.selectedFriend
          ])
        ];
        console.log(friendProfile);
      }
    );
  };

  render() {
    return (
      <Router>
        <div className="App">
          {/* Current router setup is possibly just a placeholder.
          /// Making sure it's not visible when hitting other pages of the site.
          /// decide if we should make the login page into a component?   */}
          <Route
            exact
            path="/"
            render={() => {
              return (
                <section className="log-in-page">
                  <div className="wrapper">
                    {/* FIRST PAGE: USER LOGIN */}
                    <h1 className="app-name">DinnerSafe</h1>
                    <h2 className="app-name-sub-header">Party guests with allergies and diet restictions?</h2>
                    <h2 className="app-name-sub-header">Find recipes that everyone can eat!</h2>
                    <form
                      className="log-in-form clearfix"
                      action=""
                      onSubmit={this.handleSubmitLogin}
                    >
                      <label className="username" htmlFor="create-user">
                        Username
                      </label>

                      <input
                        className="log-in-text-input"
                        onChange={this.handleChangeLogin}
                        id="create-user"
                        type="text"
                      />

                      <div className="buttons clearfix">
                        <button
                          className="left"
                          value="sign-in"
                          onClick={this.handleClickLogin}
                        >
                          SIGN IN
                        </button>
                        <button
                          className="right"
                          value="create"
                          onClick={this.handleClickLogin}
                        >
                          CREATE
                        </button>
                      </div>
                    </form>
                  </div>
                </section>
              );
            }}
          />

          {/* <Route exact path="/event" render={this.singleEvent} /> */}

          <Route
            path="/"
            render={() => {
              return this.state.userProfile !== null ? (
                <Redirect to="/overview" />
              ) : null;
            }}
          />

          {/* OVERVIEW PAGE */}
          <Route
            path="/overview"
            render={props => (
              <OverviewPage
                {...props}
                userProfile={this.state.userProfile}
                handleLogout={this.handleLogout}
                selectEvent={this.selectEvent}
              />
            )}
          />

          <Route
            path="/"
            render={() => {
              return this.state.selectedEventIndex !== null ? (
                <Redirect to="/event" />
              ) : null;
            }}
          />

          {/* SINGLE EVENT PAGE */}
          <Route path="/event" render={this.singleEvent} />

          <Route
            path="/event"
            render={() => {
              return this.state.selectedFriend !== null ? (
                <Redirect to="/edit-friend" />
              ) : null;
            }}
          />

          {/* EDIT FRIEND PAGE */}
          <Route
            path="/edit-friend"
            render={props => (
              <EditFriend
                {...props}
                friendProfile={
                  this.state.userProfile.friends[
                    _.findIndex(this.state.userProfile.friends, [
                      "name",
                      this.state.selectedFriend
                    ])
                  ]
                }
                friendKey={_.findIndex(this.state.userProfile.friends, [
                  "name",
                  this.state.selectedFriend
                ])}
                userID={this.state.userProfile.id}
                handleBackToEvent={this.handleBackToEvent}
              />
            )}
          />

          {/* ADD EXISTING FRIEND */}
          <Route
            path="/existing-friend-list"
            render={props => (
              <ExistingFriendList
                {...props}
                userProfile={this.state.userProfile}
                selectedEventIndex={this.state.selectedEventIndex}
              />
            )}
          />

          {/* <Route
            path="/manage-events"
            render={props => (
              <ManageEvents {...props} userProfile={this.state.userProfile} />
            )}
          /> */}
        </div>
      </Router>
    );
  }

  componentDidMount() {}
}

export default App;
