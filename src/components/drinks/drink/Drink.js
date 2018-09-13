import React, {Component} from 'react';
import _ from 'lodash'
import {Redirect} from 'react-router-dom'
import {database} from 'utils/firebase'
import DrinkIngredientList from 'components/drinks/drink/drink-ingredients/DrinkIngredientList'
import DrinkName from 'components/drinks/drink/fields/DrinkName'
import DrinkDescription from 'components/drinks/drink/fields/DrinkDescription'
import AddIngredientButton from 'components/drinks/drink/drink-ingredients/AddIngredientButton'
import DebugJson from 'components/shared/DebugJson'

class Drink extends Component {
  changeField = (fieldName, value) => {
    let drink = _.cloneDeep(this.props.drink)
    drink[fieldName] = value;
    this.props.onDrinkEdit(drink);
  };

  changeIngredientField = (i, fieldName, value) => {
    const newDrinkIngredients = [...this.props.drink.ingredients];
    newDrinkIngredients[i][fieldName] = value;
    let drink = _.cloneDeep(this.props.drink)
    drink.ingredients = newDrinkIngredients;
    this.props.onDrinkEdit(drink);
  }

  addIngredient = event => {
    const newIngredients = [...this.props.drink.ingredients];
    newIngredients.push({"ingredient": "", "amount": "", "unit": ""})
    let drink = _.cloneDeep(this.props.drink)
    drink.ingredients = newIngredients;
    this.props.onDrinkEdit(drink);
  }

  deleteIngredient = i => {
    let newIngredients = [...this.props.drink.ingredients];
    newIngredients.splice(i, 1);
    let drink = _.cloneDeep(this.props.drink)
    drink.ingredients = newIngredients;
    this.props.onDrinkEdit(drink);
  }

  render() {
    const drink = this.props.drink;

    return (
      <div>
        <DrinkName
          name={drink.name}
          edit={this.props.edit}
          onChange={this.changeField}/>
        <DrinkDescription
          description={drink.description}
          edit={this.props.edit}
          onChange={this.changeField}/>

        <div className="mv4">
          <DrinkIngredientList
            ingredients={drink.ingredients}
            userIngredients={this.props.userIngredients}
            edit={this.props.edit}
            drinkIngredientFieldChanged={this.changeIngredientField}
            drinkIngredientDeleted={this.deleteIngredient}/>
        </div>

        <div className="mv3">
          <AddIngredientButton edit={this.props.edit} onClick={this.addIngredient}/>
        </div>

        <DebugJson debug={false}/>
      </div>
    );
  }
}

export default Drink;
