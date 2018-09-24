import React, {Component} from 'react';
import MoreVert from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {Link} from 'react-router-dom'

import {auth} from 'utils/firebase'
import Loading from 'components/shared/Loading'

class DashboardMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      anchorElement: null
    }
  }

  open = event => {
    this.setState({anchorElement: event.currentTarget});
  };

  close = () => {
    this.setState({anchorElement: null});
  };

  onLogoutClick = () => {
    this.close()
    this.props.onLogout()
  }

  ProfileMenuItem = (props) => {
    return (
      <MenuItem
        component={Link}
        to={{
          pathname: "/profile",
          state: {
            authUser: JSON.stringify(props.user)
          }
        }}>Profile</MenuItem>
    )
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

  AssistantMenuItem = (props) => {
    return (
      <MenuItem
        component={Link}
        to={{
          pathname: "/assistant",
          state: {
            user: JSON.stringify(props.user)
          }
        }}>Assistant</MenuItem>
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
          <this.AssistantMenuItem user={this.props.user}/>
          <this.NewIngredientMenuItem show={this.props.user.admin}/>
          <this.ProfileMenuItem user={this.props.user}/>
          <MenuItem onClick={this.onLogoutClick}>Log Out</MenuItem>
        </Menu>
      </div>
    )
  }
}

export default DashboardMenu;
