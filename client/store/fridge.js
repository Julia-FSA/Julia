/* eslint-disable no-case-declarations */
/* eslint-disable guard-for-in */
import axios from 'axios'
//fake database
const fridgeDB = [
  {
    ingredientName: 'apple',
    ingredientQuantity: 5,
    unit: 'each'
  },
  {
    ingredientName: 'orange',
    ingredientQuantity: 1,
    unit: 'each'
  },
  {
    ingredientName: 'tomato',
    ingredientQuantity: 3,
    unit: 'each'
  }
]
// action types
const GET_FRIDGE = 'GET_FRIDGE'

// action creator
export const getFridge = fridge => ({
  type: GET_FRIDGE,
  fridge
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
let defaultFridge = []
export default function(state = defaultFridge, action) {
  switch (action.type) {
    case GET_FRIDGE:
      return action.fridge
    default:
      return state
  }
}
