import React, {Component} from 'react';
import Button from '@material-ui/core/Button';

import {database, auth, googleAuthProvider} from './firebase'

class App extends Component {
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
          "Successfully logged in with authUser " + authUser.displayName + " " + auth.uid
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
          } else {
            console.log("Did not find firestore user")
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
    auth.signOut().then(() =>  {
      console.log("Successfully logged out.")
      this.setState({
        authUser: null,
        firebaseUser: null
      })
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
        <Button onClick={this.logout} variant="contained" color="primary">
          Log out
        </Button>
      )
    }
  }

  render() {
    return (<div>
      <this.UserArea authUser={this.state.authUser}/>
    </div>);
  }
}

export default App;
