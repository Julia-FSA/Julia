// const Alexa = require('ask-sdk-core');
const axios = require('axios')
const {SpoonacularAPIKey} = require('../secrets.js')
//let recipe = {};
// let ingredientArr = [];
//const id = 9226 //papaya id in spoonacular
// const ingredient = chicken

const getFromSpoon = (caseType, id, ingredients) => {
  if (caseType === 'ingredientById') {
    axios
      .get(
        `https://api.spoonacular.com/food/ingredients/${id}/information?amount=1&apiKey=${SpoonacularAPIKey}`
      )
      .then(ingredient => {
        //ingredientArr.push(ingredient.data.name, ingredient.data.id)
        console.log('ingredient is ', ingredient.data)
      })
  }
  if (caseType === 'findByIngredients') {
    let ingredientStr = ''
    for (let i = 0; i < ingredients.length; i++) {
      if (i === ingredients.length - 1) {
        ingredientStr += ingredients[i]
      } else {
        ingredientStr += ingredients[i] + ',+'
      }
    }
    axios
      .get(
        `https://api.spoonacular.com/recipes/complexSearch?includeIngredients=${ingredientStr}&addRecipeInformation=true&instructionsRequired=true&number=1&apiKey=${SpoonacularAPIKey}`
      )
      .then(recipe => {
        let resultObj = recipe.data.results[0].analyzedInstructions[0].steps[0]
        //let name = recipe

        console.log('recipe is ', resultObj)
      })
  }
  if (caseType === 'recipeById') {
    axios
      .get(
        `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&amount=1&apiKey=${SpoonacularAPIKey}`
      )
      .then(recipe => {
        console.log('recipe is ', recipe.data)
      })
  }
}

getFromSpoon('ingredientById', 9266, [])
//getFromSpoon('findByIngredients', 0, [ 'chicken', 'tortilla'])

//  getFromSpoon('recipeById', 531683, [])

// {  "id": 0,
// "title": "mac & cheese",
//   "steps": "step 1. lksdfjlaskdjf; step 2. asdjflakdsjf; step 3. ajsdfajkhsdfkjah ...",
//     "ingredients": "cheese, chicken breast, garlice, onion, peppers",
//       "readyInMinutes": 30,
//         "servings": 4,
//           "vegetarian": false,

//            "vegan": false
//           }

// axios
//   .get(

//       `https://api.spoonacular.com/recipes/556470/analyzedInstructions?stepBreakdown=true&apiKey=${SpoonacularAPIKey}`

//       // `https://api.spoonacular.com/recipes/findByIngredients?ingredients=apples,+flour,+sugar&number=2&apiKey=${SpoonacularAPIKey}`
//   )
//   .then(ingredient => {
//     // recipe.push(ingredient.data.name)
//     console.log('ingredient is ', ingredient
//     )

//   })
