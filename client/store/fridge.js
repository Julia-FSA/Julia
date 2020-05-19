/* eslint-disable no-case-declarations */
/* eslint-disable guard-for-in */
import axios from 'axios'

// action types
const GET_FRIDGE = 'GET_FRIDGE'
const ADD_TO_FRIDGE = 'ADD_TO_FRIDGE'

// action creator
export const getFridge = fridge => ({
  type: GET_FRIDGE,
  fridge
})

export const addToFridge = ingredient => ({
  type: ADD_TO_FRIDGE,
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
        ingredientQuantity: fridge.data[item].quantity
      }
      fridgeArray.push(itemObj)
    }
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
let defaultFridge = []
export default function(state = defaultFridge, action) {
  switch (action.type) {
    case GET_FRIDGE:
      return action.fridge
    case ADD_TO_FRIDGE:
      console.log('ADD_TO_FRIDGE')
      return [...state, action.ingredient]
    default:
      return state
  }
}
