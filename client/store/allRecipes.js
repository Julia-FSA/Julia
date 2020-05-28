const AWS = require('aws-sdk')
const {awsConfig} = require('../../secret')
AWS.config.update(process.env.AWS_CONFIG || awsConfig)
let docClient = new AWS.DynamoDB.DocumentClient()

/**
 * ACTION TYPES
 */
const GET_RECIPES = 'GET_RECIPES'

/**
 * INITIAL STATE = array of recipes
 */
const initialState = []

/**
 * ACTION CREATORS
 */
const getRecipes = (recipes) => ({
  type: GET_RECIPES,
  recipes,
})

/**
 * THUNK CREATORS
 */
export const updatedRecipe = (userId, recipeIndex) => async (dispatch) => {
  try {
    var params = {
      TableName: 'users',
      Key: {
        email_id: 'example-1@gmail.com',
      },
      UpdateExpression: 'set updated_by = :byUser, is_deleted = :boolValue',
      ExpressionAttributeValues: {
        ':byUser': 'updateUser',
        ':boolValue': true,
      },
      ReturnValues: 'UPDATED_NEW',
    }
    docClient.update(params, function (err, data) {
      if (err) {
        console.log('users::update::error - ' + JSON.stringify(err, null, 2))
      } else {
        console.log('users::update::success ' + JSON.stringify(data))
        dispatch(getRecipes(data))
      }
    })
  } catch (error) {
    console.error(error)
  }
}

/**
 * REDUCER
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_RECIPES:
      return action.recipes
    default:
      return state
  }
}
