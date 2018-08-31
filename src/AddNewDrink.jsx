import React, {Component} from 'react';

import Drink from './Drink'

class AddNewDrink extends Component {
  render() {
    return (<Drink
      debug={this.props.debug}
      edit={true}
      new={true}
      authUser={this.props.authUser}
      units={this.props.units}
      allIngredients={this.props.allIngredients}/>)
  }
}

export default AddNewDrink
