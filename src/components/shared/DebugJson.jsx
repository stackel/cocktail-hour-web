import React, { Component } from 'react'

class DebugJson extends Component {
    render() {
      if (this.props.show) {
        return (<pre> {JSON.stringify(this.props.value, null, 2)} </pre>)
      } else {
        return null;
      }
    }
}

export default DebugJson
