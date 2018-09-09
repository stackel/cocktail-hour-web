import React, {Component} from 'react'

import Button from '@material-ui/core/Button';

class SaveOrUpdateButton extends Component {

  onClick = event => {
    this.props.onClick()
  }

  render() {
    if (this.props.new) {
      return (
        <Button
          variant="contained"
          disabled={this.props.disabled}
          color="primary"
          className="w-100"
          onClick={this.onClick}>Save</Button>
      )
    }
    if (this.props.edit) {
      return (
        <Button
          variant="contained"
          disabled={this.props.disabled}
          color="primary"
          className="w-100"
          onClick={this.onClick}>Update</Button>
      )
    }
    return null;
  }
}

export default SaveOrUpdateButton;
