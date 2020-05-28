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
const getSingleRecipe = (recipe) => ({type: GET_SINGLE_RECIPE, recipe})

/**
 * THUNK CREATORS
 */
export const fetchedSingleRecipe = (id, SpoonacularAPIKey) => async (
  dispatch
) => {
  try {
    let {data} = await axios.get(
      `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&amount=1&apiKey=${SpoonacularAPIKey}`
    )
    dispatch(getSingleRecipe(data))
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
