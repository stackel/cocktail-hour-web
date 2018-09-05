import React, {Component} from 'react';

import DebugJson from 'components/shared/DebugJson'
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

        <div className="w-50 dib pr4">
          <IngredientField
            ingredient={this.props.drinkIngredient.ingredient}
            allIngredients={this.props.allIngredients}
            firestoreUser={this.props.firestoreUser}
            edit={this.props.edit}
            handleChange={this.handleFieldChange}/>
        </div>

        <div className="w-50 dib tr">
          <div className="dib w-50 pr4">
            <AmountField
              amount={this.props.drinkIngredient.amount}
              edit={this.props.edit}
              handleChange={this.handleFieldChange}/>
          </div>

          <div className="dib w-50">
            <UnitField
              unit={this.props.drinkIngredient.unit}
              allUnits={this.props.allUnits}
              edit={this.props.edit}
              handleChange={this.handleFieldChange}/>
          </div>
        </div>

        <div className="mv3">
          <DeleteButton handleDelete={this.handleDelete} show={this.props.edit}/>
        </div>

        <DebugJson show={this.props.debug} value={this.props.drinkIngredient}/>
      </div>
    )
  }
}

export default DrinkIngredient;
