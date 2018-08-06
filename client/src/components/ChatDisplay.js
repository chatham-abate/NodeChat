import React, { Component } from 'react';
import UserColumn from './UserColumn';

class ChatDisplay extends Component {


  coponentDidMount() {

  }

  sendMessage() {

  }

  sendDirectMessage() {

  }

  render() {
    return (
      <div className = "mainBlock flexDisplay">
        <div className = "flexible flexDisplay columnFlex">
          <div className = "chatPane">
          </div>
          <div className = "flexDisplay messagePane">
            <textarea className = "flexible clickable padded" />
          </div>
        </div>
        <UserColumn validationKey = {this.props.validationKey} />
      </div>
    );
  }
}

export default ChatDisplay;
