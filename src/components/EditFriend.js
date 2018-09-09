import React, { Component } from "react";
import { allergy as Allergy, diet as Diet } from "./matchingRecipes";
import { Link } from "react-router-dom";
import firebase from "../firebase";

class EditFriend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friendProfile: props.friendProfile,
      inputValue: "",
      confirmedIngredient: "",
      userID: props.userID,
      friendKey: props.friendKey
    };

    this.dbRef = firebase.database().ref(`${this.state.userID}/friends/${this.state.friendKey}`);
  }

  // Handle input value for new restriction
  handleChangeEditFriend = e => {
    this.setState({
      inputValue: e.target.value
    });
  };

  // Handling for click for new restriction
  handleClickEditFriend = e => {
    this.setState({
      confirmedIngredient: this.state.inputValue
    });
  };

  // Handling for form submit of new restriction
  handleSubmitEditFriend = e => {
    e.preventDefault();

    // make copy of current friend profile
    let tempObj = this.state.friendProfile;

    // initialize an empty array of excluded ingredient, if it doesn't exist yet
    if (!this.state.friendProfile.excludedIngredient) {
      tempObj.excludedIngredient = [];
    }

    // push new ingredient into array
    tempObj.excludedIngredient.push(this.state.confirmedIngredient);

    // set new ingredient list to friend
    this.dbRef.set(tempObj);

    this.setState({
      confirmedIngredient: "",
      inputValue: ""
    });
  };

  // Delete current ingredient
  deleteIngredient = key => {
    let newIngredientList = this.state.friendProfile.excludedIngredient;
    newIngredientList.splice(newIngredientList.indexOf(key), 1);

    this.dbRef.child("/excludedIngredient").set(newIngredientList);
  };

  // Function to toggle allergies/diets directly on page and into firebase
  toggleAllergies = e => {
    // make copy of current friend profile
    let tempObj = this.state.friendProfile;

    // if friend has no allergy array yet, initialize one
    if (!this.state.friendProfile.allowedAllergy) {
      tempObj.allowedAllergy = [];
    }

    // if friend has no diet array yet, initialize one
    if (!this.state.friendProfile.allowedDiet) {
      tempObj.allowedDiet = [];
    }

    // if the checkbox was an allergy box
    if (e.target.className === "allergy") {
      // the item should be added to the arrayof allergies
      if (e.target.checked === true) {
        tempObj.allowedAllergy.push(e.target.id);
        this.dbRef.set(tempObj);
      }
      // the item should be removed from the list of allergies
      else {
        tempObj.allowedAllergy.splice(tempObj.allowedAllergy.indexOf(e.target.id), 1);
        this.dbRef.set(tempObj);
      }
    }
    // if not allergy, it has to be diet
    else if (e.target.className === "diet") {
      // the item should be added to the list of diet
      if (e.target.checked === true) {
        tempObj.allowedDiet.push(e.target.id);
        this.dbRef.set(tempObj);
      }
      // the item should be removed from the list of diet
      else {
        tempObj.allowedDiet.splice(tempObj.allowedDiet.indexOf(e.target.id), 1);
        this.dbRef.set(tempObj);
      }
    }
  };

  render() {
    return (
      <div>
        <h2>{this.state.friendProfile.name}</h2>
        <form action="">
          <h3>Allergies</h3>
          {Allergy.map((allergy, i) => {
            // if the current allergy is already in the friend's allergy array, check the input on display
            if (
              this.state.friendProfile.allowedAllergy &&
              this.state.friendProfile.allowedAllergy.indexOf(allergy.searchValue) !== -1
            ) {
              return (
                <div key={i}>
                  <label htmlFor={allergy.searchValue}>{allergy.shortDescription}</label>
                  <input
                    className="allergy"
                    onChange={this.toggleAllergies}
                    type="checkbox"
                    value={allergy.shortDescription}
                    id={allergy.searchValue}
                    defaultChecked
                  />
                </div>
              );
            }
            // else, do not check it
            else {
              return (
                <div key={i}>
                  <label htmlFor={allergy.searchValue}>{allergy.shortDescription}</label>
                  <input
                    className="allergy"
                    onChange={this.toggleAllergies}
                    type="checkbox"
                    value={allergy.shortDescription}
                    id={allergy.searchValue}
                  />
                </div>
              );
            }
          })}
        </form>
        <form action="">
          <h3>Diet</h3>
          {Diet.map((diet, i) => {
            // if the current diet is already in the friend's diet array, check the input on display
            if (
              this.state.friendProfile.allowedDiet &&
              this.state.friendProfile.allowedDiet.indexOf(diet.searchValue) !== -1
            ) {
              return (
                <div key={i}>
                  <label htmlFor={diet.searchValue}>{diet.shortDescription}</label>
                  <input
                    className="diet"
                    type="checkbox"
                    onChange={this.toggleAllergies}
                    value={diet.shortDescription}
                    id={diet.searchValue}
                    defaultChecked
                  />
                </div>
              );
            }
            // else, do not check it
            else {
              return (
                <div key={i}>
                  <label htmlFor={diet.searchValue}>{diet.shortDescription}</label>
                  <input
                    className="diet"
                    type="checkbox"
                    onChange={this.toggleAllergies}
                    value={diet.shortDescription}
                    id={diet.searchValue}
                  />
                </div>
              );
            }
          })}
        </form>
        <section>
          <ul className="friend-restricted-ingredients">
            <h3>Restricted Ingredients</h3>
            {this.state.friendProfile.excludedIngredient
              ? this.state.friendProfile.excludedIngredient.map((ingredient, i) => {
                  return (
                    <div key={i}>
                      <li>{ingredient}</li>
                      <button onClick={() => this.deleteIngredient(`${ingredient}`)}>REMOVE INGREDIENT</button>
                    </div>
                  );
                })
              : null}
          </ul>
          <form onSubmit={this.handleSubmitEditFriend} action="">
            <input value={this.state.inputValue} onChange={this.handleChangeEditFriend} type="text" />
            <button onClick={this.handleClickEditFriend}>ADD</button>
          </form>
        </section>

        <Link onClick={this.props.handleBackToEvent} to="/event">
          Back to Event Page
        </Link>
      </div>
    );
  }

  componentDidMount() {
    this.dbRef.on("value", snapshot => {
      this.setState({
        friendProfile: snapshot.val()
      });
    });
  }
}

export default EditFriend;
