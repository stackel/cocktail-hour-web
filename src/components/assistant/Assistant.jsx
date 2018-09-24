import React, {Component} from 'react';

import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Loading from 'components/shared/Loading'

import { database, auth } from 'utils/firebase'

class Assistant extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      drinks: null
    }
  }

  componentDidMount() {
    if(this.props.location.state) {
      this.setState({
        user: JSON.parse(this.props.location.state.authUser),
      })
      this.fetchDrinks(JSON.parse(this.props.location.state.authUser).uid)
    } else {
      this.fetchUser()
    }
  }

  fetchUser = () => {
    if(localStorage.getItem('authUser')) {
      this.setState({user: JSON.parse(localStorage.getItem('authUser'))})
      this.fetchDrinks(JSON.parse(localStorage.getItem('authUser')).uid)
    } else {
      auth.onAuthStateChanged(authUser => {
        if (authUser) {
          localStorage.setItem('authUser', JSON.stringify(authUser))
          this.setState({user: authUser})
          this.fetchDrinks(authUser.uid)
        }
      })
    }
  }

  fetchDrinks = (userUid) => {
    if (localStorage.getItem('drinks')) {
      this.setState({
        drinks: JSON.parse(localStorage.getItem('drinks')),
      })
    }
    database.collection("users").doc(userUid).collection("drinks").orderBy("name").onSnapshot(
      snapshot => {
        const drinks = []
        snapshot.forEach(doc => {
          let drink = doc.data()
          drink.id = doc.id
          drinks.push(drink);
        })
        if(drinks.length > 0) {
          localStorage.setItem('drinks', JSON.stringify(drinks))
          this.setState({drinks: drinks})
        }
      }
    );
  }

  render() {
    const user = this.state.user
    const drinks = this.state.drinks
    if (!user || !drinks) {
      return (<div class="tc mt6"><Loading/> </div>)
    } else {
      return (
        <div className="pa4">
          <h1 className="sans-serif f2 mt0 mb4">Assistant</h1>
          <h1 className="sans-serif f2 mt0 mb4">{drinks.length}</h1>
        </div>
      )
    }
  }
}

export default Assistant
