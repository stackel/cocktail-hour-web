import React, {Component} from 'react';

import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Loading from 'components/shared/Loading'

import {database, auth} from 'utils/firebase'

class Assistant extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      drinks: null
    }
  }

  componentDidMount() {
    const locationState = this.props.location.state
    if (locationState && locationState.user) {
      const user = JSON.parse(locationState.user)
      this.setState({user: user})
      this.fetchDrinks(user.id)
    } else {
      this.fetchUser()
    }
  }

  fetchUser = () => {
    const user = localStorage.getItem('user');
    if (user) {
      this.setState({user: JSON.parse(user)})
      this.fetchDrinks(JSON.parse(user).id)
      return
    }

    auth.onAuthStateChanged(authUser => {
      if (authUser) {
        database.collection("users").doc(authUser.uid).onSnapshot(snapshot => {
          const user = snapshot.data()
          if (user) {
            this.setState({user: snapshot.data()})
            localStorage.setItem('user', JSON.stringify(user))
            this.fetchDrinks(user.id)
          }
        })
      }
    })
  }

  fetchDrinks = (userUid) => {
    const drinks = localStorage.getItem('drinks')

    if (drinks) {
      this.setState({drinks: JSON.parse(drinks)})
    }

    database.collection("users").doc(userUid).collection("drinks").orderBy("name").onSnapshot(
      snapshot => {
        const drinks = []
        snapshot.forEach(doc => {
          let drink = doc.data()
          drink.id = doc.id
          drinks.push(drink);
        })
        if (drinks) {
          localStorage.setItem('drinks', JSON.stringify(drinks))
          this.setState({drinks: drinks})
        }
      }
    );
  }

  render() {
    const user = this.state.user
    const drinks = this.state.drinks
    const firestoreUser = this.state.firestoreUser

    if (!user || !drinks) {
      return (<div class="tc mt6"><Loading/>
      </div>)
    } else {
      return (
        <div className="pa4">
          <h1 className="sans-serif f2 mt0 mb4">Assistant</h1>
          <h1 className="sans-serif f3 mt0 mb4">Number of drinks: {drinks.length}</h1>
          <h1 className="sans-serif f3 mt0 mb4">Ingredients in bar: {user.ingredients.length}</h1>
        </div>
      )
    }
  }
}

export default Assistant
