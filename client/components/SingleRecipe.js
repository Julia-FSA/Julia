import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

/**
 * COMPONENT
 */
export const SingleRecipe = props => {
  const {email} = props

  return (
    <div>
      <h3>Welcome to Single Recipe Page, {email}</h3>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    email: state.user.email
  }
}

export default connect(mapState)(SingleRecipe)
