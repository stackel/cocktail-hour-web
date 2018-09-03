import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Select from 'react-select';


import DrinkIngredient from './DrinkIngredient'

class DrinkIngredientList extends Component {
  drinkIngredientFieldChanged = (i, fieldName, value) => {

    this.props.drinkIngredientFieldChanged(i, fieldName, value)
  }

  drinkIngredientDeleted = (i) => {
    this.props.drinkIngredientDeleted(i)
  }


  render() {
    const ingredients = this.props.ingredients;
    const ingredientComponents = [];
    for (let i = 0; i < ingredients.length; i++) {
      ingredientComponents.push(
        <DrinkIngredient
          i={i}
          key={i}
          drinkIngredient={ingredients[i]}
          edit={this.props.edit}
          debug={this.props.debug}
          allUnits={this.props.units}
          allIngredients={this.props.allIngredients}
          firestoreUser={this.props.firestoreUser}
          drinkIngredientFieldChanged={this.drinkIngredientFieldChanged}
          drinkIngredientDeleted={this.drinkIngredientDeleted}/>
      )
    }

    return (
      <div>
        {ingredientComponents}
      </div>
    );
  }
}

export default DrinkIngredientList;
