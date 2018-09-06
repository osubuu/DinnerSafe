// Placeholder – will build out component to dispay a single recipe

import React from "react";

const DisplaySingleRecipe = (props) => {
    return(

        <li>
            <a href="#">
                <h2>{props.recipe.recipeName}</h2>
                <div className="img">
                    <img src={props.recipe.imageUrlsBySize['90']} alt=""/>
                </div>
                
            </a>
        </li>
    )
}

export default DisplaySingleRecipe;