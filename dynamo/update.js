var AWS = require('aws-sdk')
const {awsConfig} = require('../secrets')

AWS.config.update(process.env.AWS_CONFIG || awsConfig)
let docClient = new AWS.DynamoDB.DocumentClient()

let modify = async function() {
  let result = await docClient
    .get({
      TableName: 'stocks',
      Key: {id: 4}
    })
    .promise()
  let prevIngredients = result.Item.ingredients
  //   prevIngredients.push({"ingredientName": "chickenFingers",
  //   "ingredientQuantity": 3,
  //   "unit":"each"
  // })
  var params = {
    TableName: 'stocks',
    Key: {id: 4},
    UpdateExpression: 'set ingredients = :ingred',
    ExpressionAttributeValues: {
      ':ingred': [
        ...prevIngredients,
        {
          ingredientName: 'pooop',
          ingredientQuantity: 2,
          unit: 'each'
        }
      ]
    }
  }
  await docClient.update(params).promise()
}

modify()
