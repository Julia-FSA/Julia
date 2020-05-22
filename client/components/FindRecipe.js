import React from 'react'
import {connect} from 'react-redux'
import {fetchFirstRecipe, fetchNextRecipe, saveRecipe} from '../store/recipes'
import {Button} from 'react-bootstrap'

/**
 * COMPONENT
 */
class SingleRecipe extends React.Component {
  constructor() {
    super()
    this.handleSubmit = this.handleSubmit.bind(this)
    this.saveRecipe = this.saveRecipe.bind(this)
  }

  async componentDidMount() {
    if (!this.props.selectedRecipe.title) {
      const id = this.props.user.id
      await this.props.fetchFirstRecipe(id)
    }
  }

  async handleSubmit() {
    await this.props.fetchNextRecipe(
      this.props.user.id,
      this.props.top10Recipes,
      this.props.index + 1
    )
  }

  async saveRecipe() {
    const recipeId = this.props.selectedRecipe.id
    const userId = this.props.user.id
    await this.props.saveRecipe(userId, recipeId)
  }

  render() {
    console.log('this.props render()', this.props)
    const selectedRecipe = this.props.selectedRecipe
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
                <br />
                <div onClick={this.saveRecipe} id="grayHeart" />
                <Button
                  variant="danger"
                  type="submit"
                  onClick={this.handleSubmit}
                >
                  Show Me Another Recipe
                </Button>
              </div>
            </div>
            <div className="container ingredient-cont">
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
            <div className="container instruction-cont">
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
          'Finding Your Recipe...'
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
    user: state.user,
    selectedRecipe: state.recipes.selectedRecipe,
    index: state.recipes.index,
    top10Recipes: state.recipes.top10Recipes
  }
}

const mapDispatch = dispatch => ({
  fetchFirstRecipe: userId => dispatch(fetchFirstRecipe(userId)),
  fetchNextRecipe: (userId, top10Recipes, index) =>
    dispatch(fetchNextRecipe(userId, top10Recipes, index)),
  saveRecipe: (userId, recipeId) => dispatch(saveRecipe(userId, recipeId))
})

export default connect(mapState, mapDispatch)(SingleRecipe)
