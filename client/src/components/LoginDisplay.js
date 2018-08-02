import React, { Component } from 'react';

import ErrorLog from './ErrorLog';
import FormInput from './FormInput';

class LoginDisplay extends Component {

  submitForm() {
    let username = this.refs.username;
    let password = this.refs.password;

    let flaggedUsername = username.flag();
    let flaggedPassword = password.flag();

    if(flaggedUsername || flaggedPassword)
      return;

    fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({
        username : username.value,
        password : password.value
      }),
       headers: {
         "Content-Type" : "application/json"
       }
    }).then(res => res.json())
      .then(resJSON => this.handleLoginResponse(resJSON));
  }

  clearForm() {
    this.refs.username.unflag();
    this.refs.password.unflagAndClear();
  }

  handleLoginResponse(response) {
    this.clearForm();

    if(response.errors.length !== 0)
      this.refs.log.logErrors(response.errors);

  }

  render() {
    return (
      <div className = "mainBlock">
        <br /> <br /> <br /> 
        <div className = "centered form" ref = "form">
          <FormInput type = "text"
            placeholder = "Username" ref = "username" />
          <FormInput type = "password"
            placeholder = "Password" ref = "password" />
          <ErrorLog ref ="log" />
          <div className = "flexDisplay">
            <span
              className = "clickable button"
              onClick = {this.submitForm.bind(this)}>
              Login
            </span>
            <a
              className = "clickable button"
              href = "/newUser">
              New User
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginDisplay;
