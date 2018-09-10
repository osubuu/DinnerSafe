import React, { Component } from "react";
import "./App.css";
import firebase from "./firebase";
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
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

// let tempObj = {
//   "-LLkJvR9qcy1G-CNtFoN": {
//     friends: [
//       {
//         allergies: ["Apple", "Bananas"],
//         name: "Pratik",
//         parties: ["sept3", "oct5"]
//       },
//       {
//         allergies: ["Grapes", "Cookies"],
//         name: "Junior",
//         parties: ["sept3", "oct5", "nov1"]
//       }
//     ],
//     id: "-LLkJvR9qcy1G-CNtFoN",
//     parties: [
//       {
//         recipes: ["Pie", "McDonald's"],
//         title: "sept3"
//       },
//       {
//         recipes: ["Peanut", "Pizza"],
//         title: "oct5"
//       },
//       {
//         recipes: ["Candy", "Dog Food"],
//         title: "nov1"
//       }
//     ],
//     user: "david"
//   },
//   "-LLkJyagyBPDPH2v_ELC": {
//     friends: [
//       {
//         allergies: ["Apple", "Bananas"],
//         name: "Pratik",
//         parties: ["sept3", "oct5"]
//       },
//       {
//         allergies: ["Grapes", "Cookies"],
//         name: "Junior",
//         parties: ["sept3", "oct5", "nov1"]
//       }
//     ],
//     id: "-LLkJyagyBPDPH2v_ELC",
//     parties: [
//       {
//         recipes: ["Pie", "McDonald's"],
//         title: "sept3"
//       },
//       {
//         title: "dec20"
//       },
//       {
//         title: "jan18"
//       },
//       {
//         title: "nov3"
//       }
//     ],
//     user: "jeff"
//   },
//   "-LLkK6EFr-U7nnArv6Bu": {
//     friends: [
//       {
//         allergies: ["Apple", "Bananas"],
//         name: "Pratik",
//         parties: ["sept3"]
//       },
//       {
//         allergies: ["Grapes", "Cookies"],
//         name: "Junior",
//         parties: ["sept3", "nov1"]
//       }
//     ],
//     id: "-LLkK6EFr-U7nnArv6Bu",
//     parties: [
//       {
//         recipes: ["Pie", "McDonald's"],
//         title: "sept3"
//       },
//       {
//         recipes: ["Candy", "Dog Food"],
//         title: "nov1"
//       }
//     ],
//     user: "nicole"
//   },
//   "-LLkMs39ouY20thDZdDK": {
//     id: "-LLkMs39ouY20thDZdDK",
//     user: "pratik"
//   },
//   "-LLkxQeHIEKxdNL6XjfB": {
//     friends: [
//       {
//         allowedAllergy: [null, "394^Peanut-Free"],
//         allowedDiet: [null, "389^Ovo vegetarian"],
//         excludedIngredient: [null, "Banana"],
//         name: "Stefan",
//         parties: ["sept3"]
//       },
//       {
//         allowedDiet: [null, "403^Paleo"],
//         excludedIngredient: ["Arugula", "garlic"],
//         name: "Ben",
//         parties: ["sept3", "nov1"]
//       },
//       {
//         name: "Duck",
//         parties: ["sept3"]
//       },
//       {
//         name: "Rubber Duck",
//         parties: ["sept3"]
//       },
//       {
//         excludedIngredient: ["Cauliflower"],
//         name: "Real Duck",
//         parties: ["sept3"]
//       },
//       {
//         allowedAllergy: ["398^Seafood-Free"],
//         allowedDiet: ["403^Paleo"],
//         excludedIngredient: ["Arugala", "Cauliflower"],
//         name: "Donald Duck"
//       }
//     ],
//     id: "-LLkxQeHIEKxdNL6XjfB",
//     parties: [
//       {
//         title: "sept3"
//       },
//       {
//         title: "nov1"
//       },
//       {
//         title: "this is a new test event"
//       },
//       {
//         title: "hello"
//       }
//     ],
//     user: "chris"
//   },
//   "-LLkzJf0mDz0nYtxLJK7": {
//     friends: [
//       {
//         allowedAllergy: ["393^Gluten-Free", "394^Peanut-Free"],
//         allowedDiet: ["388^Lacto vegetarian", "389^Ovo vegetarian"],
//         excludedIngredient: ["banana", "apple"],
//         name: "Jeff",
//         parties: ["nov1", "sept15"]
//       },
//       {
//         allowedAllergy: ["397^Egg-Free"],
//         allowedDiet: ["388^Lacto vegetarian"],
//         excludedIngredient: ["watermelon"],
//         name: "Shang",
//         parties: ["nov1"]
//       },
//       {
//         allowedAllergy: ["400^Soy-Free"],
//         excludedIngredient: ["strawberry"],
//         name: "Claire",
//         parties: ["nov1"]
//       },
//       {
//         allowedAllergy: ["394^Peanut-Free"],
//         excludedIngredient: ["cauliflower"],
//         name: "Rita",
//         parties: ["nov1", "sept15"]
//       },
//       {
//         allowedDiet: ["390^Pescetarian"],
//         name: "Dianna",
//         parties: ["sept15"]
//       },
//       {
//         excludedIngredient: ["fish"],
//         name: "Daniel",
//         parties: ["sept15"]
//       }
//     ],
//     id: "-LLkzJf0mDz0nYtxLJK7",
//     parties: [
//       {
//         title: "nov1"
//       },
//       {
//         title: "sept15"
//       }
//     ],
//     user: "christine"
//   },
//   default: {
//     id: "default",
//     user: "loggedOut"
//   }
// };

// dbRef.set(tempObj);

class App extends Component {
  constructor() {
    super();
    this.state = {
      // userProfile: {
      //   user: "loggedOut",
      //   id: "default"
      // },
      userProfile: null,
      selectedEventIndex: null,
      selectedFriend: null,
      loggedIn: false,
      user: "",
      currentTextValue: "",
      loginPurpose: "",
      key: "",
      signInAndLogIn: false
    };
  }

  // Function for create button
  checkIfUserExists = snapshot => {
    // if userInput is blank, leave the function
    if (this.state.user.length === 0) {
      return;
    }

    let counter = 0;
    let currentInfoFromFirebase = Object.values(snapshot);

    currentInfoFromFirebase.map(userObject => {
      // If the user input is found within the current firebase and the user clicked "CREATE", reset user state to "" so nothing displays
      if (this.state.loginPurpose === "create" && userObject.user === this.state.user) {
        this.setState({
          user: ""
        });
        swal({
          type: "warning",
          title: "User name already exists!",
          text: `Please create another user name."`
        });
        return;
      }

      // when person is found
      if (this.state.loginPurpose === "sign-in" && userObject.user === this.state.user) {
        console.log("match");

        this.setState({
          userProfile: userObject,
          loggedIn: true,
          key: userObject.id
        });
        return;
      }

      // If the user input is not found within the current firebase object, increment the counter by 1
      if (userObject.user !== this.state.user) {
        counter++;
      }

      // If this conditional is true, then the userInput does not exist yet and will be added to firebase
      if (counter === currentInfoFromFirebase.length) {
        let user = this.state.user;
        let friends = [{ name: this.state.user }];
        let parties = [];

        // if user clicked create button, create new user on firebase
        if (this.state.loginPurpose === "create") {
          console.log("creating new users");
          this.setState({ loginPurpose: "sign-in", signInAndLogIn: true }, () => {
            let id = dbRef.push(this.state.user).key;
            dbRef.child(id).set({ user, friends, parties, id });
            return;
          });
        } else if (this.state.signInAndLogIn === false) {
          swal({
            type: "warning",
            title: "User name not recognized!",
            text: `Please sign in with a correct user name."`
          });
          this.setState({ user: "" });
          console.log("warning");
        }
      }
    });
  };

  // Handling for form submit
  handleSubmitLogin = e => {
    e.preventDefault();

    auth.signInWithPopup(provider).then(res => {
      //create user on firebase
      this.setState(
        {
          // user: this.state.currentTextValue.trim().toLowerCase()
          user: res.user.displayName
        },
        () => {
          dbRef.on("value", snapshot => {
            this.checkIfUserExists(snapshot.val());
          });
        }
      );
    });
  };

  // Handling for text input of login
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

  // Reset stats back to default when logged out
  handleLogout = e => {
    auth.signOut().then(res => {
      this.setState({
        // userProfile: {
        //   user: "loggedOut",
        //   id: "default"
        // },
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
    this.setState({
      selectedEventIndex: Number(e.target.id)
    });
  };

  // Function with props for the single event page
  singleEvent = () => {
    return (
      <EventPage
        userProfile={this.state.userProfile}
        selectedEvent={this.state.userProfile.parties[this.state.selectedEventIndex]}
        handleBackToOverview={this.handleBackToOverview}
        selectFriend={this.selectFriend}
        handleLogout={this.handleLogout}
      />
    );
  };

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
                    <h1 className="app-name">DinnerSafe</h1>
                    <h2 className="app-name-sub-header">Party guests with allergies and diet restrictions?</h2>
                    <h2 className="app-name-sub-header">Find recipes that everyone can eat!</h2>
                    <form className="log-in-form clearfix" action="" onSubmit={this.handleSubmitLogin}>
                      {/* <label className="username" htmlFor="create-user">
                        Username
                      </label>

                      <input
                        className="log-in-text-input"
                        onChange={this.handleChangeLogin}
                        id="create-user"
                        type="text"
                      /> */}

                      <div className="buttons clearfix">
                        <button className="left" value="sign-in" onClick={this.handleClickLogin}>
                          SIGN IN
                        </button>
                        <button className="right" value="create" onClick={this.handleClickLogin}>
                          CREATE
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
            exact
            path="/"
            render={() => {
              return this.state.selectedEventIndex ? <Redirect to="/event" /> : null;
            }}
          />

          {/* SINGLE EVENT PAGE ROUTE */}
          <Route path="/event" render={this.singleEvent} />

          {/* REDIRECT FOR EDIT FRIEND ROUTE: wait for selected friend state to be ready*/}
          <Route
            path="/event"
            render={() => {
              return this.state.selectedFriend ? <Redirect to="/edit-friend" /> : null;
            }}
          />

          {/* EDIT FRIEND PAGE ROUTE */}
          <Route
            path="/edit-friend"
            render={props => (
              <EditFriend
                {...props}
                friendProfile={
                  this.state.userProfile.friends[
                    _.findIndex(this.state.userProfile.friends, ["name", this.state.selectedFriend])
                  ]
                }
                friendKey={_.findIndex(this.state.userProfile.friends, ["name", this.state.selectedFriend])}
                userID={this.state.userProfile.id}
                handleBackToEvent={this.handleBackToEvent}
              />
            )}
          />

          {/* ADD EXISTING FRIEND ROUTE */}
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
        </div>
      </Router>
    );
  }

  componentDidMount() {
    // let dbRef = firebase.database().ref(`${this.state.userProfile.id}`);
    // dbRef.on("value", snapshot => {
    //   this.setState({ userProfile: snapshot.val() });
    // });
  }
}

export default App;
