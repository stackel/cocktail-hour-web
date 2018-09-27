import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Email from '@material-ui/icons/Email';
import VpnKey from '@material-ui/icons/VpnKey';
import AccountCircle from '@material-ui/icons/AccountCircle';

import {database, auth, googleAuthProvider} from 'utils/firebase'
import LoadingFullscreen from 'components/shared/LoadingFullscreen'

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
    this.setState({email: event.target.value, errorMessage: ""})
  }

  passwordChanged = event => {
    this.setState({password: event.target.value, errorMessage: ""})
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
      this.setState({errorMessage: error.message})
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
      this.setState({errorMessage: error.message})
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
      this.setState({errorMessage: error.message})
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
        <LoadingFullscreen label="Signing in.."/>
      )
    }

    return (
      <div className="tc mt6 pt5 mw5 center">
        <img class=" mb4" src="res/logo-big-black.png"/>
        <form onSubmit={this.loginWithEmailPassword}>
          <div>
            <div>
              <Input
                defaultValue={this.state.email}
                placeholder="Email"
                id="email"
                className="w-100"
                label="Email"
                type="email"
                autoComplete="email"
                onChange={this.emailChanged}
                startAdornment={<InputAdornment position = "start" > <Email/>
              </InputAdornment>
                }
              />
            </div>
            <div className="mv3">

              <Input
                defaultValue={this.state.password}
                id="password"
                label="Password"
                type="password"
                className="w-100"
                placeholder="Password"
                autoComplete="current-password"
                onChange={this.passwordChanged}
                startAdornment={<InputAdornment position = "start" > <VpnKey/>
              </InputAdornment>
                }/>
            </div>

            <div>
              <div className="dib w-50 pr2">

                <Button
                  type="submit"
                  onClick={this.loginWithEmailPassword}
                  variant="contained"
                  className="w-100"
                  color="primary">
                  Sign in
                </Button>
              </div>
              <div className="dib w-50 pl2 mt2">

                <Button
                  onClick={this.registerWithEmailAndPassword}
                  className="w-100"
                  variant="outlined"
                  color="primary">
                  Sign up
                </Button>
              </div>
            </div>

          </div>
        </form>

        <div className="mv4">
          <Button className="w-100" onClick={this.loginWithGoogleAuth} variant="contained" color="primary">
            Sign in / sign up with Google
          </Button>
        </div>
        <p className="tc dark-red sans-serif f5">
          {this.state.errorMessage}</p>
      </div>
    )
  }
}

export default Auth;
