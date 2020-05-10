/**********
 *
 * a user signs up => make an entry to the users table
 * a user uses a recipe (click "USE" button???)=> update the made_recipe_ids column in the users table by inserting the recipe name or id
 * a user can delete recipe from the history (i.e. update the made_recipe_ids column for the user)
 *
 **********/

var AWS = require('aws-sdk')
const {awsConfig} = require('../../secret')
AWS.config.update(process.env.AWS_CONFIG || awsConfig)
let docClient = new AWS.DynamoDB.DocumentClient()

/**
 * ACTION TYPES
 */
const GET_RECIPE_HISTORY = 'GET_RECIPE_HISTORY'

/**
 * INITIAL STATE = array of recipes
 */
const initialState = []

/**
 * ACTION CREATORS
 */
const getRecipes = recipes => ({
  type: GET_RECIPE_HISTORY,
  recipes
})

/**
 * THUNK CREATORS
 */
export const fetchedRecipeHistory = () => async dispatch => {
  try {
    var params = {
      TableName: 'users'
      // Key: {
      //   saved_recipe_ids: searchTerm,
      // },
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
        dispatch(getRecipes(data.saved_recipe_ids))
      }
    })
  } catch (err) {
    console.error(err)
  }
}

export const updatedRecipeHistory = (userId, recipeIndex) => async dispatch => {
  try {
    var params = {
      TableName: 'users',
      Key: {
        email_id: 'example-1@gmail.com'
      },
      UpdateExpression: 'set updated_by = :byUser, is_deleted = :boolValue',
      ExpressionAttributeValues: {
        ':byUser': 'updateUser',
        ':boolValue': true
      },
      ReturnValues: 'UPDATED_NEW'
    }
    docClient.update(params, function(err, data) {
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
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_RECIPE_HISTORY:
      return action.recipes
    default:
      return state
  }
}
