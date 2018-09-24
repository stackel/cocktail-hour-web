import React, {Component} from 'react';

import { auth } from 'utils/firebase'

import Auth from 'components/auth/Auth'
import User from 'components/dashboard/User'
import DrinkList from 'components/drinks/DrinkList'
import IngredientList from 'components/ingredients/IngredientList'
import BottomTabs from 'components/dashboard/BottomTabs'
import DashboardMenu from 'components/dashboard/Menu'

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

  render() {
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
          <DashboardMenu user={this.state.user}/>
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
