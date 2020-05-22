import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {fetchFavoriteRecipes} from '../store/recipes'

/**
 * COMPONENT
 */
let sampleImage =
  'https://lh3.googleusercontent.com/proxy/89dmcyifdFSpMuiGbwRBKdRuEOUG1glka6BvB4Bg0QZj8xHCzYFrPtxQUazJFhF9ziFu-Z79oBBm_DKnnOwukL9R3P22'
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
      <div className="outer-cont">
        <div className="container inner-cont">
          <div className="fridge-cont">
            <h1>Your Favorite Recipes:</h1>
            <div id="flex-card-cont">
              <div className="card">
                <img
                  className="card-img-top"
                  src={sampleImage}
                  alt="Card image cap"
                />
                <div className="card-body">
                  <h5 className="card-title">
                    Thai Carrot Peanut Noodle Salad
                  </h5>
                  <p className="card-text">
                    Some quick example text to build on the card title and make
                    up the bulk of the card's content.
                  </p>
                  <a href="#" className="btn btn-warning">
                    See More
                  </a>
                </div>
              </div>
              <div className="card">
                <img
                  className="card-img-top"
                  src={sampleImage}
                  alt="Card image cap"
                />
                <div className="card-body">
                  <h5 className="card-title">Recipe Title</h5>
                  <p className="card-text">
                    Some quick example text to build on the card title and make
                    up the bulk of the card's content.
                  </p>
                  <a href="#" className="btn btn-warning">
                    Go somewhere
                  </a>
                </div>
              </div>
              <div className="card">
                <img
                  className="card-img-top"
                  src={sampleImage}
                  alt="Card image cap"
                />
                <div className="card-body">
                  <h5 className="card-title">Card title</h5>
                  <p className="card-text">
                    Some quick example text to build on the card title and make
                    up the bulk of the card's content.
                  </p>
                  <a href="#" className="btn btn-primary">
                    Go somewhere
                  </a>
                </div>
              </div>
            </div>
          </div>

          <ul className="recipe-container">
            <div>
              {favoriteRecipes.length ? (
                favoriteRecipes.map(recipe => {
                  return (
                    <li className="recipe" key={recipe.id}>
                      <Link className="recipe-link" to={`/recipe/${recipe.id}`}>
                        <img src={sampleImage} className="recipe-image" />
                        {`${recipe.title} - Ready In:${
                          recipe.readyInMinutes
                        }min. - ${recipe.aggregateLikes} Likes`}
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
