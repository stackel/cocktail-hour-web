import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import _ from 'lodash'

import {database} from 'utils/firebase'
import DrinkIngredientList from 'components/drinks/drink/drink-ingredients/DrinkIngredientList'
import DrinkMenu from 'components/drinks/drink/menu/DrinkMenu'
import DrinkName from 'components/drinks/drink/fields/DrinkName'
import DrinkDescription from 'components/drinks/drink/fields/DrinkDescription'
import AddIngredientButton from 'components/drinks/drink/drink-ingredients/AddIngredientButton'
import SaveOrUpdateButton from 'components/drinks/drink/buttons/SaveOrUpdateButton'
import DebugJson from 'components/shared/DebugJson'

class Drink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: props.edit,
      name: "",
      description: "",
      ingredients: [{}]
    }
  }

  componentDidMount() {
    if (this.props.drink) {
      this.setDrink(this.props.drink)
    }
  }

  setDrink = (drink) => {
    if (!drink) {
      return
    }
    this.setState({
      description: drink.description,
      name: drink.name,
      id: drink.id,
      ingredients: _.cloneDeep(drink.ingredients)
    })

  }

  toggleEdit = value => {
    this.setState({edit: value})
    if (!value) {
      this.setDrink(this.props.drink)
    }
  }

  changeField = (fieldName, value) => {
    this.setState({[fieldName]: value});
  };

  changeIngredientField = (i, fieldName, value) => {
    const newDrinkIngredients = [...this.state.ingredients];
    newDrinkIngredients[i][fieldName] = value;
    this.setState({ingredients: newDrinkIngredients});
  }

  addIngredient = event => {
    const newIngredients = [...this.state.ingredients];
    newIngredients.push({"ingredient": "", "amount": "", "unit": ""})
    this.setState({ingredients: newIngredients});
  }

  deleteIngredient = i => {
    let newIngredients = [...this.state.ingredients];
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

  SaveOrUpdateButton = (props) => {}

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

        <DrinkName
          name={this.state.name}
          edit={this.state.edit}
          onChange={this.changeField}/>
        <DrinkDescription
          description={this.state.description}
          edit={this.state.edit}
          onChange={this.changeField}/>

        <div className="mv4">
          <DrinkIngredientList
            ingredients={this.state.ingredients}
            edit={this.state.edit}
            debug={this.state.debug}
            units={this.props.units}
            firestoreUser={this.props.firestoreUser}
            allIngredients={this.props.allIngredients}
            drinkIngredientFieldChanged={this.changeIngredientField}
            drinkIngredientDeleted={this.deleteIngredient}/>
        </div>

        <div className="mv3">
          <AddIngredientButton edit={this.state.edit} onClick={this.addIngredient}/>
        </div>

        <SaveOrUpdateButton
          edit={this.state.edit}
          new={this.props.new}
          onSave={this.saveDrink}
          onUpdate={this.updateDrink}/>

        <DebugJson debug={this.props.debug}/>
      </div>
    );
  }
}

export default Drink;
