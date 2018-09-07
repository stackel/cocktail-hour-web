import React, {Component} from 'react';
import _ from 'lodash'
import {Redirect} from 'react-router-dom'
import {database} from 'utils/firebase'
import DrinkIngredientList from 'components/drinks/drink/drink-ingredients/DrinkIngredientList'
import AddNewDrinkTitle from 'components/drinks/drink/fields/AddNewDrinkTitle'
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
      ingredients: [
        {}
      ],
      redirectToDashboard: false
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
    database.collection("users").doc(this.props.authUserUid).collection("drinks").add(
      {name: this.state.name, description: this.state.description, ingredients: this.state.ingredients}
    ).then(() => {
      this.setState({redirectToDashboard: true})
    })
  }

  updateDrink = () => {
    database.collection("users").doc(this.props.authUserUid).collection("drinks").doc(
      this.state.id
    ).set(
      {name: this.state.name, description: this.state.description, ingredients: this.state.ingredients}
    )
    this.setState({edit: false})
  }

  deleteDrink = () => {
    database.collection("users").doc(this.props.authUserUid).collection("drinks").doc(
      this.state.id
    ).delete().then(() => {
      this.setState({
        redirectToDashboard: true
      })
    })
  }

  validateFields = () => {
    if(!this.state.name.length < 0) {
      return false
    }

    if(!this.state.description.length < 0) {
      return false
    }

    if(this.state.ingredients.length < 1) {
      return false
    }

    const firstIngredient = this.state.ingredients[0];
    if(!firstIngredient.ingredient) {
      return false
    }
    if(!firstIngredient.amount) {
      return false
    }

    return true;

  }

  render() {
    if (this.state.redirectToDashboard) {
      return (<Redirect to="/"/>)
    }
    return (
      <div>
        <div className="tc">
          <AddNewDrinkTitle new={this.props.new}/>
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
            userIngredients={this.props.userIngredients}
            edit={this.state.edit}
            drinkIngredientFieldChanged={this.changeIngredientField}
            drinkIngredientDeleted={this.deleteIngredient}/>
        </div>

        <div className="mv3">
          <AddIngredientButton edit={this.state.edit} onClick={this.addIngredient}/>
        </div>

        <SaveOrUpdateButton
          disabled={!this.validateFields()}
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
