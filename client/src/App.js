import React, { Component } from 'react';

import LoginDisplay from './displays/LoginDisplay';
import NewUserDisplay from './displays/NewUserDisplay';
import ChatDisplay from './displays/ChatDisplay';
import SettingsDisplay from './displays/SettingsDisplay';

import './componentStyles/genericStyles.css';
import './componentStyles/inputStyles.css';
import './componentStyles/chatStyles.css';
import './componentStyles/colors.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      validationKey : "",
      currentUsername : "",
      currentDisplay : "",
      displays : {}
    };
  }


  /**
   * Get the Default Settings Display Component.
   * @return {SettingsDisplay}
   *  The Component.
   */
  get settingsDisplay() {
    return (
      <SettingsDisplay
        locations = {{
          "Chat Menu" : "chat",
          "Log Out" : "login"
        }}
        switchDisplay = {this.switchDisplay.bind(this)}
        validationKey = {this.validationKey.bind(this)} />
    );
  }


  /**
   * Get the Default Login Display Component.
   * @return {LoginDisplay}
   *  The Component.
   */
  get loginDisplay() {
    return (
      <LoginDisplay
        switchDisplay = {this.switchDisplay.bind(this)}
        setUsername = {this.setUsername.bind(this)}
        validate = {this.validate.bind(this)} />
    );
  }


  /**
   * Get the Default Chat Display Component.
   * @return {ChatDisplay}
   *  The Component.
   */
  get chatDisplay() {
    return (
      <ChatDisplay
        locations = {{
          "Settings" : "settings",
          "Log Out" : "login"
        }}
        switchDisplay = {this.switchDisplay.bind(this)}
        username = {this.username.bind(this)}
        validationKey = {this.validationKey.bind(this)}
        initialAddress = "~" />
    );
  }


  /**
   * Get the Default New User Display Component.
   * @return {NewUserDisplay}
   *  The Component.
   */
  get newUserDisplay() {
    return (
      <NewUserDisplay
        switchDisplay = {this.switchDisplay.bind(this)} />
    );
  }


  /**
   * Life Cycle Method.
   */
  componentDidMount() {
    this.setState({
      displays : {
        "login" : this.loginDisplay,
        "newUser" : this.newUserDisplay,
        "chat" : this.chatDisplay,
        "settings" : this.settingsDisplay
      },
      currentDisplay : "login"
    });
  }


  /**
   * Switch The Display.
   *
   * @param  {string} displayName
   *  The name of the Display.
   */
  switchDisplay(displayName) {
    if(displayName in this.state.displays)
      this.setState({currentDisplay : displayName});
  }


  /**
   * Set the App's Validation Key.
   *
   * @param  {string} validationKey
   *  The Validation Key.
   */
  validate(validationKey) {
    this.setState({validationKey : validationKey});
  }


  /**
   * Get the App's current Validation Key.
   *
   * @return {string}
   *  The Validation Key.
   */
  validationKey() {
    return this.state.validationKey;
  }


  /**
   * Set the App's current Username.
   *
   * @param {string} username
   *  The username.
   */
  setUsername(username) {
    this.setState({username : username});
  }


  /**
   * Get the App's current Username.
   *
   * @return {string}
   *  The username.
   */
  username() {
    return this.state.username;
  }


  /**
   * Life Cycle for Rendering.
   */
  render() {
    if(this.state.currentDisplay === "")
      return (<div> loading... </div>);

    return this.state.displays[this.state.currentDisplay];
  }
}

export default App;
