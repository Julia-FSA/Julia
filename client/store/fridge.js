/* eslint-disable no-case-declarations */
/* eslint-disable guard-for-in */
import axios from 'axios'
const {SpoonacularAPIKey} = require('../../secrets')
// action types
const GET_FRIDGE = 'GET_FRIDGE'
const ADD_TO_FRIDGE = 'ADD_TO_FRIDGE'
const REMOVE_FROM_FRIDGE = 'REMOVE_FROM_FRIDGE'

// action creator
export const getFridge = fridge => ({
  type: GET_FRIDGE,
  fridge
})

export const addToFridge = ingredient => ({
  type: ADD_TO_FRIDGE,
  ingredient
})

export const removeFromFridge = ingredient => ({
  type: REMOVE_FROM_FRIDGE,
  ingredient
})

export const getFridgeThunk = stockId => async dispatch => {
  try {
    const fridge = await axios.put(`/api/fridge/`, {stockId: stockId})
    let fridgeArray = []
    console.log(fridge.data)
    for (const item in fridge.data) {
      let itemObj = {
        ingredientName: item,
        ingredientQuantity: fridge.data[item].quantity,
        imageURL: fridge.data[item].img
      }
      fridgeArray.push(itemObj)
    }
    console.log('fridgeArray Thunk', fridgeArray)
    dispatch(getFridge(fridgeArray))
  } catch (error) {
    console.log(error)
  }
}

export const addToFridgeThunk = (stockId, ingredient) => async dispatch => {
  try {
    let imageURL = null
    const res = await axios.get(
      `https://api.spoonacular.com/food/ingredients/autocomplete?query=${ingredient}&number=1&apiKey=${SpoonacularAPIKey}`
    )
    if (res.data[0].image) {
      imageURL = `https://spoonacular.com/cdn/ingredients_250x250/${
        res.data[0].image
      }`
    }
    await axios.put(`/api/fridge/add`, {stockId, ingredient, imageURL})
    console.log('image from spoon', imageURL)
    dispatch(
      addToFridge({
        ingredientName: ingredient,
        ingredientQuantity: 1,
        imageURL: imageURL
      })
    )
  } catch (error) {
    console.log(error)
  }
}

export const removeFromFridgeThunk = (
  stockId,
  ingredientName
) => async dispatch => {
  try {
    const res = await axios.put('/api/fridge/remove', {stockId, ingredientName})
    dispatch(removeFromFridge(ingredientName))
  } catch (error) {
    console.log(error)
  }
}
let defaultFridge = []
export default function(state = defaultFridge, action) {
  switch (action.type) {
    case GET_FRIDGE:
      return action.fridge
    case ADD_TO_FRIDGE:
      console.log('ADD_TO_FRIDGE')

      for (let i = 0; i < state.length; i++) {
        if (state[i].ingredientName === action.ingredient.ingredientName) {
          return state
        }
      }
      return [...state, action.ingredient]

    case REMOVE_FROM_FRIDGE:
      return state.filter(ingredient => {
        return ingredient.ingredientName !== action.ingredient
      })
    default:
      return state
  }
}
