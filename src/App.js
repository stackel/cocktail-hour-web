import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";

import Dashboard from 'components/dashboard/Dashboard'
import AddNewDrink from 'components/drinks/AddNewDrink'

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
        </div>
      </Router>
    );
  }
}

export default App;
