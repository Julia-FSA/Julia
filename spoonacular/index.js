// const Alexa = require('ask-sdk-core');
const axios = require('axios')
const {SpoonacularAPIKey} = require('./secrets.js')
let recipe = []

const id = 9226 //papaya id in spoonacular

axios
  .get(
    `https://api.spoonacular.com/food/ingredients/${id}/information?apiKey=${SpoonacularAPIKey}`
  )
  .then(ingredient => {
    recipe.push(ingredient.data.name)
    console.log('ingredient is ', ingredient.data.name)
  })
