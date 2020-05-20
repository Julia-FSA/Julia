import axios from 'axios'

const initialState = {
  selectedRecipe: {},
  index: 0,
  top5Recipes: []
}

// Action Types
// const SET_ALL_SPECIES = 'SET_ALL_SPECIES'
const SET_RECIPE_RESULTS = 'SET_RECIPE_RESULTS'
const SET_NEXT_RECIPE = 'SET_NEXT_RECIPE'

// Actions Creators
// export const setAllSpecies = species => {
//   return {
//     type: SET_ALL_SPECIES,
//     species
//   }
// }

export const setRecipeResults = (selectedRecipe, index, top10Recipes) => {
  return {
    type: SET_RECIPE_RESULTS,
    selectedRecipe,
    index,
    top10Recipes
  }
}

export const setNextRecipe = (selectedRecipe, index) => {
  return {
    type: SET_NEXT_RECIPE,
    selectedRecipe,
    index
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

export const fetchNextRecipe = (top10Recipes, index) => {
  console.log('fetching next...')
  return async dispatch => {
    try {
      console.log('t10.len', top10Recipes.length, 'index', index)
      if (top10Recipes.length <= index) index = 0
      const res = await axios.get(`/api/recipe/${top10Recipes[index].id}`)
      console.log('res', res)
      if (res.data.analyzedInstructions.length) {
        dispatch(setNextRecipe(res.data, index))
      } else if (top10Recipes.length >= index + 1) {
        console.log('checking next recipe')
        console.log('top10Recipes', top10Recipes)
        console.log('index+1', index + 1)
        console.log('fetchNextRecipe', fetchNextRecipe)
        await dispatch(fetchNextRecipe(top10Recipes, index + 1))
      } else {
        console.log('going back to 0')
        await dispatch(fetchNextRecipe(top10Recipes, 0))
      }
    } catch (error) {
      console.log(error)
    }
  }
}

export const fetchFirstRecipe = userId => {
  return async dispatch => {
    try {
      const res = await axios.get(`/api/recipe/findrecipe/${userId}`)
      dispatch(
        setRecipeResults(
          res.data.goodRecipe,
          res.data.index,
          res.data.sortedRecipes
        )
      )
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
        index: action.index,
        top10Recipes: action.top10Recipes
      }
    }
    case SET_NEXT_RECIPE: {
      return {
        ...state,
        selectedRecipe: action.selectedRecipe,
        index: action.index
      }
    }
    default:
      return state
  }
}

export default recipesReducer
