import React from 'react'
import {connect} from 'react-redux'
// import {Link} from 'react-router-dom'

/**
 * COMPONENT
 */
export const Alexa = props => {
  console.log('Alexa props', props)
  return (
    <div id="alexa">
      <p>
        Blah blah blah
        <br />
        <br />
        Blah blah
        <br />
        <br />
        Happy Cooking,
        <br />
        Team Julia
      </p>
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
