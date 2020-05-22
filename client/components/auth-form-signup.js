import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {signup} from '../store'
import {registeredEmail} from '../../server/db/read'
import {Button} from 'react-bootstrap'

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
  emailError: ''
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
      emailError = 'Invalid email'
    }
    if (!nameRegex.test(this.state.firstName)) {
      firstNameError = 'First name is required'
    }
    if (!nameRegex.test(this.state.lastName)) {
      lastNameError = 'Last name is required'
    }
    if (this.state.password.length < 6) {
      passwordError = 'Password needs to be at least 5 characters long'
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
      [evt.target.name]: evt.target.value
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
      this.props.signup(email, password, formName, firstName, lastName)
      this.setState(initialState)
    }
  }

  render() {
    const {name, displayName, error} = this.props
    return (
      <div className="outer-cont" id="form-background">
        <div className="form-inner-cont">
          <form
            className="text-center border border-light p-5"
            action="#!"
            onSubmit={this.handleSubmit}
            name={name}
          >
            <p className="h4 mb-4">Sign up</p>

            <input
              id="defaultRegisterFormFirstName"
              className="form-control"
              placeholder="First name"
              name="firstName"
              type="text"
              value={this.state.firstName}
              onChange={this.handleChange}
            />
            <small className="form-text text-muted mb-4">
              {this.state.firstNameError}
            </small>
            <input
              id="defaultRegisterFormLastName"
              className="form-control"
              placeholder="Last name"
              name="lastName"
              type="text"
              value={this.state.lastName}
              onChange={this.handleChange}
            />
            <small className="form-text text-muted mb-4">
              {this.state.lastNameError}
            </small>
            <input
              id="defaultRegisterFormEmail"
              className="form-control mb-4"
              placeholder="E-mail"
              name="email"
              type="text"
              value={this.state.email}
              onChange={this.handleChange}
            />
            <small className="form-text text-muted mb-4">
              {this.state.emailError}
            </small>

            <input
              id="defaultRegisterFormPassword"
              className="form-control"
              placeholder="Password"
              name="password"
              type="password"
              value={this.state.password}
              onChange={this.handleChange}
            />
            <small className="form-text text-muted mb-4">
              {this.state.passwordError}
            </small>

            <button className="btn btn-info my-4 btn-block" type="submit">
              Sign up
            </button>

            {error && error.response && <div> {error.response.data} </div>}
          </form>
        </div>
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

const mapSignup = state => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error
  }
}

const mapDispatch = dispatch => ({
  signup: (email, password, formName, firstName, lastName) => {
    dispatch(signup(email, password, formName, firstName, lastName))
  }
})

export const Signup = connect(mapSignup, mapDispatch)(AuthFormSignUp)

/**
 * PROP TYPES
 */
AuthFormSignUp.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  // handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
}
