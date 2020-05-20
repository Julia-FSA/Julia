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
const searchRecipe = (recipe) => ({
  type: SEARCH_RECIPE_BY_INGREDIENTS,
  recipe,
})

/**
 * THUNK CREATORS
 */
export const searchedRecipe = (id, SpoonacularAPIKey) => async (dispatch) => {
  try {
    let {data} = await axios.get(
      `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&amount=1&apiKey=${SpoonacularAPIKey}`
    )
    dispatch(searchRecipe(data))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
const searchRecipeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_RECIPE_BY_INGREDIENTS:
      return {...action.recipe}
    case SEARCH_RECIPE_BY_NAME:
      return {...action.recipe}
    default:
      return state
  }
}

export default searchRecipeReducer
