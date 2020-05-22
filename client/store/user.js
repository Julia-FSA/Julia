import axios from 'axios'
import history from '../history'
import {setRecipeResults} from './recipes'

/**
 * ACTION TYPES
 */
const SIGN_UP_USER = 'SIGN_UP_USER'
const LOGIN_USER = 'LOGIN_USER'
const REMOVE_USER = 'REMOVE_USER'
// const RECIPE_TO_ALEXA = 'RECIPE_TO_ALEXA'

/**
 * INITIAL STATE
 */
const defaultUser = {
  fridge: [],
  recipes: {selectedRecipe: {}, top10Recipes: []},
  searchRecipes: {},
  user: {}
}

/**
 * ACTION CREATORS
 */
const signUpUser = user => ({type: SIGN_UP_USER, user})
const loginUser = user => ({type: LOGIN_USER, user})
const removeUser = () => ({type: REMOVE_USER})
// const sendRecipeToAlexa = (recipe) => ({type: RECIPE_TO_ALEXA, recipe})

/**
 * THUNK CREATORS
 */
export const me = () => async dispatch => {
  try {
    const res = await axios.get('/auth/me')
    dispatch(loginUser(res.data || defaultUser))
  } catch (err) {
    console.error(err)
  }
}

export const login = (email, password, method) => async dispatch => {
  let res
  try {
    res = await axios.post(`/auth/${method}`, {
      email,
      password
    })
    dispatch(loginUser(res.data))
    history.push('/home')
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr)
  }
}

export const signup = (
  email,
  password,
  method,
  firstName,
  lastName
) => async dispatch => {
  let res
  try {
    res = await axios.post(`/auth/${method}`, {
      email,
      password,
      firstName,
      lastName
    })
    dispatch(signUpUser(res.data))
    history.push('/home')
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr)
  }
}

export const logout = () => async dispatch => {
  try {
    await axios.post('/auth/logout')
    dispatch(removeUser())
    dispatch(setRecipeResults({}, 0, []))
    history.push('/login')
  } catch (err) {
    console.error(err)
  }
}

// export const recipeToAlexa = (recipe) => (dispatch) => {
//   try {
//     dispatch(sendRecipeToAlexa(recipe))
//   } catch (dispatchOrHistoryErr) {
//     console.error(dispatchOrHistoryErr)
//   }
// }

/**
 * REDUCER
 */
export default function(state = defaultUser, action) {
  switch (action.type) {
    case SIGN_UP_USER:
      return {
        email: action.user.email.S,
        firstName: action.user.firstName.S,
        id: action.user.id.S,
        lastName: action.user.lastName.S,
        password: action.user.password.S,
        salt: action.user.salt.S
      }
    case LOGIN_USER:
      return {
        email: action.user.email,
        firstName: action.user.firstName,
        id: action.user.id,
        lastName: action.user.lastName,
        password: action.user.password,
        salt: action.user.salt
      }
    case REMOVE_USER:
      return defaultUser
    default:
      return state
  }
}
