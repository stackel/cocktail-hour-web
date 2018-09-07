import React, {Component} from 'react';

import Drink from 'components/drinks/drink/Drink'

import {auth, database} from 'utils/firebase'

class EditDrink extends Component {
  constructor(props) {
    super(props)
    this.state = {
      edit: true,
      new: false,
      units: null,
      userUid: null,
      allIngredients: null,
      drink: null
    }
  }

  getUser = () => {
    auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.setState({userUid: authUser.uid})
      }
    })
  }

  componentDidMount() {
    if(this.props.location.state) {
      this.setState({
        drink: this.props.location.state.drink
      })
    }
    this.getUser()
  }

  render() {
    if (!this.state.userUid || !this.state.drink) {
      return (<div>Loading...</div>)
    }
    return (
      <div className="ma4">
        <Drink
          edit={this.state.edit}
          new={this.state.new}
          authUserUid={this.state.userUid}
          drink={this.state.drink}/>
      </div>
    )
  }
}

export default EditDrink
