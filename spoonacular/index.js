// const Alexa = require('ask-sdk-core');
const axios = require('axios')
const {SpoonacularAPIKey} = require('../secrets.js')
let recipe = []

const id = 9226 //papaya id in spoonacular

// axios
//   .get(
//     `https://api.spoonacular.com/food/ingredients/${id}/information?apiKey=${SpoonacularAPIKey}`
//   )
//   .then((ingredient) => {
//     // recipe.push(ingredient.data.name)
//     console.log('ingredient is ', ingredient)
//   })

// axios
//   .get(
//     `https://api.spoonacular.com/recipes/search?query=cheese&number=2&apiKey=${SpoonacularAPIKey}`
//   )
//   .then((recipe) => {
//     // recipe.push(recipe.data.name)
//     console.log('recipe is ', recipe.results)
//   })

axios
  .get(
    `https://api.spoonacular.com/recipes/324694/analyzedInstructions?apiKey=${SpoonacularAPIKey}`
  )
  .then(recipe => {
    // recipe.push(recipe.data.name)
    console.log('recipe is ', recipe)
  })
