import React, {Component} from 'react';

import DrinkIngredient from 'components/drinks/drink/drink-ingredients/drink-ingredient/DrinkIngredient'

class DrinkIngredientList extends Component {
  drinkIngredientFieldChanged = (i, fieldName, value) => {
    this.props.drinkIngredientFieldChanged(i, fieldName, value)
  }

  drinkIngredientDeleted = (i) => {
    this.props.drinkIngredientDeleted(i)
  }

  render() {
    const ingredients = this.props.ingredients;

    if (!ingredients) {
      return null
    }

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

    return (<div>{ingredientComponents}</div>)
  }
}

export default DrinkIngredientList;
