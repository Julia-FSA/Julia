// const Alexa = require('ask-sdk-core');
const axios = require('axios')
const {SpoonacularAPIKey} = require('../secrets.js')
// const router = require('express').Router()
// module.exports = router

// router.use('/recipeId', require('./recById'))

// router.use('/recipeIng', require('./recByIngr'))

// router.use('/ingredientName', require('./ingrByName'))

// router.use('/ingredientId', require('./ingrById'))

// router.use((req, res, next) => {
//   const error = new Error('Not Found')
//   error.status = 404
//   next(error)
// })

//*********if this works as is */
const ingredientFormatter = ingredient => {
  let ingr = {
    id: 0,
    aisle: 'default',
    name: 'default',
    imageURL: 'defaultURL',
    unit: 'peice'
  }
  ingr.id = ingredient.id
  ingr.aisle = ingredient.aisle
  ingr.name = ingredient.name
  ingr.imageURL = ingredient.image
  ingr.unit = ingredient.possibleUnits
  console.log('ingredient is ', ingr)
}

const recipeFormatter = recipe => {
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
  let stepArr = [],
    ingrArr = []

  rec.id = recipe.id
  rec.title = recipe.title
  rec.readyInMinutes = recipe.readyInMinutes
  rec.servings = recipe.servings
  rec.vegan = recipe.vegan
  rec.vegetarian = recipe.vegetarian
  // rec.steps = recipe.analyzedInstructions[0].steps;
  recipe.analyzedInstructions[0].steps.forEach(step => {
    stepArr.push(`Step ${step.number}: ${step.step}`)
    step.ingredients.forEach(ingredient => {
      if (!ingrArr.includes(ingredient.id)) {
        ingrArr.push(ingredient.id, `${ingredient.name}`)
      }
    })
  })
  rec.ingredients = ingrArr
  rec.steps = stepArr
  console.log(rec)
}

function getFromSpoon(callType, id, ingredients, name) {
  switch (callType) {
    case 'ingredientByName': {
      try {
        axios
          .get(
            `https://api.spoonacular.com/food/ingredients/autocomplete?query=${name}&metaInformation=true&number=1&apiKey=${SpoonacularAPIKey}`
          )
          .then(ingredient => {
            ingredientFormatter(ingredient.data[0])
          })
      } catch (error) {
        console.error('Cannot find ingredient under that name', error)
      }
      break
    }
    case 'ingredientById': {
      try {
        axios
          .get(
            `https://api.spoonacular.com/food/ingredients/${id}/information?amount=1&apiKey=${SpoonacularAPIKey}`
          )
          .then(ingredient => {
            ingredientFormatter(ingredient.data)
          })
      } catch (error) {
        console.error('Cannot find an ingredient with that id')
      }
      break
    }
    case 'findByIngredients': {
      let ingredientStr = ''
      for (let i = 0; i < ingredients.length; i++) {
        if (i === ingredients.length - 1) ingredientStr += ingredients[i]
        else ingredientStr += ingredients[i] + ',+'
      }
      try {
        axios
          .get(
            `https://api.spoonacular.com/recipes/complexSearch?includeIngredients=${ingredientStr}&addRecipeInformation=true&instructionsRequired=true&number=1&apiKey=${SpoonacularAPIKey}`
          )
          .then(recipe => {
            recipeFormatter(recipe.data.results[0])
          })
      } catch (error) {
        console.error('There is no recipe available with thoes ingredients')
      }
      break
    }
    case 'recipeById': {
      try {
        axios
          .get(
            `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&amount=1&apiKey=${SpoonacularAPIKey}`
          )
          .then(recipe => {
            recipeFormatter(recipe.data)
          })
      } catch (error) {
        console.error('Cannot find a recipe with that id')
      }
      break
    }
    default: {
      console.error(
        'Call to Spoonacular did not work, Please check your callType string'
      )
    }
  }
}
getFromSpoon('ingredientByName', 0, [], 'apple')
getFromSpoon('ingredientById', 9266, [], null)
getFromSpoon('findByIngredients', 0, ['peppers', 'steak'], null)
getFromSpoon('recipeById', 531686, [], null)
