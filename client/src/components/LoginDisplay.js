import React, { Component } from 'react';
import ErrorLog from './ErrorLog';
import ClassModifier from "./componentModules/ClassModifier";

import './componentStyles/genericStyles.css';

class LoginDisplay extends Component {

  submitForm() {
    let username = this.refs.username;
    let password = this.refs.password;

    if(username.value === "" || password.value === "") {
      username.className += username.value === "" ? " required" : "";
      password.className += password.value === "" ? " required" : "";

      return;
    }

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
    ClassModifier.clearInput(this.refs.username);
    ClassModifier.clearInput(this.refs.password);
  }

  handleLoginResponse(response) {
    this.clearForm();
    if(response.errors.length !== 0)
      this.refs.log.logErrors(response.errors);

  }

  render() {
    return (
      <div className = "mainBlock topPadded">
        <div className = "centered form" ref = "form">
          <div className = "flexDisplay">
            <input className = "flexible clickable padded"
              type = "text"
              placeholder = "Username"
              ref = "username" />
          </div>
          <div className = "flexDisplay">
            <input className = "flexible clickable padded"
              type = "password"
              placeholder = "Password"
              ref = "password" />
          </div>
          <ErrorLog ref ="log" />
          <div className = "flexDisplay">
            <span
              className = "flexible clickable padded centeredText faded"
              onClick = {this.submitForm.bind(this)}>
              Login
            </span>
            <span className = "flexible clickable padded centeredText faded">
              New User
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginDisplay;
