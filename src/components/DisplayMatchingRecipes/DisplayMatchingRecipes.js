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
      courses: ["course^course-Main Dishes"],
      mains: true,
      desserts: false,
      sideDishes: false,
      appetizers: false,
      salads: false,
      breakfastAndBrunch: false,
      breads: false,
      soups: false,
      beverages: false,
      condimentsAndSauces: false,
      cocktails: false,
      snacks: false,
      lunch: false,
      search: "",
      // placeholder: "ingredient",
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
          allowedCourse: this.state.courses,
          q: this.state.search,
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

  handleChange = (e) => {

    this.setState({
      [e.target.id]: e.target.value
    });
  }

  componentDidMount() {
    this.setRestrictions();
  }

  handleSubmit = e => {
    e.preventDefault();
    this.setRestrictions();

    // if(this.state.search){
    //   this.setState({
    //     placeholder: this.state.search,
    //     search: ""
    //   })
    // }
  }

  handleCheckboxChange = (e) => {
    
    const tempCourses = this.state.courses;

    const courseList = { 
      mains: "course^course-Main Dishes",
      desserts: "course^course-Desserts",
      sideDishes: "course^course-Side Dishes",
      appetizers: "course^course-Appetizers",
      salads: "course^course-Salads",
      breakfastAndBrunch: "course^course-Breakfast and Brunch",
      breads: "course^course-Breads",
      soups: "course^course-Soups",
      beverages: "course^course-Beverages",
      condimentsAndSauces: "course^course-Condiments and Sauces",
      cocktails: "course^course-Cocktails",
      snacks: "course^course-Snacks",
      lunch: "course^course-Lunch",
    }

    // Remove from array
    if (this.state[e.target.name]){
      tempCourses.splice(tempCourses.indexOf(courseList[e.target.name]),1)

    }
    // Add to array
    else {
      tempCourses.push(courseList[e.target.name])
    }



    const value = !this.state[e.target.name];
    // const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const name = e.target.name;

    this.setState({
      [name]: value,
      courses: tempCourses
    });
  }

  render() {
    return (
      <div className="matching-recipes">

        <form className="filter-recipes-form" action="">
          <label htmlFor="search">Search</label>
          <input
            type="text"
            id="search"
            placeholder="ingredient"
            value={this.state.search}
            onChange={this.handleChange}
          />

          <div className="courses">
            <label>
              <input
                name="mains"
                type="checkbox"
                checked={this.state.mains}
                onChange={this.handleCheckboxChange} />
              Mains
            </label>

            <label>
              <input
                name="desserts"
                type="checkbox"
                checked={this.state.desserts}
                onChange={this.handleCheckboxChange} />
                Desserts
            </label>

            <label>
              <input
                name="sideDishes"
                type="checkbox"
                checked={this.state.sideDishes}
                onChange={this.handleCheckboxChange} />
                Side Dishes
            </label>

            <label>
              <input
                name="appetizers"
                type="checkbox"
                checked={this.state.appetizers}
                onChange={this.handleCheckboxChange} />
                Appetizers
            </label>

            <label>
              <input
                name="salads"
                type="checkbox"
                checked={this.state.salads}
                onChange={this.handleCheckboxChange} />
                Salads
            </label>

            <label>
              <input
                name="breakfastAndBrunch"
                type="checkbox"
                checked={this.state.breakfastAndBrunch}
                onChange={this.handleCheckboxChange} />
                Breakfast & Brunch
            </label>

            <label>
              <input
                name="breads"
                type="checkbox"
                checked={this.state.breads}
                onChange={this.handleCheckboxChange} />
                Breads
            </label>

            <label>
              <input
                name="soups"
                type="checkbox"
                checked={this.state.soups}
                onChange={this.handleCheckboxChange} />
                Soups
            </label>

            <label>
              <input
                name="beverages"
                type="checkbox"
                checked={this.state.beverages}
                onChange={this.handleCheckboxChange} />
                Beverages
            </label>

            <label>
              <input
                name="condimentsAndSauces"
                type="checkbox"
                checked={this.state.condimentsAndSauces}
                onChange={this.handleCheckboxChange} />
                Condiments & Sauces
            </label>

            <label>
              <input
                name="cocktails"
                type="checkbox"
                checked={this.state.cocktails}
                onChange={this.handleCheckboxChange} />
                Cocktails
            </label>

            <label>
              <input
                name="snacks"
                type="checkbox"
                checked={this.state.snacks}
                onChange={this.handleCheckboxChange} />
                Snacks
            </label>

            <label>
              <input
                name="lunch"
                type="checkbox"
                checked={this.state.lunch}
                onChange={this.handleCheckboxChange} />
                Lunch
            </label>

          </div>

          <button onClick={this.handleSubmit}>Filter Recipes</button>
        </form>

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
