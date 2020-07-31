import React from 'react'
import ReactDOM from 'react-dom'
import UrlForm from './UrlForm'
import PropTypes from 'prop-types'

class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    return (
      <UrlForm name="React" />
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Main />,
    document.getElementsByTagName('main')[0],
  )
})
