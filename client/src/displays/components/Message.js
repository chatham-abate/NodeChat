import React, {Component} from 'react';

/**
 * Component For Displaying a Single Message.
 * @extends Component
 *
 * @author Chatham Abate
 */
class Message extends Component {

  /**
   * Constructor.
   */
  constructor() {
    super();

    this.state = {
      expanded : false
    }
  }


  /**
   * Life Cycle Method for Rendering.
   */
  render() {
    let messageClass = "clickable bordered message";
    let sender = null;

    // Determine Appearance of the Message.
    if(this.props.message.sender === "~")
      messageClass += " centered";
    else {
      messageClass += (this.props.authored
        ? " color-secondary-2-4 authored"
        : " color-secondary-1-4");

      sender = (<b>{this.props.message.sender}</b>)
    }

    // Determine if date should be displayed or not.
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
