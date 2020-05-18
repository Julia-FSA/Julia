import React from 'react'
import {connect} from 'react-redux'
import {getFridgeThunk} from '../store/fridge'
import {Button} from 'react-bootstrap'
export class UserFridge extends React.Component {
  constructor() {
    super()
  }
  componentDidMount() {
    this.props.getFridge()
  }
  render() {
    return (
      <div className="container">
        <div className="fridge-cont">
          <h1>Your Fridge</h1>
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
    fridge: state.fridge
  }
}

const mapDispatch = dispatch => {
  return {
    getFridge: function() {
      dispatch(getFridgeThunk())
    }
  }
}

export default connect(mapState, mapDispatch)(UserFridge)
