import React, {Component} from 'react';

import TextField from '@material-ui/core/TextField';

class AmountField extends Component {
  handleChange = event => {
    this.props.handleChange("amount", event.target.value)
  }

  render() {
    const props = this.props

    if (props.edit) {
      return (
        <TextField
          id={props.amount}
          className="w-100"
          label="Amount"
          defaultValue={props.amount}
          onChange={this.handleChange}/>
      )
    }

    if (!props.amount) {
      return null
    }

    return (<p className="sans-serif">{props.amount}</p>)
  }
}

export default AmountField;
