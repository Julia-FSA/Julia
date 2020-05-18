const router = require('express').Router()
var AWS = require('aws-sdk')
const {awsConfig} = require('../../secrets')
AWS.config.update(awsConfig)
let docClient = new AWS.DynamoDB.DocumentClient()
// route to access user fridge. Takes in param from fridge store and retrives data from dynamoDB then sends a json to /api/fridge
router.get('/', async (req, res, next) => {
  try {
    let stockId = Number(req.query.userId)
    console.log(stockId)
    let params = {
      TableName: 'stocks',
      Key: {
        id: stockId,
      },
    }
    await docClient.get(params, function (err, data) {
      if (err) {
        res.json(err)
      } else {
        res.json(data.Item.ingredients)
      }
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
