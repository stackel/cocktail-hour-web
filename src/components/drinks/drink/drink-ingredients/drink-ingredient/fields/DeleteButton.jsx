import React, {Component} from 'react';

import Button from '@material-ui/core/Button';

class AmountField extends Component {
  render() {
    if (this.props.show) {
      return (
        <Button color="secondary" variant="outlined" className="w-100" onClick={this.props.handleDelete}>Delete Ingredient</Button>
      )
    } else {
      return null;
    }
  }
}

export default AmountField;
