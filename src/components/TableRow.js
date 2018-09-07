import React, { Component } from "react";

class TableRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friendData: props.friendData
    };
  }

  render() {
    return (
      <tr className="single-friend">
        <td>{this.state.friendData.name}</td>
        <td>{this.state.friendData.allowedAllergy}</td>
        <td>{this.state.friendData.allowedDiet}</td>
        <td>{this.state.friendData.excludedIngredient}</td>
        <td>{this.state.friendData.parties}</td>
      </tr>
    );
  }
}

export default TableRow;
