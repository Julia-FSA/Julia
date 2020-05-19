import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'
import {Nav, Navbar} from 'react-bootstrap'
const NavbarComp = ({handleClick, isLoggedIn}) => (
  <div>
    {isLoggedIn ? (
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="/home">Julia-Cooks</Navbar.Brand>
        <Nav className="mr-auto">
          <Link to="/fridge">My Fridge</Link>
          <Link to="/findrecipe">What can I make?</Link>
          <Link to="/recipes">My Recipes</Link>
        </Nav>
        <Nav>
          <Link href="#" onClick={handleClick}>
            Logout
          </Link>
        </Nav>
      </Navbar>
    ) : (
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="/home">Julia-Cooks</Navbar.Brand>
        <Nav className="mr-auto justify-contt-enden">
          <Link to="/searchrecipes">Search Recipes</Link>
        </Nav>
        <Nav>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </Nav>
      </Navbar>
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

export default connect(mapState, mapDispatch)(NavbarComp)

/**
 * PROP TYPES
 */
NavbarComp.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
