import React, {Component} from 'react';
import Button from '@material-ui/core/Button';

import {database, auth, googleAuthProvider} from 'utils/firebase'
import Loading from 'components/shared/Loading'

class Auth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged(authUser => {
      if (authUser) {
        console.log(
          "Successfully logged in with authUser " + authUser.displayName + " " +
          authUser.uid
        )
        database.collection("users").doc(authUser.uid).onSnapshot(snapshot => {
          let firestoreUser = snapshot.data()
          if (firestoreUser) {
            console.log("Found firestore user.")
            console.log(firestoreUser)
            this.props.onLogin(authUser, firestoreUser)
          } else {
            database.collection("users").doc(authUser.uid).set(
              {ingredients: []}
            ).then(() => {
              database.collection("users").doc(authUser.uid).onSnapshot(snapshot => {
                this.props.onLogin(authUser, snapshot.data())
              });

            }).catch(response => {
              console.log(response)
            });
          }
        })
      } else {
        console.log("Auth user not found.")
        this.setState({loading: false})
      }
    });
  }

  loginWithGoogleAuth = () => {
    auth.signInWithPopup(googleAuthProvider).then(result => {
      console.log("Google auth successful with result: ")
      console.log(result)
    }).catch(error => {
      console.log("Google auth failed with error: ")
      console.log(error)
    })
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="tc ma6">
          <h1 className="sans-serif f2 tc mt7">
            COCKTAIL HOUR</h1>
          <Loading/>
        </div>
      )
    }

    return (
      <div className="tc">
        <h1 className="sans-serif f2 tc mt7">
          COCKTAIL HOUR</h1>
        <Button onClick={this.loginWithGoogleAuth} variant="outlined" color="primary">
          Log in
        </Button>
      </div>
    )
  }
}

export default Auth;
