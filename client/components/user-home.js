import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

/**
 * COMPONENT
 */
export const UserHome = (props) => {
  const {email, id} = props

  return (
    <div>
      <h3>Welcome, {email}.</h3>
      <h3>Alexa Code: {id.slice(0, 8)} (***PLEASE DO NOT SHARE***)</h3>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    email: state.user.email,
    id: state.user.id,
  }
}

export default connect(mapState)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string,
  id: PropTypes.string,
}
