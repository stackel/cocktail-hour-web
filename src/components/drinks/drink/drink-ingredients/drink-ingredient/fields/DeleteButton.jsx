import React, {Component} from 'react';

import DeleteIcon from '@material-ui/icons/Delete';

class DeleteButton extends Component {
  render() {
    if (this.props.show) {
      return (
        <DeleteIcon
          color="secondary"
          variant="outlined"
          className="v-mid link grow"
          onClick={this.props.handleDelete}>X</DeleteIcon>
      )
    } else {
      return null;
    }
  }
}

export default DeleteButton;
