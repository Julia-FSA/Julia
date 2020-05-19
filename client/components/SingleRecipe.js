import React from 'react'
// import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {fetchSingleRecipe} from '../store/recipes'

/**
 * COMPONENT
 */
class SingleRecipe extends React.Component {
  async componentDidMount() {
    await this.props.fetchSingleRecipe(this.props.userId)
  }

  render() {
    console.log('SingleRecipe props', this.props)
    const selectedRecipe = this.props.selectedRecipe
    const top5Recipes = this.props.top5Recipes

    return (
      <div>
        <p>
          {selectedRecipe.title ? (
            <div>
              <h3>{selectedRecipe.title}</h3>
              <p>Cook time: {selectedRecipe.cookingMinutes} min</p>
              <p>{selectedRecipe.aggregateLikes} Likes</p>
              <br />
              <br />
              <h3>Ingredients:</h3>
              <div>
                {' '}
                {selectedRecipe.extendedIngredients.map(function(ingredient) {
                  return (
                    <p key={ingredient.id}>
                      {ingredient.amount} {ingredient.unit} - {ingredient.name}
                    </p>
                  )
                })}
              </div>
            </div>
          ) : (
            'nothing here'
          )}
        </p>
      </div>
    )
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
    top5Recipes: state.recipes.top5Recipes
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
