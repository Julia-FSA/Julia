const router = require('express').Router()
var AWS = require('aws-sdk')
const {awsConfig} = require('../../secrets')
AWS.config.update(awsConfig)
let docClient = new AWS.DynamoDB.DocumentClient()
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
    const data = await docClient.get(params).promise()
    console.log(data.Item.ingredients)
    res.json(data.Item.ingredients)
  } catch (error) {
    next(error)
  }
})

router.put('/add', async (req, res, next) => {
  try {
    let stockId = req.body.stockId
    let params = {
      TableName: 'stocks'
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router
