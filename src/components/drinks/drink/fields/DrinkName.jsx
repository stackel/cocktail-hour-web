import React, { Component } from 'react'

import TextField from '@material-ui/core/TextField';

class DrinkName extends Component {

    onChange = event => {
      this.props.onChange("name", event.target.value)
    }

    render() {
      if (this.props.edit) {
        return (
          <TextField
            id="name"
            label="Name"
            className="w-100"
            value={this.props.name}
            onChange={this.onChange}/>
        )
      } else {
        return <h3 className="sans-serif f2">{this.props.name}</h3>
      }
    }
}

export default DrinkName
