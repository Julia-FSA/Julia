import React from 'react'
import {connect} from 'react-redux'
import {
  getFridgeThunk,
  addToFridgeThunk,
  removeFromFridgeThunk
} from '../store/fridge'
import {Button} from 'react-bootstrap'


export class Fridge extends React.Component {
  constructor() {
    super()
    this.state = {
      searchIngredient: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
  }
  componentDidMount() {
    this.props.getFridge(this.props.stockId)
  }
  handleSubmit = event => {
    event.preventDefault()
    this.props.addToFridge(this.props.stockId, this.state.searchIngredient)
    this.setState({
      searchIngredient: ''
    })
  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  handleRemove(ingredientName) {
    this.props.removeFromFridge(this.props.stockId, ingredientName)
  }
  render() {
    console.log('fridge props', this.props)
    return (
      <div className="outer-cont-fridge">
        <div className="container inner-cont">
          <div className="fridge-cont">
            <h1>Your Fridge</h1>
            <div className="add-to-fridge-cont">
              <label htmlFor="searchIngredient">
                Add an Ingredient to Your Fridge
              </label>
              <input
                name="searchIngredient"
                type="text"
                value={this.state.searchIngredient}
                onChange={this.handleChange}
              />
              <Button
                variant="success"
                type="submit"
                onClick={this.handleSubmit}
              >
                Add Ingredient
              </Button>
            </div>
          </div>
          <div className="container fridge-flex-container">
            {this.props.fridge && this.props.fridge.length > 0 ? (
              this.props.fridge.map(item => {
                return (
                  <div className="fridge-item-cont" key={item.ingredientName}>
                    <h3>{item.ingredientName.toUpperCase()}</h3>
                    <Button
                      variant="danger"
                      onClick={() => this.handleRemove(item.ingredientName)}
                    >
                      Remove Item
                    </Button>
                  </div>
                )
              })
            ) : (
              <h1>Your Fridge is Empty!</h1>
            )}
          </div>
        </div>

      </div>
    )
  }
}

const mapState = state => {
  return {
    fridge: state.fridge,
    stockId: state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    getFridge: function(stockId) {
      dispatch(getFridgeThunk(stockId))
    },
    addToFridge: function(stockId, ingredient) {
      dispatch(addToFridgeThunk(stockId, ingredient))
    },
    removeFromFridge: function(stockId, ingredientName) {
      dispatch(removeFromFridgeThunk(stockId, ingredientName))
    }
  }
}


export default connect(mapState, mapDispatch)(Fridge)

