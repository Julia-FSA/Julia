import React from 'react'
import {setCode} from '../../server/db/write'
import {connect} from 'react-redux'

/**
 * COMPONENT
 */
class LinkAccount extends React.Component {
  constructor() {
    super()
    this.state = {
      passcode: null,
      timeRemaining: null,
      expired: false
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.retireCode = this.retireCode.bind(this)
  }

  async retireCode() {
    await setCode(this.props.user.id, false)
    this.setState({expired: true})
  }

  async handleSubmit() {
    const rand = Math.floor(100000 + Math.random() * 900000)
    const timeLimit = 180000
    const interval = 1000

    await setCode(this.props.user.id, rand)

    for (let i = 0; i < timeLimit / interval; i++) {
      setTimeout(
        function() {
          const time = this.state.timeRemaining
          this.setState({timeRemaining: time - 1})
        }.bind(this),
        i * interval
      )
    }

    setTimeout(
      function() {
        this.retireCode()
      }.bind(this),
      timeLimit
    )

    this.setState({
      passcode: rand,
      timeRemaining: timeLimit / interval,
      expired: false
    })
  }

  render() {
    return (
      <div className="linkaccount" id="link-background">
        <h4>Click to generate a new code:</h4>
        <button type="submit" onClick={this.handleSubmit}>
          New Code
        </button>
        <div>
          {this.state.passcode ? <h2>{this.state.passcode}</h2> : <h2 />}
          {this.state.timeRemaining ? (
            <h3>Code expires in: {this.state.timeRemaining}s</h3>
          ) : (
            <p />
          )}
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

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    user: state.user
  }
}

export default connect(mapState)(LinkAccount)
