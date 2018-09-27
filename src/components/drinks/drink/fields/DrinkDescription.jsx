import React, {Component} from 'react'

import TextField from '@material-ui/core/TextField';

class DrinkDescription extends Component {

  onChange = event => {
    this.props.onChange("description", event.target.value)
  }

  render() {
    if (this.props.edit) {
      return (
        <TextField
          id="description"
          label="Description"
          className="w-100"
          value={this.props.description}
          onChange={this.onChange}
          multiline
          rowsMax="4"/>
      )
    } else {
      return <p className="sans-serif f5 lh-copy dark-gray">{this.props.description}</p>
    }
  }
}

export default DrinkDescription
