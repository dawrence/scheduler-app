import React from 'react'
import ReactDOM from 'react-dom'
import AppScheduler from './AppScheduler'
import PropTypes from 'prop-types'

class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    return (
      <AppScheduler name="AppScheduler" />
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Main />,
    document.getElementsByTagName('main')[0],
  )
})
