import React, {Component} from 'react';

import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

class User extends Component {
  constructor(props){
    super(props)
    this.state = {
      drawerOpen: false
    }
  }

  onLogOutClicked = () => {
    this.props.onLogout()
  }

  toggleDrawer = (open) => () => {
    this.setState({
      drawerOpen: open,
    });
  };

  render() {
    if (!this.props.authUser) {
      return null
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
                    {this.props.authUser.displayName}
                  </p>
                </ListItem>

                <ListItem>
                  <p className="sans-serif f4 gray mv0 pv0 fw3">
                    {this.props.authUser.email}
                  </p>
                </ListItem>

                <ListItem button="button">
                  <Button onClick={this.props.onLogout} variant="contained" color="primary">
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
              {this.props.authUser.displayName}</Button>
          </div>
        </div>
      )
    }
  }
}

export default User
