import React, {Component} from 'react';

import Button from '@material-ui/core/Button';

class EditBackButton extends Component {

  onClick = event => {
    this.props.onClick(false);
  }

  render() {
    if (this.props.new || !this.props.edit) {
      return null
    }

    return (<Button onClick={this.onClick}>
      Back
    </Button>)
  }
}

export default EditBackButton;
