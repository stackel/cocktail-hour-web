import React, {Component} from 'react';

import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Loading from 'components/shared/Loading'

import { auth } from 'utils/firebase'
class User extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null
    }

  }

  componentDidMount() {
    if(this.props.location.state) {
      this.setState({
        user: JSON.parse(this.props.location.state.authUser)
      })
    } else {
      this.fetchUser()
    }
  }

  fetchUser = () => {
    auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.setState({user: authUser})
      }
    })
  }

  render() {
    const user = this.state.user
    if (!user) {
      return (<div class="tc mt6"><Loading/> </div>)
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

export default User
