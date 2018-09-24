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
    const locationState = this.props.location.state;
    if (!locationState) {
      this.fetchUser()
      return
    }

    const authUser = locationState.authUser;
    if (!authUser) {
      this.fetchUser();
      return
    }

    this.setState({user: authUser})
    this.fetchDrinks(authUser.uid)
    this.fetchFirestoreUser(authUser.uid)
  }

  fetchFirestoreUser = (userUid) => {
    if (localStorage.getItem('firestoreUser')) {
      const firestoreUser = JSON.parse(localStorage.getItem('firestoreUser'))
      this.setState({firestoreUser: firestoreUser})
    }
    database.collection("users").doc(userUid).onSnapshot(snapshot => {
      const firestoreUser = snapshot.data();
      if (firestoreUser) {
        this.setState({firestoreUser: firestoreUser})
        localStorage.setItem('firestoreUser', JSON.stringify(firestoreUser))

      }
    })

  }

  fetchUser = () => {
    if (localStorage.getItem('authUser')) {
      const authUser = JSON.parse(localStorage.getItem('authUser'))
      this.setState({user: authUser})
      this.fetchDrinks(authUser.uid)
      this.fetchFirestoreUser(authUser.uid)

    } else {
      auth.onAuthStateChanged(authUser => {
        if (authUser) {
          localStorage.setItem('authUser', JSON.stringify(authUser))
          this.setState({user: authUser})
          this.fetchDrinks(authUser.uid)
          this.fetchFirestoreUser(authUser.uid)
        } else {
          console.log("GET AUTH USER FAILED")
        }
      })
    }
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
        if (drinks.length > 0) {
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

    if (!user || !drinks || !firestoreUser) {
      return (<div class="tc mt6"><Loading/>
      </div>)
    } else {
      return (
        <div className="pa4">
          <h1 className="sans-serif f2 mt0 mb4">Assistant</h1>
            <h1 className="sans-serif f2 mt0 mb4">{drinks.length}</h1>
            <h1 className="sans-serif f2 mt0 mb4">{firestoreUser.ingredients.length}</h1>
        </div>
      )
    }
  }
}

export default Assistant
