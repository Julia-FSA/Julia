import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  Alexa,
  FindRecipe,
  Fridge,
  Home,
  LinkAccount,
  Login,
  MyRecipes,
  Signup,
  SearchRecipes,
} from './components'
import {me} from './store'
/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData()
  }

  render() {
    const {isLoggedIn} = this.props

    return (
      <Switch>
        {/* Routes placed here are available to all visitors */}
        <Route exact path="/" component={Home} />
        <Route path="/home" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        {/* <Route path="/allrecipes" component={AllRecipes} /> */}
        {/* <Route path="/singlerecipe" component={SingleRecipe} /> */}
        {/* <Route path="/recipehistory" component={RecipeHistory} /> */}
        <Route path="/searchrecipes" component={SearchRecipes} />
        <Route path="/alexa" component={Alexa} />
        {isLoggedIn && (
          <Switch>
            {/* Routes placed here are only available after logging in */}
            <Route path="/fridge" component={Fridge} />
            <Route path="/findRecipe" component={FindRecipe} />
            <Route path="/myrecipes" component={MyRecipes} />
            <Route path="/searchrecipes" component={SearchRecipes} />
            <Route path="/linkaccount" component={LinkAccount} />
          </Switch>
        )}
        {/* Displays our Login component as a fallback */}
        <Route component={Login} />
      </Switch>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
    // Otherwise, state.user will be an empty object, and state.user.id will be falsey
    isLoggedIn: !!state.user.id,
  }
}

const mapDispatch = (dispatch) => {
  return {
    loadInitialData() {
      dispatch(me())
    },
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes))

/**
 * PROP TYPES
 */
Routes.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
}
