const axios = require('axios')
const {SpoonacularAPIKey} = require('../../secrets.js')
const db = require('../db')
const router = require('express').Router()
module.exports = router

const recipeFormatter = (recipe) => {
  let rec = {
    id: recipe.id,
    ingredients: [],
    readyInMinutes: recipe.readyInMinutes,
    servings: recipe.servings,
    steps: [],
    title: recipe.title,
    vegan: recipe.vegan,
    vegetarian: recipe.vegetarian,
  }
  recipe.analyzedInstructions[0].steps.forEach((step) => {
    rec.steps.push(`Step ${step.number}: ${step.step}`)
    step.ingredients.forEach((ingredient) => {
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
      .then((recipe) => {
        // console.log('RECIPE >>>>>>>>>>>>>', recipe.data.results)
        res.json(recipeFormatter(recipe.data.results[0]))
      })
  } catch (error) {
    next(error)
  }
})

router.get('/findrecipe/:id', async (req, res, next) => {
  try {
    let params = {
      TableName: 'stocks',
      Key: {
        id: req.params.id,
      },
    }

    const data = await db.get(params).promise()
    let ingredients = Object.keys(data.Item.ingredients)

    let ingredientStr = ''
    for (let i = 0; i < ingredients.length; i++) {
      if (i === ingredients.length - 1) ingredientStr += ingredients[i]
      else ingredientStr += ingredients[i] + ',+'
    }

    let result = await axios.get(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientStr}&number=10&ranking=2&ignorePantry=true&apiKey=${SpoonacularAPIKey}`
    )

    const sortedRecipes = result.data.sort(function (a, b) {
      return b.likes - a.likes
    })
    const filteredRecipes = sortedRecipes.filter((recipe) => {
      return (
        recipe.missedIngredientCount === result.data[0].missedIngredientCount
      )
    })

    let goodRecipe
    let index
    for (let i = 0; i < filteredRecipes.length; i++) {
      let id = filteredRecipes[i].id

      const response = await axios.get(
        `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&amount=1&apiKey=${SpoonacularAPIKey}`
      )
      if (response.data.analyzedInstructions.length) {
        goodRecipe = response.data
        index = i
        break
      }
    }

    const obj = {
      goodRecipe,
      index,
      sortedRecipes,
    }
    console.log('RECIPE >>>>>>>>>>>>>', obj)
    res.json(obj)
  } catch (error) {
    next(error)
  }
})

router.get('/byRecipeName/:recipeName', async (req, res, next) => {
  let recipeName = req.params.recipeName
  try {
    let recipe = await axios.get(
      `https://api.spoonacular.com/recipes/search?query=${recipeName}&apiKey=${SpoonacularAPIKey}`
    )
    console.log('RECIPE >>>>>>>>>>>>>', recipe.data.results[0].id)
    // if (recipe.data.result[0].id) {
    //   recipe = await axios.get(`api/recipe/${recipe.data.results[0].id}`)
    // }
    res.json(recipe.data)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', (req, res, next) => {
  let id = req.params.id
  console.log('getting recipe by id')
  try {
    axios
      .get(
        `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&amount=1&apiKey=${SpoonacularAPIKey}`
      )
      .then((recipe) => {
        console.log('found recipe by id')
        console.log('recipe.data', recipe.data)
        res.json(recipe.data)
      })
  } catch (error) {
    next(error)
  }
})
