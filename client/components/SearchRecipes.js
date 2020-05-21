import React from 'react'
// import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {
  searchedByIngredients,
  searchedByRecipeName,
} from '../store/searchRecipes'
import {Button} from 'react-bootstrap'

/**
 * COMPONENT
 */

class SearchRecipes extends React.Component {
  constructor() {
    super()
    this.state = {
      on: true,
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.toggle = this.toggle.bind(this)
  }

  toggle() {
    this.setState({
      on: !this.state.on,
    })
    if (this.state.on) {
      this.props.searchByRecipeName('')
    } else {
      this.props.searchByIngredients('')
    }
  }

  handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value,
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

  render() {
    const {searchedRecipes} = this.props.searchRecipes

    return (
      <div className="outer-cont">
        <form className="search-cont" onSubmit={this.handleSubmit}>
          <div>
            {this.state.on ? (
              <div>
                <Button variant="warning" onClick={this.toggle}>
                  Search by ingredients
                </Button>
              </div>
            ) : (
              <div>
                <Button variant="warning" onClick={this.toggle}>
                  Search by recipe name
                </Button>
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
                Submit
              </Button>
            </div>
          </div>
        </form>
        <div>
          {searchedRecipes ? (
            !this.state.on ? (
              !searchedRecipes.extendedIngredients ? (
                <div className="container inner-cont">
                  <div className="title-image-cont">
                    {/* <div className="image-cont">
                          <img
                            src={searchedRecipes.image}
                            alt={searchedRecipes.title}
                          />
                        </div> */}
                    <div className="title-cont">
                      <h3>{searchedRecipes.title}</h3>
                      <p>Servings: {searchedRecipes.servings}</p>
                      <p>Cook time: {searchedRecipes.readyInMinutes} Minutes</p>
                    </div>
                  </div>
                  <div className="container ingredient-cont">
                    <h3>Ingredients </h3>
                    <hr />
                    <ul>
                      {searchedRecipes.ingredients
                        .filter((ingredient) => typeof ingredient === 'string')
                        .map((ingredient, index) => (
                          <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                  </div>
                  <div className="container instruction-cont">
                    <h3>Instructions</h3>
                    <hr />
                    {searchedRecipes.steps.map((step, index) => (
                      <div key={index}>{step.slice(5)}</div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="loader">
                  No Result - Please try a new search.
                </div>
              )
            ) : !searchedRecipes.ingredients ? (
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
                  <h3> Ingredients </h3>
                  <hr />
                  <ul>
                    {searchedRecipes.extendedIngredients.map(
                      (ingredient, index) => (
                        <li key={index}>{ingredient.name}</li>
                      )
                    )}
                  </ul>
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
            )
          ) : null}
        </div>
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
