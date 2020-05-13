var AWS = require('aws-sdk')

const {awsConfig} = require('../secrets')

AWS.config.update(process.env.AWS_CONFIG || awsConfig)
let docClient = new AWS.DynamoDB.DocumentClient()

let fetchOneByKey = function(tableName, stockId) {
  var params = {
    TableName: tableName,
    Key: {
      id: stockId
    }
  }
  docClient.get(params, function(err, data) {
    if (err) {
      console.log(
        'users::fetchOneByKey::error - ' + JSON.stringify(err, null, 2)
      )
    } else {
      console.log(
        'users::fetchOneByKey::success - ' + JSON.stringify(data, null, 2)
      )
      console.log(data.Item.ingredients)
    }
  })
}
let ingred = "dan's recipe"
async function queryName(ingre) {
  const results = await docClient
    .scan({
      TableName: 'test',
      FilterExpression: '#title = :title',
      ExpressionAttributeNames: {
        '#title': 'title'
      },
      ExpressionAttributeValues: {
        ':title': ingre
      }
    })
    .promise()
  console.log(results.Items)
}
// fetchOneByKey('stocks', 2)
queryName(ingred)
