import React, {Component} from 'react';

import Loading from 'components/shared/Loading';

export default class LoadingFullscreen extends Component {
  render() {
    return (
      <div className="tc ma3 mt6 pt5 mb4 mw5 center">
        <img className=" mb4" src="/res/logo-big-black.png" alt="logo"/>
        <Loading label={this.props.label || ""}/>
      </div>
    )
  }
}
