import axios from 'axios'

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
const getRecipes = recipes => ({
  type: GET_RECIPES,
  recipes
})

/**
 * THUNK CREATORS
 */
export const fetchedRecipes = userId => async dispatch => {
  try {
    const res = await axios.get(`/api/${userId}}/recipes`)
    dispatch(getRecipes(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const addedRecipe = (userId, recipe) => async dispatch => {
  try {
    await axios.post(`/api/${userId}}/recipes`, recipe)
    const {data} = await axios.get(`/api/${userId}}/recipes`)
    dispatch(getRecipes(data))
  } catch (error) {
    console.error(error)
  }
}

export const removedRecipe = (userId, recipeId) => async dispatch => {
  try {
    await axios.delete(`/api/${userId}}/recipes/${recipeId}`)
    const {data} = await axios.get(`/api/${userId}}/recipes`)
    dispatch(getRecipes(data))
  } catch (error) {
    console.error(error)
  }
}

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_RECIPES:
      return action.recipes
    default:
      return state
  }
}
