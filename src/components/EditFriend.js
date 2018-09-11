import React, { Component } from "react";
import { allergy as Allergy, diet as Diet } from "./matchingRecipes";
import { Link, Redirect } from "react-router-dom";
import firebase from "../firebase";
import _ from "lodash";
import Header from "./Header";

class EditFriend extends Component {
  constructor(props) {
    super(props);
    if (props.friendProfile) {
      this.state = {
        inputValue: "",
        confirmedIngredient: ""
      };
      this.dbRef = firebase.database().ref(`${this.props.userID}/friends/${this.props.friendKey}`);
    } else {
      props.getRedirected(true);
    }
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

    if (this.state.confirmedIngredient) {
      // make copy of current friend profile
      let tempObj = this.props.friendProfile;

      // initialize an empty array of excluded ingredient, if it doesn't exist yet
      if (!this.props.friendProfile.excludedIngredient) {
        tempObj.excludedIngredient = [];
      }

      // push new ingredient into array
      tempObj.excludedIngredient.push(this.state.confirmedIngredient.trim().toLowerCase());

      // set new ingredient list to friend
      this.dbRef.set(tempObj);

      this.setState({
        confirmedIngredient: "",
        inputValue: ""
      });
    } else {
      return null;
    }
  };

  // Delete current ingredient
  deleteIngredient = key => {
    let newIngredientList = this.props.friendProfile.excludedIngredient;
    newIngredientList.splice(newIngredientList.indexOf(key), 1);

    this.dbRef.child("/excludedIngredient").set(newIngredientList);
  };

  // Function to toggle allergies/diets directly on page and into firebase
  toggleAllergies = e => {
    // make copy of current friend profile
    let tempObj = this.props.friendProfile;

    // if friend has no allergy array yet, initialize one
    if (!this.props.friendProfile.allowedAllergy) {
      tempObj.allowedAllergy = [];
    }

    // if friend has no diet array yet, initialize one
    if (!this.props.friendProfile.allowedDiet) {
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
        <Header user={this.props.userProfile.user} handleLogout={this.props.handleLogout} />

        {this.props.friendProfile ? (
          <div>
            <div className="edit-guest-subheader">
              <div className="wrapper clearfix edit-guest-sub-subheader">
                <h2 className="edit-guest-title">Dietary Options for {this.props.friendProfile.name}</h2>

                <div className="edit-guest-save-div clearfix">
                  <Link className="edit-guest-save" onClick={this.props.handleBackToEvent} to="/event">
                    Save and Return to Event
                  </Link>
                </div>
              </div>
            </div>

            <div className="wrapper">
              <div>
                <h3 className="edit-guest-section-header">Allergies</h3>
                <form className="edit-guest-form clearfix" action="">
                  {Allergy.map((allergy, i) => {
                    // if the current allergy is already in the friend's allergy array, check the input on display
                    if (
                      this.props.friendProfile.allowedAllergy &&
                      this.props.friendProfile.allowedAllergy.indexOf(allergy.searchValue) !== -1
                    ) {
                      return (
                        <div className="allergy-diet" key={i}>
                          <input
                            className="allergy"
                            onChange={this.toggleAllergies}
                            type="checkbox"
                            value={allergy.shortDescription}
                            id={allergy.searchValue}
                            defaultChecked
                          />
                          <label htmlFor={allergy.searchValue}>
                            <div className="stylish-checkbox">
                              <i class="fas fa-check" />
                            </div>
                            {allergy.shortDescription.replace("-Free", "")}
                          </label>
                        </div>
                      );
                    }
                    // else, do not check it
                    else {
                      return (
                        <div className="allergy-diet" key={i}>
                          <input
                            className="allergy"
                            onChange={this.toggleAllergies}
                            type="checkbox"
                            value={allergy.shortDescription}
                            id={allergy.searchValue}
                          />
                          <label htmlFor={allergy.searchValue}>
                            <div className="stylish-checkbox">
                              <i class="fas fa-check" />
                            </div>
                            {allergy.shortDescription.replace("-Free", "")}
                          </label>
                        </div>
                      );
                    }
                  })}
                </form>
                {/* End of Allergies */}

                <h3 className="edit-guest-section-header">Diet</h3>
                <form className="edit-guest-form clearfix" action="">
                  {Diet.map((diet, i) => {
                    // if the current diet is already in the friend's diet array, check the input on display
                    if (
                      this.props.friendProfile.allowedDiet &&
                      this.props.friendProfile.allowedDiet.indexOf(diet.searchValue) !== -1
                    ) {
                      return (
                        <div className="allergy-diet" key={i}>
                          <input
                            className="diet"
                            type="checkbox"
                            onChange={this.toggleAllergies}
                            value={diet.shortDescription}
                            id={diet.searchValue}
                            defaultChecked
                          />

                          <label htmlFor={diet.searchValue}>
                            <div className="stylish-checkbox">
                              <i class="fas fa-check" />
                            </div>
                            {diet.shortDescription.replace("-Free", "")}
                          </label>
                        </div>
                      );
                    }
                    // else, do not check it
                    else {
                      return (
                        <div className="alergy-diet" key={i}>
                          <input
                            className="diet"
                            type="checkbox"
                            onChange={this.toggleAllergies}
                            value={diet.shortDescription}
                            id={diet.searchValue}
                          />

                          <label htmlFor={diet.searchValue}>
                            <div className="stylish-checkbox">
                              <i class="fas fa-check" />
                            </div>
                            {diet.shortDescription.replace("-Free", "")}
                          </label>
                        </div>
                      );
                    }
                  })}
                </form>
                {/* End of Diet */}

                <h3 className="edit-guest-section-header">Restricted Ingredients</h3>
                <section className="edit-guest-form">
                  <form onSubmit={this.handleSubmitEditFriend} action="">
                    <input value={this.state.inputValue} onChange={this.handleChangeEditFriend} type="text" />
                    <button onClick={this.handleClickEditFriend}>ADD</button>
                  </form>

                  <ul className="friend-restricted-ingredients clearfix">
                    {this.props.friendProfile.excludedIngredient
                      ? this.props.friendProfile.excludedIngredient.map((ingredient, i) => {
                          return (
                            <div className="alergy-diet" key={i}>
                              <li>{_.startCase(_.toLower(ingredient))}</li>
                              <button onClick={() => this.deleteIngredient(`${ingredient}`)}>REMOVE INGREDIENT</button>
                            </div>
                          );
                        })
                      : null}
                  </ul>
                </section>
                {/* End of Restricted Ingredients */}
              </div>
            </div>
            {/* end of wrapper */}
          </div>
        ) : (
          <Redirect from="/event" to="/" />
        )}
      </div>
    );
  }
}

export default EditFriend;
