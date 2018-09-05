import axios from 'axios';

const apiUrl = 'http://api.yummly.com/v1/api/recipes';
const apiKey = 'db330b81d710c9b574e3c76551fbcdb5';
const apiId = 'a61c2317';

export default function apiCall (searchText) {
  return axios.get(apiUrl, {
    params: {
      _app_key: `db330b81d710c9b574e3c76551fbcdb5`,
      _app_id: `a61c2317`,
      requirePictures: true,
      allowedAllergy: [],
      allowedDiet: [],
    }
  })
}

// Supported Allergies Dairy, Egg, Gluten, Peanut, Seafood, Sesame, Soy, Sulfite, Tree Nut, Wheat
// Supported Diets: Lacto vegetarian, Ovo vegetarian, Pescetarian, Vegan, Vegetarian
