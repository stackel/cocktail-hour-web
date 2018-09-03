import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Select from 'react-select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import {database, firebase} from './firebase'

class IngredientListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ingredient: props.ingredient,
      hasIngredient: props.ingredients.includes(props.ingredient.name)
    };
  }

  hasIngredientChanged = event => {
    this.setState({hasIngredient: event.target.checked})
    if (event.target.checked) {
      database.collection("users").doc(this.props.authUser.uid).update({
        ingredients: firebase.firestore.FieldValue.arrayUnion(this.state.ingredient.name)
      })
    } else {
      database.collection("users").doc(this.props.authUser.uid).update({
        ingredients: firebase.firestore.FieldValue.arrayRemove(
          this.state.ingredient.name
        )
      })
    }
  }

  render() {
    return (
      <div>
        <FormControlLabel
          control={<Switch
          checked = {
            this.state.hasIngredient
          }
          onChange = {
            this.hasIngredientChanged
          }
          value = "Has Ingredient"
          />}
          label="Has Ingredient"/>
        <h3 className="sans-serif f4">
          {this.state.ingredient.label}
        </h3>
        <p className="sans-serif f5 gray">
          {this.state.ingredient.description}
        </p>
      </div>
    )
  }
}

export default IngredientListItem;
