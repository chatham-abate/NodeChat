import React, {Component} from 'react';

class Message extends Component {


  render() {


    let messageClass =
      this.props.authored
        ? "authored message" : "default message";

    return (
      <div className = "messageContainer">
        <span className = {messageClass}>
          <b>{this.props.message.sender}</b>
          <div className = "messageBulk">{this.props.message.text}</div>
        </span>
      </div>
    );
  }
}

export default Message;
