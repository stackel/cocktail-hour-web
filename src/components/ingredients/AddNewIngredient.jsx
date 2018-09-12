import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'

import TextField from '@material-ui/core/TextField';
import Select from 'react-select';
import SaveOrUpdateButton from 'components/drinks/drink/buttons/SaveOrUpdateButton'

import {auth, database} from 'utils/firebase'

class AddNewIngredient extends Component {
  constructor(props) {
    super(props)
    this.state = {
      label: null,
      name: null,
      type: null,
      description: null,
      allTypes: null,
      saving: false
    }
  }

  componentDidMount() {
    this.fetchTypes()
  }

  fetchTypes = () => {
    database.collection("ingredient-types").onSnapshot(snapshot => {
      let ingredientTypes = []
      snapshot.forEach(doc => {
        ingredientTypes.push(doc.data());
      })
      this.setState({allTypes: ingredientTypes})
    })
  }

  ingredientChanged = name => event => {
    this.setState({[name]: event.target.value})
  }

  typeChanged = value => {
    this.setState({type: value})
  }

  saveIngredient = () => {
    const {name, label, type, description} = this.state
    this.setState({saving: true})
    database.collection("ingredients").add(
      {label: label, name: name, type: type, description: description}
    ).then(() => {
      this.setState(
        {saving: false, label: null, name: null, type: null, description: null}
      )
    })
  }

  validateFields = () => {
    const {name, label, type, description} = this.state
    if (!name || !label || !type || !description) {
      return false
    }
    return true
  }

  render() {
    if (!this.state.allTypes) {
      return (<p>loading</p>)
    }

    if (this.state.saving) {
      return (<p>saving</p>)
    }

    return (
      <div className="ma4">
        <TextField
          id="name"
          label="Name"
          className="w-100"
          defaultValue={this.state.name}
          onChange={this.ingredientChanged("name")}/>

        <TextField
          id="label"
          label="Label"
          className="w-100"
          defaultValue={this.state.label}
          onChange={this.ingredientChanged("label")}/>

        <TextField
          id="description"
          label="Description"
          className="w-100"
          defaultValue={this.state.description}
          onChange={this.ingredientChanged("description")}/>

        <Select
          placeholder="Type"
          onChange={this.typeChanged}
          defaultValue={this.state.type}
          options={this.state.allTypes}/>

        <SaveOrUpdateButton
          new={true}
          onClick={this.saveIngredient}
          disabled={!this.validateFields()}/>

      </div>
    )
  }
}

export default AddNewIngredient
