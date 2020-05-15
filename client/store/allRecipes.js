/*********
 *
 * a user signs up => make an entry to the users table
 * a user saves/deletes a recipe => update the saved_recipe_ids column in the users table by inserting the recipe name or id
 *
 **********/

var AWS = require('aws-sdk')
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
export const fetchedRecipes = () => async (dispatch) => {
  try {
    // var params = {
    //   TableName: 'users',
    //   // Key: {
    //   //   saved_recipe_ids: searchTerm,
    //   // },
    // }
    // docClient.get(params, function (err, data) {
    //   if (err) {
    //     console.log(
    //       'users::fetchOneByKey::error - ' + JSON.stringify(err, null, 2)
    //     )
    //   } else {
    //     console.log(
    //       'users::fetchOneByKey::success - ' + JSON.stringify(data, null, 2)
    //     )
    //     dispatch(getRecipes(data.saved_recipe_ids))
    //   }
    // })
  } catch (err) {
    console.error(err)
  }
}

// export const addedRecipe = (userId, recipe) => async (dispatch) => {
//   try {
//     var input = {
//       email_id: 'example-1@gmail.com',
//       created_by: 'clientUser',
//       created_on: new Date().toString(),
//       updated_by: 'clientUser',
//       updated_on: new Date().toString(),
//       is_deleted: false,
//     }
//     var params = {
//       TableName: 'users',
//       Item: input,
//     }
//     docClient.put(params, function (err, data) {
//       if (err) {
//         console.log('users::save::error - ' + JSON.stringify(err, null, 2))
//       } else {
//         console.log('users::save::success')
//         dispatch(getRecipes(data))
//       }
//     })
//   } catch (error) {
//     console.error(error)
//   }
// }

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

// export const removedRecipe = (userId) => async (dispatch) => {
//   try {
//     var params = {
//       TableName: 'users',
//       Key: {
//         id: userId,
//       },
//     }
//     docClient.delete(params, function (err, data) {
//       if (err) {
//         console.log(
//           'users::fetchOneByKey::error - ' + JSON.stringify(err, null, 2)
//         )
//       } else {
//         console.log('users::delete::success')
//         dispatch(getRecipes(data))
//       }
//     })
//   } catch (error) {
//     console.error(error)
//   }
// }

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
