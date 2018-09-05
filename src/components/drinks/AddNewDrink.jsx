import React, {Component} from 'react';

import Drink from 'components/drinks/drink/Drink'

import {auth, database} from 'utils/firebase'

class AddNewDrink extends Component {
  constructor(props) {
    super(props)
    this.state = {
      debug: false,
      edit: true,
      new: true,
      units: null,
      userUid: null,
      allIngredients: null
    }
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
      this.setState({units: units})
    })
  }

  getUser = () => {
    auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.setState({userUid: authUser.uid})
      }
    })
  }

  componentDidMount() {
    const locationState = this.props.location.state;

    if (!locationState) {
      this.getUser()
      this.fetchIngredients()
      this.fetchUnits()

    } else {
      this.setState({
        debug: JSON.parse(locationState.debug),
        units: JSON.parse(locationState.units),
        userUid: locationState.userUid,
        allIngredients: JSON.parse(locationState.allIngredients)
      })
    }
  }

  render() {
    if (!this.state.units || !this.state.userUid || !this.state.allIngredients) {
      return (<div>Loading...</div>)
    }
    return (
      <div className="ma4">
        <Drink
          edit={this.state.edit}
          new={this.state.new}
          debug={this.state.debug}
          units={this.state.units}
          authUserUid={this.state.userUid}
          allIngredients={this.state.allIngredients}/>
      </div>
    )
  }
}

export default AddNewDrink
