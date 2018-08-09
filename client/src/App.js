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

  get settingsDisplay() {
    return (
      <SettingsDisplay
        switchDisplay = {this.switchDisplay.bind(this)}
        validationKey = {this.validationKey.bind(this)} />
    );
  }

  get loginDisplay() {
    return (
      <LoginDisplay
        switchDisplay = {this.switchDisplay.bind(this)}
        setUsername = {this.setUsername.bind(this)}
        validate = {this.validate.bind(this)} />
    );
  }

  get chatDisplay() {
    return (
      <ChatDisplay
        switchDisplay = {this.switchDisplay.bind(this)}
        username = {this.username.bind(this)}
        validationKey = {this.validationKey.bind(this)}
        initialAddress = "~" />
    );
  }

  get newUserDisplay() {
    return (
      <NewUserDisplay
        switchDisplay = {this.switchDisplay.bind(this)} />
    );
  }

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

  switchDisplay(displayName) {
    if(displayName in this.state.displays)
      this.setState({currentDisplay : displayName});
  }

  validate(validationKey) {
    this.setState({validationKey : validationKey});
  }

  validationKey() {
    return this.state.validationKey;
  }

  setUsername(username) {
    this.setState({username : username});
  }

  username() {
    return this.state.username;
  }

  render() {
    if(this.state.currentDisplay === "")
      return (<div> loading... </div>);

    return this.state.displays[this.state.currentDisplay];
  }
}

export default App;
