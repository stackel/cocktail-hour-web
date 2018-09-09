import React, {Component} from 'react';

import Drink from 'components/drinks/drink/Drink'
import {Redirect} from 'react-router-dom'
import {auth, database} from 'utils/firebase'

class AddNewDrink extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userUid: null,
      redirectToDashboard: false
    }
  }

  componentDidMount() {
    if (!this.props.location.userUid) {
      this.getUserUid()
    }
  }

  getUserUid = () => {
    auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.setState({userUid: authUser.uid})
      }
    })
  }

  saveDrink = (newDrink) => {
    database.collection("users").doc(this.state.userUid).collection("drinks").add(
      newDrink
    ).then(() => {
      this.setState({redirectToDashboard: true})
    })
  }

  render() {
    if (this.state.redirectToDashboard) {
      return (<Redirect to="/"/>)
    }

    if (!this.state.userUid) {
      return (<div>Loading...</div>)
    }

    return (
      <div className="ma4">
        <Drink
          edit={true}
          new={true}
          onSaveDrink={this.saveDrink}/>
      </div>
    )
  }
}

export default AddNewDrink
