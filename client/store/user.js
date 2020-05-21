import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const SIGN_UP_USER = 'SIGN_UP_USER'
const LOGIN_USER = 'LOGIN_USER'
const REMOVE_USER = 'REMOVE_USER'

/**
 * INITIAL STATE
 */
const defaultUser = {}

/**
 * ACTION CREATORS
 */
const signUpUser = (user) => ({type: SIGN_UP_USER, user})
const loginUser = (user) => ({type: LOGIN_USER, user})
const removeUser = () => ({type: REMOVE_USER})

/**
 * THUNK CREATORS
 */
export const me = () => async (dispatch) => {
  try {
    const res = await axios.get('/auth/me')
    dispatch(signUpUser(res.data || defaultUser))
  } catch (err) {
    console.error(err)
  }
}

export const login = (email, password, method) => async (dispatch) => {
  let res
  try {
    res = await axios.post(`/auth/${method}`, {
      email,
      password,
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
  firstName = null,
  lastName = null
) => async (dispatch) => {
  let res
  try {
    res = await axios.post(`/auth/${method}`, {
      email,
      password,
      firstName,
      lastName,
    })

    dispatch(signUpUser(res.data))
    history.push('/home')
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr)
  }
}

export const logout = () => async (dispatch) => {
  try {
    await axios.post('/auth/logout')
    dispatch(removeUser())
    history.push('/login')
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function (state = defaultUser, action) {
  switch (action.type) {
    case SIGN_UP_USER:
      return {
        email: action.user.email.S,
        firstName: action.user.firstName.S,
        id: action.user.id.S,
        lastName: action.user.lastName.S,
        password: action.user.password.S,
        salt: action.user.salt.S,
        ...action.user,
      }
    case LOGIN_USER:
      return {
        email: action.user.email,
        firstName: action.user.firstName,
        id: action.user.id,
        lastName: action.user.lastName,
        password: action.user.password,
        salt: action.user.salt,
        ...action.user,
      }
    case REMOVE_USER:
      return defaultUser
    default:
      return state
  }
}
