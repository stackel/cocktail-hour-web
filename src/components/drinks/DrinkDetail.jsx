import React, {Component} from 'react';

import Drink from 'components/drinks/drink/Drink'
import DrinkMenu from 'components/drinks/drink/menu/DrinkMenu'

import {database} from 'utils/firebase'
import {Redirect} from 'react-router-dom'

class DrinkDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userIngredients: null,
      drink: null,
      authUserUid: null
    }
  }

  componentDidMount() {
    const locationState = this.props.location.state

    if(locationState) {
      if (locationState.drink) {
        this.setState({
          drink: JSON.parse(locationState.drink)
        })
      }

      if (locationState.userIngredients) {
        this.setState({
          userIngredients: JSON.parse(locationState.userIngredients)
        })
      }

      if (locationState.authUserUid) {
        this.setState({authUserUid: locationState.authUserUid})
      }
    } else {
      //G ET EVERYTHING
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
          push="push"
          to={{
            pathname: this.state.drink.id + "/edit",
            state: {
              drink: this.state.drink
            }
          }}/>
      )
    }

    return (
      <div className="ma4">
        <div className="fr">
          <DrinkMenu
            showDelete={this.state.authUserUid}
            onDelete={this.deleteDrink}
            onEditClicked={this.goToEditDrink}/>
        </div>
        <Drink
          drink={this.state.drink}
          edit={false}
          new={false}
          userIngredients={this.state.userIngredients}/>
      </div>
    );
  }
}

export default DrinkDetail;
