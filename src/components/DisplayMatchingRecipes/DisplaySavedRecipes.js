import React from "react";
import DisplaySingleRecipe from "./DisplaySingleRecipe";

const DisplaySavedRecipes = props => {
  if (props.savedRecipes) {
    return (
      <div className="saved-recipes">
        <h1>SAVED RECIPES</h1>
        <ul className="saved-recipes-list clearfix">
          {props.savedRecipes.map(recipe => {
            return (
              <DisplaySingleRecipe
                className={"save-single-recipe"}
                toggleRecipe={props.toggleRecipe}
                action={"remove"}
                buttonTag={<i class="fas fa-minus-circle"></i>}
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
