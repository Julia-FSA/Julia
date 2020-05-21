import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

/**
 * COMPONENT
 */
export const Home = (props) => {
  const user = props.user
  return (
    <div className="home-image-cont">
      {user.firstName ? (
        <div>
          <div className="home-title">
            <h1>Welcome, {user.firstName}!</h1>
            {/* <Link to="/linkAccount">
              <button type="button">Link to Alexa</button>
            </Link> */}
          </div>
        </div>
      ) : (
        <div>
          <div className="home-title">
            <h1>Welcome to Julia Cooks!</h1>
            <br />
            <h2>Login or Signup to get started.</h2>
          </div>
        </div>
      )}
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
