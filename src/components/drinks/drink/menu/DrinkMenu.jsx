import React, {Component} from 'react';
import Menu from '@material-ui/core/Menu';
import MoreVert from '@material-ui/icons/MoreVert';
import MenuItem from '@material-ui/core/MenuItem';

import EditButton from 'components/drinks/drink/menu/EditButton'
import DeleteButton from 'components/drinks/drink/menu/DeleteButton'


class DrinkMenu extends Component {
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

  onDelete = () => {
    this.props.onDelete()
    this.close()
  }

  onEditClicked = () => {
    this.props.onEditClicked()
    this.close()
  }

  onShareClicked = () => {
    this.props.onShareClicked();
    this.close()
  }

  ShareButton = (props) => {
    if(!props.show) {
      return null
    } else {
      return (<MenuItem onClick={this.onShareClicked}> Share</MenuItem>)
    }
  }

  render() {
    const anchorElement = this.state.anchorElement;
    // hide edit on no ID
    // hide share on no ID
    if(!this.props.hasUserId) {
      return null
    }
    return (
      <div>
        <MoreVert
          className="link"
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
          <EditButton onClick={this.onEditClicked}/>
          <this.ShareButton show={!this.props.shareId}/>
          <DeleteButton
            show={true}
            onClick={this.onDelete}
            edit={this.props.edit}
            new={this.props.new}/>
        </Menu>
      </div>
    )
  }
}

export default DrinkMenu;
