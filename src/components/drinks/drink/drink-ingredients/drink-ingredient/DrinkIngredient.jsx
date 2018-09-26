import React, {Component} from 'react';

import IngredientField from
"components/drinks/drink/drink-ingredients/drink-ingredient/fields/IngredientField"
import AmountField from
"components/drinks/drink/drink-ingredients/drink-ingredient/fields/AmountField"
import UnitField from
"components/drinks/drink/drink-ingredients/drink-ingredient/fields/UnitField"
import DeleteButton from
"components/drinks/drink/drink-ingredients/drink-ingredient/fields/DeleteButton"

class DrinkIngredient extends Component {
  handleFieldChange = (fieldName, value) => {
    this.props.drinkIngredientFieldChanged(this.props.i, fieldName, value)
  };

  handleDelete = () => {
    this.props.drinkIngredientDeleted(this.props.i);
  }

  render() {
    return (
      <div>
        <div className="w-50 dib pr3">
          <IngredientField
            ingredient={this.props.drinkIngredient.ingredient}
            allIngredients={this.props.allIngredients}
            userIngredients={this.props.userIngredients}
            edit={this.props.edit}
            handleChange={this.handleFieldChange}/>
        </div>

        <div className="w-50 dib tr">
          <div className="dib w-30 pr3">
            <AmountField
              amount={this.props.drinkIngredient.amount}
              edit={this.props.edit}
              handleChange={this.handleFieldChange}/>
          </div>

          <div className="dib w-60 pr3">
            <UnitField
              unit={this.props.drinkIngredient.unit}
              allUnits={this.props.allUnits}
              amount={this.props.drinkIngredient.amount}
              edit={this.props.edit}
              handleChange={this.handleFieldChange}/>
          </div>

          <div className="dib w-10">
            <DeleteButton handleDelete={this.handleDelete} show={this.props.edit}/>
          </div>
        </div>

      </div>
    )
  }
}

export default DrinkIngredient;
