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
    const userId = 2
    const fridge = await axios.get(`/api/fridge/`, {params: {userId}})
    dispatch(getFridge(fridge.data))
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
