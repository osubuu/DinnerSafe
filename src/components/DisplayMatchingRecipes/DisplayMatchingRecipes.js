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
        set: false
      }
    };
  }

  setRestrictions = (userProfile, event, callback) => {
    // filters userProfile.friends array for friends with the event and pushes them to the friends array
    const friends = userProfile.friends.filter(friend => friend.parties && friend.parties.includes(event));

    console.log("friends filtered: ", friends);

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
          set: true
        }
      },
      () => {
        callback();
      }
    );
  };

  componentDidMount() {
    if (this.props.userProfile) {
      this.setRestrictions(this.props.userProfile, this.props.eventName, () => {
        console.log("restrictions", this.state.restrictions);
        console.log("party: ", this.props.userProfile.parties[0].title);

        matchingRecipes(this.state.restrictions).then(res => {
          console.log("res: ", res);

          this.setState({
            listOfRecipes: res.data.matches
          });
        });
      });
    } else {
      return null;
    }
  }

  render() {
    return (
      <ul>
        {this.state.listOfRecipes.map(recipe => {
          return <DisplaySingleRecipe key={recipe.id} recipe={recipe} />;
        })}
      </ul>
    );
  }
}

export default DisplayMatchingRecipes;
