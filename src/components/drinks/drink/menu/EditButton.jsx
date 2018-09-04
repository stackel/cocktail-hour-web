import React, {Component} from 'react';

import MenuItem from '@material-ui/core/MenuItem';


class EditButton extends Component {
  onClick = event => {
    this.props.onClick(true);

  }
  render() {
    return (<MenuItem onClick={this.onClick}>Edit</MenuItem>)
  }
}

export default EditButton;
