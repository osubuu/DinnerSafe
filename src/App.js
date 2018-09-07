import React, { Component } from "react";
import "./App.css";
import firebase from "./firebase";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from "react-router-dom";
//COMPONENTS//
import OverviewPage from "./components/OverviewPage";
import ManageEvents from "./components/ManageEvents";
import EditFriend from "./components/EditFriend";

// FUNCTIONS
import matchingRecipes from "./components/matchingRecipes";

//COMPONENTS
import DisplayMatchingRecipes from "./components/DisplayMatchingRecipes/DisplayMatchingRecipes";
import ExistingFriendList from "./components/ExistingFriendList";

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
      restrictions: {
        allowedAllergy: ["400^Soy-Free"],
        allowedDiet: ["387^Lacto-ovo vegetarian"],
        excludedIngredient: ["salt", "butter", "beef"]
      },
      userProfile: null,
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
    console.log(currentInfoFromFirebase);

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
        this.setState({ userProfile: userObject });
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
          this.setState({ user: "", userProfile: [] });
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
          console.log(snapshot.val());
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

  render() {
    return (
      <Router>
        <div className="App">
          <section className="logInPage">
            {/* FIRST PAGE: USER LOGIN */}
            <form action="" onSubmit={this.handleSubmitLogin}>
              <label htmlFor="create-user">USERNAME</label>
              <input
                onChange={this.handleChangeLogin}
                id="create-user"
                type="text"
              />
              <button value="sign-in" onClick={this.handleClickLogin}>
                SIGN IN
              </button>
              <button value="create" onClick={this.handleClickLogin}>
                CREATE
              </button>
            </form>
          </section>

          {/* Display List of Recipes */}
          {/* <DisplayMatchingRecipes restrictions={this.state.restrictions} /> */}

          <Route
            exact
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
              <OverviewPage {...props} userProfile={this.state.userProfile} />
            )}
          />

          <Route
            path="/existing-friend-list"
            render={props => (
              <ExistingFriendList
                {...props}
                userProfile={this.state.userProfile}
              />
            )}
          />

          <Route
            path="/manage-events"
            render={props => (
              <ManageEvents {...props} userProfile={this.state.userProfile} />
            )}
          />

          {/* <Route
            exact
            path="/edit-friend"
            render={props => (
              <EditFriend
                {...props}
                friendProfile={this.state.userProfileFriends[this.state.key]}
                friendKey={this.state.key}
                userID={this.props.userProfile.id}
              />
            )}
          /> */}
        </div>
      </Router>
    );
  }

  componentDidMount() {}
}

export default App;
