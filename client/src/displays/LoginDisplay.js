import React, { Component } from 'react';

import Logger from './components/Logger';
import FormInput from './components/FormInput';
import Fetcher from './componentModules/Fetcher';

/**
 * React Component for Logging into the Server.
 * Inteded Use as Full Screen Display.
 * @extends Component
 *
 * @author Chatham Abate
 */
class LoginDisplay extends Component {

  constructor() {
    super();

    this.state = {
      pendingUsername : "",
      waiting : false
    };
  }

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

    if(flaggedUsername || flaggedPassword || this.state.waiting)
      return;

    this.setState({pendingUsername : username.value, waiting : true});

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
    this.setState({waiting : false});

    // Clear the Form upon recieving the response.
    this.clearForm();

    // Check for errors.
    if(response.errors.length !== 0)
      this.refs.log.logErrors(response.errors);
    else {
      // Store the Validation Key.
      this.props.validate(response.body);
      this.props.setUsername(this.state.pendingUsername);
      this.props.switchDisplay("chat");
    }
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
            <Logger ref = "log" success = "Logging In" />
            <div className = "flexDisplay">
              <span
                className = "clickable button"
                onClick = {this.submitForm.bind(this)}>
                Login
              </span>
              <span
                className = "clickable button"
                onClick = {() => this.props.switchDisplay("newUser")}>
                New User
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginDisplay;
