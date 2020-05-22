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
          <div className="title-image-cont">
            <div>
              <h3 style={{alignText: 'center'}}>Your Favorite Recipes:</h3>
            </div>
            <ul className="recipe-container">
              <div>
                {favoriteRecipes.length ? (
                  favoriteRecipes.map(recipe => {
                    return (
                      <li className="recipe" key={recipe.id}>
                        <Link
                          className="recipe-link"
                          to={`/recipe/${recipe.id}`}
                        >
                          <div className="image-cont">
                            <img src={recipe.image} className="recipe-image" />
                          </div>
                          <div className="title-cont">
                            {`${recipe.title} - Ready In: ${
                              recipe.readyInMinutes
                            }min. - ${recipe.likes} Likes`}
                          </div>
                        </Link>
                      </li>
                    )
                  })
                ) : (
                  <li>No Favorite Recipes</li>
                )}
              </div>
            </ul>
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
