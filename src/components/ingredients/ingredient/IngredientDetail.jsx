import React, {Component} from 'react';

import {database, firebase} from 'utils/firebase'
import DrinkListItem from 'components/drinks/DrinkListItem'
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';

class IngredientDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ingredient: null,
      userId: null,
      drinksWithIngredient: []
    };
  }

  hasIngredient = (obj, concept) => {
    for (var i = 0; i < obj.ingredients.length; i++) {
      const drinkIngredientName = obj.ingredients[i].ingredient.name.toLowerCase();
      if (drinkIngredientName === concept.name.toLowerCase()) {
        return true
      }
    }
    return false
  }

  filterDrinks = (drinks) => {
    this.setState({
      drinksWithIngredient: drinks.filter(obj => {
        return this.hasIngredient(obj, this.state.ingredient)
      })
    })
  }

  fetchDrinks = (userUid) => {
    if (localStorage.getItem('drinks')) {
      this.filterDrinks(JSON.parse(localStorage.getItem('drinks')))
    } else {
      database.collection("users").doc(userUid).collection("drinks").orderBy("name").onSnapshot(
        snapshot => {
          const drinks = []
          snapshot.forEach(doc => {
            let drink = doc.data()
            drink.id = doc.id
            drinks.push(drink);
          })
          this.filterDrinks(drinks)
        }
      );
    }
  }

  componentDidMount() {
    const locationState = this.props.location.state

    if (locationState) {
      if (locationState.ingredient) {
        this.setState({
          ingredient: JSON.parse(locationState.ingredient),
          userId: locationState.userId
        }, () => {
          this.fetchDrinks(locationState.userId);
        })
      }
    } else {
      return;
    }

  }

  render() {
    const {ingredient, drinksWithIngredient} = this.state;
    if (!ingredient) {
      return null
    }

    const drinkComponents = [];
    for (let i = 0; i < drinksWithIngredient.length; i++) {
      drinkComponents.push(
        <div key={drinksWithIngredient[i].id}>
          <DrinkListItem drink={drinksWithIngredient[i]}/>
          <Divider/>
        </div>

      )
    }

    return (
      <div>
        <div className="mh4 mt4 mb5">
          <h3 className="sans-serif f2 mb2 pb0">{ingredient.label}</h3>
          <h4 className="sans-serif f4 gray fw5 mb4 mt0 pt0">{ingredient.type.label}</h4>
          <p className="sans-serif f5 lh-copy dark-gray ">{ingredient.description}</p>
        </div>

        <h4 className="sans-serif f5 dark-gray tc fw5 mb2 mt0 pt0">Drinks with ingredient</h4>
        <List component="nav">
          {drinkComponents}
        </List>
      </div>
    )
  }
}

export default IngredientDetail;
