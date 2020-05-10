// const Alexa = require('ask-sdk-core');
const axios = require('axios')
const {SpoonacularAPIKey} = require('../secrets.js')

let ingr = {
  id: 0,
  aisle: 'default',
  name: 'default',
  imageURL: 'defaultURL',
  unit: 'peice'
}
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

const getFromSpoon = (caseType, id, ingredients, name) => {
  if (caseType === 'ingredientByName') {
    axios
      .get(
        `https://api.spoonacular.com/food/ingredients/autocomplete?query=${name}&metaInformation=true&number=1&apiKey=${SpoonacularAPIKey}`
      )
      .then(ingredient => {
        ingr.id = ingredient.data[0].id
        ingr.aisle = ingredient.data[0].aisle
        ingr.name = ingredient.data[0].name
        ingr.imageURL = ingredient.data[0].image
        ingr.unit = ingredient.data[0].possibleUnits
        console.log('ingredient is ', ingr)
      })
  }

  if (caseType === 'ingredientById') {
    axios
      .get(
        `https://api.spoonacular.com/food/ingredients/${id}/information?amount=1&apiKey=${SpoonacularAPIKey}`
      )

      .then(ingredient => {
        ingr.id = ingredient.data.id
        ingr.aisle = ingredient.data.aisle
        ingr.name = ingredient.data.name
        ingr.imageURL = ingredient.data.image
        ingr.unit = ingredient.data.possibleUnits
        console.log('ingredient is ', ingr)
      })
  }

  if (caseType === 'findByIngredients') {
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
  }

  if (caseType === 'recipeById') {
    axios
      .get(
        `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&amount=1&apiKey=${SpoonacularAPIKey}`
      )
      .then(recipe => {
        let stepArr = [],
          ingrArr = []
        let resultObj = recipe.data
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
  }
}
getFromSpoon('ingredientByName', 0, [], 'apple')
getFromSpoon('ingredientById', 9266, [], null)
getFromSpoon('findByIngredients', 0, ['peppers', 'steak'], null)
getFromSpoon('recipeById', 531686, [], null)

// switch(callType){
//   case 'ingredientByName':
//     require('./ingrByName');
//     break;
//   case 'ingredientById':
//     require('./ingrById');
//     break;
//   case 'findByIngredients':
//     require('./recByIngr');
//     break;
//   case 'recipeById':
//     require('./recById');
//     break;
//   default:
//       console.log('Call to Spoonacular did not work, Please check your callType string')

// }
