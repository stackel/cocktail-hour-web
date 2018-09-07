import React, {Component} from 'react';

import Drink from 'components/drinks/drink/Drink'

import {auth, database} from 'utils/firebase'

class AddNewDrink extends Component {
  constructor(props) {
    super(props)
    this.state = {
      edit: true,
      new: true,
      units: null,
      userUid: null,
      allIngredients: null
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
    this.getUser()
  }

  render() {
    if (!this.state.userUid) {
      return (<div>Loading...</div>)
    }
    return (
      <div className="ma4">
        <Drink
          edit={this.state.edit}
          new={this.state.new}
          authUserUid={this.state.userUid}/>
      </div>
    )
  }
}

export default AddNewDrink
