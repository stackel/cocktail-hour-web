import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import MoreVert from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {Link} from 'react-router-dom'

import {database, auth, googleAuthProvider} from 'utils/firebase'
import Loading from 'components/shared/Loading'

class DashboardMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      anchorElement: null,
    }
  }

  open = event => {
    this.setState({anchorElement: event.currentTarget});
  };

  close = () => {
    this.setState({anchorElement: null});
  };

  logout = () => {
    auth.signOut().then(() => {
      localStorage.clear()
      this.setState({user: null})
    }, error => {
      console.log("An error occured while logging out: ")
      console.log(error)
    })
  }

  NewIngredientMenuItem = (props) => {
    if (!props.show) {
      return null
    }

    return (
      <Link className="link" to="/ingredients/new">
        <MenuItem>New Ingredient</MenuItem>
      </Link>
    )
  }
  render() {
    const anchorElement = this.state.anchorElement
    return (
      <div>
      <MoreVert
        aria-owns={anchorElement
          ? 'drink-menu'
          : null}
        aria-haspopup="true"
        onClick={this.open}>
        menu
      </MoreVert>
      <Menu
        id="drink-menu"
        anchorEl={anchorElement}
        open={Boolean(anchorElement)}
        onClose={this.close}>
        <Link className="link" to="/new">
          <MenuItem>New Drink</MenuItem>
        </Link>
        <this.NewIngredientMenuItem show={this.props.user.admin}/>
        <MenuItem
          component={Link}
          to={{
            pathname: "/profile",
            state: {
              authUser: JSON.stringify(this.props.user)
            }
          }}>Profile</MenuItem>
        <MenuItem
          component={Link}
          to={{
            pathname: "/assistant",
            state: {
              authUser: JSON.stringify(this.props.user)
            }
          }}>Assistant</MenuItem>
        <MenuItem onClick={this.logout}>Log Out</MenuItem>
      </Menu>
    </div>
    )

  }

}

export default DashboardMenu;
