import React, {Component} from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';

export default class Loading extends Component {
  render() {
    if (this.props.label) {
      return (
        <div>
          <CircularProgress/>
          <h3 className="f5 fw3 tc sans-serif">{this.props.label}</h3>
        </div>
      )
    } else {
      return <CircularProgress/>
    }
  }
}
