import React, {Component} from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import {database} from './firebase'

import Auth from './Auth'
import AddNewDrink from './AddNewDrink'
import DrinkList from './DrinkList'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authUser: null,
      firebaseUser: null,
      debug: false,
      units: [],
      allIngredients: []
    };
  }

  fetchIngredients = () => {
    const ingredients = []
    database.collection("ingredients").onSnapshot(snapshot => {
      snapshot.forEach(doc => {
        ingredients.push(doc.data());
      })
      this.setState({allIngredients: ingredients})
    })
  }

  fetchUnits = () => {
    const units = []
    database.collection("units").onSnapshot(snapshot => {
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
    this.setState({authUser: null, firebaseUser: null, drinks: null})
  }

  handleDebugChange = name => event => {
    this.setState({debug: event.target.checked});
  };

  DebugToggle = props => {
    if(props.hide) {
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

  render() {
    return (
      <div>
        <div className="ma4">
          <this.DebugToggle hide={true} debug={this.state.debug}/>
        </div>
        <div className="ma4 mw7 center">
          <Auth onLogin={this.onLogin} onLogout={this.onLogout}/>
        </div>

        <div className="ma4 mw7 center">
          <AddNewDrink
            debug={this.state.debug}
            authUser={this.state.authUser}
            units={this.state.units}
            allIngredients={this.state.allIngredients}/>
        </div>

        <DrinkList
          debug={this.state.debug}
          authUser={this.state.authUser}
          units={this.state.units}
          allIngredients={this.state.allIngredients}/>
      </div>
    );
  }
}

export default App;
