import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {Link} from "react-router-dom";

import {database, auth, googleAuthProvider} from 'utils/firebase'

import Drink from 'components/drinks/drink/Drink'

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

  drinkClicked = () => {}

  render() {
    if (!this.props.firestoreUser) {
      return null
    }

    const drinks = this.state.drinks;
    const drinkComponents = [];
    for (let i = 0; i < drinks.length; i++) {
      drinkComponents.push(
        <ListItem
          component={Link}
          to={{
            pathname: "/drink/" + drinks[i].id,
            state: {
              debug: JSON.stringify(this.props.debug),
              allIngredients: JSON.stringify(this.props.allIngredients),
              units: JSON.stringify(this.props.units),
              authUser: JSON.stringify(this.props.authUser),
              firestoreUser: JSON.stringify(this.props.firestoreUser),
              drink: JSON.stringify(drinks[i])
            }
          }}
          button="button"
          key={drinks[i].id}
          onClick={this.drinkClicked}>
          <ListItemText className="db" primary={drinks[i].name}/>
        </ListItem>
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
