import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

/**
 * COMPONENT
 */
export const Home = (props) => {
  const firstName = props.user.firstName
  return (
    <div className="home" id="background">
      <div id="welcome">
        {firstName ? (
          <div id="header">
            <h1>Welcome, {firstName}!</h1>
            <br />
            <Link to="/linkAccount">
              <button type="button">Link to Alexa</button>
            </Link>
          </div>
        ) : (
          <div id="header">
            <h1>Welcome to Julia Cooks!</h1>
            <br />
            <h2 style={{fontStyle: 'italic'}}>
              Login or Signup to get started.
            </h2>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    user: state.user,
  }
}

export default connect(mapState)(Home)
