import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import List from '@material-ui/core/List';

import {database, auth, googleAuthProvider} from 'utils/firebase'

import DrinkListItem from 'components/drinks/drink/DrinkListItem'

class DrinkList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      drinks: []
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.authUser) {
      this.fetchDrinks(nextProps.authUser.uid)
    } else {
      this.setState({drinks: []})
    }
  }

  componentDidMount() {
    if (this.props.authUser) {
      this.fetchDrinks(this.props.authUser.uid)
    }
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
        this.setState({drinks: drinks})
      }
    );
  }

  render() {
    if (!this.props.firestoreUser) {
      return null
    }

    const drinks = this.state.drinks;
    const drinkComponents = [];
    for (let i = 0; i < drinks.length; i++) {
      drinkComponents.push(
        <DrinkListItem
          key={drinks[i].id}
          debug={this.props.debug}
          allIngredients={this.props.allIngredients}
          units={this.props.units}
          authUser={this.props.authUser}
          firestoreUser={this.props.firestoreUser}
          drink={drinks[i]}/>
      )
    }
    return (
      <div className="w-100">
        <List component="nav">
          {drinkComponents}
        </List>
      </div>
    );
  }
}

export default DrinkList;
