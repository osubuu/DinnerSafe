// Placeholder – will build out component to dispay a single recipe

import React from "react";

const DisplaySingleRecipe = props => {
  return (
    <li className={props.className}>
    <h2 className={props.recipeHeading}>{props.recipe.recipeName}</h2>
    <button className={props.buttonClass} onClick={() => props.toggleRecipe(props.recipe, props.action)}>{props.buttonTag}</button>
      <a className="recipe-each-link clearfix" href={`http://www.yummly.com/recipe/${props.recipe.id}`} target="_blank">
        <div className="recipe-img-container">
          {/* Removing the last 6 characters from the provided url '=s90-c' which appear to set the size of the image to a 90 pixel square */}
          <img
            className="recipe-img"
            src={props.recipe.imageUrlsBySize["90"].substring(0, props.recipe.imageUrlsBySize["90"].length - 6)}
            alt={props.recipe.recipeName}
          />
        </div>
      </a>

    </li>
  );
};

export default DisplaySingleRecipe;
