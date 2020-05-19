import axios from 'axios'

const initialState = {
  selectedRecipe: {},
  top10Recipes: []
}

// Action Types
// const SET_ALL_SPECIES = 'SET_ALL_SPECIES'
const SET_RECIPE_RESULTS = 'SET_RECIPE_RESULTS'

// Actions Creators
// export const setAllSpecies = species => {
//   return {
//     type: SET_ALL_SPECIES,
//     species
//   }
// }

export const setRecipeResults = (selectedRecipe, top10Recipes) => {
  return {
    type: SET_RECIPE_RESULTS,
    selectedRecipe,
    top10Recipes
  }
}

// Thunk Creators
// export const fetchAllSpecies = () => {
//   return async dispatch => {
//     try {
//       const res = await axios.get('/api/species')
//       dispatch(setAllSpecies(res.data))
//     } catch (error) {
//       console.log(error)
//     }
//   }
// }

export const fetchSingleRecipe = id => {
  return async dispatch => {
    try {
      const res = await axios.get(`/api/recipe/findrecipe/${id}`)
      dispatch(setRecipeResults(res.data.goodRecipe, res.data.sortedRecipes))
    } catch (error) {
      console.log(error)
    }
  }
}

// SPECIES Reducer
const recipesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_RECIPE_RESULTS: {
      return {
        ...state,
        selectedRecipe: action.selectedRecipe,
        top10Recipes: action.top10Recipes
      }
    }
    default:
      return state
  }
}

export default recipesReducer
