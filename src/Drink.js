import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Select from 'react-select';

import {database} from './firebase'

import DrinkIngredient from './DrinkIngredient'
import DrinkIngredientList from './DrinkIngredientList'

class Drink extends Component {
  constructor(props) {
    super(props);
    if (props.drink) {
      this.state = {
        edit: props.edit,
        name: props.drink.name,
        description: props.drink.description,
        ingredients: props.drink.ingredients,
        id: props.drink.id
      };
    } else {
      this.state = {
        edit: props.edit,
        name: "",
        description: "",
        ingredients: [{}]
      };
    }
  }

  handleFieldChange = fieldName => event => {
    this.setState({[fieldName]: event.target.value});
  };

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

  editModeChanged = event => {
    this.setState({edit: event.target.checked});
  };

  saveDrink = () => {
    database.collection("users").doc(this.props.authUser.uid).collection("drinks").add(
      {name: this.state.name, description: this.state.description, ingredients: this.state.ingredients}
    )
    this.setState({
        name: "",
        description: "",
        ingredients: [{}]
    })
  }

  updateDrink = () => {
    database.collection("users").doc(this.props.authUser.uid).collection("drinks").doc(
      this.state.id
    ).set(
      {name: this.state.name, description: this.state.description, ingredients: this.state.ingredients}
    )

    this.setState({
      edit: false
    })

  }

  deleteDrink = () => {
    console.log("DELETE")
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
      return <h1>{this.state.name}</h1>
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
      return <h1>{this.state.description}</h1>
    }
  }

  DebugJson = props => {
    if (props.debug) {
      return (<pre> {JSON.stringify(this.state, null, 2)} </pre>)
    } else {
      return null;
    }
  }

  NewDrink = (props) => {
    if (props.new) {
      return (<h2 className="tc sans-serif f3">Add New Drink</h2>)
    } else {
      return null
    }
  }

  EditToggle = (props) => {
    if (props.new) {
      return null;
    } else {
      return (
        <div className="mh4">
          <FormControlLabel
            className="ma4"
            control={<Switch
            checked = {
              this.state.edit
            }
            onChange = {
              this.editModeChanged
            }
            value = "edit"
            />}
            label="Edit"/>
        </div>
      )
    }
  }

  SaveOrUpdateButton = (props) => {
    if (props.new) {
      return (
        <Button
          variant="contained"
          className="w-100"
          onClick={this.saveDrink}
          color="primary">Save</Button>
      )
    }
    if (props.edit) {
      return (
        <Button
          variant="contained"
          className="w-100"
          onClick={this.updateDrink}
          color="primary">Update</Button>
      )
    }
    return null;
  }

  AddIngredientButton = (props) => {
    if(props.edit) {
      return (<Button variant="contained" className="w-100" onClick={this.addIngredient}>Add ingredient</Button>)
    } else {
      return null
    }
  }

  DeleteDrinkButton = (props) => {
    if(!props.new) {
      return (<Button onClick={this.deleteDrink}>X</Button>)
    } else {
      return null;
    }
  }

  render() {
    return (
      <Card>
        <CardContent>
          <this.EditToggle new={this.props.new}/>
          <this.DeleteDrinkButton edit={this.state.edit} new={this.props.new}/>
          <this.NewDrink new={this.props.new}/>
          <this.DrinkName edit={this.state.edit}/>
          <this.DrinkDescription edit={this.state.edit}/>

          <h3 className="tc sans-serif f4">Ingredients:</h3>
          <DrinkIngredientList
            ingredients={this.state.ingredients}
            edit={this.state.edit}
            debug={this.state.debug}
            units={this.props.units}
            allIngredients={this.props.allIngredients}
            drinkIngredientFieldChanged={this.drinkIngredientFieldChanged}
            drinkIngredientDeleted={this.deleteDrinkIngredient}/>
          <div className="mv3">
            <this.AddIngredientButton edit={this.state.edit}/>
          </div>
          <this.SaveOrUpdateButton edit={this.state.edit} new={this.props.new}/>
          <this.DebugJson debug={this.props.debug}/>
        </CardContent>
      </Card>
    );
  }
}

export default Drink;
