import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import List from '@material-ui/core/List';
import Input from '@material-ui/core/Input';
import _ from 'lodash'
import {database, auth, googleAuthProvider} from 'utils/firebase'
import Divider from '@material-ui/core/Divider';

import DrinkListItem from 'components/drinks/DrinkListItem'
import Loading from 'components/shared/Loading'
import Search from 'components/drinks/Search'

class DrinkList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      drinks: null,
      drinksFiltered: null
    }
  }

  componentDidMount() {
    this.fetchDrinks(this.props.authUserUid)
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
        if(drinks) {
          localStorage.setItem('drinks', JSON.stringify(drinks))
          this.setState({drinks: drinks, drinksFiltered: drinks})
        } else {
          this.setState({
            drinks: [],
            drinksFiltered: []
          })
        }
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
        <div>
          <DrinkListItem
            key={drinks[i].id}
            drink={drinks[i]}
            authUserUid={this.props.authUserUid}/>
          <Divider/>
        </div>

      )
    }
    return (
      <div className="tc">

        <div className="w-100 ph4">
          <Search onChange={this.searchInputChanged} drinks={this.state.drinks}/>
        </div>

        <List component="nav">
          {drinkComponents}
        </List>

      </div>
    );
  }
}

export default DrinkList;
