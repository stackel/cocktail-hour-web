import React, {Component} from 'react';

import MenuItem from '@material-ui/core/MenuItem';


class EditButton extends Component {
  onClick = event => {
    this.props.onClick();

  }
  render() {
    return (<MenuItem onClick={this.onClick}>Delete</MenuItem>)
  }
}

export default EditButton;
