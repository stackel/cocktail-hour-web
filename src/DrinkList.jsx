import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import {database, auth, googleAuthProvider} from './firebase'

import Auth from './Auth'
import AddNewDrink from './AddNewDrink'
import Drink from './Drink'

class DrinkList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      drinks: []
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.authUser) {
      this.fetchDrinks(nextProps.authUser.uid)
    } else {
      this.setState({
        drinks: []
      })
    }
  }

  componentDidMount() {
    if(this.props.authUser) {
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
    const drinks = this.state.drinks;
    const drinkComponents = [];
    for (let i = 0; i < drinks.length; i++) {
      drinkComponents.push(
        <Card className="ma3" key={drinks[i].id}>
          <CardContent className="ma2">
            <Drink
              className="ma4"
              drink={drinks[i]}
              debug={this.props.debug}
              edit={false}
              new={false}
              authUser={this.props.authUser}
              firestoreUser={this.props.firestoreUser}
              allIngredients={this.props.allIngredients}
              units={this.props.units}/>
          </CardContent>
        </Card>
      )
    }

    return (<div>
      {drinkComponents}
    </div>);
  }
}

export default DrinkList;
