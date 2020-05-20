import React from 'react'
// import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {fetchFirstRecipe, fetchNextRecipe} from '../store/recipes'

/**
 * COMPONENT
 */
class SingleRecipe extends React.Component {
  constructor() {
    super()
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  async componentDidMount() {
    if (!this.props.selectedRecipe.title) {
      await this.props.fetchFirstRecipe(this.props.userId)
    }
  }

  async handleSubmit() {
    await this.props.fetchNextRecipe(
      this.props.top10Recipes,
      this.props.index + 1
    )
  }

  render() {
    const selectedRecipe = this.props.selectedRecipe
    console.log('rendeding selectedRecipe', selectedRecipe)
    return (
      <div>
        {selectedRecipe.analyzedInstructions ? (
          <div>
            <h3>{selectedRecipe.title}</h3>
            <img src={selectedRecipe.image} alt={selectedRecipe.title} />
            <p>Cook time: {selectedRecipe.readyInMinutes} Minutes</p>
            <p>{selectedRecipe.aggregateLikes} Likes</p>
            <button type="submit" onClick={this.handleSubmit}>
              Show Me Another Recipe
            </button>
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
            <br />
            <br />
            <h3>Instructions:</h3>
            <div>
              {' '}
              {selectedRecipe.analyzedInstructions[0].steps.map(function(step) {
                return (
                  <p key={step.number}>
                    {step.number}. {step.step}
                  </p>
                )
              })}
            </div>
          </div>
        ) : (
          'Finding recipe. Please wait...'
        )}
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
    index: state.recipes.index,
    top10Recipes: state.recipes.top10Recipes
  }
}

const mapDispatch = dispatch => ({
  fetchFirstRecipe: userId => dispatch(fetchFirstRecipe(userId)),
  fetchNextRecipe: (top10Recipes, index) =>
    dispatch(fetchNextRecipe(top10Recipes, index))
})

export default connect(mapState, mapDispatch)(SingleRecipe)

/**
 * PROP TYPES
 */
// SingleRecipe.propTypes = {
//   email: PropTypes.string
// }
