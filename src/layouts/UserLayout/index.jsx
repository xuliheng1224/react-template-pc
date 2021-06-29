import React, { Component } from 'react'

export default class UserLayout extends Component {
  render () {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}