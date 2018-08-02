import React, { Component } from 'react';

import ErrorLog from './ErrorLog';
import FormInput from './FormInput';

class NewUserDisplay extends Component {
  submitForm() {

  }

  render() {
    return (
      <div className = "mainBlock topPadded">
        <div className = "centered form" ref = "form">
          <FormInput type = "text"
            placeholder = "Username" ref = "username" />
          <FormInput type = "password"
            placeholder = "Password" ref = "password" />
          <FormInput type = "password"
            placeholder = "Confirm Password" ref = "passwordConfirm" />
          <ErrorLog ref ="log" />
          <div className = "flexDisplay">
            <span
              className = "clickable button"
              onClick = {this.submitForm.bind(this)}>
              Create
            </span>
            <a
              className = "clickable button"
              href = "/">
              Back
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default NewUserDisplay;
