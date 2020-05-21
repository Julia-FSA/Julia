import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {auth} from '../store'
import {Button} from 'react-bootstrap'

/**
 * COMPONENT
 */
const AuthForm = props => {
  const {name, displayName, handleSubmit, error} = props

  return (
    <div className="outer-cont" id="login-background">
      <div className="inner-cont form-inner-cont">
        <form
          className="text-center border border-light p-5"
          action="#!"
          onSubmit={handleSubmit}
          name={name}
        >
          <p className="h4 mb-4">Login</p>

          <input
            type="email"
            id="defaultLoginFormEmail"
            className="form-control mb-4"
            placeholder="E-mail"
            name="email"
            required
          />

          <input
            type="password"
            id="defaultLoginFormPassword"
            className="form-control mb-4"
            placeholder="Password"
            name="password"
            required
          />

          <button className="btn btn-info btn-block my-4" type="submit">
            Login
          </button>

          {error && error.response && <div> {error.response.data} </div>}
        </form>
        {/* <a href="/auth/google">{displayName} with Google</a> */}
      </div>
    </div>
  )
}

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = state => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error
  }
}

// const mapSignup = (state) => {
//   return {
//     name: 'signup',
//     displayName: 'Sign Up',
//     error: state.user.error,
//   }
// }

const mapDispatch = dispatch => {
  return {
    handleSubmit(evt) {
      evt.preventDefault()
      const formName = evt.target.name
      const email = evt.target.email.value
      const password = evt.target.password.value
      dispatch(auth(email, password, formName))
    }
  }
}

export const Login = connect(mapLogin, mapDispatch)(AuthForm)
// export const Signup = connect(mapSignup, mapDispatch)(AuthForm)

/**
 * PROP TYPES
 */
AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
}

{
  /* <div className="modal fade" id="modalLoginForm" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
aria-hidden="true">
<div className="modal-dialog" role="document">
  <div className="modal-content">
    <div className="modal-header text-center">
      <h4 className="modal-title w-100 font-weight-bold">Sign in</h4>
      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div className="modal-body mx-3">
      <div className="md-form mb-5">
        <i className="fas fa-envelope prefix grey-text"></i>
        <input type="email" id="defaultForm-email" className="form-control validate"/>
        <label data-error="wrong" data-success="right" htmlFor="defaultForm-email">Your email</label>
      </div>

      <div className="md-form mb-4">
        <i className="fas fa-lock prefix grey-text"></i>
        <input type="password" id="defaultForm-pass" className="form-control validate"/>
        <label data-error="wrong" data-success="right" htmlFor="defaultForm-pass">Your password</label>
      </div>

    </div>
    <div className="modal-footer d-flex justify-content-center">
      <button type="submit" className="btn btn-default">Login</button>
    </div>
  </div>
</div>
</div>
<div className="text-center">
<a href="" className="btn btn-default btn-rounded mb-4" data-toggle="modal" data-target="#modalLoginForm">Launch
  Modal Login Form</a>
</div> */
}
