import React, {Component} from 'react'

import Button from '@material-ui/core/Button';

class SaveOrUpdateButton extends Component {

  onSave = event => {
    this.props.onSave()
  }

  onUpdate = event => {
    this.props.onUpdate()
  }

  render() {
    if (this.props.new) {
      return (
        <Button
          variant="contained"
          disabled={this.props.disabled}
          color="primary"
          className="w-100"
          onClick={this.onSave}>Save</Button>
      )
    }
    if (this.props.edit) {
      return (
        <Button
          variant="contained"
          disabled={this.props.disabled}
          color="primary"
          className="w-100"
          onClick={this.onUpdate}>Update</Button>
      )
    }
    return null;
  }
}

export default SaveOrUpdateButton;
