import React, {Component} from 'react';

class Message extends Component {
  constructor() {
    super();

    this.state = {
      expanded : false
    }
  }

  render() {
    let messageClass = "clickable bordered message";
    let sender = null;

    if(this.props.message.sender === "~")
      messageClass += " centered";
    else {
      messageClass += (this.props.authored
        ? " color-secondary-2-4 authored"
        : " color-secondary-1-4");

      sender = (<b>{this.props.message.sender}</b>)
    }

    let expansion = this.state.expanded
      ? (<b> {this.props.message.date} </b>) : null;

    return (
      <div className = "messageContainer">
        <span className = {messageClass}
          onClick = {() => this.setState({expanded : !this.state.expanded})}>
          {sender}
          <div className = "messageBulk">
            {this.props.message.text}
          </div>
          {expansion}
        </span>
      </div>
    );
  }
}

export default Message;
