import React from 'react'
import {connect} from 'react-redux'
import {getFridgeThunk} from '../store/fridge'

export class UserFridge extends React.Component {
  constructor() {
    super()
  }
  componentDidMount() {
    this.props.getFridge()
  }
  render() {
    return (
      <div>
        <h1>Your Fridge</h1>
        <div>
          {this.props.fridge && this.props.fridge.length > 0 ? (
            this.props.fridge.map(item => {
              return (
                <div key={item.ingredientName}>
                  <h3>{item.ingredientName}</h3>
                  <h3>{item.ingredientQuantity}</h3>
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
