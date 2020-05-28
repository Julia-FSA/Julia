import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {fetchFavoriteRecipes} from '../store/recipes'

/**
 * COMPONENT
 */

class MyRecipes extends React.Component {
  async componentDidMount() {
    const id = this.props.user.id
    await this.props.fetchFavoriteRecipes(id)
  }

  render() {
    const favoriteRecipes = Object.values(this.props.favoriteRecipes)
    return (
      <div className="outer-cont">
        <div className="container inner-cont">
          <div className="fridge-cont">
            <div className="favorite-recipe-cont">
              <h1>Your Favorite Recipes:</h1>
            </div>
            {/* <ul className="recipe-container"> */}
            <div id="flex-card-cont">
              {favoriteRecipes.length ? (
                favoriteRecipes.map(recipe => {
                  return (
                    <div className="card" key={recipe.id}>
                      <img
                        className="card-img-top"
                        src={recipe.image}
                        alt="Card image cap"
                      />
                      <div className="card-body">
                        <h5 className="card-title">{recipe.title}</h5>
                        <p className="card-text">
                          Ready In: {recipe.readyInMinutes} min.
                        </p>
                        <p className="card-text">{recipe.likes} Likes</p>
                        <Link to={`/recipe/${recipe.id}`}>
                          <button className="btn btn-warning">See More</button>
                        </Link>
                      </div>
                    </div>
                  )
                })
              ) : (
                <h2>No Favorite Recipes</h2>
              )}
            </div>
            {/* </ul> */}
          </div>
        </div>
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
    favoriteRecipes: state.recipes.favoriteRecipes
  }
}

const mapDispatch = dispatch => ({
  fetchFavoriteRecipes: id => dispatch(fetchFavoriteRecipes(id))
})

export default connect(mapState, mapDispatch)(MyRecipes)


