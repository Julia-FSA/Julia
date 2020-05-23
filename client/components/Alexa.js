import axios from 'axios'
import React from 'react'
import {connect} from 'react-redux'
import {Button} from 'react-bootstrap'

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
    const userId = this.props.user.id
    await axios.put(`/api/users/passcode/${userId}`, {code: false})
    this.setState({expired: true})
  }

  async handleSubmit() {
    const code = Math.floor(100000 + Math.random() * 900000)
    const timeLimit = 180000
    const interval = 1000

    const userId = this.props.user.id
    console.log('axios.......', userId, code)
    await axios.put(`/api/users/passcode/${userId}`, {code})

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
      passcode: code,
      timeRemaining: timeLimit / interval,
      expired: false
    })
  }

  render() {
    return (
      <div className="linkaccount">
        <div className="linkalexa">
          <h3>Click to generate a new code:</h3>
        </div>
        <Button variant="danger" type="submit" onClick={this.handleSubmit}>
          New Code{' '}
        </Button>
        <div className="passcode-cont">
          {this.state.passcode ? (
            <h2 className="passcode">{this.state.passcode}</h2>
          ) : (
            <h2 />
          )}
          {this.state.timeRemaining ? (
            <h3>Code expires in: {this.state.timeRemaining}s</h3>
          ) : (
            <div />
          )}
          {this.state.expired ? (
            <p style={{color: 'red'}}>Your code has expired.</p>
          ) : (
            <div />
          )}
        </div>
        <div className="alexa-instructions">
          <h3 className="linkalexa">How to link your account to Alexa:</h3>
          <div className="step-cont">
            <div className="step">
              Step 1. Click the Link to Alexa button on the homepage to generate
              a passcode
            </div>
            <br />
            <div className="step">
              Step 2. Open Julia Cooks with Alexa by saying "Alexa, open Julia
              Cooks"
            </div>
            <br />

            <div className="step">
              Step 3. Julia Cooks is open, say "Link my account"
            </div>
            <br />

            <div className="step">
              Step 4. Follow Alexa's prompt and say the passcode one digit at a
              time.
            </div>
            <br />

            <div className="step">
              Step 5. Repeat step 4 until Alexa has your correct passcode.
            </div>
            <br />

            <div className="step">
              Step 6. Say "Confirm Code" to link the web account to Alexa.
            </div>
          </div>
          {/* <h3 className="linkalexa">
            Now, you can start adding food items to your fridge and get a recipe
            based on what you have. Bon Appetit!~
          </h3> */}
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
