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
    let body = {
      validationKey : this.props.validationKey(),
      withUsers : false
    };

    Fetcher.fetchJSON("/api/conversationMap", body,
      json => this.setState({conversations : json.body}));
  }

  switchAddress(address) {
    this.props.switchAddress(address);
    this.setState({toggledConversation : address});
  }

  render() {
    return (
      <div className = "color-primary-4 column">
        <div ref = "settingsButton"
          className = "clickable button"
          onClick = {() => this.props.switchDisplay("settings")}>
          Settings
        </div>
        {Object.keys(this.state.conversations).map((conversationKey) => {
          let conversation = this.state.conversations[conversationKey];
          let convoClass = "clickable button" +
            (conversation.unreadLength > 0 ? " unread" : "");

          if(this.state.toggledConversation === conversationKey)
            convoClass += " toggled";
          else
            convoClass += (conversation.isPublic
              ? " color-secondary-2-4"
              : " color-secondary-1-4");

          return (
            <div key = {conversationKey}
              onClick = {() => this.switchAddress(conversationKey)}
              className = {convoClass}>
              {conversation.name}
            </div>
          );
        })}
      </div>
    );
  }
}

export default UserColumn;
