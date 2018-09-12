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
          defaultValue={props.unit}
          onChange={this.handleChange}
          options={props.allUnits}/>
      )
    }

    if (!props.unit) {
      return null
    }

    return (<p className="sans-serif gray f4">{props.unit.label}</p>)
  }
}

export default UnitField;
