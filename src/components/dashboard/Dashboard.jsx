import React, {Component} from 'react';

import Button from '@material-ui/core/Button';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import {Link} from 'react-router-dom'

import {database, auth} from 'utils/firebase'

import Auth from 'components/auth/Auth'
import User from 'components/dashboard/User'
import DebugToggle from 'components/dashboard/DebugToggle'
import AddNewDrink from 'components/drinks/AddNewDrink'
import DrinkList from 'components/drinks/DrinkList'
import IngredientList from 'components/ingredients/IngredientList'

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authUser: null,
      firestoreUser: null,
      debug: false,
      units: [],
      allIngredients: [],
      value: 0
    };
  }

  fetchIngredients = () => {
    database.collection("ingredients").onSnapshot(snapshot => {
      let ingredients = []
      snapshot.forEach(doc => {
        ingredients.push(doc.data());
      })
      this.setState({allIngredients: ingredients})
    })
  }

  fetchUnits = () => {
    database.collection("units").onSnapshot(snapshot => {
      let units = []
      snapshot.forEach(doc => {
        units.push(doc.data());
      })
      this.setState({units: units})
    })
  }

  onLogin = (authUser, firestoreUser) => {
    this.setState({authUser: authUser, firestoreUser: firestoreUser})
    this.fetchIngredients();
    this.fetchUnits();
  }

  logout = () => {
    auth.signOut().then(() => {
      console.log("Successfully logged out.")
      this.setState({authUser: null, firestoreUser: null})
    }, error => {
      console.log("An error occured while logging out: ")
      console.log(error)
    })
  }

  changeDebugMode = debug => {
    this.setState({debug: debug});
  };

  bottomNavigationChanged = (event, value) => {
    this.setState({value});
  }

  List = (props) => {
    if (props.value === 0) {
      return (
        <div>
          <DrinkList
            debug={this.state.debug}
            authUser={this.state.authUser}
            firestoreUser={this.state.firestoreUser}
            units={this.state.units}
            allIngredients={this.state.allIngredients}/>
        </div>
      )
    }
    if (props.value === 1) {
      return (
        <IngredientList
          debug={this.state.debug}
          authUser={this.state.authUser}
          firestoreUser={this.state.firestoreUser}
          units={this.state.units}
          allIngredients={this.state.allIngredients}/>
      )
    }
    return null;
  }

  render() {
    if (!this.state.authUser) {
      return (<Auth onLogin={this.onLogin}/>)
    }

    return (
      <div>
        <DebugToggle
          hide={false}
          debug={this.state.debug}
          onChange={this.changeDebugMode}/>

        <User authUser={this.state.authUser} onLogout={this.logout}/>

        <div class="tc mv3">
          <Button
            variant="outlined"
            color="primary"
            component={Link}
            to={{
              pathname: "/new",
              state: {
                debug: JSON.stringify(this.state.debug),
                allIngredients: JSON.stringify(this.state.allIngredients),
                units: JSON.stringify(this.state.units),
                userUid: this.state.authUser.uid
              }
            }}>
            New Drink
          </Button>
        </div>

        <this.List value={this.state.value} authUser={this.state.authUser}/>

        <BottomNavigation
          className="fixed bottom-0 w-100"
          value={this.state.value}
          onChange={this.bottomNavigationChanged}
          showLabels="showLabels">
          <BottomNavigationAction label="Drinks"/>
          <BottomNavigationAction label="Ingredients"/>
        </BottomNavigation>
      </div>
    );
  }
}

export default Dashboard;
