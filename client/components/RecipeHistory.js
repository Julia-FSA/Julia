import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

/**
 * COMPONENT
 */
export const RecipeHistory = (props) => {
  const {email} = props

  return (
    <div>
      <h3>Welcome, {email}</h3>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    email: state.user.email,
  }
}

export default connect(mapState)(RecipeHistory)

/**
 * PROP TYPES
 */
// RecipeHistory.propTypes = {
//   email: PropTypes.string
// }
