import React, { Component } from 'react';

import Logger from './components/Logger';
import FormInput from './components/FormInput';
import Fetcher from './componentModules/Fetcher';

/**
 * New User Component.
 * Intended Use as Fullscreen Display.
 * @extends Component
 *
 * @author Chatham Abate
 */
class NewUserDisplay extends Component {

  /**
   * Submit The New User Form.
   * The New User Form is not actually an HTML Form,
   * submitting the form does not always change the page.
   */
  submitForm() {
    let username = this.refs.username;
    let password = this.refs.password;
    let passwordConfirm = this.refs.passwordConfirm;

    // Flag All Fields.
    let flaggedUsername = username.flag();
    let flaggedPassword = password.flag();
    let flaggedPasswordConfirm = passwordConfirm.flag();

    if(flaggedUsername || flaggedPassword || flaggedPasswordConfirm)
      return;

    const UNMATCHED_PW_ERROR = "Passwords Must Match";

    // Test if the passwords match.
    if(password.value !== passwordConfirm.value)
    {
      this.refs.log.logErrors([UNMATCHED_PW_ERROR]);
      return;
    }

    // Fetch the request.
    let body = {
      username : username.value,
      password : password.value
    }

    Fetcher.fetchJSON("/api/newUser", body,
      this.handleNewUserResponse.bind(this));
  }


  /**
   * Handle the response from a New User Request.
   *
   * @param  {ServerResponse} response
   *  The response from the Server.
   */
  handleNewUserResponse(response) {
    this.refs.log.logResponse(response);
  }

  /**
   * Life Cycle Method for Rendering.
   */
  render() {
    return (
      <div className = "mainBlock">
        <div className = "topPadded">
          <div className = "color-primary-4 centered form"
            ref = "form">
            <FormInput type = "text" attempt = {this.submitForm.bind(this)}
              placeholder = "Username" ref = "username" />
            <FormInput type = "password" attempt = {this.submitForm.bind(this)}
              placeholder = "Password" ref = "password" />
            <FormInput type = "password" attempt = {this.submitForm.bind(this)}
              placeholder = "Confirm Password" ref = "passwordConfirm" />
            <Logger success = "User Created" ref = "log" />
            <div className = "flexDisplay">
              <span
                className = "clickable button"
                onClick = {this.submitForm.bind(this)}>
                Create
              </span>
              <span
                className = "clickable button"
                onClick = {() => this.props.switchDisplay("login")}>
                Back
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NewUserDisplay;
