const router = require('express').Router()
const {SpoonacularAPIKey} = require('../../secrets')
const axios = require('axios')
const db = require('../db')

// route to access user fridge. Takes in param from fridge store and retrives data from dynamoDB then sends a json to /api/fridge
router.put('/', async (req, res, next) => {
  try {
    let stockId = req.body.stockId
    console.log(stockId)
    let params = {
      TableName: 'stocks',
      Key: {
        id: stockId
      }
    }
    const data = await db.get(params).promise()
    console.log(data.Item.ingredients)
    res.json(data.Item.ingredients)
  } catch (error) {
    next(error)
  }
})

router.put('/add', async (req, res, next) => {
  try {
    let stockId = req.body.stockId
    let ingredient = req.body.ingredient
    let imageURL = req.body.imageURL
    let result = await db
      .get({
        TableName: 'stocks',
        Key: {id: stockId}
      })
      .promise()
    let prevIngredients = result.Item.ingredients
    if (prevIngredients[ingredient]) {
      prevIngredients[ingredient].quantity++
    } else {
      prevIngredients[ingredient] = {
        quantity: 1,
        unit: 'each',
        img: imageURL
      }
    }
    const params = {
      TableName: 'stocks',
      Key: {id: stockId},
      UpdateExpression: 'set ingredients = :ingred',
      ExpressionAttributeValues: {
        ':ingred': prevIngredients
      }
    }
    await db.update(params).promise()
    res.sendStatus(200)
  } catch (error) {
    next(error)
  }
})

router.put('/remove', async (req, res, next) => {
  try {
    let stockId = req.body.stockId
    let ingredientName = req.body.ingredientName
    let result = await db
      .get({
        TableName: 'stocks',
        Key: {id: stockId}
      })
      .promise()
    let prevIngredients = result.Item.ingredients
    if (prevIngredients[ingredientName]) {
      delete prevIngredients[ingredientName]
    }
    const params = {
      TableName: 'stocks',
      Key: {id: stockId},
      UpdateExpression: 'set ingredients = :ingred',
      ExpressionAttributeValues: {
        ':ingred': prevIngredients
      }
    }

    await db.update(params).promise()
    res.sendStatus(200)
  } catch (error) {
    next(error)
  }
})

module.exports = router
