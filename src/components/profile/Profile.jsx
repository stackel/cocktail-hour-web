import React, {Component} from 'react';

import Loading from 'components/shared/Loading'
import {auth, database} from 'utils/firebase'

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null
    }
  }

  componentDidMount() {
    const locationState = this.props.location.state
    if (locationState && locationState.user) {
      this.setState({
        user: JSON.parse(locationState.user)
      })
    } else {
      this.fetchUser()
    }
  }

  fetchUser = () => {
    const localUser = localStorage.getItem('user');
    if (localUser) {
      this.setState({
        user: JSON.parse(localUser)
      })
    }

    auth.onAuthStateChanged(authUser => {
      if (authUser) {
        database.collection("users").doc(authUser.uid).onSnapshot(snapshot => {
          const user = snapshot.data()
          if(user) {
            this.setState({user: snapshot.data()})
            localStorage.setItem('user', JSON.stringify(user))
          }
        })
      }
    })
  }

  render() {
    const { user } = this.state
    if (!user) {
      return (<div className="tc mt6"><Loading label="Loading"/>
      </div>)
    } else {
      return (
        <div className="pa4">
          <h1 className="sans-serif f2 mt0 mb4">Profile</h1>
          <h2 className="sans-serif f3 mb0">{user.displayName}</h2>
          <h2 className="sans-serif f4 fw3 gray">{user.email}</h2>
        </div>
      )
    }
  }
}

export default Profile
