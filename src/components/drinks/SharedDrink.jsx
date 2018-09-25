import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import _ from 'lodash'
import Drink from 'components/drinks/drink/Drink'
import DrinkMenu from 'components/drinks/drink/menu/DrinkMenu'
import Loading from 'components/shared/Loading'

import {database, auth} from 'utils/firebase'
import {Redirect} from 'react-router-dom'

class SharedDrink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drink: null,
      userId: null,
      redirectToDashboard: false
    }
  }

  fetchUser = () => {
    auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.setState({
          userId: authUser.uid
        })
      } else {
      }
    })
  }

  componentDidMount() {
    this.fetchUser()

    database.collection("shared").doc(this.props.match.params.id).onSnapshot(
      snapshot => {
        const drink = snapshot.data()
        if (drink) {
          this.setState({drink: drink})
        } else {}
      }
    )
  }

  addToLibrary = () => {
    const drink = _.cloneDeep(this.state.drink)
    drink.shareId = null
    database.collection("users").doc(this.state.userId).collection("drinks").add(
      drink
    ).then(() => {
      console.log("added to library")
      this.setState({
        redirectToDashboard: true
      })
    })
  }

  AddDrinkButton = (props) => {
    if(!props.show) {
      return null
    }

    return(<Button variant="outlined" color="primary" onClick={this.addToLibrary}>Add copy to your library</Button>)
  }

  render() {
    if (!this.state.drink) {
      return (
        <div className="tc mt6">
          <Loading label="Loading"/>
        </div>
      )
    }

    if(this.state.redirectToDashboard) {
      return (<Redirect push to="/"/>)
    }

    return (
      <div className="ma4">
        <Drink drink={this.state.drink} edit={false} new={false}/>
        <div className="tc">
          <this.AddDrinkButton show={this.state.userId}/>
        </div>
      </div>
    );
  }
}

export default SharedDrink;
