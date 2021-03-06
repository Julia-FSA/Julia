import React from 'react'
import {connect} from 'react-redux'
import {fetchThisRecipe} from '../store/recipes'
import {Button} from 'react-bootstrap'
import {fraction} from 'mathjs'

/**
 * COMPONENT
 */
class SingleRecipe extends React.Component {
  async componentDidMount() {
    const id = this.props.match.params.id
    await this.props.fetchThisRecipe(id)
  }

  render() {
    console.log('render() props', this.props)
    const selectedRecipe = this.props.selectedRecipe
    console.log('selectedRecipe', selectedRecipe)
    return (
      <div className="outer-cont">
        {selectedRecipe.steps ? (
          <div className="container inner-cont">
            <div className="title-image-cont">
              <div className="image-cont">
                <img src={selectedRecipe.image} alt={selectedRecipe.title} />
              </div>
              <div className="title-cont">
                <h3>{selectedRecipe.title}</h3>
                <p>Cook time: {selectedRecipe.readyInMinutes} Minutes</p>
                <p>{selectedRecipe.likes} Likes</p>
              </div>
            </div>
            <div className="container ingredient-cont">
              <h3>Ingredients:</h3>
              <hr />
              <div>
                <ul>
                  {selectedRecipe.ingredients.map(function(ingredient) {
                    const amount =
                      ingredient.amount % 1 === 0
                        ? ingredient.amount
                        : `${fraction(ingredient.amount).n}/${
                            fraction(ingredient.amount).d
                          }`
                    return (
                      <li key={ingredient.id}>
                        {amount} {ingredient.unit} - {ingredient.name}
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
                {selectedRecipe.steps.map(function(step) {
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
          'Loading Your Recipe...'
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
    selectedRecipe: state.recipes.selectedRecipe
  }
}

const mapDispatch = dispatch => ({
  fetchThisRecipe: id => dispatch(fetchThisRecipe(id))
})

export default connect(mapState, mapDispatch)(SingleRecipe)
