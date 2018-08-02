import React, { Component } from 'react';

import Log from './Log';
import FormInput from './FormInput';
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
      this.refs.errorLog.logEntries([UNMATCHED_PW_ERROR]);
      return;
    }

    // Fetch teh request.
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
    if(response.errors.length !== 0)
      this.refs.errorLog.logEntries(response.errors);
    else {
      this.refs.successLog.logEntries([response.body]);
    }
  }


  /**
   * Handle a Key Press Event from the Form.
   *
   * @param  {Event} e
   *  The Key Press Event.
   */
  handleKeyPress(e) {
    // Submit Form on Enter.
    if(e.charCode === 13)
      this.submitForm();
  }


  /**
   * Life Cycle Method for Rendering.
   */
  render() {
    return (
      <div className = "mainBlock">
        <div className = "topPadded">
          <div className = "centered form"
            ref = "form"
            onKeyPress = {this.handleKeyPress.bind(this)}>
            <FormInput type = "text"
              placeholder = "Username" ref = "username" />
            <FormInput type = "password"
              placeholder = "Password" ref = "password" />
            <FormInput type = "password"
              placeholder = "Confirm Password" ref = "passwordConfirm" />
            <Log ref = "successLog" />
            <Log errorLog ref = "errorLog" />
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
      </div>
    );
  }
}

export default NewUserDisplay;
