import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Select from 'react-select';

import {database} from './firebase'

class IngredientListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ingredient: props.ingredient
    };
  }

  render() {
    return ( <p> {this.state.ingredient.label} </p> )
  }
}

export default IngredientListItem;
