import React, {Component} from 'react';

import {database} from 'utils/firebase'
import DrinkIngredient from 'components/drinks/drink/drink-ingredients/drink-ingredient/DrinkIngredient'
import Loading from 'components/shared/Loading'

class DrinkIngredientList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      allIngredients: null,
      allUnits: null
    }
  }

  componentDidMount() {
    if (this.props.edit) {
      this.fetchAllIngredients()
      this.fetchAllUnits()
    }
  }

  drinkIngredientFieldChanged = (i, fieldName, value) => {
    this.props.drinkIngredientFieldChanged(i, fieldName, value)
  }

  drinkIngredientDeleted = (i) => {
    this.props.drinkIngredientDeleted(i)
  }

  fetchAllIngredients = () => {
    if(localStorage.getItem('allIngredients')) {
      this.setState({ingredients: JSON.parse(localStorage.getItem('allIngredients'))})
    }

    database.collection("ingredients").onSnapshot(snapshot => {
      let ingredients = []
      snapshot.forEach(doc => {
        ingredients.push(doc.data());
      })
      localStorage.setItem('allIngredients', JSON.stringify(ingredients))
      this.setState({allIngredients: ingredients})
    })
  }

  fetchAllUnits = () => {
    if(localStorage.getItem('allUnits')) {
      this.setState({allUnits: JSON.parse(localStorage.getItem('allUnits'))})
    }
    database.collection("units").onSnapshot(snapshot => {
      let units = []
      snapshot.forEach(doc => {
        units.push(doc.data());
      })
      localStorage.setItem('allUnits', JSON.stringify(units))
      this.setState({allUnits: units})
    })
  }

  render() {
    if (!this.props.ingredients) {
      return null
    }

    if (this.props.edit && (!this.state.allIngredients || !this.state.allUnits)) {
      return (<div className="tc ma5">
        <Loading/>
      </div>)
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
