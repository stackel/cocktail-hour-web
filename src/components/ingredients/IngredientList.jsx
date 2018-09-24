import React, {Component} from 'react';
import List from '@material-ui/core/List';
import {database} from 'utils/firebase'

import IngredientListItem from 'components/ingredients/ingredient/IngredientListItem'
import Loading from 'components/shared/Loading'

class IngredientList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ingredients: null,
      userIngredients: null
    }
  }

  componentDidMount() {
    const user = this.props.user
    if (user) {
      this.fetchAllIngredients()
      this.fetchUserIngredients(user.id)
    }
  }

  fetchAllIngredients = () => {
    if (localStorage.getItem('allIngredients')) {
      this.setState({
        ingredients: JSON.parse(localStorage.getItem('allIngredients'))
      })
    }

    database.collection("ingredients").orderBy("name").onSnapshot(snapshot => {
      const ingredients = []
      snapshot.forEach(doc => {
        let ingredient = doc.data()
        ingredient.id = doc.id
        ingredients.push(ingredient);
      })
      if (ingredients) {
        localStorage.setItem('allIngredients', JSON.stringify(ingredients))
        this.setState({ingredients: ingredients})
      }
    });
  }

  fetchUserIngredients = (userId) => {
    if (localStorage.getItem('userIngredients')) {
      this.setState({
        userIngredients: JSON.parse(localStorage.getItem('userIngredients'))
      })
    }

    database.collection("users").doc(userId).onSnapshot(snapshot => {
      const ingredients = (snapshot.data().ingredients || []).sort()

      localStorage.setItem('userIngredients', JSON.stringify(ingredients))
      this.setState({userIngredients: ingredients})
    });

  }

  render() {
    if (!this.state.ingredients || !this.state.userIngredients) {
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
          ingredients={this.state.userIngredients}
          user={this.props.user}/>
      )
    }

    return (<List>
      {ingredientComponents}
    </List>);
  }
}

export default IngredientList;
