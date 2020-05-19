import React from 'react'
import {connect} from 'react-redux'
import {getFridgeThunk} from '../store/fridge'
import {Button} from 'react-bootstrap'
export class UserFridge extends React.Component {
  constructor() {
    super()
    this.state = {
      searchIngredient: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentDidMount() {
    this.props.getFridge(this.props.stockId)
  }
  handleSubmit = event => {
    event.preventDefault()
    console.log('you clicked on add')
  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  render() {
    console.log('fridge props', this.props)
    return (
      <div className="container">
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
            <Button variant="success" type="submit" onClick={this.handleSubmit}>
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
                  <Button variant="danger">Remove Item</Button>
                </div>
              )
            })
          ) : (
            <h1>Your Fridge is Empty!</h1>
          )}
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
    }
  }
}

export default connect(mapState, mapDispatch)(UserFridge)
