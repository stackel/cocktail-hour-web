import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";

import Dashboard from 'components/dashboard/Dashboard'
import AddNewDrink from 'components/drinks/AddNewDrink'
import DrinkDetail from 'components/drinks/drink/DrinkDetail'

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Dashboard}/>
          <Route exact path="/new" component={AddNewDrink}/>
          <Route exact path="/drink/:id" component={DrinkDetail}/>
        </div>
      </Router>
    );
  }
}

export default App;
