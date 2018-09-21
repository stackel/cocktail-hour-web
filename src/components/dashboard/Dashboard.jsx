import React, {Component} from 'react';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import {Link} from 'react-router-dom'
import MoreVert from '@material-ui/icons/MoreVert';

import {database, auth} from 'utils/firebase'

import Auth from 'components/auth/Auth'
import User from 'components/dashboard/User'
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
      value: 0,
      anchorElement: null
    };

    if (localStorage.getItem('authUser')) {
      this.state["authUser"] = JSON.parse(localStorage.getItem('authUser'));
    }

    if (localStorage.getItem('firestoreUser')) {
      this.state["firestoreUser"] = JSON.parse(localStorage.getItem('firestoreUser'));
    }
  }

  onLogin = (authUser, firestoreUser) => {
    this.setState({authUser: authUser, firestoreUser: firestoreUser})
  }

  logout = () => {
    auth.signOut().then(() => {
      console.log("Successfully logged out.")
      localStorage.clear()
      this.setState(
        {authUser: null, firestoreUser: null, anchorElement: null, allIngredients: null}
      )
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

  open = event => {
    this.setState({anchorElement: event.currentTarget});
  };

  close = () => {
    this.setState({anchorElement: null});
  };

  render() {
    const anchorElement = this.state.anchorElement
    if (!this.state.authUser) {
      return (<Auth onLogin={this.onLogin}/>)
    }

    return (<div>
      <header className="ph4 pv4">
        <h1 className="sans-serif f2 ma0 pa0 fl">{
            this.state.value === 0
              ? "Drinks"
              : "Ingredients"
          }</h1>
        <div className="fr v-mid">
          <MoreVert
            aria-owns={anchorElement
              ? 'drink-menu'
              : null}
            aria-haspopup="true"
            onClick={this.open}>
            menu
          </MoreVert>
          <Menu
            id="drink-menu"
            anchorEl={anchorElement}
            open={Boolean(anchorElement)}
            onClose={this.close}>
            <Link className="link" to="/new">
              <MenuItem>New Drink</MenuItem>
            </Link>
            >
            <MenuItem
              component={Link}
              to={{
                pathname: "/profile",
                state: {
                  authUser: JSON.stringify(this.state.authUser)
                }
              }}>Profile</MenuItem>
            <MenuItem onClick={this.logout}>Log Out</MenuItem>
          </Menu>
        </div>
      </header>

      <div className="mt4 pb5">
        <this.List value={this.state.value} authUser={this.state.authUser}/>
      </div>

      <BottomNavigation
        className="fixed bottom-0 w-100 mw7"
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
