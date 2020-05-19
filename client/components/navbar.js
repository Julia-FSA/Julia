import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'
import {Nav, Navbar} from 'react-bootstrap'
const NavbarComp = ({handleClick, isLoggedIn}) => (
  <div>
    {isLoggedIn ? (
      <nav className="navbar navbar-expand-md navbar-dark bg-dark">
        <img id="nav-logo" className="navbar-brand" src="favicon.ico" />

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
            <Link className="nav-link" to="/searchrecipes">
              Search Recipes
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/singlerecipe">
              Get Recipe
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/usedrecipes">
              Used Recipe
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
{
  /* <Navbar bg="dark" variant="dark">
<img id="nav-logo" className="navbar-brand" src="favicon.ico" />
<Nav className="mr-auto">
  <Nav.Link href="/home">Home</Nav.Link>
  <Nav.Link href="/fridge">My Fridge</Nav.Link>
  <Nav.Link href="/searchrecipes">Search Recipes</Nav.Link>
  <Nav.Link href="/singlerecipe">Get Recipe</Nav.Link>
  <Nav.Link href="/usedrecipes">Used Recipes</Nav.Link>
</Nav>
<Nav>
  <Nav.Link href="#" onClick={handleClick}>
    Logout
  </Nav.Link>
</Nav>
</Navbar> */
}
{
  /* <Navbar bg="dark" variant="dark">
<img id="nav-logo" className="navbar-brand" src="favicon.ico" />
<Nav className="mr-auto justify-contt-enden">
  <Nav.Link href="/searchrecipes">Search Recipes</Nav.Link>
</Nav>
<Nav>
  <Nav.Link href="/login">Login</Nav.Link>
  <Nav.Link href="/signup">Sign Up</Nav.Link>
</Nav>
</Navbar> */
}
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

export default connect(mapState, mapDispatch)(NavbarComp)

/**
 * PROP TYPES
 */
NavbarComp.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
