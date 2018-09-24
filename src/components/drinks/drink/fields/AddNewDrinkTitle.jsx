import React, {Component} from 'react'

class AddNewDrinkTitle extends Component {
  render() {
    if (!this.props.new) {
      return null
    }
    return (
      <h2 className="sans-serif f2 b"> Add New Drink</h2>
    )
  }
}

export default AddNewDrinkTitle
