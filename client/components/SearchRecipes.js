import React from 'react'
// import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {
  searchedByIngredients,
  searchedByRecipeName,
} from '../store/searchRecipes'

/**
 * COMPONENT
 */

class SearchRecipes extends React.Component {
  constructor() {
    super()
    this.state = {on: true}
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.toggle = this.toggle.bind(this)
  }

  toggle() {
    this.setState({
      ...this.state,
      searchRecipes: {},
      on: !this.state.on,
    })
  }

  handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value,
    })
  }

  handleSubmit(evt) {
    evt.preventDefault()
    const searchByName = this.state.on //true = search by recipe name
    if (searchByName) {
      const recipeName = evt.target.recipeName.value
      this.props.searchByRecipeName(recipeName)
      console.log('SEARCH RECIPES >>>>>>>>>>>>>>', this.props.searchRecipes)
    } else {
      const ingredients = evt.target.ingredients.value
      this.props.searchByIngredients(ingredients)
      console.log('SEARCH RECIPES >>>>>>>>>>>>>>', this.props.searchRecipes)
    }
  }

  render() {
    console.log('SEARCH RECIPES >>>>>>>>>>>>>>', this.props.searchRecipes)
    const {searchedRecipes} = this.props.searchRecipes
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          {this.state.on ? (
            <div>
              <button type="button" onClick={this.toggle}>
                Search by ingredients
              </button>
            </div>
          ) : (
            <div>
              <button type="button" onClick={this.toggle}>
                Search by recipe name
              </button>
            </div>
          )}
          <br />
          {this.state.on ? (
            <div>
              <div>
                <label htmlFor="recipeName">Search by recipe name:</label>
              </div>
              <div>
                <input
                  name="recipeName"
                  type="text"
                  value={this.state.recipeName}
                  onChange={this.handleChange}
                />
              </div>
            </div>
          ) : (
            <div>
              <div>
                <label htmlFor="ingredients"> Search by ingredients:</label>
              </div>
              <div>
                <input
                  name="ingredients"
                  type="text"
                  value={this.state.ingredients}
                  onChange={this.handleChange}
                />
              </div>
            </div>
          )}
          <div>
            <button type="submit">Submit</button>
          </div>
          <br />
          {searchedRecipes ? (
            !this.state.on ? (
              <div>
                <h2>{searchedRecipes.title}</h2>
                <h4> servings: {searchedRecipes.servings}</h4>
                <br />
                <h4> ready in minutes: {searchedRecipes.readyInMinutes}</h4>
                <br />
                <h4>Ingredients: </h4>
                <div>
                  {searchedRecipes.ingredients
                    .filter((ingredient) => typeof ingredient === 'string')
                    .map((ingredient, index) => (
                      <div key={index}>
                        <div>{index + 1}.</div>
                        <div>{ingredient}</div>
                      </div>
                    ))}
                </div>
                <br />
                <div>
                  {searchedRecipes.steps.map((step, index) => (
                    <div key={index}>{step}</div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h2>{searchedRecipes.title}</h2>
                <a href={searchedRecipes.image}></a>
                <h4> servings: {searchedRecipes.servings}</h4>
                <br />
                <h4> ready in minutes: {searchedRecipes.readyInMinutes}</h4>
                <br />
                <h4>Ingredients: </h4>
                <div>
                  {searchedRecipes.extendedIngredients.map(
                    (ingredient, index) => (
                      <div key={index}>
                        <div>{index + 1}.</div>
                        <div>{ingredient.name}</div>
                      </div>
                    )
                  )}
                </div>
                <br />
                <div>
                  <div>
                    {searchedRecipes.analyzedInstructions[0].steps.map(
                      (step, index) => (
                        <div key={index}>
                          Step{index + 1}. {step.step}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )
          ) : null}
        </form>
      </div>
    )
  }
}

/**
 * CONTAINER
 */

const mapDispatch = (dispatch) => ({
  searchByIngredients: (ingredients) => {
    dispatch(searchedByIngredients(ingredients))
  },
  searchByRecipeName: (recipeName) => {
    dispatch(searchedByRecipeName(recipeName))
  },
})

const mapState = (state) => {
  return {
    email: state.user.email,
    searchRecipes: state.searchRecipes,
  }
}

export default connect(mapState, mapDispatch)(SearchRecipes)
