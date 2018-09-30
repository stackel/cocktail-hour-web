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

class DrinkList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      drinks: [],
      drinksFiltered: null
    }
  }

  componentDidMount() {
    this.fetchDrinks(this.props.user.id)
  }

  fetchDrinks = (userUid) => {
    if (localStorage.getItem('drinks')) {
      this.setState({
        drinks: JSON.parse(localStorage.getItem('drinks')),
        drinksFiltered: JSON.parse(localStorage.getItem('drinks'))
      })
    }
    database.collection("users").doc(userUid).collection("drinks").orderBy("name").onSnapshot(
      snapshot => {
        const drinks = []
        snapshot.forEach(doc => {
          let drink = doc.data()
          drink.id = doc.id
          drinks.push(drink);
        })
        localStorage.setItem('drinks', JSON.stringify(drinks))
        this.setState({drinks: drinks, drinksFiltered: drinks})
      }
    );
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

  hasTag = (obj, concept) => {
    if (obj.tags) {
      for (var i = 0; i < obj.tags.length; i++) {
        const tagLabel = obj.tags[i].label.toLowerCase();
        if (tagLabel.includes(concept.label.toLowerCase())) {
          return true
        }
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
        return this.hasIngredient(obj, concept) || this.hasTag(obj, concept) || obj.id === concept.value
      })

      hits = drinksFiltered;
    }

    this.setState({drinksFiltered: _.uniq(hits)})
  }

  NoDrinks = (props) => {
    return (
      <div class="mw6 center mt6 tc">
        <h2 class="f4 sans-serif dark-gray">
          Your drink list is empty.</h2>
        <div className="mv4">
          <Button
            component={Link}
            to="/new"
            variant="contained"
            color="primary">Add drink</Button>

        </div>
        <div>
          <Button
            component={Link}
            to="/shared"
            variant="outlined"
            color="primary"
            className="mt4">Browse shared drinks</Button>
        </div>
      </div>
    )
  }

  NoMatching = (props) => {
    return (
      <div className="mw6 center mt6 tc">
        <h2 className="f4 sans-serif dark-gray">
          No matching drinks found.</h2>
      </div>
    )
  }

  render() {
    const drinks = this.state.drinksFiltered;

    if (!drinks) {
      return (<div className="tc ma5">
        <Loading/>
      </div>)
    }

    if (!this.state.drinks.length) {
      return (<this.NoDrinks/>)
    }

    const drinkComponents = [];
    for (let i = 0; i < drinks.length; i++) {
      drinkComponents.push(
        <div key={drinks[i].id}>
          <DrinkListItem drink={drinks[i]} user={this.props.user}/>
          <Divider/>
        </div>

      )
    }
    return (
      <div className="tc">

        <div className="w-100 ph4">
          <Search onChange={this.searchInputChanged} drinks={this.state.drinks}/>
        </div>

        {!drinks.length && <this.NoMatching/>}

        <List component="nav">
          {drinkComponents}
        </List>

      </div>
    );
  }
}

export default DrinkList;
