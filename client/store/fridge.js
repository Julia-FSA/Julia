/* eslint-disable no-case-declarations */
/* eslint-disable guard-for-in */
import axios from 'axios'

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
      console.log('each item', item)
      let itemObj = {
        ingredientName: item,
        ingredientQuantity: fridge.data[item].quantity,
        imgURL: fridge.data[item].img
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
    console.log('i am getting triggered')
    const res = await axios.put(`/api/fridge/add`, {stockId, ingredient})
    dispatch(addToFridge({ingredientName: ingredient, ingredientQuantity: 1}))
    console.log('after dispatch')
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
      return [...state, action.ingredient]
    case REMOVE_FROM_FRIDGE:
      return state.filter(ingredient => {
        return ingredient.ingredientName !== action.ingredient
      })
    default:
      return state
  }
}
