import React from 'react'
// import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {fetchSingleRecipe} from '../store/recipes'

/**
 * COMPONENT
 */
class SingleRecipe extends React.Component {
  render() {
    return <div>'nothing here'</div>
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    email: state.user.email,
    userId: state.user.id,
    selectedRecipe: state.recipes.selectedRecipe,
    index: state.recipes.index,
    top10Recipes: state.recipes.top10Recipes
  }
}

const mapDispatch = dispatch => ({
  fetchSingleRecipe: id => dispatch(fetchSingleRecipe(id))
})

export default connect(mapState, mapDispatch)(SingleRecipe)

/**
 * PROP TYPES
 */
// SingleRecipe.propTypes = {
//   email: PropTypes.string
// }
