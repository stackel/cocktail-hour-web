import React, {Component} from 'react';

import Select from 'react-select';

class IngredientField extends Component {

  handleChange = value => {
    this.props.handleChange("ingredient", value)
  }

  render() {
    const props = this.props

    if (props.edit) {
      return (
        <Select
          placeholder="Ingredient"
          defaultValue={props.ingredient}
          onChange={this.handleChange}
          options={props.allIngredients}/>
      )
    }

    if (!props.ingredient) {
      return null
    }

    if(!props.userIngredients) {
      return (<p className="sans-serif gray ">{props.ingredient.label}</p>)
    }

    if (props.userIngredients.includes(props.ingredient.name)) {
      return (<p className="sans-serif b">{props.ingredient.label}</p>)
    } else {
      return (<p className="sans-serif gray ">{props.ingredient.label}</p>)
    }

  }
}

export default IngredientField;
