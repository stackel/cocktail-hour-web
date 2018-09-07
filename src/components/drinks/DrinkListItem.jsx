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
            userIngredients: JSON.stringify(this.props.userIngredients),
            drink: JSON.stringify(drink),
            authUserUid: this.props.authUserUid
          }
        }}
        button>

        <ListItemText primary={ drink.name }/>
        <ListItemText secondary={ drink.ingredients.map(obj => {return obj.ingredient.label}).join(", ") }/>
      </ListItem>
    );
  }
}

export default DrinkListItem;
