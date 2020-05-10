import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_SINGLE_RECIPE = 'GET_SINGLE_RECIPE'

/**
 * INITIAL STATE
 */
const initialState = {}

/**
 * ACTION CREATORS
 */
const getSingleRecipe = recipe => ({type: GET_SINGLE_RECIPE, recipe})

/**
 * THUNK CREATORS
 */
export const fetchedSingleRecipe = (userId, recipeId) => async dispatch => {
  try {
    const res = await axios.get(`/api/${userId}/recipes/${recipeId}`)

    dispatch(getSingleRecipe(res.data))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
const singleRecipeReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SINGLE_RECIPE:
      return {...action.recipe}
    default:
      return state
  }
}

export default singleRecipeReducer
