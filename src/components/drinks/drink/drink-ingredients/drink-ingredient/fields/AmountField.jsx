import React, {Component} from 'react';

import TextField from '@material-ui/core/TextField';

class AmountField extends Component {
  handleChange = event => {
    console.log(event.target.value)
    this.props.handleChange("amount", event.target.value)
  }

  render() {
    if (this.props.edit) {
      return (
        <TextField
          className="w-100"
          label="Amount"
          defaultValue={this.props.amount}
          onChange={this.handleChange}/>
      )
    }

    if (!this.props.amount) {
      return null
    }

    return (<p className="sans-serif f4">{this.props.amount}</p>)
  }
}

export default AmountField;
