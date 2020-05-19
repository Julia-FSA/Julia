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

export const getFridgeThunk = () => async dispatch => {
  try {
    const userId =
      'AF56CVBWEI3WZM6BVEQ4YVWF6U7GUOFSPH47ZKANU7S6LPRE5CJY4OSCWBEGNK6WMMH474N3HW5YNZC3EYCVKLQNTTTW3WROV24KCEYW5B4B3CLRYUHXSJU5FFU7FLJ5AYIDQJ2WTHEJSA4WSOTEQXCXBQ463B6IV7EDSI6GQUN6VDNMAUUSIOFSO6Z3O7DGQBX42GJJ4IPPTWY'
    const fridge = await axios.put(`/api/fridge/`, {stockId: userId})
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
