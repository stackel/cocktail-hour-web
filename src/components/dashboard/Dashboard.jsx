import React, {Component} from 'react';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';

import {Link} from 'react-router-dom'
import MoreVert from '@material-ui/icons/MoreVert';

import {database, auth} from 'utils/firebase'

import Auth from 'components/auth/Auth'
import User from 'components/dashboard/User'
import DrinkList from 'components/drinks/DrinkList'
import IngredientList from 'components/ingredients/IngredientList'
import BottomTabs from 'components/dashboard/BottomTabs'

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      debug: false,
      units: [],
      allIngredients: [],
      currentTab: 0,
      anchorElement: null
    };

    const user = localStorage.getItem('user');
    if (user) {
      this.state["user"] = JSON.parse(localStorage.getItem('user'));
    }
  }

  onLogin = (user) => {
    this.setState({user: user})
  }

  logout = () => {
    auth.signOut().then(() => {
      console.log("Successfully logged out.")
      localStorage.clear()
      this.setState(
        {user: null}
      )
    }, error => {
      console.log("An error occured while logging out: ")
      console.log(error)
    })
  }

  changeTab = (event, value) => {
    this.setState({currentTab: value});
  }

  List = (props) => {
    if (props.value === 0) {
      return (
        <div>
          <DrinkList user={this.state.user}/>
        </div>
      )
    }
    if (props.value === 1) {
      return (
        <IngredientList
          debug={this.state.debug}
          user={this.state.user}
          units={this.state.units}
          allIngredients={this.state.allIngredients}/>
      )
    }
    return null;
  }

  NewIngredientMenuItem = (props) => {
    if (!props.show) {
      return null
    }

    return (
      <Link className="link" to="/ingredients/new">
        <MenuItem>New Ingredient</MenuItem>
      </Link>
    )
  }

  open = event => {
    this.setState({anchorElement: event.currentTarget});
  };

  close = () => {
    this.setState({anchorElement: null});
  };

  render() {
    const anchorElement = this.state.anchorElement
    if (!this.state.user) {
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
            <this.NewIngredientMenuItem show={this.state.user.admin}/>
            <MenuItem
              component={Link}
              to={{
                pathname: "/profile",
                state: {
                  authUser: JSON.stringify(this.state.user)
                }
              }}>Profile</MenuItem>
              <MenuItem
                component={Link}
                to={{
                  pathname: "/assistant",
                  state: {
                    authUser: JSON.stringify(this.state.user)
                  }
                }}>Assistant</MenuItem>
            <MenuItem onClick={this.logout}>Log Out</MenuItem>
          </Menu>
        </div>
      </header>

      <div className="mt4 pb5">
        <this.List value={this.state.currentTab} authUser={this.state.user}/>
      </div>
      <BottomTabs value={this.state.currentTab} onTabChanged={this.changeTab}/>
    </div>
    );
  }
}

export default Dashboard;
