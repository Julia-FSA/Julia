import axios from 'axios'

const initialState = {
  selectedRecipe: {},
  index: 0,
  top10Recipes: [],
  favoriteRecipes: {}
}

// Action Types
const SET_RECIPE_RESULTS = 'SET_RECIPE_RESULTS'
const SET_NEXT_RECIPE = 'SET_NEXT_RECIPE'
const SET_THIS_RECIPE = 'SET_THIS_RECIPE'
const SET_FAVORITE_RECIPES = 'SET_FAVORITE_RECIPES'

// Actions Creators
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

export const setThisRecipe = selectedRecipe => {
  return {
    type: SET_THIS_RECIPE,
    selectedRecipe
  }
}

export const setFavoriteRecipes = favoriteRecipes => {
  return {
    type: SET_FAVORITE_RECIPES,
    favoriteRecipes
  }
}

// Thunk Creators
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

export const fetchNextRecipe = (userId, top10Recipes, index) => {
  return async dispatch => {
    console.log('fetchingNextRecipe in store', userId, top10Recipes, index)
    try {
      if (top10Recipes.length <= index) index = 0
      const res = await axios.get(
        `/api/recipe/${userId}/${top10Recipes[index].id}`
      )
      if (res.data.analyzedInstructions.length) {
        dispatch(setNextRecipe(res.data, index))
      } else if (top10Recipes.length >= index + 1) {
        await dispatch(fetchNextRecipe(userId, top10Recipes, index + 1))
      } else {
        await dispatch(fetchNextRecipe(userId, top10Recipes, 0))
      }
    } catch (error) {
      console.log(error)
    }
  }
}

export const fetchThisRecipe = id => {
  return async dispatch => {
    try {
      const res = await axios.get(`/api/recipe/myrecipes/${id}`)
      if (res.data.title) {
        dispatch(setThisRecipe(res.data))
      }
    } catch (error) {
      console.log(error)
    }
  }
}

export const fetchFavoriteRecipes = userId => {
  return async dispatch => {
    try {
      const {data} = await axios.get(`/api/recipe/favorites/${userId}`)
      dispatch(setFavoriteRecipes(data))
    } catch (error) {
      console.log(error)
    }
  }
}

export const saveRecipe = (userId, recipeId) => {
  return async () => {
    try {
      await axios.get(`/api/recipe/save/${userId}/${recipeId}`)
    } catch (error) {
      console.log(error)
    }
  }
}

export const unsaveRecipe = (userId, recipeId) => {
  return async () => {
    try {
      await axios.get(`/api/recipe/unsave/${userId}/${recipeId}`)
    } catch (error) {
      console.log(error)
    }
  }
}

// Recipes Reducer
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
    case SET_THIS_RECIPE: {
      return {
        ...state,
        selectedRecipe: action.selectedRecipe
      }
    }
    case SET_FAVORITE_RECIPES: {
      return {
        ...state,
        favoriteRecipes: action.favoriteRecipes
      }
    }
    default:
      return state
  }
}

export default recipesReducer
