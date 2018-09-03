import React, {Component} from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

import {database} from './firebase'

import Auth from './Auth'
import AddNewDrink from './AddNewDrink'
import DrinkList from './DrinkList'
import IngredientList from './IngredientList'

class App extends Component {
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

  onLogout = () => {
    this.setState({authUser: null, firestoreUser: null, drinks: null})
  }

  handleDebugChange = name => event => {
    this.setState({debug: event.target.checked});
  };

  bottomNavigationChanged = (event, value) => {
    this.setState({value});
  }

  DebugToggle = props => {
    if (props.hide) {
      return null;
    }
    return (
      <FormControlLabel
        control={<Switch
        checked = {
          props.debug
        }
        onChange = {
          this.handleDebugChange()
        }
        value = "debug"
        />}
        label="Debug"/>
    )
  }

  Content = (props) => {
    if (props.value === 0) {
      return (
        <div>
          <ExpansionPanel>
            <ExpansionPanelSummary >
              <h2 className="tc sans-serif f4 center mv0 pv0">Add New Drink</h2>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className="mh3">
              <AddNewDrink
                debug={this.state.debug}
                authUser={this.state.authUser}
                units={this.state.units}
                allIngredients={this.state.allIngredients}/>
            </ExpansionPanelDetails>
          </ExpansionPanel>
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
      return (          <IngredientList
                  debug={this.state.debug}
                  authUser={this.state.authUser}
                  firestoreUser={this.state.firestoreUser}
                  units={this.state.units}
                  allIngredients={this.state.allIngredients}/>)
    }
    return null;
  }

  render() {
    return (
      <div>
        <div className="ma4">
          <this.DebugToggle hide={true} debug={this.state.debug}/>
        </div>
        <div className="ma4 mw7 center">
          <Auth onLogin={this.onLogin} onLogout={this.onLogout}/>
        </div>

        <this.Content value={this.state.value}/>

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

export default App;
