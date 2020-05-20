/**
 * `components/index.js` exists simply as a 'central export' for our components.
 * This way, we can import all of our components from the same place, rather than
 * having to figure out which file they belong to!
 */
export {default as NavbarComp} from './navbar'
export {default as Home} from './Home'
export {default as Alexa} from './Alexa'
export {default as LinkAccount} from './LinkAccount'
export {default as UserFridge} from './UserFridge'
export {default as FindRecipe} from './FindRecipe'
export {default as MyRecipes} from './MyRecipes'
// export {default as AllRecipes} from './AllRecipes'
// export {default as SingleRecipe} from './SingleRecipe'
// export {default as RecipeHistory} from './RecipeHistory'
export {default as SearchRecipes} from './SearchRecipes'
export {Login} from './auth-form'
export {Signup} from './auth-form-signup'
