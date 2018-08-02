import React, { Component } from 'react';
import Log from './Log';
import FormInput from './FormInput';
import Fetcher from './componentModules/Fetcher';

/**
 * React Component for Logging into the Server.
 * Inteded Use as Full Screen Display.
 * @extends Component
 *
 * @author Chatham Abate
 */
class LoginDisplay extends Component {

  /**
   * Submit The Login Form.
   * The Login Form is not actually an HTML Form,
   * submitting the form does not always change the page.
   */
  submitForm() {
    let username = this.refs.username;
    let password = this.refs.password;

    // Flag the fields.
    let flaggedUsername = username.flag();
    let flaggedPassword = password.flag();

    if(flaggedUsername || flaggedPassword)
      return;

    // Create and fetch the request.
    let body = {
      username : username.value,
      password : password.value
    };

    Fetcher.fetchJSON('/api/login', body, this.handleLoginResponse.bind(this));
  }


  /**
   * Clear the Login Form.
   * Both the Username and Password fields will be unflagged.
   * Only the Password field's value will be cleared.
   */
  clearForm() {
    this.refs.username.unflag();
    this.refs.password.unflagAndClear();
  }


  /**
   * Handle the Response to a Login request.
   *
   * @param  {ServerResponse} response
   *  The Response from the Server.
   */
  handleLoginResponse(response) {
    // Clear the Form upon recieving the response.
    this.clearForm();

    // Check for errors.
    if(response.errors.length !== 0)
      this.refs.errorLog.logEntries(response.errors);
    else
      this.refs.successLog.logEntries([response.body]);

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
            <Log ref = "successLog" />
            <Log errorLog ref = "errorLog" />
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
      </div>
    );
  }
}

export default LoginDisplay;
