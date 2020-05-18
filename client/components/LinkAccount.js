import React from 'react'
import {setCode} from '../../dynamo/write'
import {getUser} from '../store/user'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

/**
 * COMPONENT
 */
class LinkAccount extends React.Component {
  constructor() {
    super()
    this.state = {
      passcode: null,
      expired: false
    }

    this.bind.handleSubmit = this.bind.handleSubmit(this)
  }

  async handleSubmit() {
    let rand = Math.floor(100000 + Math.random() * 900000)
    console.log('setCode() with', this.props.user.id, rand)
    await setCode(this.props.user.id, rand)
  }

  render() {
    console.log('rendering at least...', this.props)
    return (
      <div>
        <p>Click to generate a new code:</p>
        <button type="submit" onClick={this.handleSubmit}>
          New Code
        </button>
        <div>
          {this.state.passcode ? <h2>{this.state.passcode}</h2> : <h2 />}
          {this.state.expired ? (
            <p style={{color: 'red'}}>Your code has expired.</p>
          ) : (
            <p />
          )}
        </div>
      </div>
    )
  }
}

// /**
//  * CONTAINER
//  */
// const mapState = state => {
//     return {
//       user: state.user
//     }
//   }

//   const mapDispatch = dispatch => ({
//     getUser: () => dispatch(getUser())
//   })

export default LinkAccount
