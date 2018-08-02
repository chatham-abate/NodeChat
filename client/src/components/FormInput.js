import React, { Component } from 'react';

import ClassModifier from "./componentModules/ClassModifier";

class FormInput extends Component {

  get value() {
    return this.refs.field.value;
  }

  flagged() {
    return (this.refs.field.className.indexOf("required") !== -1);
  }

  flag() {
    if(this.value === "") {
      this.refs.field.className += " required";
      return true;
    }

    return false;
  }

  unflag() {
    if(this.flagged())
      ClassModifier.removeClass(this.refs.field, "required");
  }

  unflagAndClear() {
    this.unflag();

    this.refs.field.value = "";
  }

  render() {
    return (
      <div className = "flexDisplay">
        <input className = "flexible clickable padded"
          type = {this.props.type}
          placeholder = {this.props.placeholder}
          ref = "field" />
      </div>
    );
  }
}

export default FormInput;
