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
          className="sans-serif f6 f5-ns"
          defaultValue={props.unit}
          onChange={this.handleChange}
          options={props.allUnits}
          getOptionLabel={(props.amount > 1) ? (option : {}) => option.label_plural : (option : {}) => option.label}/>
      )
    }

    if (!props.unit) {
      return null
    }

    if (props.amount > 1) {
      return (<p className="sans-serif gray f4">{props.unit.label_plural}</p>)
    }
    return (<p className="sans-serif gray f4">{props.unit.label}</p>)
  }
}

export default UnitField;
