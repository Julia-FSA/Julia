var AWS = require('aws-sdk')
const {awsConfig} = require('../secrets')

AWS.config.update(process.env.AWS_CONFIG || awsConfig)
let docClient = new AWS.DynamoDB.DocumentClient()

const axios = require('axios')
const id = 9226
const spoonacularAPIKey = 'ba51c1e2686d4c01abb5c4cdf16fb881'
let ingred
async function getSpoon() {
  try {
    const res = await axios.get(
      `https://api.spoonacular.com/food/ingredients/${id}/information?apiKey=${spoonacularAPIKey}`
    )
    console.log(res.data.name)
    const input = {
      id: res.data.id,
      name: res.data.name
    }
    const params = {
      TableName: 'ingredients',
      Item: input
    }

    await docClient.put(params).promise()
  } catch (error) {
    console.log(error)
  }
}

getSpoon()

// let save = function() {
//   var input = {
//     email_id: 'example-1@gmail.com',
//     created_by: 'clientUser',
//     created_on: new Date().toString(),
//     updated_by: 'clientUser',
//     updated_on: new Date().toString(),
//     is_deleted: false
//   }
//   var params = {
//     TableName: 'users',
//     Item: input
//   }
//   docClient.put(params, function(err, data) {
//     if (err) {
//       console.log('users::save::error - ' + JSON.stringify(err, null, 2))
//     } else {
//       console.log('users::save::success')
//     }
//   })
// }
