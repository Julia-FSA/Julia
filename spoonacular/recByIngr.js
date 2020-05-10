const axios = require('axios')
const {SpoonacularAPIKey} = require('../secrets.js')
const router = require('express').Router()
module.exports = router

let rec = {
  id: 0,
  ingredients: [],
  readyInMinutes: 0,
  servings: 0,
  steps: [],
  title: '',
  vegan: false,
  vegetarian: false
}
//  ['peppers', 'steak', cheddar cheese]
router.get('/')

let ingredientStr = ''
for (let i = 0; i < ingredients.length; i++) {
  if (i === ingredients.length - 1) ingredientStr += ingredients[i]
  else ingredientStr += ingredients[i] + ',+'
}
axios
  .get(
    `https://api.spoonacular.com/recipes/complexSearch?includeIngredients=${ingredientStr}&addRecipeInformation=true&instructionsRequired=true&number=1&apiKey=${SpoonacularAPIKey}`
  )
  .then(recipe => {
    let stepArr = [],
      ingrArr = []
    let resultObj = recipe.data.results[0]
    rec.id = resultObj.id
    rec.title = resultObj.title
    rec.readyInMinutes = resultObj.readyInMinutes
    rec.servings = resultObj.servings
    rec.vegan = resultObj.vegan
    rec.vegetarian = resultObj.vegetarian
    // rec.steps = resultObj.analyzedInstructions[0].steps;
    resultObj.analyzedInstructions[0].steps.forEach(step => {
      stepArr.push(`Step ${step.number}: ${step.step}`)
      step.ingredients.forEach(ingredient => {
        if (!ingrArr.includes(ingredient.id)) {
          ingrArr.push(ingredient.id, `${ingredient.name}`)
        }
      })
    })
    rec.ingredients = ingrArr
    rec.steps = stepArr
    console.log('recipe is ', rec)
  })
