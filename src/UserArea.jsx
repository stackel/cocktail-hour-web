import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import {database, auth, googleAuthProvider} from './firebase'

import Drink from './Drink'

class Auth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authUser: null,
      firebaseUser: null
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged(authUser => {
      if (authUser) {
        console.log(
          "Successfully logged in with authUser " + authUser.displayName + " " +
          authUser.uid
        )
        console.log(authUser)
        this.setState({authUser: authUser})

        //find firestore user by uid.
        let userRef = database.collection("users").doc(authUser.uid);

        userRef.onSnapshot(snapshot => {
          let firestoreUser = snapshot.data()
          if (firestoreUser) {
            console.log("Found firestore user.")
            console.log(firestoreUser)

            this.setState({firestoreUser: firestoreUser})
            this.props.onLogin(authUser, firestoreUser)
          } else {
            console.log("Did not find firestore user, creating it.")
            database.collection("users").doc(authUser.uid).set({"drinks": {}}).then(
              response => {
                console.log("Firestore user created.")
              },
              error => {
                console.log("Error creating firestore user: ")
                console.log(error)
              }
            )
          }
        })
      } else {
        console.log("Auth user not found.")
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

  logout = () => {
    auth.signOut().then(() => {
      console.log("Successfully logged out.")
      this.setState({authUser: null, firebaseUser: null})
      this.props.onLogout()
    }, error => {
      console.log("An error occured while logging out: ")
      console.log(error)
    })
  }

  UserArea = (props) => {
    if (!props.authUser) {
      return (
        <Button onClick={this.loginWithGoogleAuth} variant="contained" color="primary">
          Log in
        </Button>
      )
    } else {
      return (
        <Card>
          <CardContent>
            <h2 className="sans-serif tc">Welcome {props.authUser.displayName}!</h2>
            <h3 className="sans-serif tc f4 gray fw3">
              {props.authUser.email}</h3>
            <Button onClick={this.logout} variant="contained" color="primary">
              Log out
            </Button>
          </CardContent>
        </Card>
      )
    }
  }

  render() {
    return (
      <div className="ma4">
        <this.UserArea className="mv4" authUser={this.state.authUser}/>
      </div>
    );
  }
}

export default Auth;
