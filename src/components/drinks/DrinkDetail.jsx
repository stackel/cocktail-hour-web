import React, {Component} from 'react';

import Drink from 'components/drinks/drink/Drink'
import DrinkMenu from 'components/drinks/drink/menu/DrinkMenu'
import Loading from 'components/shared/Loading'
import _ from 'lodash'

import {database} from 'utils/firebase'
import {Redirect} from 'react-router-dom'

class DrinkDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userIngredients: null,
      drink: null,
      user: {}
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

      if (locationState.user) {
        this.setState({user: locationState.user})
      }
    } else {
      //G ET EVERYTHING
    }

  }

  deleteDrink = () => {
    database.collection("users").doc(this.state.user.id).collection("drinks").doc(
      this.state.drink.id
    ).delete().then(() => {
      //TODO: REMOVE SHARE
      this.setState({redirectToDashboard: true})
    })
  }

  goToEditDrink = () => {
    this.setState({redirectToEditDrink: true})
  }

  shareDrink = () => {
    let sharedDrink = _.cloneDeep(this.state.drink);
    sharedDrink.tags = [];

    database.collection("shared").add(sharedDrink).then(response => {
      console.log("drink shared")
      console.log(response.id)
      let updatedDrink = _.cloneDeep(this.state.drink)
      updatedDrink.shareId = response.id

      database.collection("users").doc(this.state.user.id).collection("drinks").doc(
        this.state.drink.id
      ).set(updatedDrink).then(() => {
        this.setState({
          drink:updatedDrink
        })
        console.log("updated with shared id!")
      })
    })
  }

  DrinkShareInfo = (props) => {
    if(!props.shareId) {
      return null
    } else {
      const link = window.location.origin + "/shared/" + props.shareId
      return(<p className="tc sans-serif f5 dark-gray">Drink shared at <a className="link b black" target="_blank" href={link}>{link}</a></p>)
    }
  }

  render() {
    if (!this.state.drink) {
      return (<div className="tc mt6">
        <Loading label="Loading"/>
      </div>)
    }

    if (this.state.redirectToDashboard) {
      return (<Redirect to="/"/>)
    }
    if (this.state.redirectToEditDrink) {
      return (
        <Redirect
          push
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
            isShared={this.state.drink.shareId}
            hasUserId={this.state.user.id}
            onDelete={this.deleteDrink}
            onEditClicked={this.goToEditDrink}
            onShareClicked={this.shareDrink}/>
        </div>
        <Drink
          drink={this.state.drink}
          edit={false}
          new={false}
          userIngredients={this.state.userIngredients}/>
        <this.DrinkShareInfo shareId={this.state.drink.shareId}/>
      </div>
    );
  }
}

export default DrinkDetail;
