import React, { Component } from 'react';
import Fetcher from '../componentModules/Fetcher';

class UserColumn extends Component {

  constructor() {
    super();

    this.state = {
      conversations : {},
      toggledConversation : ""
    };
  }

  componentDidMount() {
    this.setState(
      {toggledConversation : this.props.initialAddress}, this.update);
  }

  update() {
    Fetcher.fetchJSON("/api/conversationMap",
      {validationKey : this.props.validationKey()},
      json => this.setState({conversations : json.body}));
  }

  switchAddress(address) {
    this.props.switchAddress(address);
    this.setState({toggledConversation : address});
  }

  render() {
    return (
      <div className = "color-primary-4 fixedWidth">
        <div ref = "settingsButton"
          className = "clickable button"
          onClick = {() => this.props.switchDisplay("settings")}>
          Settings
        </div>
        {Object.keys(this.state.conversations).map((conversationKey) => {
          return (
            <div key = {conversationKey}
              onClick = {() => this.switchAddress(conversationKey)}
              className = {"clickable button" +
                (this.state.conversations[conversationKey].unreadLength > 0 ? " unread" : "") +
                (this.state.toggledConversation === conversationKey ? " toggled" : "")}>
              {this.state.conversations[conversationKey].name}
            </div>
          );
        })}
      </div>
    );
  }
}

export default UserColumn;
