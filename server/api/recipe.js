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
    const favorites = data2.Item.favorites || []
    const favorited = favorites.includes(goodRecipe.id)
    console.log('data2', data2)
    console.log('favorites', favorites)
    console.log('favorited', favorited)
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
  const userInfo = {
    TableName: 'users',
    Key: {
      id: userId
    }
  }

  try {
    const data = await db.get(userInfo).promise()
    let arr = data.Item.favorites || []
    const id = Number(recipeId)
    if (!arr.includes(id)) {
      arr.push(id)
      const userFavorites = {
        TableName: 'users',
        Key: {
          id: userId
        },
        UpdateExpression: 'set favorites = :f',
        ExpressionAttributeValues: {
          ':f': arr
        },
        ReturnValues: 'ALL_NEW'
      }

      console.log('pinging spoon')
      const result = await axios.get(
        `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&amount=1&apiKey=${SpoonacularAPIKey}`
      )

      const detailedRecipe = result.data
      console.log(
        'detailedRecipe.analyzedInstructions',
        detailedRecipe.analyzedInstructions
      )

      const reducedRecipe = {
        TableName: 'recipes',
        Key: {id: detailedRecipe.id},
        UpdateExpression:
          'set ingredients = :ingredients, readyInMinutes = :readyInMinutes, servings = :servings, steps = :steps, image = :image, title = :title, vegan = :vegan, vegetarian = :vegetarian, likes = :likes',
        ExpressionAttributeValues: {
          ':ingredients': detailedRecipe.extendedIngredients,
          ':readyInMinutes': detailedRecipe.readyInMinutes,
          ':servings': detailedRecipe.servings,
          ':steps': detailedRecipe.analyzedInstructions[0].steps,
          ':image': detailedRecipe.image,
          ':title': detailedRecipe.title,
          ':vegan': detailedRecipe.vegan,
          ':vegetarian': detailedRecipe.vegetarian,
          ':likes': detailedRecipe.aggregateLikes
        }
      }

      await db.update(reducedRecipe).promise()
      await db.update(userFavorites).promise()
    }
    res.status(200).send('Ok.')
  } catch (err) {
    console.log(err)
  }
})

router.get('/unsave/:userId/:recipeId', async (req, res, next) => {
  const {recipeId, userId} = req.params
  const params1 = {
    TableName: 'users',
    Key: {
      id: userId
    }
  }

  try {
    const data = await db.get(params1).promise()
    let arr = data.Item.favorites || []
    console.log('arr', arr)
    const id = Number(recipeId)
    if (arr.includes(id)) {
      arr.splice(arr.indexOf(id), 1)
      const params2 = {
        TableName: 'users',
        Key: {
          id: userId
        },
        UpdateExpression: 'set favorites = :f',
        ExpressionAttributeValues: {
          ':f': arr
        },
        ReturnValues: 'ALL_NEW'
      }

      console.log('new arr', arr)

      try {
        await db.update(params2).promise()
      } catch (err) {
        console.log(err)
      }

      res.status(200).send('Ok.')
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
    const recipesArr = data1.Item.favorites || []
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
  const {recipeId, userId} = req.params
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
    const favorites = data.Item.favorites || []
    const favorited = favorites.includes(recipe.data.id)
    recipe.data.favorited = favorited

    res.json(recipe.data)
  } catch (error) {
    next(error)
  }
})

router.get('/:recipeId', async (req, res, next) => {
  const {recipeId} = req.params
  try {
    const params = {
      TableName: 'recipes',
      Key: {
        id: Number(recipeId)
      }
    }

    const recipe = await db.get(params).promise()
    res.json(recipe.data)
  } catch (error) {
    next(error)
  }
})
