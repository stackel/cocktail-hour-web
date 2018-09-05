import React, {Component} from 'react'

import Button from '@material-ui/core/Button';

class AddIngredientButton extends Component {

  onClick = event => {
    this.props.onClick()
  }

  render() {
    if (this.props.edit) {
      return (
        <Button variant="outlined" className="w-100" onClick={this.onClick}>Add ingredient</Button>
      )
    } else {
      return null
    }
  }
}

export default AddIngredientButton
