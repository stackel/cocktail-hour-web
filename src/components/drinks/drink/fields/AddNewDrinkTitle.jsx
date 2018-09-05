import React, {Component} from 'react'

import TextField from '@material-ui/core/TextField';

class AddNewDrinkTitle extends Component {
  render() {
    if (!this.props.new) {
      return null
    }
    return (
      <h2 className="sans-serif f3 b ttu"> Add New Drink</h2>
    )
  }
}

export default AddNewDrinkTitle
