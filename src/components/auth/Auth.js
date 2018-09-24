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
        console.log("Found auth user")
        database.collection("users").doc(authUser.uid).onSnapshot(snapshot => {
          let firestoreUser = snapshot.data()

          if (firestoreUser) {
            console.log("Found firestore user.")
            console.log(firestoreUser)
            this.loginDone(firestoreUser)
          } else {
            console.log("Did not find firestore user.")
            const firestoreUser = {
              displayName: authUser.displayName,
              email: authUser.email,
              id: authUser.uid,
              admin: false
            }
            database.collection("users").doc(authUser.uid).set(firestoreUser).then(() => {
              console.log("Firestore user registered.")
              this.loginDone(firestoreUser)
            }).catch(response => {
              console.log(response)
            });
          }
        })
      } else {
        this.setState({loading: false})
        console.log("Auth user not found.")
      }
    });
  }


  loginWithGoogleAuth = () => {
    this.setState({loading: true})
    auth.signInWithPopup(googleAuthProvider).then(result => {
      console.log("Google auth successful with result: ")
      console.log(result)
    }).catch(error => {
      console.log("Google auth failed with error: ")
      console.log(error)
    })
  }

  loginDone = (user) => {
    localStorage.setItem('user', JSON.stringify(user))
    this.setState({loading: false})
    this.props.onLogin(user)
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
