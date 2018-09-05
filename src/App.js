import React, { Component } from "react";
import "./App.css";
import firebase from "./firebase";
//COMPONENTS//
import apiCall from "./components/apiCall";

const dbRef = firebase.database().ref();

/* ===================
TEST STUFF BELOW THAT CAN BE DELETED WHEN DONE
==================== */
let user = "Jeff";
let friends = [
  {
    name: "Dianna",
    allergies: ["Candy", "Bananas"],
    parties: ["sept3", "oct5"]
  },
  {
    name: "Moin",
    allergies: ["Grapes", "Cookies"],
    parties: ["sept3", "oct5"]
  }
];

let parties = [
  {
    title: "sept3",
    recipes: ["Pie", "McDonald's"]
  },
  {
    title: "oct5",
    recipes: ["Peanut", "Pizza"]
  }
];

// let key = dbRef.push(user).key;
// dbRef.child(key).set({ user, friends, parties });

/* ===================
TEST STUFF ABOVE THAT CAN BE DELETED WHEN DONE
==================== */

class App extends Component {
  constructor() {
    super();
    this.state = {
      allowedAllergies: [],
      allowedDiet: [],
      userProfile: {}
    };
  }

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

  render() {
    return (
      <div className="App">
        <h1>JDK PROJECT!!!</h1>
        {Object.values(this.state.userProfile).map(property => {
          if (property.user === user) {
            return (
              <div>
                <h1>{property.user}</h1>
                {property.parties.map(party => {
                  return (
                    <div>
                      <h2>{party.title}</h2>
                      {party.recipes.map(recipe => {
                        return <h3>{recipe}</h3>;
                      })}
                    </div>
                  );
                })}
              </div>
            );
          }
        })}
      </div>
    );
  }

  componentDidMount() {
    dbRef.on("value", snapshot => {
      this.retrieveEventsFromFirebase(snapshot.val());
    });
  }
}

export default App;
