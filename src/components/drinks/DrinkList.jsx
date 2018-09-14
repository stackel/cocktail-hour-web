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
    database.collection("users").doc(userUid).collection("drinks").onSnapshot(
      snapshot => {
        const drinks = []
        snapshot.forEach(doc => {
          let drink = doc.data()
          drink.id = doc.id
          drinks.push(drink);
        })
        this.setState({drinks: drinks, drinksFiltered: drinks})
      }
    );
  }
  searchInputChanged = event => {
    const drinks = this.state.drinks;
    const searchString = event.target.value.toLowerCase()

    let drinksFilteredByName = drinks.filter(obj => {return obj.name.toLowerCase().includes(searchString)})

    let drinksFilteredByIngredients = drinks.filter(obj => {
      for (var i = 0; i < obj.ingredients.length; i++) {
        const drinkIngredientName = obj.ingredients[i].ingredient.label.toLowerCase();
        if(drinkIngredientName.includes(searchString)) {
          return true;
        }
      }
      return false
    })

    let drinksFilteredByTags = drinks.filter(obj => {
      if(obj.tags) {
        for (var i = 0; i < obj.tags.length; i++) {
          const tagLabel = obj.tags[i].label.toLowerCase();
          if(tagLabel.includes(searchString)) {
            return true;
          }
        }
      }

      return false
    })

    this.setState({
      drinksFiltered: _.uniq(drinksFilteredByName.concat(drinksFilteredByIngredients).concat(drinksFilteredByTags))
    })
  }

  render() {
    const drinks = this.state.drinksFiltered;
    if(!drinks) {
      return(<div className="tc ma5">
        <Loading/>
      </div>)
    }

    const drinkComponents = [];
    for (let i = 0; i < drinks.length; i++) {
      drinkComponents.push(
        <div>
          <DrinkListItem
            key={drinks[i].id}
            userIngredients={this.props.userIngredients}
            drink={drinks[i]}
            authUserUid={this.props.authUserUid}/>
          <Divider/>
        </div>

      )
    }
    return (
      <div className="tc">

        <div className="w-100 ph4">
          <Input
            className="w-100"
            placeholder="Search (Name, ingredient, tag)"
            inputProps={{
              'aria-label' : 'Search'
            }}
            onChange={this.searchInputChanged}/>
        </div>

        <List component="nav">
          {drinkComponents}
        </List>


      </div>
    );
  }
}

export default DrinkList;
