// Displays a list of recipes matching the restrictions of the party guests

import React, { Component } from "react";

// API Call for Matching Recipes
import matchingRecipes from '../matchingRecipes';

// COMPONENTS
import DisplaySingleRecipe from './DisplaySingleRecipe';

class DisplayMatchingRecipes extends Component {
    constructor() {
        super();
        this.state = {
            listOfRecipes: []
        }
    }

    componentDidMount(){
        matchingRecipes(this.props.restrictions).then(res => {

            this.setState({
                listOfRecipes: res.data.matches
            });

            console.log('this.state.listOfRecipes: ', this.state.listOfRecipes);
        });

        
    }

    render() {
        
        if (this.state.listOfRecipes[0]) {
            return (
                <ul>
                    {this.state.listOfRecipes.map( recipe => {
                        return (
                            <DisplaySingleRecipe key={recipe.id} recipe={recipe} />
                        )
                    })}
                </ul>
            )
        }
        else {
            return null
        }
    }
}

export default DisplayMatchingRecipes;