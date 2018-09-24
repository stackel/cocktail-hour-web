import React, {Component} from 'react';

import Select from 'react-select';
import Checkbox from '@material-ui/core/Checkbox';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import {database, firebase} from 'utils/firebase'

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
      database.collection("users").doc(this.props.user.id).update({
        ingredients: firebase.firestore.FieldValue.arrayUnion(
          this.state.ingredient.name
        )
      })
    } else {
      database.collection("users").doc(this.props.user.id).update({
        ingredients: firebase.firestore.FieldValue.arrayRemove(
          this.state.ingredient.name
        )
      })
    }
  }

  render() {
    return (
      <ListItem button>
        <ListItemText primary={this.state.ingredient.label} secondary={this.state.ingredient.type.label}/>
        <ListItemSecondaryAction>
          <Checkbox
            onChange={this.hasIngredientChanged}
            checked={this.state.hasIngredient}/>
        </ListItemSecondaryAction>
      </ListItem>
    )
  }
}

export default IngredientListItem;
