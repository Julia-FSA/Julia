var AWS = require('aws-sdk')

const {awsConfig} = require('../secrets')

AWS.config.update(process.env.AWS_CONFIG || awsConfig)
let docClient = new AWS.DynamoDB.DocumentClient()

const getFullRecipe = async recArr => {
  try {
    const keyArr = recArr.map(rec => ({id: rec}))
    let params = {
      RequestItems: {
        recipes: {
          Keys: keyArr
        }
      }
    }
    const data = await docClient.batchGet(params).promise()
    return data.Responses.recipes
  } catch (error) {
    console.error(error)
  }
}
const getRecipeUser = async userID => {
  try {
    const params = {
      TableName: 'users',
      Key: {id: userID}
    }
    let data = await docClient.get(params).promise()
    getFullRecipe(data.Item.saved_recipe_ids)
  } catch (error) {
    console.error(error)
  }
}

getRecipeUser('2')
// let fetchOneByKey = function(tableName, stockId) {

//   var params = {
//     TableName: tableName,
//     Key: {

//       id: stockId
//     }

//   }
//   docClient.get(params, function (err, data) {
//     if (err) {
//       console.log(
//         'users::fetchOneByKey::error - ' + JSON.stringify(err, null, 2)
//       )
//     } else {
//       console.log(
//         'users::fetchOneByKey::success - ' + JSON.stringify(data, null, 2)
//       )
//       console.log(data.Item.ingredients)
//     }
//   })
// }

// fetchOneByKey('stocks', 2)
