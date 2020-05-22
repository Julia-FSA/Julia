import React from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import {
  searchedByIngredients,
  searchedByRecipeName
} from '../store/searchRecipes'
import {Button} from 'react-bootstrap'
const {recipeToAlexa, recipeFormatter} = require('../util_recipeToAlexa')
const {SpoonacularAPIKey} = require('../../secrets')

/**
 * COMPONENT
 */

class SearchRecipes extends React.Component {
  constructor() {
    super()
    this.state = {
      on: true
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.toggle = this.toggle.bind(this)
  }

  toggle() {
    this.setState({
      on: !this.state.on
    })
  }

  handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value
    })
  }

  handleSubmit(evt) {
    evt.preventDefault()
    const searchByName = this.state.on // true => search by recipe name
    if (searchByName) {
      const recipeName = evt.target.recipeName.value
      this.props.searchByRecipeName(recipeName)
    } else {
      const ingredients = evt.target.ingredients.value
      this.props.searchByIngredients(ingredients)
    }
  }

  async sendToAlexa(user) {
    let recipe = this.props.searchRecipes.searchedRecipes
    const res = await axios.get(
      `https://api.spoonacular.com/recipes/${
        recipe.id
      }/information?instructionsRequired=true&includeNutrition=false&amount=1&apiKey=${SpoonacularAPIKey}`
    )
    recipe = res.data
    const formattedRecipe = recipeFormatter(recipe)
    if (user.id) {
      recipeToAlexa(user, formattedRecipe)
    }
  }

  render() {
    const {searchedRecipes} = this.props.searchRecipes
    const {user} = this.props

    return (
      <div className="outer-cont">
        <form className="search-cont container" onSubmit={this.handleSubmit}>
          <div>
            {this.state.on ? (
              <div>
                <div>
                  <Button variant="warning" onClick={this.toggle}>
                    Search by ingredients
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div>
                  <Button variant="warning" onClick={this.toggle}>
                    Search by recipe name
                  </Button>
                </div>
              </div>
            )}
            <br />
            {this.state.on ? (
              <div className="searchlabel">
                <div className="toggle">
                  <label htmlFor="recipeName">Search by recipe name:</label>
                </div>
                <input
                  name="recipeName"
                  type="text"
                  value={this.state.recipeName}
                  onChange={this.handleChange}
                />
              </div>
            ) : (
              <div className="searchlabel">
                <div className="toggle">
                  <label htmlFor="ingredients"> Search by ingredients:</label>
                </div>
                <input
                  name="ingredients"
                  type="text"
                  value={this.state.ingredients}
                  onChange={this.handleChange}
                />
              </div>
            )}
            <div>
              <Button variant="danger" type="submit">
                Search
              </Button>
              <div>
                {user.id ? (
                  <Button
                    variant="success"
                    onClick={() => this.sendToAlexa(user)}
                  >
                    Send to Alexa
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </form>
        <div>
          {!searchedRecipes ? null : searchedRecipes.extendedIngredients ? (
            // SEARCH BY INGREDIENTS
            <div className="container inner-cont">
              <div className="title-image-cont">
                <div className="image-cont">
                  <img src={searchedRecipes.image} alt="recipe image" />
                </div>
                <div className="title-cont">
                  <h3>{searchedRecipes.title}</h3>
                  <p>Servings: {searchedRecipes.servings}</p>
                  <p>Cook time: {searchedRecipes.readyInMinutes} Minutes</p>
                </div>
              </div>
              <div className="container ingredient-cont">
                <h3>Ingredients </h3>
                <hr />
                <div>
                  <ul>
                    {searchedRecipes.extendedIngredients.map(function(
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
                {searchedRecipes.analyzedInstructions[0].steps.map(
                  (step, index) => (
                    <p key={index}>
                      {index + 1}. {step.step}
                    </p>
                  )
                )}
              </div>
            </div>
          ) : (
            <div className="loader">No Result - Please try a new search.</div>
          )}
        </div>
      </div>
    )
  }
}

/**
 * CONTAINER
 */

const mapDispatch = dispatch => ({
  searchByIngredients: ingredients => {
    dispatch(searchedByIngredients(ingredients))
  },
  searchByRecipeName: recipeName => {
    dispatch(searchedByRecipeName(recipeName))
  }
})

const mapState = state => {
  return {
    user: state.user,
    searchRecipes: state.searchRecipes
  }
}

export default connect(mapState, mapDispatch)(SearchRecipes)
