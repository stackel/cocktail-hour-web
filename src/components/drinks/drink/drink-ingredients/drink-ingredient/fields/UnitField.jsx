import React, {Component} from 'react';

import Select from 'react-select';

class UnitField extends Component {
  handleChange = value => {
    this.props.handleChange("unit", value)
  }

  render() {
    const props = this.props

    if (props.edit) {
      return (
        <Select
          placeholder="Unit"
          value={props.unit}
          onChange={this.handleChange}
          options={props.allUnits}/>
      )
    }

    if (!props.unit) {
      return null
    }

    return (<p className="sans-serif gray">{props.unit.label}</p>)
  }
}

export default UnitField;
