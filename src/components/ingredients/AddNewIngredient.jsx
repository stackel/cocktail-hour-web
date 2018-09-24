import React, {Component} from 'react';

import TextField from '@material-ui/core/TextField';
import Select from 'react-select';
import Loading from 'components/shared/Loading';
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
    this.fetchUser()
  }

  fetchUser = () => {
    if(localStorage.getItem('authUser')) {
      this.setState({user: JSON.parse(localStorage.getItem('authUser'))})
    }

    auth.onAuthStateChanged(authUser => {
      if (authUser) {
        localStorage.setItem('authUser', JSON.stringify(authUser))
        this.setState({user: authUser})
      }
    })
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
      return (<div className="tc mt6">
        <Loading label="Loading"/>
      </div>)
    }

    if (this.state.saving) {
      return (<div className="tc mt6">
        <Loading label="Saving"/>
      </div>)
    }

    return (
      <div className="ma4">
        <h1 className="sans-serif f2"> Add New Ingredient</h1>
        <TextField
          className="mv4 w-100"
          id="name"
          label="Name"
          defaultValue={this.state.name}
          onChange={this.ingredientChanged("name")}/>

        <TextField
          className="mv4 w-100"
          id="label"
          label="Label"
          defaultValue={this.state.label}
          onChange={this.ingredientChanged("label")}/>

        <TextField
          className="mv4 w-100"
          id="description"
          label="Description"
          defaultValue={this.state.description}
          onChange={this.ingredientChanged("description")}/>

        <Select
          className="mv4"
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
