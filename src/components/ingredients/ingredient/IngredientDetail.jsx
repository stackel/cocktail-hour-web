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
      drinksWithIngredient: [],
      sharedDrinksWithIngredient: []
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
    return drinks.filter(obj => {
      return this.hasIngredient(obj, this.state.ingredient)
    })
  }

  fetchDrinks = (userUid) => {
    if (localStorage.getItem('drinks')) {
      this.setState({
        drinksWithIngredient: this.filterDrinks(
          JSON.parse(localStorage.getItem('drinks'))
        )
      });
    } else {
      database.collection("users").doc(userUid).collection("drinks").orderBy("name").onSnapshot(
        snapshot => {
          const drinks = []
          snapshot.forEach(doc => {
            let drink = doc.data()
            drink.id = doc.id
            drinks.push(drink);
          })
          this.setState({drinksWithIngredient: this.filterDrinks(drinks)});
        }
      )
    }
  }

  fetchSharedDrinks = () => {
    database.collection("shared").orderBy("name").onSnapshot(snapshot => {
      const drinks = []
      snapshot.forEach(doc => {
        let drink = doc.data()
        drink.id = doc.id
        drinks.push(drink);
      })
      this.setState({sharedDrinksWithIngredient: this.filterDrinks(drinks)});

    });
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
          this.fetchSharedDrinks();
        })
      }
    } else {
      return;
    }

  }

  render() {
    const {ingredient, drinksWithIngredient, sharedDrinksWithIngredient} = this.state;
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

    const sharedDrinkComponents = [];
    for (let i = 0; i < sharedDrinksWithIngredient.length; i++) {
      sharedDrinkComponents.push(
        <div key={sharedDrinksWithIngredient[i].id}>
          <DrinkListItem drink={sharedDrinksWithIngredient[i]}/>
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
        {
          drinkComponents.length > 0 &&
          <div>
            <h4 className="sans-serif f5 dark-gray tc fw5 mb2 mt0 pt0">Drinks with ingredient</h4>
            <List component="nav">
              {drinkComponents}
            </List>
          </div>
        }
        {
          sharedDrinkComponents.length > 0 &&
          <div>
            <h4 className="sans-serif f5 dark-gray tc fw5 mb2 mt5 pt0">Shared drinks with ingredient</h4>
            <List component="nav">
              {sharedDrinkComponents}
            </List>
          </div>
        }

      </div>
    )
  }
}

export default IngredientDetail;
