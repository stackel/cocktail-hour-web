import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItem';

import {database, auth, googleAuthProvider} from 'utils/firebase'

class Auth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authUser: null,
      firestoreUser: null,
      drawerOpen: false,
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
        console.log(authUser)
        this.setState({authUser: authUser})

        //find firestore user by uid.
        let userRef = database.collection("users").doc(authUser.uid);

        userRef.onSnapshot(snapshot => {
          let firestoreUser = snapshot.data()
          if (firestoreUser) {
            console.log("Found firestore user.")
            console.log(firestoreUser)
            this.setState({
              loading: false
            })
            this.setState({firestoreUser: firestoreUser})
            this.props.onLogin(authUser, firestoreUser)
          } else {
            /*console.log("Did not find firestore user, creating it.")
            database.collection("users").doc(authUser.uid).set({"drinks": {}}).then(
              response => {
                console.log("Firestore user created.")
              },
              error => {
                console.log("Error creating firestore user: ")
                console.log(error)
              }
            )*/
          }
        })
      } else {
        console.log("Auth user not found.")
        this.setState({
          loading: false
        })
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
      this.setState({authUser: null, firestoreUser: null})
      this.props.onLogout()
    }, error => {
      console.log("An error occured while logging out: ")
      console.log(error)
    })
  }

  toggleDrawer = (open) => () => {
    this.setState({drawerOpen: open});
  };

  UserArea = (props) => {
    if(this.state.loading) {
      return (<p>LOADFINF</p>)
    }
    if (!props.authUser) {
      return (
        <div className="tc">
          <h1 className="sans-serif f2 tc mt7"> COCKTAIL HOUR</h1>
          <Button onClick={this.loginWithGoogleAuth} variant="outlined" color="primary">
            Log in
          </Button>
        </div>
      )
    } else {
      return (
        <div>
          <Drawer
            anchor="top"
            open={this.state.drawerOpen}
            onClose={this.toggleDrawer(false)}>
            <div
              tabIndex={0}
              role="button"
              onClick={this.toggleDrawer(false)}
              onKeyDown={this.toggleDrawer(false)}>

              <List component="nav">

                <ListItem>
                  <p className="sans-serif f4 mv0 pv0">
                    {props.authUser.displayName}
                  </p>
                </ListItem>

                <ListItem>
                  <p className="sans-serif f4 gray mv0 pv0 fw3">
                    {props.authUser.email}
                  </p>
                </ListItem>

                <ListItem button="button">
                  <Button onClick={this.logout} variant="contained" color="primary">
                    Log out
                  </Button>
                </ListItem>
              </List>

            </div>
          </Drawer>
          <div className="tc">
            <Button
              className="sans-serif"
              variant="outlined"
              onClick={this.toggleDrawer(true)}>
              {props.authUser.displayName}s drinks</Button>
          </div>
        </div>
      )
    }
  }
  render() {
    return (<this.UserArea authUser={this.state.authUser}/>);
  }
}

export default Auth;
