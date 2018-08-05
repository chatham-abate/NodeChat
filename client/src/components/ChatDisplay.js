import React, { Component } from 'react';

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
          <div className = "flexDisplay columnFlex messagePane">
            <div className = "clickable button inflexible">Hello</div>
            <textarea className = "flexible clickable padded" />
          </div>
        </div>
        <div className = "userColumn">
          User Column
        </div>
      </div>
    );
  }
}

export default ChatDisplay;
