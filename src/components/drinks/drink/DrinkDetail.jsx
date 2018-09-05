import React, {Component} from 'react';

import Drink from 'components/drinks/drink/Drink'

class DrinkDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      debug: false,
      edit: false,
      new: false,
      authUser: JSON.parse(this.props.location.state.authUser),
      firestoreUser: JSON.parse(this.props.location.state.firestoreUser),
      allIngredients: JSON.parse(this.props.location.state.allIngredients),
      units:JSON.parse(this.props.location.state.units),
      drink: JSON.parse(this.props.location.state.drink),
    }
  }

  render() {
    return (
      <div class="ma4">
        <Drink
          drink={this.state.drink}
          debug={this.state.debug}
          edit={false}
          new={false}
          authUserUid={this.state.authUser.uid}
          firestoreUser={this.state.firestoreUser}
          allIngredients={this.state.allIngredients}
          units={this.state.units}/>

      </div>

    );
  }
}

export default DrinkDetail;
