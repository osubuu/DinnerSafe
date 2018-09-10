// Displays a list of recipes matching the restrictions of the party guests

import React, { Component } from "react";

// API Call for Matching Recipes
import matchingRecipes from "../matchingRecipes";

// COMPONENTS
import DisplaySingleRecipe from "./DisplaySingleRecipe";

class DisplayMatchingRecipes extends Component {
  constructor() {
    super();
    this.state = {
      listOfRecipes: [],
      restrictions: {
        allowedAllergy: [],
        allowedDiet: [],
        excludedIngredient: [],
        allowedCourse: [],
        q: "",
        set: false
      }
    };
  }

  setRestrictions = () => {
    // filters userProfile.friends array for friends with the event and pushes them to the friends array
    const friends = this.props.userProfile.friends.filter(friend => friend.parties && friend.parties.includes(this.props.eventName));

    const allergies = [];
    const diets = [];
    const ingredients = [];
    

    friends.forEach(friend => {
      if (friend.allowedAllergy) {
        friend.allowedAllergy.forEach(allergy => allergies.push(allergy));
      }
      if (friend.allowedDiet) {
        friend.allowedDiet.forEach(diet => diets.push(diet));
      }
      if (friend.excludedIngredient) {
        friend.excludedIngredient.forEach(ingredient => ingredients.push(ingredient));
      }
    });

    this.setState(
      {
        restrictions: {
          allowedAllergy: allergies,
          allowedDiet: diets,
          excludedIngredient: ingredients,
          allowedCourse: this.props.courses,
          q: this.props.search,
          set: true
        }
      },
      () => {
      
        matchingRecipes(this.state.restrictions).then(res => {

          this.setState({
            listOfRecipes: res.data.matches
          });
        });
      }
    );
  };

  componentDidMount() {
    this.setRestrictions();
  }

  render() {
    return (
      <div className="matching-recipes">

        <button onClick={this.setRestrictions}>SHOW ME RECIPES</button>

        <ul>
          {this.state.listOfRecipes.map(recipe => {
            return (
              <DisplaySingleRecipe
                toggleRecipe={this.props.toggleRecipe}
                action={"save"}
                buttonTag={"+"}
                key={recipe.id}
                recipe={recipe}
              />
            );
          })}
        </ul>
      </div>
    );
  }
}

export default DisplayMatchingRecipes;
