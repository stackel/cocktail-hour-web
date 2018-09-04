import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Select from 'react-select';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import {database} from 'utils/firebase'

import DrinkIngredientList from 'components/drinks/drink/drink-ingredients/DrinkIngredientList'
import DrinkMenu from 'components/drinks/drink/menu/DrinkMenu'
import DebugJson from 'components/shared/DebugJson'


class Drink extends Component {
  constructor(props) {
    super(props);
    if (props.drink) {
      this.state = {
        edit: props.edit,
        name: props.drink.name,
        description: props.drink.description,
        ingredients: props.drink.ingredients,
        id: props.drink.id,
      };
    } else {
      this.state = {
        edit: props.edit,
        name: "",
        description: "",
        ingredients: [
          {}
        ],
      };
    }
  }

  handleFieldChange = fieldName => event => {
    this.setState({[fieldName]: event.target.value});
  };

  toggleEdit = value => {
    this.setState({
      edit: value
    })
  }

  drinkIngredientFieldChanged = (i, fieldName, value) => {
    const newDrinkIngredients = [...this.state.ingredients];
    newDrinkIngredients[i][fieldName] = value;
    this.setState({ingredients: newDrinkIngredients});
  }

  addIngredient = event => {
    const newIngredients = [...this.state.ingredients];
    newIngredients.push({"ingredient": "", "amount": "", "unit": ""})
    this.setState({ingredients: newIngredients});
  }

  deleteDrinkIngredient = i => {
    const newIngredients = [...this.state.ingredients];
    newIngredients.splice(i, 1);
    this.setState({ingredients: newIngredients});
  }

  saveDrink = () => {
    database.collection("users").doc(this.props.authUser.uid).collection("drinks").add(
      {name: this.state.name, description: this.state.description, ingredients: this.state.ingredients}
    )
    this.setState({name: "", description: "", ingredients: [{}]})
  }

  updateDrink = () => {
    database.collection("users").doc(this.props.authUser.uid).collection("drinks").doc(
      this.state.id
    ).set(
      {name: this.state.name, description: this.state.description, ingredients: this.state.ingredients}
    )
    this.setState({edit: false})
  }

  deleteDrink = () => {
    database.collection("users").doc(this.props.authUser.uid).collection("drinks").doc(
      this.state.id
    ).delete()
  }

  DrinkName = props => {
    if (props.edit) {
      return (
        <TextField
          id="name"
          label="Name"
          className="w-100"
          value={this.state.name}
          onChange={this.handleFieldChange('name')}/>
      )
    } else {
      return <h3 className="sans-serif f3">{this.state.name}</h3>
    }
  }

  DrinkDescription = props => {
    if (props.edit) {
      return (
        <TextField
          id="description"
          label="Description"
          className="w-100"
          value={this.state.description}
          onChange={this.handleFieldChange('description')}/>
      )
    } else {
      return <p className="f4 sans-serif">{this.state.description}</p>
    }
  }

  NewDrink = (props) => {
    if (props.new) {
      return (<h2 className="tc sans-serif f3">Add New Drink</h2>)
    } else {
      return null
    }
  }

  SaveOrUpdateButton = (props) => {
    if (props.new) {
      return (
        <Button
          variant="contained"
          color="primary"
          className="w-100"
          onClick={this.saveDrink}>Save</Button>
      )
    }
    if (props.edit) {
      return (
        <Button
          variant="contained"
          color="primary"
          className="w-100"
          onClick={this.updateDrink}>Update</Button>
      )
    }
    return null;
  }

  AddIngredientButton = (props) => {
    if (props.edit) {
      return (
        <Button variant="outlined" className="w-100" onClick={this.addIngredient}>Add ingredient</Button>
      )
    } else {
      return null
    }
  }

  render() {
    return (
      <div>
        <div className="fr">
          <DrinkMenu
            edit={this.state.edit}
            new={this.props.new}
            onDelete={this.deleteDrink}
            onEditChanged={this.toggleEdit}/>
        </div>

        <this.DrinkName edit={this.state.edit}/>
        <this.DrinkDescription edit={this.state.edit}/>

        <h3 className="tc sans-serif f4">Ingredients:</h3>
        <DrinkIngredientList
          ingredients={this.state.ingredients}
          edit={this.state.edit}
          debug={this.state.debug}
          units={this.props.units}
          firestoreUser={this.props.firestoreUser}
          allIngredients={this.props.allIngredients}
          drinkIngredientFieldChanged={this.drinkIngredientFieldChanged}
          drinkIngredientDeleted={this.deleteDrinkIngredient}/>
        <div className="mv3">
          <this.AddIngredientButton edit={this.state.edit}/>
        </div>
        <this.SaveOrUpdateButton edit={this.state.edit} new={this.props.new}/>
        <DebugJson debug={this.props.debug}/>
      </div>
    );
  }
}

export default Drink;
