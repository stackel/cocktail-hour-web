import React, {Component} from 'react';

import Drink from 'components/drinks/drink/Drink'
import DrinkMenu from 'components/drinks/drink/menu/DrinkMenu'

import {database, auth} from 'utils/firebase'
import {Redirect} from 'react-router-dom'

class DrinkDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      debug: false,
      edit: false,
      new: false,
      userIngredients: null,
      drink: null,
      authUserUid:null
    }
  }

  componentDidMount() {
    if(this.props.location.state) {
      this.setState({
        userIngredients: JSON.parse(this.props.location.state.userIngredients),
        drink: JSON.parse(this.props.location.state.drink),
        authUserUid: this.props.location.state.authUserUid
      })
    } else {
      //TODO: MAKE IT WORK INDEPEDENTLY
      //GET  AUTH USER
      //GET FIRESTORE user
      // GET DRINK
    }
  }

  deleteDrink = () => {
    database.collection("users").doc(this.state.authUserUid).collection("drinks").doc(
      this.state.drink.id
    ).delete().then(() => {
      this.setState({redirectToDashboard: true})
    })
  }

  goToEditDrink = () => {
    this.setState({redirectToEditDrink: true})
  }

  render() {
    if (!this.state.drink) {
      return <div>loading</div>
    }
    if (this.state.redirectToDashboard) {
      return (<Redirect to="/"/>)
    }
    if (this.state.redirectToEditDrink) {
      return (
        <Redirect
          push to={{
            pathname: this.state.drink.id + "/edit",
            state: {
              drink: this.state.drink
            }
          }}/>
      )
    }

    return (
      <div class="ma4">
        <div className="fr">
          <DrinkMenu onDelete={this.deleteDrink} onEditClicked={this.goToEditDrink}/>
        </div>
        <Drink
          drink={this.state.drink}
          edit={false}
          new={false}
          userIngredients={this.state.userIngredients}
          authUserUid={this.state.authUserUid}/>
      </div>

    );
  }
}

export default DrinkDetail;
