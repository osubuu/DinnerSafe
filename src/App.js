import React, { Component } from "react";
import "./App.css";
import firebase from "./firebase";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import _ from "lodash";
import swal from "sweetalert2";

//COMPONENTS//

import EventPage from "./components/EventPage/EventPage";
import OverviewPage from "./components/OverviewPage";
import EditFriend from "./components/EditFriend";

//COMPONENTS
import ExistingFriendList from "./components/ExistingFriendList";

const dbRef = firebase.database().ref();
const provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();

class App extends Component {
  constructor() {
    super();
    this.state = {
      userProfile: null,
      selectedEventIndex: null,
      selectedFriend: null,
      loggedIn: false,
      user: "",
      currentTextValue: "",
      loginPurpose: "",
      key: "",
      savedRecipes: []
    };
  }

  toggleRecipe = (recipeObj, action) => {
    let tempArr = this.state.savedRecipes;

    // if user is saving the recipe
    if (action === "save") {
      // if recipe to be saved is already in saved recipes
      if (_.findIndex(tempArr, ["id", recipeObj.id]) !== -1) {
        swal({ type: "warning", title: "Recipe already saved!" });
        return;
      } else {
        // add recipe to temporary recipes array
        tempArr.push(recipeObj);

        // create copy of current party object
        let currentUserParty = this.state.userProfile.parties[this.state.selectedEventIndex];

        // if there are no saved recipes yet, initialize one
        if (!currentUserParty.savedRecipes) {
          currentUserParty.savedRecipes = [];
        }

        currentUserParty.savedRecipes = tempArr;

        // put new array of saved recipes to firebase
        dbRef.child(`${this.state.key}/parties/${this.state.selectedEventIndex}`).set(currentUserParty);
      }
    }
    // if user wishes to remove the saved recipe
    else {
      // remove recipe from array
      tempArr.splice(_.findIndex(tempArr, ["id", recipeObj.id]), 1);

      // create copy of current party object and update it
      let currentUserParty = this.state.userProfile.parties[this.state.selectedEventIndex];
      currentUserParty.savedRecipes = tempArr;

      // send updated copy to firebase
      dbRef.child(`${this.state.key}/parties/${this.state.selectedEventIndex}`).set(currentUserParty);
    }
  };

  // Function for create button
  checkIfUserExists = snapshot => {
    // error handling (if there is no user state)
    if (!this.state.user) {
      return;
    }

    let counter = 0;
    let currentInfoFromFirebase = Object.values(snapshot);

    currentInfoFromFirebase.map(userObject => {
      // when the current person is found
      if (userObject.user === this.state.user) {
        this.setState({
          userProfile: userObject,
          loggedIn: true,
          key: userObject.id
        });
        return;
      } else {
        // If the user input is not found within the current firebase object, increment the counter by 1
        counter++;

        // If this conditional is true, then the user does not exist yet and will be created and added to firebase
        if (this.state.loginPurpose !== "create" && counter === currentInfoFromFirebase.length) {
          let user = this.state.user;
          let friends = [{ name: this.state.user }];
          let parties = [];

          this.setState(
            {
              loginPurpose: "create"
            },
            () => {
              // push new account to firebase
              let id = dbRef.push(this.state.user).key;
              dbRef.child(id).set({ user, friends, parties, id });
            }
          );
        }
      }
    });
  };

  // Handling for form submit
  handleSubmitLogin = e => {
    e.preventDefault();

    // if user is logging in with GMAIL
    if (this.state.loginPurpose === "sign-in") {
      auth.signInWithPopup(provider).then(res => {
        //set user state to gmail display name
        this.setState({ user: res.user.displayName }, () => {
          dbRef.on("value", snapshot => {
            this.checkIfUserExists(snapshot.val());
          });
        });
      });
    }
    // if user is signing in as guest or demo
    else {
      auth.signInAnonymously().then(res => {
        let userName = "Demo";

        // if guest account, reset guest account everytime
        if (this.state.loginPurpose === "guest") {
          userName = "Guest";
          dbRef.child("default").set({
            id: "default",
            user: "Guest",
            friends: [{ name: "Guest" }]
          });
        }

        this.setState({ user: userName }, () => {
          dbRef.on("value", snapshot => {
            this.checkIfUserExists(snapshot.val());
          });
        });
      });
    }
  };

  // Handling for click of either sign in or create buttons
  handleClickLogin = e => {
    this.setState({
      loginPurpose: e.target.value
    });
  };

  // Reset stats back to default when logged out
  handleLogout = e => {
    auth.signOut().then(res => {
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
      dbRef.off();
    });
  };

  // Set state for selecting an event (used in overview page)
  selectEvent = e => {
    this.setState(
      {
        selectedEventIndex: Number(e.target.id)
      },
      () => {
        if (this.state.userProfile.parties[this.state.selectedEventIndex].savedRecipes) {
          this.setState({
            savedRecipes: this.state.userProfile.parties[this.state.selectedEventIndex].savedRecipes
          });
        }
      }
    );
  };

  // Function with props for the single event page
  // singleEvent = () => {
  //   return (
  //     <EventPage
  //       userProfile={this.state.userProfile}
  //       selectedEvent={this.state.userProfile.parties[this.state.selectedEventIndex]}
  //       handleBackToOverview={this.handleBackToOverview}
  //       selectFriend={this.selectFriend}
  //       handleLogout={this.handleLogout}
  //       toggleRecipe={this.toggleRecipe}
  //       savedRecipes={this.state.savedRecipes}
  //     />
  //   );
  // };

  // Handler for going back to the main page from the single event page
  handleBackToOverview = e => {
    this.setState({
      selectedEventIndex: null
    });
  };

  // Handler for going back to event page from editing a friend (used in edit friend)
  handleBackToEvent = e => {
    this.setState({
      selectedFriend: null
    });
  };

  // Set state for selecting a friend (used in Event Page)
  selectFriend = e => {
    this.setState({
      selectedFriend: e.target.id
    });
  };

  getFriendProfile = () => {
    if (this.state.userProfile) {
      return this.state.userProfile.friends[
        _.findIndex(this.state.userProfile.friends, ["name", this.state.selectedFriend])
      ];
    } else {
      return null;
    }
  };

  getFriendKey = () => {
    if (this.state.userProfile) {
      return _.findIndex(this.state.userProfile.friends, ["name", this.state.selectedFriend]);
    } else {
      return null;
    }
  };

  render() {
    return (
      <Router>
        <div className="App">
          <Redirect from="*" to="/" />
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
                    <h1 className="app-name">DinnerSafe</h1>
                    <h2 className="app-name-sub-header">Party guests with allergies and diet restrictions?</h2>
                    <h2 className="app-name-sub-header">Find recipes that everyone can eat!</h2>
                    <form className="log-in-form clearfix" action="" onSubmit={this.handleSubmitLogin}>
                      <div className="buttons clearfix">
                        <button className="log-in-page-button sign-in-create" value="sign-in" onClick={this.handleClickLogin}>
                          Sign In / Create Account <i class="fab fa-google"></i>
                        </button>
                        <button className="log-in-page-button guest" onClick={this.handleClickLogin} value="guest">
                          Continue as Guest
                        </button>
                        <button className="log-in-page-button" onClick={this.handleClickLogin} value="demo">
                          Demo
                        </button>
                      </div>
                    </form>
                  </div>
                </section>
              );
            }}
          />

          {/* REDIRECT FOR OVERVIEW PAGE: wait for userProfile to be ready */}
          <Route
            path="/"
            render={() => {
              return this.state.userProfile && this.state.loggedIn === true && this.state.key ? (
                <Redirect to="/home" />
              ) : null;
            }}
          />

          {/* OVERVIEW PAGE */}
          <Route
            path="/home"
            render={props => (
              <OverviewPage
                {...props}
                userProfile={this.state.userProfile}
                handleLogout={this.handleLogout}
                selectEvent={this.selectEvent}
                userID={this.state.key}
              />
            )}
          />

          {/* REDIRECT FOR SINGLE EVENT PAGE ROUTE: wait for selected event index to be ready */}
          <Route
            // exact
            path="/home"
            render={() => {
              return this.state.selectedEventIndex ? <Redirect to="/event" /> : null;
            }}
          />

          {/* SINGLE EVENT PAGE ROUTE */}
          {/* <Route path="/event" render={this.singleEvent} /> */}
          <Route
            path="/event"
            render={props => (
              <EventPage
                {...props}
                userProfile={this.state.userProfile}
                // selectedEvent={this.state.userProfile.parties[this.state.selectedEventIndex]}
                selectedEventIndex={this.state.selectedEventIndex}
                handleBackToOverview={this.handleBackToOverview}
                selectFriend={this.selectFriend}
                handleLogout={this.handleLogout}
                toggleRecipe={this.toggleRecipe}
                savedRecipes={this.state.savedRecipes}
              />
            )}
          />

          {/* REDIRECT FOR EDIT FRIEND ROUTE: wait for selected friend state to be ready*/}
          <Route
            path="/event"
            render={() => {
              return this.state.selectedFriend ? <Redirect to="/edit-guest" /> : null;
            }}
          />

          {/* EDIT FRIEND PAGE ROUTE */}
          <Route
            path="/edit-guest"
            render={props => (
              <EditFriend
                {...props}
                // friendProfile={
                //   this.state.userProfile.friends[
                //     _.findIndex(this.state.userProfile.friends, ["name", this.state.selectedFriend])
                //   ]
                // }
                friendProfile={this.getFriendProfile()}
                // friendKey={_.findIndex(this.state.userProfile.friends, ["name", this.state.selectedFriend])}
                friendKey={this.getFriendKey()}
                userID={this.state.key}
                handleBackToEvent={this.handleBackToEvent}
              />
            )}
          />

          {/* ADD EXISTING GUEST ROUTE */}
          <Route
            path="/existing-guest-list"
            render={props => (
              <ExistingFriendList
                {...props}
                userProfile={this.state.userProfile}
                selectedEventIndex={this.state.selectedEventIndex}
              />
            )}
          />
        </div>
      </Router>
    );
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      // if previous user had an email (i.e not a guest/demo), automatically log-in
      if (user.emailVerified === true) {
        this.setState({ user: user.displayName, loginPurpose: "sign-in" }, () => {
          dbRef.on("value", snapshot => {
            this.checkIfUserExists(snapshot.val());
          });
        });
      }
    });
  }
}

export default App;
