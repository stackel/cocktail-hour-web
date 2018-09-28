import React, {Component} from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Chip from '@material-ui/core/Chip';
import {Link} from "react-router-dom";
import { database } from 'utils/firebase'

class DrinkListItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userIngredients: []
    }
  }

  componentDidMount() {
    if(this.props.user) {
      this.fetchUserIngredients(this.props.user.id)
    }
  }

  fetchUserIngredients = (userUid) => {
    if(localStorage.getItem('userIngredients')) {
      this.setState({userIngredients: JSON.parse(localStorage.getItem('userIngredients'))})
    }

    database.collection("users").doc(userUid).onSnapshot(snapshot => {
      const firestoreUser = snapshot.data()
      const ingredients = firestoreUser.ingredients

      if(ingredients) {
        localStorage.setItem('userIngredients', JSON.stringify(ingredients))
        this.setState({userIngredients: ingredients})
      }
    });

  }

  TagList = (props) => {
    const tagComponents = []
    if (props.tags) {
      props.tags.forEach(tag => {
        tagComponents.push(
          <Chip className="dib fr mv2 mh1" key={tag.name} label={tag.label}/>
        );
      });
    }
    return tagComponents;
  }

  hasAllIngredients = drink => {
    for (var i = 0; i < drink.ingredients.length; i++) {
      const ingredient = drink.ingredients[i]
      if (!this.state.userIngredients.includes(ingredient.ingredient.name)) {
        return false
      }
    }
    return true
  }

  hasIngredient = (ingredient) => {
    return this.state.userIngredients.includes(ingredient.name);
  }

  secondaryText = (drink) => {
    if (this.hasAllIngredients(drink)) {
      return (drink.ingredients.map(obj => {
        return obj.ingredient.label
      }).join(", "))
    } else {
      return ("Missing: " + (
        drink.ingredients.filter(obj => {
          return !this.hasIngredient(obj.ingredient)
        }).map(obj => {
          return obj.ingredient.label
        }).join(", ")
      ))
    }
  }

  render() {
    const drink = this.props.drink
    const shareId = this.props.shareId || false
    if(!this.state.userIngredients) {
      return null
    }
    return (
      <ListItem
        component={Link}
        to={{
          pathname: shareId ? "/shared/" + shareId : "/drink/"+  drink.id,
          state: {
            userIngredients: JSON.stringify(this.state.userIngredients),
            drink: JSON.stringify(drink),
            user: this.props.user
          }
        }}
        button>

        <ListItemText primary={drink.name} secondary={this.secondaryText(drink)}/>

        <div>
          <this.TagList tags={drink.tags}/>
        </div>

      </ListItem>
    );
  }
}

export default DrinkListItem;
