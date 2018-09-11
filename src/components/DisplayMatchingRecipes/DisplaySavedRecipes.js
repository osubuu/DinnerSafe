import React from "react";
import DisplaySingleRecipe from "./DisplaySingleRecipe";

const DisplaySavedRecipes = props => {
  if (props.savedRecipes) {
    return (
      <div className="saved-recipes">
        <h1>SAVED RECIPES</h1>
        <ul className="saved-recipes-list">
          {props.savedRecipes.map(recipe => {
            return (
              <DisplaySingleRecipe
                toggleRecipe={props.toggleRecipe}
                action={"remove"}
                buttonTag={"-"}
                key={recipe.id}
                recipe={recipe}
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
