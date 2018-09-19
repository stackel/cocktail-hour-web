import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";

import Dashboard from 'components/dashboard/Dashboard'
import DrinkDetail from 'components/drinks/DrinkDetail'
import CreateOrEditDrink from 'components/drinks/CreateOrEditDrink'
import AddNewIngredient from 'components/ingredients/AddNewIngredient'
import User from 'components/dashboard/User'

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <div className="mw7 center">
          <Route exact path="/" component={Dashboard}/>
          <Route exact path="/profile" component={User}/>
          <Route exact path="/new" component={CreateOrEditDrink}/>
          <Route exact path="/drink/:id/edit" component={CreateOrEditDrink}/>
          <Route exact path="/drink/:id" component={DrinkDetail}/>
          <Route exact path="/ingredients/new" component={AddNewIngredient}/>
        </div>
      </Router>
    );
  }
}

export default App;
