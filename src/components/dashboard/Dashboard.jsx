import React, {Component} from 'react';

import Button from '@material-ui/core/Button';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import {Link} from 'react-router-dom'

import {database, auth} from 'utils/firebase'

import Auth from 'components/auth/Auth'
import User from 'components/dashboard/User'
import DebugToggle from 'components/dashboard/DebugToggle'
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

  onLogin = (authUser, firestoreUser) => {
    this.setState({authUser: authUser, firestoreUser: firestoreUser})
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
            userIngredients={this.state.firestoreUser.ingredients}
            authUserUid={this.state.authUser.uid}/>
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
      <div className="pt3">
        <DebugToggle
          hide={true}
          debug={this.state.debug}
          onChange={this.changeDebugMode}/>

        <User authUser={this.state.authUser} onLogout={this.logout}/>

        <div class="tc mv3">
          <Button
            variant="outlined"
            color="primary"
            component={Link}
            to="/new">
            New Drink
          </Button>
        </div>
        <div className="mt4">
          <this.List value={this.state.value} authUser={this.state.authUser}/>

        </div>

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
