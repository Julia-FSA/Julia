const axios = require('axios')
const {SpoonacularAPIKey} = require('../../../secrets.js')
const router = require('express').Router()
module.exports = router

const recipeFormatter = recipe => {
  let rec = {
    id: recipe.id,
    ingredients: [],
    readyInMinutes: recipe.readyInMinutes,
    servings: recipe.servings,
    steps: [],
    title: recipe.title,
    vegan: recipe.vegan,
    vegetarian: recipe.vegetarian
  }
  recipe.analyzedInstructions[0].steps.forEach(step => {
    rec.steps.push(`Step ${step.number}: ${step.step}`)
    step.ingredients.forEach(ingredient => {
      if (!rec.ingredients.includes(ingredient.id)) {
        rec.ingredients.push(ingredient.id, `${ingredient.name}`)
      }
    })
  })
  return rec
}

router.get('/byIngredient/:ingredients', (req, res, next) => {
  let ingredientStr = req.params.ingredients
  // for (let i = 0; i < ingredients.length; i++) {
  //   if (i === ingredients.length - 1) ingredientStr += ingredients[i]
  //   else ingredientStr += ingredients[i] + ',+'
  // }
  try {
    axios
      .get(
        `https://api.spoonacular.com/recipes/complexSearch?includeIngredients=${ingredientStr}&addRecipeInformation=true&instructionsRequired=true&number=1&apiKey=${SpoonacularAPIKey}`
      )
      .then(recipe => {
        res.json(recipeFormatter(recipe.data.results[0]))
      })
  } catch (error) {
    console.error('There is no recipe available with thoes ingredients')
  }
})

router.get('/byId/:id', (req, res, next) => {
  let id = req.params.id
  try {
    axios
      .get(
        `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&amount=1&apiKey=${SpoonacularAPIKey}`
      )
      .then(recipe => {
        res.json(recipeFormatter(recipe.data))
      })
  } catch (error) {
    console.error('Cannot find a recipe with that id')
  }
})
