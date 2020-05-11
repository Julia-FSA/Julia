import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_RECIPE_HISTORY = 'GET_RECIPE_HISTORY'

/**
 * INITIAL STATE
 */
const initialState = {}

/**
 * ACTION CREATORS
 */
const getRecipeHistory = (recipe) => ({type: GET_RECIPE_HISTORY, recipe})

/**
 * THUNK CREATORS
 */
export const fetchedRecipeHistory = () => async (dispatch) => {
  try {
    var params = {
      TableName: 'users',
      // Key: {
      //   saved_recipe_ids: searchTerm,
      // },
    }
    docClient.get(params, function (err, data) {
      if (err) {
        console.log(
          'users::fetchOneByKey::error - ' + JSON.stringify(err, null, 2)
        )
      } else {
        console.log(
          'users::fetchOneByKey::success - ' + JSON.stringify(data, null, 2)
        )
        dispatch(getRecipeHistory(data))
      }
    })
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
const recipeHistoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_RECIPE_HISTORY:
      return {...action.recipe}
    default:
      return state
  }
}

export default recipeHistoryReducer
