import React, {Component} from 'react';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import FavoriteIcon from '@material-ui/icons/Favorite';

class BottomTabs extends Component {
  onChange = (event, value) => {
    this.props.onTabChanged(event, value)
  }

  render() {
    return (
      <BottomNavigation
        className="fixed bottom-0 w-100 mw7"
        value={this.props.value}
        onChange={this.onChange}
        showLabels>
        <BottomNavigationAction label="Drinks"/>
        <BottomNavigationAction label="Ingredients"/>
      </BottomNavigation>
    )

  }

}

export default BottomTabs;
