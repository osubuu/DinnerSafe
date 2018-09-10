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
      courseCheckboxes: {
        mainDishes: 
          {
            include: true,
            value: "course^course-Main Dishes"
          }
        ,
        sideDishes: 
          {
            include: false,
            value: "course^course-Side Dishes"
          }
        ,
        appetizers: 
          {
            include: false,
            value: "course^course-Appetizers"
          }
        ,
        salads: 
          {
            include: false,
            value: "course^course-Salads"
          }
        ,
        desserts: 
          {
            include: false,
            value: "course^course-Desserts"
          }
        ,
        breakfastAndBrunch: 
          {
            include: false,
            value: "course^course-Breakfast and Brunch"
          }
        ,
        breads: 
          {
            include: false,
            value: "course^course-Breads"
          }
        ,
        soups: 
          {
            include: false,
            value: "course^course-Soups"
          }
        ,
        beverages: 
          {
            include: false,
            value: "course^course-Beverages"
          }
        ,
        condimentsAndSauces: 
          {
            include: false,
            value: "course^course-Condiments and Sauces"
          }
        ,
        cocktails: 
          {
            include: false,
            value: "course^course-Cocktails"
          }
        ,
        snacks: 
          {
            include: false,
            value: "course^course-Snacks"
          }
        ,
        lunch: 
          {
            include: false,
            value: "course^course-Lunch"
          }
      },
      restrictions: {
        allowedAllergy: [],
        allowedDiet: [],
        excludedIngredient: [],
        allowedCourse: [],
        q: "",
        set: false
      },
      courses: ["course^course-Cocktails"],
      search: "melon"
    };
  }

  setRestrictions = (userProfile, event, courses, searchTerm, callback) => {
    // filters userProfile.friends array for friends with the event and pushes them to the friends array
    const friends = userProfile.friends.filter(friend => friend.parties && friend.parties.includes(event));

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
          allowedCourse: courses,
          q: searchTerm,
          set: true
        }
      },
      () => {
        callback();
      }
    );
  };


  handleCheckChange = (e) => {
  
    const value = e.target.value;
    const name = e.target.name;
    let tempCourses = this.state.courseCheckboxes

    tempCourses[name].include = value;
    
    console.log('tempCourses', tempCourses);
    
    


    // console.log(this.state.courses[name].include);
    

    // this.setState({
    //   courses[{name}]:
    //     {
    //       include: value,
    //     }
    // });
  }

  handleChange = (e) => {

    this.setState({
      [e.target.id]: e.target.value
    });
  }

  componentDidMount() {
    this.setRestrictions(this.props.userProfile, this.props.eventName, this.state.courses, this.state.search, () => {
      
      matchingRecipes(this.state.restrictions).then(res => {

        this.setState({
          listOfRecipes: res.data.matches
        });
      });
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

          <h3 className="filter-by-course">Filter by Category</h3>
          <fieldset className="courses">
            {/* MAINS */}
            {/* MAINS is the only category checked by default */}
            <label>
              <input
                name="mainDishes"
                type="checkbox"
                checked={this.state.courseCheckboxes.mainDishes.include}
                onChange={this.handleCheckChange}
              />
              Main Dishes
            </label>
            <label>
              <input
                name="sideDishes"
                type="checkbox"
                checked={this.state.courseCheckboxes.sideDishes.include}
                onChange={this.handleCheckChange}
              />
              Side Dishes
            </label>
            <label>
              <input
                name="appetizers"
                type="checkbox"
                checked={this.state.courseCheckboxes.appetizers.include}
                onChange={this.handleCheckChange}
              />
              Appetizers
            </label>
            <label>
              <input
                name="salads"
                type="checkbox"
                checked={this.state.courseCheckboxes.salads.include}
                onChange={this.handleCheckChange}
              />
              Salads
            </label>
            <label>
              <input
                name="desserts"
                type="checkbox"
                checked={this.state.courseCheckboxes.desserts.include}
                onChange={this.handleCheckChange}
              />
              Desserts
            </label>
            <label>
              <input
                name="breakfastAndBrunch"
                type="checkbox"
                checked={this.state.courseCheckboxes.breakfastAndBrunch.include}
                onChange={this.handleCheckChange}
              />
              Breakfast & Brunch
            </label>
            <label>
              <input
                name="breads"
                type="checkbox"
                checked={this.state.courseCheckboxes.breads.include}
                onChange={this.handleCheckChange}
              />
              Breads
            </label>
            <label>
              <input
                name="soups"
                type="checkbox"
                checked={this.state.courseCheckboxes.soups.include}
                onChange={this.handleCheckChange}
              />
              Soups
            </label>
            <label>
              <input
                name="beverages"
                type="checkbox"
                checked={this.state.courseCheckboxes.beverages.include}
                onChange={this.handleCheckChange}
              />
              Beverages
            </label>
            <label>
              <input
                name="condimentsAndSauces"
                type="checkbox"
                checked={this.state.courseCheckboxes.condimentsAndSauces.include}
                onChange={this.handleCheckChange}
              />
              Condiments & Sauces
            </label>
            s
            <label>
              <input
                name="cocktails"
                type="checkbox"
                checked={this.state.courseCheckboxes.cocktails.include}
                onChange={this.handleCheckChange}
              />
              Cocktails
            </label>
            <label>
              <input
                name="snacks"
                type="checkbox"
                checked={this.state.courseCheckboxes.snacks.include}
                onChange={this.handleCheckChange}
              />
              Snacks
            </label>
            <label>
              <input
                name="lunch"
                type="checkbox"
                checked={this.state.courseCheckboxes.lunch.include}
                onChange={this.handleCheckChange}
              />
              Lunch
            </label>
          </fieldset>

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
