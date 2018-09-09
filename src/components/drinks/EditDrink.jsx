import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'

import Drink from 'components/drinks/drink/Drink'
import SaveOrUpdateButton from 'components/drinks/drink/buttons/SaveOrUpdateButton'

import {auth, database} from 'utils/firebase'

class EditDrink extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userUid: null,
      drink: null,
      drinkUpdated: false
    }
  }

  componentDidMount() {
    if (this.props.location.state) {
      this.setState({drink: this.props.location.state.drink})
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

  updateDrink = () => {
    console.log(this.state.drink)
    database.collection("users").doc(this.state.userUid).collection("drinks").doc(
      this.state.drink.id
    ).set(this.state.drink).then(() => {
      this.setState({drinkUpdated: true})
    })
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
      return (<Redirect to={"/drink/" + this.state.drink.id}/>)
    }

    return (
      <div className="ma4">
        <Drink
          drink={this.state.drink}
          edit={true}
          new={false}
          onDrinkUpdate={this.updateDrink}
          onDrinkEdit={this.editDrink}/>
        <SaveOrUpdateButton
          edit={true}
          new={false}
          onUpdate={this.updateDrink}
          disabled={!this.validateFields()}/>
      </div>
    )
  }
}

export default EditDrink
