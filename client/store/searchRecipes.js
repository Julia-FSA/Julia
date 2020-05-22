/*********
 *
 * a user signs up => make an entry to the users table
 * after adding food to the stock DB, user can look up what he/she can make
 * click a recipe => show recipe details (img, ingredients, steps, etc.)
 *
 **********/

import axios from 'axios'

/**
 * ACTION TYPES
 */
const SEARCH_RECIPE_BY_INGREDIENTS = 'SEARCH_RECIPE_BY_INGREDIENTS'
const SEARCH_RECIPE_BY_NAME = 'SEARCH_RECIPE_BY_NAME'

/**
 * INITIAL STATE
 */
const initialState = {}

/**
 * ACTION CREATORS
 */
const searchRecipeByIngredients = (recipe) => ({
  type: SEARCH_RECIPE_BY_INGREDIENTS,
  recipe,
})
const searchRecipeByName = (recipe) => ({
  type: SEARCH_RECIPE_BY_NAME,
  recipe,
})
/**
 * THUNK CREATORS
 */
export const searchedByIngredients = (ingredients) => async (dispatch) => {
  try {
    let recipe = await axios.get(`api/recipe/byIngredient/${ingredients}`)
    let {data} = await axios.get(`api/recipe/search/${recipe.data.id}`)
    dispatch(searchRecipeByIngredients(data))
  } catch (err) {
    console.error(err)
  }
}

export const searchedByRecipeName = (recipeName) => async (dispatch) => {
  try {
    let recipe = await axios.get(`api/recipe/byRecipeName/${recipeName}`)
    let {data} = await axios.get(
      `api/recipe/search/${recipe.data.results[0].id}`
    )
    dispatch(searchRecipeByName(data))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case SEARCH_RECIPE_BY_INGREDIENTS:
      return {...state, searchedRecipes: action.recipe}
    case SEARCH_RECIPE_BY_NAME:
      return {...state, searchedRecipes: action.recipe}
    default:
      return state
  }
}
