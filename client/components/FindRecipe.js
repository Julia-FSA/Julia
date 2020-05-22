import React from 'react'
// import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {fetchFirstRecipe, fetchNextRecipe} from '../store/recipes'
import {Button} from 'react-bootstrap'
const recipeToAlexa = require('../util_recipeToAlexa')

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

  sendToAlexa(user) {
    if (user.id) {
      recipeToAlexa(user, this.props.selectedRecipe)
    }
  }
  render() {
    const selectedRecipe = this.props.selectedRecipe
    const {user} = this.props
    // console.log('rendeding selectedRecipe', selectedRecipe)

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
                <Button
                  variant="danger"
                  type="submit"
                  onClick={this.handleSubmit}
                >
                  Show Me Another Recipe
                </Button>
                <br />
                <Button
                  variant="success"
                  onClick={() => this.sendToAlexa(user)}
                >
                  Send to Alexa
                </Button>
              </div>
            </div>

            <div className="container ingredient-cont">
              <h3>Ingredients</h3>
              <hr />
              <div>
                <ul>
                  {selectedRecipe.extendedIngredients.map(function (
                    ingredient
                  ) {
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
            <div className="container instruction-cont">
              <h3>Instructions</h3>
              <hr />
              <div>
                {' '}
                {selectedRecipe.analyzedInstructions[0].steps.map(function (
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
          <div className="container inner-cont">
            <h1>Finding recipe. Please wait...</h1>
          </div>
        )}
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    user: state.user,
    userId: state.user.id,
    selectedRecipe: state.recipes.selectedRecipe,
    index: state.recipes.index,
    top10Recipes: state.recipes.top10Recipes,
  }
}

const mapDispatch = (dispatch) => ({
  fetchFirstRecipe: (userId) => dispatch(fetchFirstRecipe(userId)),
  fetchNextRecipe: (top10Recipes, index) =>
    dispatch(fetchNextRecipe(top10Recipes, index)),
})

export default connect(mapState, mapDispatch)(SingleRecipe)

/**
 * PROP TYPES
 */
// SingleRecipe.propTypes = {
//   email: PropTypes.string
// }
