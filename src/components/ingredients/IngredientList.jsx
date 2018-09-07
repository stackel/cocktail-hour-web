import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import List from '@material-ui/core/List';

import {database} from 'utils/firebase'

import IngredientListItem from 'components/ingredients/ingredient/IngredientListItem'

class IngredientList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ingredients: []
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.authUser) {
      this.fetchIngredients(nextProps.authUser.uid)
    } else {
      this.setState({ingredient: []})
    }
  }

  componentDidMount() {
    if (this.props.authUser) {
      this.fetchIngredients(this.props.authUser.uid)
    }
  }

  fetchIngredients = (userUid) => {
    database.collection("ingredients").orderBy("name").onSnapshot(snapshot => {
      const ingredients = []
      snapshot.forEach(doc => {
        let ingredient = doc.data()
        ingredient.id = doc.id
        ingredients.push(ingredient);
      })
      this.setState({ingredients: ingredients})
    });
  }

  render() {
    const ingredients = this.state.ingredients;
    const ingredientComponents = [];
    for (let i = 0; i < ingredients.length; i++) {
      ingredientComponents.push(
        <IngredientListItem
          key={ingredients[i].id}
          ingredient={ingredients[i]}
          authUser={this.props.authUser}
          ingredients={this.props.firestoreUser.ingredients}/>
      )
    }

    return (<List>
      {ingredientComponents}
    </List>);
  }
}

export default IngredientList;
