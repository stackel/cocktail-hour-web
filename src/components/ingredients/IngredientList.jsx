import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import List from '@material-ui/core/List';
import {database} from 'utils/firebase'

import IngredientListItem from 'components/ingredients/ingredient/IngredientListItem'
import Loading from 'components/shared/Loading'

class IngredientList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ingredients: null
    }
  }
  
  componentDidMount() {
    if (this.props.authUser) {
      this.fetchAllIngredients(this.props.authUser.uid)
    }
  }

  fetchAllIngredients = (userUid) => {
    if(localStorage.getItem('allIngredients')) {
      this.setState({ingredients: JSON.parse(localStorage.getItem('allIngredients'))})
    }

    database.collection("ingredients").orderBy("name").onSnapshot(snapshot => {
      const ingredients = []
      snapshot.forEach(doc => {
        let ingredient = doc.data()
        ingredient.id = doc.id
        ingredients.push(ingredient);
      })
      //save to localstorage
      localStorage.setItem('allIngredients', JSON.stringify(ingredients))
      this.setState({ingredients: ingredients})
    });
  }

  render() {
    if (!this.state.ingredients || !this.props.authUser) {
      return (<div className="tc ma5">
        <Loading/>
      </div>)
    }
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
