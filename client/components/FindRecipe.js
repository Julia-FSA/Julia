import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

/**
 * COMPONENT
 */
export const FindRecipe = props => {
  const {email} = props

  return (
    <div>
      <h3>Find a Recipe</h3>
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

export default connect(mapState)(FindRecipe)

/**
 * PROP TYPES
 */
// SingleRecipe.propTypes = {
//   email: PropTypes.string
// }
