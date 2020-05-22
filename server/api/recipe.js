const axios = require('axios')
const {SpoonacularAPIKey} = process.env.SpoonacularAPIKey
  ? {SpoonacularAPIKey: process.env.SpoonacularAPIKey}
  : require('../../secrets')
const db = require('../db')
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
        id: req.params.id
      }
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

    const sortedRecipes = result.data.sort(function(a, b) {
      return b.likes - a.likes
    })
    const filteredRecipes = sortedRecipes.filter(recipe => {
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

    let params2 = {
      TableName: 'users',
      Key: {
        id: req.params.id
      }
    }

    const data2 = await db.get(params2).promise()
    const favorites = Object.keys(data2.Item.recipes)
    const favorited = favorites.includes(goodRecipe.id)
    goodRecipe.favorited = favorited

    const obj = {
      goodRecipe,
      index,
      sortedRecipes
    }
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
    res.json(recipe.data)
  } catch (error) {
    next(error)
  }
})

router.get('/save/:userId/:recipeId', async (req, res, next) => {
  const {recipeId, userId} = req.params
  console.log('recipeId', 'userId', recipeId, userId)
  const params1 = {
    TableName: 'users',
    Key: {
      id: userId
    }
  }

  try {
    const data = await db.get(params1).promise()
    let arr = data.Item.recipes
    console.log('arr', arr)
    const id = Number(recipeId)
    if (!arr.includes(id)) {
      arr.push(id)
      const params2 = {
        TableName: 'users',
        Key: {
          id: userId
        },
        UpdateExpression: 'set recipes = :r',
        ExpressionAttributeValues: {
          ':r': arr
        },
        ReturnValues: 'ALL_NEW'
      }

      try {
        await db.update(params2).promise()
      } catch (err) {
        console.log(err)
      }
    }
  } catch (err) {
    console.log(err)
  }
})

router.get('/favorites/:userId', async (req, res, next) => {
  let userId = req.params.userId
  try {
    const params1 = {
      TableName: 'users',
      Key: {
        id: userId
      }
    }

    const data1 = await db.get(params1).promise()
    const recipesArr = data1.Item.recipes
    const favoriteRecipes = {}

    for (let i = 0; i < recipesArr.length; i++) {
      const params2 = {
        TableName: 'recipes',
        Key: {
          id: recipesArr[i]
        }
      }

      const data2 = await db.get(params2).promise()
      if (data2.Item) {
        console.log('data2', data2)
        const {title} = data2.Item
        favoriteRecipes[title] = data2.Item
      }
    }

    res.json(favoriteRecipes)
  } catch (error) {
    next(error)
  }
})

router.get('/:userId/:recipeId', async (req, res, next) => {
  const {recipeId, userId} = req.params.id
  try {
    const recipe = await axios.get(
      `https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=false&amount=1&apiKey=${SpoonacularAPIKey}`
    )

    const params = {
      TableName: 'users',
      Key: {
        id: userId
      }
    }

    const data = await db.get(params).promise()
    const favorites = Object.keys(data.Item.recipes)
    const favorited = favorites.includes(recipe.data.id)
    recipe.data.favorited = favorited

    res.json(recipe.data)
  } catch (error) {
    next(error)
  }
})
