import React, {Component} from 'react';

import Auth from 'components/auth/Auth'
import DashboardMenu from 'components/dashboard/Menu'
import DrinkList from 'components/drinks/DrinkList'
import IngredientList from 'components/ingredients/IngredientList'
import BottomTabs from 'components/dashboard/BottomTabs'
import {auth} from 'utils/firebase'

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      currentTab: 0
    };

    const user = localStorage.getItem('user');
    if (user) {
      this.state["user"] = JSON.parse(user);
    }
  }

  onLogin = (user) => {
    this.setState({user: user})
  }

  changeTab = (event, value) => {
    this.setState({currentTab: value});
  }

  List = (props) => {
    if (props.value === 0) {
      return (<div>
        <DrinkList user={this.state.user}/>
      </div>)
    }
    if (props.value === 1) {
      return (<IngredientList user={this.state.user}/>)
    }
    return null;
  }

  render() {
    if (!this.state.user) {
      return (<Auth onLogin={this.onLogin}/>)
    }

    return (
      <div>
        <header className="pa4">
          <h1 className="sans-serif f2 ma0 pa0 fl">{
              this.state.currentTab === 0
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
