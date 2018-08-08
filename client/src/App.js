import React, { Component } from 'react';

import LoginDisplay from './components/LoginDisplay';
import NewUserDisplay from './components/NewUserDisplay';
import ChatDisplay from './components/ChatDisplay';

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

  get loginDisplay() {
    return (<LoginDisplay
      switchDisplay = {this.switchDisplay.bind(this)}
      setUsername = {this.setUsername.bind(this)}
      validate = {this.validate.bind(this)} />);
  }

  get chatDisplay() {
    return (<ChatDisplay
      switchDisplay = {this.switchDisplay.bind(this)}
      username = {this.username.bind(this)}
      validationKey = {this.validationKey.bind(this)}
      initialAddress = "~" />);
  }

  get newUserDisplay() {
    return (<NewUserDisplay
      switchDisplay = {this.switchDisplay.bind(this)} />);
  }

  componentDidMount() {
    this.setState({displays : {
      "login" : this.loginDisplay,
      "newUser" : this.newUserDisplay,
      "chat" : this.chatDisplay
    }});

    this.setState({currentDisplay : "login"});
  }

  render() {
    if(this.state.currentDisplay === "")
      return (<div> loading... </div>);

    return this.state.displays[this.state.currentDisplay];
  }
}

export default App;
