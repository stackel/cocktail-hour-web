import React, {Component} from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {Link} from "react-router-dom";

class DrinkListItem extends Component {
  render() {
    const drink = this.props.drink
    return (
      <ListItem
        component={Link}
        to={{
          pathname: "/drink/" + drink.id,
          state: {
            debug: JSON.stringify(this.props.debug),
            allIngredients: JSON.stringify(this.props.allIngredients),
            units: JSON.stringify(this.props.units),
            authUser: JSON.stringify(this.props.authUser),
            firestoreUser: JSON.stringify(this.props.firestoreUser),
            drink: JSON.stringify(drink)
          }
        }}
        button>

        <ListItemText primary={drink.name}/>

      </ListItem>
    );
  }
}

export default DrinkListItem;
