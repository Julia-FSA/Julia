import React from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import {
  fetchFirstRecipe,
  fetchNextRecipe,
  unsaveRecipe,
  saveRecipe,
} from '../store/recipes'
import {Button} from 'react-bootstrap'
const {recipeToAlexa, recipeFormatter} = require('../util_recipeToAlexa')
const {SpoonacularAPIKey} = require('../../secrets')

/**
 * COMPONENT
 */
class SingleRecipe extends React.Component {
  constructor() {
    super()
    this.state = {
      favorited: false,
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.saveRecipe = this.saveRecipe.bind(this)
    this.unsaveRecipe = this.unsaveRecipe.bind(this)
  }

  async componentDidMount() {
    if (!this.props.selectedRecipe.title) {
      const id = this.props.user.id
      await this.props.fetchFirstRecipe(id)
    }
  }

  async handleSubmit() {
    console.log('this.props submit()', this.props)
    await this.props.fetchNextRecipe(
      this.props.user.id,
      this.props.top10Recipes,
      this.props.index + 1
    )
    this.setState({
      favorited: false,
    })
  }

  async saveRecipe() {
    const recipeId = this.props.selectedRecipe.id
    const userId = this.props.user.id
    console.log('component saving...', recipeId, userId)
    await this.props.saveRecipe(userId, recipeId)
    console.log('component saved!')
    this.setState({
      favorited: true,
    })
  }

  async unsaveRecipe() {
    const recipeId = this.props.selectedRecipe.id
    const userId = this.props.user.id
    console.log('component unsaving...', recipeId, userId)
    await this.props.unsaveRecipe(userId, recipeId)
    console.log('component unsaved!')
    this.setState({
      favorited: false,
    })
  }

  async sendToAlexa(user) {
    let recipe = this.props.selectedRecipe
    const res = await axios.get(
      `https://api.spoonacular.com/recipes/${recipe.id}/information?instructionsRequired=true&includeNutrition=false&amount=1&apiKey=${SpoonacularAPIKey}`
    )
    recipe = res.data
    // console.log('axiosed recipe >>>>>>>>>>>>>> ', recipe)
    const formattedRecipe = recipeFormatter(recipe)
    // console.log('formatted FindRecipe >>>>>>>>>>>>>> ', formattedRecipe)
    if (user.id) {
      recipeToAlexa(user, formattedRecipe)
    }
  }

  render() {
    console.log('this.props render()', this.props)
    const selectedRecipe = this.props.selectedRecipe
    const {user} = this.props

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
                {selectedRecipe.favorited || this.state.favorited ? (
                  <div onClick={this.unsaveRecipe} id="blueHeart" />
                ) : (
                  <div onClick={this.saveRecipe} id="grayHeart" />
                )}
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
    selectedRecipe: state.recipes.selectedRecipe,
    index: state.recipes.index,
    top10Recipes: state.recipes.top10Recipes,
  }
}

const mapDispatch = (dispatch) => ({
  fetchFirstRecipe: (userId) => dispatch(fetchFirstRecipe(userId)),
  fetchNextRecipe: (userId, top10Recipes, index) =>
    dispatch(fetchNextRecipe(userId, top10Recipes, index)),
  saveRecipe: (userId, recipeId) => dispatch(saveRecipe(userId, recipeId)),
  unsaveRecipe: (userId, recipeId) => dispatch(unsaveRecipe(userId, recipeId)),
})

export default connect(mapState, mapDispatch)(SingleRecipe)
