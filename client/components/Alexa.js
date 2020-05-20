import React from 'react'
import {connect} from 'react-redux'
// import {Link} from 'react-router-dom'

/**
 * COMPONENT
 */
export const Alexa = props => {
  console.log('Alexa props', props)
  return (
    <div className="alexa-instructions" id="alexa-background">
      <h4 id="header">How to link your account to Alexa:</h4>
      <div className="step">
        Step 1. Click the Link to Alexa button on the homepage to generate a
        passcode
      </div>
      <div className="step">
        Step 2. Open Julia Cooks with Alexa by saying "Alexa, open Julia Cooks"
      </div>
      <div className="step">
        Step 3. Julia Cooks is open, say "Link my account"
      </div>
      <div className="step">
        Step 4. Follow Alexa's prompt and say the passcode one digit at a time.
      </div>
      <div className="step">
        Step 5. Repeat step 4 until Alexa has your correct passcode.
      </div>
      <div className="step">
        Step 6. Say "Confirm Code" to link the web account to Alexa.
      </div>
      <h4 id="header">
        Now, you can start adding food items to your fridge and get a recipe
        based on what you have. Bon Appetit!~
      </h4>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    user: state.user.firstName
  }
}

export default connect(mapState)(Alexa)
