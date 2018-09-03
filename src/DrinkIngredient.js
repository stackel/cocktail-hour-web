import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Select from 'react-select';

import {database} from './firebase'

class DrinkIngredient extends Component {
  constructor(props) {
    super(props);

    this.state = {
      drinkIngredient: props.drinkIngredient
    };
  }

  handleSelectChange = (i, fieldName) => value => {
    this.props.drinkIngredientFieldChanged(i, fieldName, value)
  };

  handleTextFieldChange = (i, fieldName) => event => {
    this.props.drinkIngredientFieldChanged(i, fieldName, event.target.value)
  }

  delete = i => event => {
    this.props.drinkIngredientDeleted(i);
  }

  DebugJson = props => {
    if (props.debug) {
      return (<pre> {JSON.stringify(this.state, null, 2)} </pre>)
    } else {
      return null;
    }
  }

  IngredientField = props => {
    if (props.edit) {
      return (
        <Select
          placeholder="Ingredient"
          className="mb2"
          value={props.ingredient}
          onChange={this.handleSelectChange(props.i, "ingredient")}
          options={props.allIngredients}/>
      )
    }

    if (props.ingredient) {
      if(props.firestoreUser) {
        if(props.firestoreUser.ingredients.includes(props.ingredient.name)){
          return (<p className="sans-serif dib b">{props.ingredient.label}</p>)
        }
      }
      return (<p className="sans-serif dib gray ">{props.ingredient.label}</p>)

    }
    return null
  }

  AmountField = props => {
    if (props.edit) {
      return (
        <TextField
          id={props.amount}
          className="w-100"
          label="Amount"
          defaultValue={props.amount}
          onChange={this.handleTextFieldChange(props.i, "amount")}/>
      )
    }

    if (props.amount) {
      return (<p className="sans-serif fr">{props.amount}</p>)
    } else {
      return null
    }
  }

  UnitField = props => {
    if (props.edit) {
      return (
        <Select
          value={props.unit}
          placeholder="Unit"
          onChange={this.handleSelectChange(props.i, "unit")}
          options={props.allUnits}/>
      )
    }

    if (props.unit) {
      return (<p className="sans-serif fr mh1 gray">{props.unit.label}</p>)
    } else {
      return null
    }
  }

  DeleteButton = (props) => {
    if(props.edit) {
      return (<Button onClick={this.delete(this.props.i)}>X</Button>)
    } else {
      return null;
    }
  }

  render() {
    const amount = this.state.drinkIngredient.amount;
    const unit = this.state.drinkIngredient.unit;
    const allUnits = this.props.allUnits;

    return (
      <div>
        <this.DeleteButton edit={this.props.edit}/>
        <this.IngredientField
          ingredient={this.state.drinkIngredient.ingredient}
          allIngredients={this.props.allIngredients}
          i={this.props.i}
          firestoreUser={this.props.firestoreUser}
          edit={this.props.edit}/>

        <this.AmountField
          amount={this.state.drinkIngredient.amount}
          i={this.props.i}
          edit={this.props.edit}/>

        <this.UnitField
          unit={this.state.drinkIngredient.unit}
          allUnits={this.props.allUnits}
          i={this.props.i}
          edit={this.props.edit}/>

        <this.DebugJson debug={this.props.debug}/>
      </div>
    )
  }
}

export default DrinkIngredient;
