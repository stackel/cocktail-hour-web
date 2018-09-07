import React, {Component} from 'react';

import { database } from 'utils/firebase'
import DrinkIngredient from 'components/drinks/drink/drink-ingredients/drink-ingredient/DrinkIngredient'

class DrinkIngredientList extends Component {
  constructor(props) {
    super(props)
    this.state={
      allIngredients: null,
      allUnits: null
    }
  }

  componentDidMount() {
    if(this.props.edit) {
      this.fetchIngredients()
      this.fetchUnits()
    }
  }

  drinkIngredientFieldChanged = (i, fieldName, value) => {
    this.props.drinkIngredientFieldChanged(i, fieldName, value)
  }

  drinkIngredientDeleted = (i) => {
    this.props.drinkIngredientDeleted(i)
  }

  fetchIngredients = () => {
    database.collection("ingredients").onSnapshot(snapshot => {
      let ingredients = []
      snapshot.forEach(doc => {
        ingredients.push(doc.data());
      })
      this.setState({allIngredients: ingredients})
    })
  }

  fetchUnits = () => {
    database.collection("units").onSnapshot(snapshot => {
      let units = []
      snapshot.forEach(doc => {
        units.push(doc.data());
      })
      this.setState({allUnits: units})
    })
  }

  render() {
    if (!this.props.ingredients) {
      return null
    }

    if(this.props.edit && (!this.state.allIngredients || !this.state.allUnits)) {
      return <div> loading</div>
    }

    const ingredientComponents = [];
    for (let i = 0; i < this.props.ingredients.length; i++) {
      ingredientComponents.push(
        <DrinkIngredient
          i={i}
          key={i}
          drinkIngredient={this.props.ingredients[i]}
          edit={this.props.edit}
          userIngredients={this.props.userIngredients}
          allIngredients={this.state.allIngredients}
          allUnits={this.state.allUnits}
          drinkIngredientFieldChanged={this.drinkIngredientFieldChanged}
          drinkIngredientDeleted={this.drinkIngredientDeleted}/>
      )
    }

    return (<div>{ingredientComponents}</div>)
  }
}

export default DrinkIngredientList;
