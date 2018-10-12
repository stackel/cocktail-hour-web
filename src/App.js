import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";

import Dashboard from 'components/dashboard/Dashboard'
import DrinkDetail from 'components/drinks/DrinkDetail'
import ShareDrink from 'components/drinks/SharedDrink'
import BrowseSharedDrinks from 'components/drinks/SharedDrinks/BrowseSharedDrinks'
import CreateOrEditDrink from 'components/drinks/CreateOrEditDrink'
import AddNewIngredient from 'components/ingredients/AddNewIngredient'
import IngredientDetail from 'components/ingredients/ingredient/IngredientDetail'
import Profile from 'components/profile/Profile'
import Assistant from 'components/assistant/Assistant'
import ScrollToTop from 'utils/ScrollToTop'

class App extends Component {
  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <ScrollToTop>
        <div className="mw7 center">
          <Route exact path="/" component={Dashboard}/>
          <Route exact path="/profile" component={Profile}/>
          <Route exact path="/new" component={CreateOrEditDrink}/>
          <Route exact path="/drink/:id/edit" component={CreateOrEditDrink}/>
          <Route exact path="/drink/:id" component={DrinkDetail}/>
          <Route exact path="/shared" component={BrowseSharedDrinks}/>
          <Route exact path="/shared/:id" component={ShareDrink}/>
          <Route exact path="/ingredient/:id" component={IngredientDetail}/>
          <Route exact path="/ingredients/new" component={AddNewIngredient}/>
          <Route exact path="/assistant" component={Assistant}/>
        </div>
      </ScrollToTop>

      </Router>
    );
  }
}

export default App;
