import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {auth} from '../store'
import {registeredEmail} from '../../server/db/read'

/**
 * COMPONENT
 */
const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  firstNameError: '',
  lastNameError: '',
  passowrdError: '',
  emailError: '',
}

class AuthFormSignUp extends React.Component {
  constructor() {
    super()
    this.state = initialState
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.validate = this.validate.bind(this)
  }

  validate = () => {
    let firstNameError = ''
    let lastNameError = ''
    let passwordError = ''
    let emailError = ''
    const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    const nameRegex = /^[a-zA-Z]+$/

    if (!emailRegex.test(this.state.email)) {
      emailError = 'invalid email'
    }
    if (!nameRegex.test(this.state.firstName)) {
      firstNameError = 'first name is not valid'
    }
    if (!nameRegex.test(this.state.lastName)) {
      lastNameError = 'last name is not valid'
    }
    if (this.state.password.length < 6) {
      passwordError = 'password needs to be greater than 5 characters'
    }

    // NEED TO WORK ON CHECKING IF AN EMAIL HAS ALREADY BEEN REGISTERED
    // if (registeredEmail(this.state.email)) {
    //   emailError = 'already registered email'
    // }

    if (emailError || firstNameError || lastNameError || passwordError) {
      this.setState({emailError, firstNameError, lastNameError, passwordError})
      return false
    }
    return true
  }

  handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value,
    })
  }

  handleSubmit(evt) {
    evt.preventDefault()
    const formName = evt.target.name
    const firstName = evt.target.firstName.value
    const lastName = evt.target.lastName.value
    const email = evt.target.email.value
    const password = evt.target.password.value
    const isValid = this.validate()
    if (isValid) {
      this.props.auth(email, password, formName, firstName, lastName)
      this.setState(initialState)
    }
  }

  render() {
    const {name, displayName, error} = this.props
    return (
      <div className="signup" id="signup-background">
        <form onSubmit={this.handleSubmit} name={name}>
          <div>
            <label htmlFor="firstName">
              <small>First Name</small>
            </label>
            <input
              name="firstName"
              type="text"
              value={this.state.firstName}
              onChange={this.handleChange}
            />
            <div style={{fontSize: 16, color: 'red'}}>
              {this.state.firstNameError}
            </div>
          </div>
          <div>
            <label htmlFor="lastName">
              <small>Last Name</small>
            </label>
            <input
              name="lastName"
              type="text"
              value={this.state.lastName}
              onChange={this.handleChange}
            />
            <div style={{fontSize: 16, color: 'red'}}>
              {this.state.lastNameError}
            </div>
          </div>
          <br />
          <div>
            <label htmlFor="email">
              <small>Email</small>
            </label>
            <input
              name="email"
              type="text"
              value={this.state.email}
              onChange={this.handleChange}
            />
            <div style={{fontSize: 16, color: 'red'}}>
              {this.state.emailError}
            </div>
          </div>
          <div>
            <label htmlFor="password">
              <small>Password</small>
            </label>
            <input
              name="password"
              type="password"
              value={this.state.password}
              onChange={this.handleChange}
            />
            <div style={{fontSize: 16, color: 'red'}}>
              {this.state.passwordError}
            </div>
          </div>
          <br />
          <div>
            <button type="submit">{displayName}</button>
          </div>
          {error && error.response && <div> {error.response.data} </div>}
        </form>
        {/* <a href="/auth/google">{displayName} with Google</a> */}
      </div>
    )
  }
}

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */

// const mapLogin = (state) => {
//   return {
//     name: 'login',
//     displayName: 'Login',
//     error: state.user.error,
//   }
// }

const mapSignup = (state) => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error,
  }
}

const mapDispatch = (dispatch) => ({
  auth: (email, password, formName, firstName, lastName) => {
    dispatch(auth(email, password, formName, firstName, lastName))
  },
})

export const Signup = connect(mapSignup, mapDispatch)(AuthFormSignUp)

/**
 * PROP TYPES
 */
AuthFormSignUp.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  // handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object,
}
