var AWS = require('aws-sdk')

const {awsConfig} = require('../secrets')

AWS.config.update(process.env.AWS_CONFIG || awsConfig)
let docClient = new AWS.DynamoDB.DocumentClient()

const getRecipeById = async recipeId => {
  try {
    const params = {
      TableName: 'recipes',
      Key: {id: recipeId}
    }
    let data = await docClient.get(params).promise()
    console.log(`recipe ${recipeId} is:`, data.Item)
  } catch (error) {
    console.error(error)
  }
}

getRecipeById(123)

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

const getSavedRecipeIds = async userID => {
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

// getSavedRecipeIds('2')

const fetchOneByKey = async (tableName, stockId) => {
  try {
    const params = {
      TableName: tableName,
      Key: {
        id: stockId
      }
    }

    const data = await docClient.get(params).promise()
    console.log(data.Item.ingredients)
  } catch (err) {
    console.log(err)
  }
}

// fetchOneByKey('stocks', 2)
