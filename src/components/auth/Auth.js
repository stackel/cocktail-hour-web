import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';

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

  emailChanged = event => {
    this.setState({
      email: event.target.value,
      errorMessage: ""

    })
  }

  passwordChanged = event => {
    this.setState({
      password: event.target.value,
      errorMessage: ""
    })
  }

  loginWithGoogleAuth = () => {
    this.setState({loading: true})
    auth.signInWithPopup(googleAuthProvider).then(result => {
      console.log("Google auth successful with result: ")
      console.log(result)
    }).catch(error => {
      this.setState({loading: false})
      console.log("Google auth failed with error: ")
      console.log(error)
      this.setState({
        errorMessage: error.message
      })
    })
  }

  loginWithEmailPassword = () => {
    this.setState({loading: true})
    auth.signInWithEmailAndPassword(this.state.email, this.state.password).then(
      result => {
        console.log("Email/Password auth successful with result: ")
        console.log(result)
      }
    ).catch(error => {
      this.setState({loading: false})
      console.log("Email/Password auth failed with error: ")
      console.log(error)
      this.setState({
        errorMessage: error.message
      })
    })
  }

  registerWithEmailAndPassword = () => {
    this.setState({loading: true})
    auth.createUserWithEmailAndPassword(this.state.email, this.state.password).then(
      result => {
        console.log("Email/Password register successful with result: ")
        console.log(result)
      }
    ).catch(error => {
      this.setState({loading: false})
      console.log("Email/Password register failed with error: ")
      console.log(error)
      this.setState({
        errorMessage: error.message
      })
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
          <Loading label="Logging in"/>
        </div>
      )
    }

    return (
      <div className="tc">
        <h1 className="sans-serif f2 tc mt7">
          COCKTAIL HOUR</h1>
        <div>
          <div>
            <TextField
              defaultValue={this.state.email}
              id="email"
              label="Email"
              type="email"
              autoComplete="email"
              onChange={this.emailChanged}/>
          </div>
          <div className="mt2 mb4">
            <TextField
              defaultValue={this.state.password}
              id="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              onChange={this.passwordChanged}/>
          </div>

          <div>
            <div className="dib mh2">

              <Button
                onClick={this.loginWithEmailPassword}
                variant="contained"
                color="primary">
                Sign in
              </Button>
            </div>
            <div className="dib mh2">

              <Button
                onClick={this.registerWithEmailAndPassword}
                className="mh2"
                variant="outlined"
                color="primary">
                Register
              </Button>
            </div>
          </div>

        </div>

        <div className="mv4">
          <Button onClick={this.loginWithGoogleAuth} variant="contained" color="primary">
            Sign in / register with Google
          </Button>
        </div>
        <p className="tc dark-red sans-serif f5"> {this.state.errorMessage}</p>
      </div>
    )
  }
}

export default Auth;
