import React from "react";
import DisplaySingleRecipe from "./DisplaySingleRecipe";

const DisplaySavedRecipes = props => {
  if (props.savedRecipes) {
    return (
      <div className="saved-recipes">
        <h1>SAVED RECIPES</h1>
        <h3>({props.savedRecipes.length})</h3>
        <ul className="saved-recipes-list clearfix">
          {props.savedRecipes.map(recipe => {
            return (
              <DisplaySingleRecipe
                className={"save-single-recipe"}
                toggleRecipe={props.toggleRecipe}
                action={"remove"}
                buttonTag={<i className="fas fa-minus-circle" />}
                key={recipe.id}
                recipe={recipe}
                buttonClass={"recipe-remove-button"}
                recipeHeading={"saved-recipe-name"}
              />
            );
          })}
        </ul>
      </div>
    );
  } else {
    return null;
  }
};

export default DisplaySavedRecipes;
