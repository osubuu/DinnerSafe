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
import EventPage from "./components/EventPage/EventPage"

// FUNCTIONS
import matchingRecipes from "./components/matchingRecipes";

//COMPONENTS
import DisplayMatchingRecipes from "./components/DisplayMatchingRecipes/DisplayMatchingRecipes";

const dbRef = firebase.database().ref();

/* ===================
TEST STUFF BELOW THAT CAN BE DELETED WHEN DONE
==================== */
let user = "Nicole";
let friends = [
  {
    name: "Pratik",
    allergies: ["Apple", "Bananas"],
    parties: ["sept3"]
  },
  {
    name: "Junior",
    allergies: ["Grapes", "Cookies"],
    parties: ["sept3", "nov1"]
  }
];

let parties = [
  {
    title: "sept3",
    recipes: ["Pie", "McDonald's"]
  },
  {
    title: "nov1",
    recipes: ["Candy", "Dog Food"]
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
      loginPurpose: ""
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

  /* FUNCTION TO GET EVENTS FROM FIREBASE */
  retrieveEventsFromFirebase = snapshot => {
    let newResults = Object.values(snapshot);

    newResults.forEach(person => {
      if (user === person.user) {
        this.setState({
          userProfile: newResults
        });
      }
    });
  };

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

      // console.log(userObject);
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
          let newKey = dbRef.push(this.state.user).key;
          dbRef.child(newKey).set({ user, friends, parties });

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

  // Add props to singleEvent
  singleEvent = () => {
    return(
      <EventPage 
        userProfile={this.state.userProfile}
        eventName={this.state.userProfile.parties[0].title}
      />
    )
  }

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

          <Route 
            exact path="/event"
            render={this.singleEvent}
          />


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
            exact
            path="/overview"
            render={props => (
              <OverviewPage {...props} userProfile={this.state.userProfile} />
            )}
          />
        </div>
      </Router>
    );
  }

  componentDidMount() {}
}

export default App;
