import React, {Component} from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Chip from '@material-ui/core/Chip';
import {Link} from "react-router-dom";

class DrinkListItem extends Component {
  TagList = (props) => {
    const tagComponents = []
    if(props.tags) {
      props.tags.map(tag => {
        tagComponents.push(<Chip className="dib mh2" key={tag.name} label={tag.label}/>);
      });
    }
    return tagComponents;
  }

  render() {
    const drink = this.props.drink
    return (
      <ListItem
        component={Link}
        to={{
          pathname: "/drink/" + drink.id,
          state: {
            userIngredients: JSON.stringify(this.props.userIngredients),
            drink: JSON.stringify(drink),
            authUserUid: this.props.authUserUid
          }
        }}
        button="button">

        <ListItemText
          primary={drink.name}
          secondary={drink.ingredients.map(obj => {
            return obj.ingredient.label
          }).join(", ")}/>

        <div>
          <this.TagList tags={drink.tags} />
        </div>

      </ListItem>
    );
  }
}

export default DrinkListItem;
