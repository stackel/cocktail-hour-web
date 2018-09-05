import React, {Component} from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

class DebugToggle extends Component {
  onChange = event => {
    this.props.onChange(event.target.checked)
  }

  render() {
    if (this.props.hide) {
      return null;
    }
    return (
      <FormControlLabel
        control={<Switch
        checked = {
          this.props.debug
        }
        onChange = {
          this.onChange
        }
        value = "debug"
        />}
        label="Debug"/>
    )

  }
}

export default DebugToggle
