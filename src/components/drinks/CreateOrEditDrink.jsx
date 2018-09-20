import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'

import Drink from 'components/drinks/drink/Drink'
import AddNewDrinkTitle from 'components/drinks/drink/fields/AddNewDrinkTitle'

import SaveOrUpdateButton from 'components/drinks/drink/buttons/SaveOrUpdateButton'

import {auth, database} from 'utils/firebase'

class CreateOrEditDrink extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userUid: null,
      drink: null,
      drinkUpdated: false,
      drinkSaved: false,
      saving: false
    }
  }

  componentDidMount() {
    if (this.props.location.state) {
      this.setState({drink: this.props.location.state.drink, new: false})
    } else {
      this.setState({
        drink: {
          name: "",
          description: "",
          ingredients: [{}]
        },
        new: true
      })
    }
    this.getUser()
  }

  getUser = () => {
    auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.setState({userUid: authUser.uid})
      }
    })
  }

  updateOrSaveDrink = () => {
    
    this.state.drink.ingredients = this.state.drink.ingredients.filter(obj => {return obj.ingredient})
    this.setState({
      saving: true
    })
    if (this.state.drink.id) {
      database.collection("users").doc(this.state.userUid).collection("drinks").doc(
        this.state.drink.id
      ).set(this.state.drink).then(() => {
        this.setState({drinkUpdated: true, saving: false})
      })
    } else {
      database.collection("users").doc(this.state.userUid).collection("drinks").add(
        this.state.drink
      ).then(() => {
        this.setState({drinkSaved: true, saving:false})
      })
    }
  }

  editDrink = (newDrink) => {
    this.setState({drink: newDrink})
  }

  validateFields = () => {
    const drink = this.state.drink;

    if (!drink.name.length < 0) {
      return false
    }

    if (!drink.description.length < 0) {
      return false
    }

    if (drink.ingredients.length < 1) {
      return false
    }

    const firstIngredient = drink.ingredients[0];
    if (!firstIngredient.ingredient) {
      return false
    }
    if (!firstIngredient.amount) {
      return false
    }

    return true;
  }

  render() {
    if (!this.state.userUid || !this.state.drink) {
      return (<div>Loading...</div>)
    }

    if (this.state.drinkUpdated) {
      return (
        <Redirect
          to={{
            pathname: "/drink/" + this.state.drink.id,
            state: {
              drink: JSON.stringify(this.state.drink)
            }
          }}/>
      )
    }

    if (this.state.drinkSaved) {
      return (<Redirect to="/"/>)
    }

    if(this.state.saving) {
      return (<p> saving ..</p>)
    }

    return (
      <div className="ma4">
        <AddNewDrinkTitle new={this.state.new}/>
        <Drink
          drink={this.state.drink}
          edit={true}
          new={this.state.new}
          onDrinkEdit={this.editDrink}/>
        <SaveOrUpdateButton
          edit={true}
          new={this.state.new}
          onClick={this.updateOrSaveDrink}
          disabled={!this.validateFields()}/>
      </div>
    )
  }
}

export default CreateOrEditDrink
