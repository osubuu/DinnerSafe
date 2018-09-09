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

  handleChangeEditFriend = e => {
    this.setState({
      inputValue: e.target.value
    });
  };

  // Handling for click of either sign in or create buttons
  handleClickEditFriend = e => {
    this.setState({
      confirmedIngredient: this.state.inputValue
    });
  };

  // Handling for form submit
  handleSubmitEditFriend = e => {
    e.preventDefault();

    // make copy of current excluded ingredient array and then push new ingredient to it
    let newIngredientList = this.state.friendProfile.excludedIngredient;
    newIngredientList.push(this.state.confirmedIngredient);

    // set new ingredient list to friend
    this.dbRef.child("/excludedIngredient").set(newIngredientList);

    this.setState({
      confirmedIngredient: ""
    });
  };

  deleteIngredient = key => {
    console.log(key);
    let newIngredientList = this.state.friendProfile.excludedIngredient;
    console.log(newIngredientList);
    newIngredientList.splice(newIngredientList.indexOf(key), 1);
    console.log(newIngredientList);

    this.dbRef.child("/excludedIngredient").set(newIngredientList);
  };

  toggleAllergies = e => {
    if (e.target.className === "allergy") {
      let tempArr = this.state.friendProfile.allowedAllergy;
      // the item should be added to the list of allergies
      if (e.target.checked === true) {
        tempArr.push(e.target.id);

        this.dbRef.child("/allowedAllergy").set(tempArr);
      }
      // the item should be removed from the list of allergies
      else {
        tempArr.splice(tempArr.indexOf(e.target.id), 1);

        this.dbRef.child("/allowedAllergy").set(tempArr);
      }
    }
    // if not allergy, it has to be diet
    else {
      let tempArr = this.state.friendProfile.allowedDiet;
      // the item should be added to the list of diet
      if (e.target.checked === true) {
        tempArr.push(e.target.id);

        this.dbRef.child("/allowedDiet").set(tempArr);
      }
      // the item should be removed from the list of diet
      else {
        tempArr.splice(tempArr.indexOf(e.target.id), 1);

        this.dbRef.child("/allowedDiet").set(tempArr);
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
            <input onChange={this.handleChangeEditFriend} type="text" />
            <button onClick={this.handleClickEditFriend}>ADD</button>
          </form>
        </section>

        <Link onClick={this.props.handleBackToEvent} to="/event">
          Back to Event Page
        </Link>
      </div>
    );
  }

  // componentDidMount() {
  //   this.dbRef.on("value", snapshot => {
  //     this.setState({
  //       friendProfile: snapshot.val()
  //     });
  //   });
  // }
}

export default EditFriend;
