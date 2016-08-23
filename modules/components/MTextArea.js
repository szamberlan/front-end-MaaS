import React, { Component, PropTypes } from 'react'

class MTextArea extends Component {

  render() {
    return (
      <textarea {...this.props}  onChange={this.props.onWrite} defaultValue={this.props.value}/>
    )
  }
}

MTextArea.contextTypes = {
  store : React.PropTypes.object
}

export default MTextArea
