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
    console.log('rendering MyRecipes props:', this.props)
    const favoriteRecipes = Object.values(this.props.favoriteRecipes)
    console.log('favoriteRecipes in render()', favoriteRecipes)
    return (
      <div>
        <div>
          <h1 style={{alignText: 'center'}}>Your Favorite Recipes:</h1>
        </div>
        <ul className="recipe-container">
          <div>
            {favoriteRecipes.length ? (
              favoriteRecipes.map(recipe => {
                return (
                  <li className="recipe" key={recipe.id}>
                    <Link className="recipe-link" to={`/recipe/${recipe.id}`}>
                      <img src={recipe.image} className="recipe-image" />
                      {`${recipe.title} - Ready In: ${
                        recipe.readyInMinutes
                      }min. - ${recipe.likes} Likes`}
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
