import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'

const Navbar = ({handleClick, isLoggedIn}) => (
  <div>
    {isLoggedIn ? (
      <nav className="navbar navbar-expand-md navbar-dark bg-dark">
        <Link to="/home">
          <img id="nav-logo" className="navbar-brand" src="favicon.ico" />
        </Link>

        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/home">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/fridge">
              My Fridge
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/findrecipe">
              What Can I Make?
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/myrecipes">
              My Recipes
            </Link>
          </li>
        </ul>
        <div className="logout-cont">
          <a className="nav-link" href="#" onClick={handleClick}>
            Logout
          </a>
        </div>
      </nav>
    ) : (
      <nav className="navbar navbar-expand-md navbar-dark bg-dark">
        <img id="nav-logo" className="navbar-brand" src="favicon.ico" />

        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/searchrecipes">
              Search Recipes
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/alexa">
              Using Alexa
            </Link>
          </li>
        </ul>
        <div className="auth-cont">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/signup">
                Sign Up
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    )}
  </div>
)
/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(Navbar)

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
