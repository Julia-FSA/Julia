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
      <div className="outer-cont">
        {selectedRecipe.analyzedInstructions ? (
          <div className="container inner-cont">
            <div className="title-image-cont">
              <div className="image-cont">
                <img src={selectedRecipe.image} alt={selectedRecipe.title} />
              </div>
              <div className="title-cont">
                <h3>{selectedRecipe.title}</h3>
                <p>Cook time: {selectedRecipe.readyInMinutes} Minutes</p>
                <p>{selectedRecipe.aggregateLikes} Likes</p>
                <button type="submit" onClick={this.handleSubmit}>
                  Show Me Another Recipe
                </button>
              </div>
            </div>
            <div className="ingredient-cont">
              <h3>Ingredients:</h3>
              <hr />
              <div>
                <ul>
                  {selectedRecipe.extendedIngredients.map(function(ingredient) {
                    return (
                      <li key={ingredient.id}>
                        {ingredient.amount} {ingredient.unit} -{' '}
                        {ingredient.name}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
            <div className="instruction-cont">
              <h3>Instructions:</h3>
              <hr />
              <div>
                {' '}
                {selectedRecipe.analyzedInstructions[0].steps.map(function(
                  step
                ) {
                  return (
                    <p key={step.number}>
                      {step.number}. {step.step}
                    </p>
                  )
                })}
              </div>
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
