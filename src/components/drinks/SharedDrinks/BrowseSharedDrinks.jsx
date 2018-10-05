import React, {Component} from 'react';
import List from '@material-ui/core/List';
import _ from 'lodash'
import {Link} from 'react-router-dom'

import {database} from 'utils/firebase'
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

import DrinkListItem from 'components/drinks/DrinkListItem'
import Loading from 'components/shared/Loading'
import Search from 'components/drinks/Search'

class BrowseSharedDrinks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      drinks: [],
      drinksFiltered: null
    }
  }

  componentDidMount() {
    this.fetchDrinks()
  }

  fetchDrinks = () => {
    database.collection("shared").orderBy("name").onSnapshot(snapshot => {
      const drinks = []
      snapshot.forEach(doc => {
        let drink = doc.data()
        drink.shareId = doc.id
        drinks.push(drink);
      })
      this.setState({drinks: drinks, drinksFiltered: drinks})
    });
  }

  hasIngredient = (obj, concept) => {
    for (var i = 0; i < obj.ingredients.length; i++) {
      const drinkIngredientName = obj.ingredients[i].ingredient.label.toLowerCase();
      if (drinkIngredientName.includes(concept.label.toLowerCase())) {
        return true
      }
    }
    return false
  }

  searchInputChanged = searchInput => {
    const drinks = this.state.drinks;

    if (searchInput.length <= 0) {
      this.setState({drinksFiltered: drinks})
      return
    }

    let hits = _.cloneDeep(drinks)

    for (var i = 0; i < searchInput.length; i++) {
      const concept = searchInput[i]

      let drinksFiltered = hits.filter(obj => {
        return this.hasIngredient(obj, concept) || obj.id === concept.value
      })

      hits = drinksFiltered;
    }

    this.setState({drinksFiltered: _.uniq(hits)})
  }
  render() {
    const drinks = this.state.drinksFiltered;

    if (!drinks) {
      return (<div className="tc ma5">
        <Loading/>
      </div>)
    }

    const drinkComponents = [];
    for (let i = 0; i < drinks.length; i++) {
      drinkComponents.push(
        <div key={drinks[i].shareId}>
          <DrinkListItem drink={drinks[i]} shareId={drinks[i].shareId}/>
          <Divider/>
        </div>

      )
    }
    return (
      <div className="">
        <div className="pt4 ph4">
          <h1 className="sans-serif f2 mt0 mb0">Shared Drinks</h1>
          <h2 className="sans-serif f4 mt2 mb2 gray fw5">User created recipes.</h2>
        </div>

        <div className="w-100 ph4 mv3">
          <Search noTags onChange={this.searchInputChanged} drinks={this.state.drinks}/>
        </div>

        <List component="nav">
          {drinkComponents}
        </List>

      </div>
    );
  }
}

export default BrowseSharedDrinks;
