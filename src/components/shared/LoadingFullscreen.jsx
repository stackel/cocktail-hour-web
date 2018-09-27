import React, {Component} from 'react';

import Loading from 'components/shared/Loading';

export default class LoadingFullscreen extends Component {
  render() {
    return (
      <div className="tc ma5 mt6 pt5 mb4">
        <img class="mw5 mb4" src="res/logo-big-black.png" alt="logo"/>
        <Loading label={this.props.label || ""}/>
      </div>
    )
  }
}
