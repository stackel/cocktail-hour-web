import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';

import EditButton from 'components/drinks/drink/menu/EditButton'
import DeleteButton from 'components/drinks/drink/menu/DeleteButton'
import EditBackButton from 'components/drinks/drink/menu/EditBackButton'

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

  render() {
    const anchorElement = this.state.anchorElement;

    return (
      <div>
        <Button
          aria-owns={anchorElement
            ? 'drink-menu'
            : null}
          aria-haspopup="true"
          onClick={this.open}>
          menu
        </Button>
        <Menu
          id="drink-menu"
          anchorEl={anchorElement}
          open={Boolean(anchorElement)}
          onClose={this.close}>
          <EditButton onClick={this.onEditClicked}/>
          <DeleteButton
            show={this.props.showdelete}
            onClick={this.onDelete}
            edit={this.props.edit}
            new={this.props.new}/>
        </Menu>
      </div>
    )
  }
}

export default DrinkMenu;
