// Placeholder – will build out component to dispay a single recipe

import React from "react";

const DisplaySingleRecipe = props => {
  return (
     <li className={props.className}>
      <a className="recipe-each-link" href={`http://www.yummly.com/recipe/${props.recipe.id}`} target="_blank">
        <h2 className="recipe-name">{props.recipe.recipeName}</h2>

        <div className="recipe-img-container">
          {/* Removing the last 6 characters from the provided url '=s90-c' which appear to set the size of the image to a 90 pixel square */}
          <img
            className="recipe-img"
            src={props.recipe.imageUrlsBySize["90"].substring(0, props.recipe.imageUrlsBySize["90"].length - 6)}
            alt={props.recipe.recipeName}
          />
        </div>
      </a>

      <button onClick={() => props.toggleRecipe(props.recipe, props.action)}>{props.buttonTag}</button>
    </li>
  );
};

export default DisplaySingleRecipe;
