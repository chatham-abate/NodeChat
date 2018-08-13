import React, {Component} from 'react';

import Fetcher from '../componentModules/Fetcher';
import Message from '../components/Message';
import Logger from '../components/Logger';

/**
 * Pane Component for submiting and reading messages froma Conversation.
 * @extends Component
 *
 * @author Chatham Abate
 */
class AddressPane extends Component {

  /**
   * Constructor.
   */
  constructor() {
    super();

    this.state = {
      address : "",
      messages : [],
      startIndex : null
    };
  }


  /**
   * Switch the address of the Pane.
   * The Address is the Conversation Key
   * of the Conversation being both read and sent to from this Pane.
   *
   * @param  {string} Address
   *  The Conversation Key of the Conversation to switch to.
   */
  switchAddress(address) {
    this.setState({address : address, startIndex : null}, () =>
      this.loadHistory(null, true));
  }


  /**
   * Load a Conversations History.
   *
   * @param  {boolean} scroll
   *  Whether or not to scroll to the bottom after the history has been loaded.
   */
  loadHistory(startIndex, scroll) {
    let body = {
      validationKey : this.props.validationKey(),
      startIndex : startIndex,
      conversationKey : this.state.address
    };

    // Set Scroll Callback.
    let callback = scroll ? this.scrollToBottom.bind(this) : (() => {});

    // Submit the Load Request.
    Fetcher.fetchJSON("/api/loadConversation", body,
      json => {
        console.log(json);
        this.setState(json.body, callback);
      });

  }


  /**
   * Update the Pane.
   * i.e. retrieve all unread messages from the Pane's address/Conversation Key.
   */
  update() {
    // Check if the Pane even has an Address.
    if(this.state.address === "")
      return;

    let body = {
      validationKey : this.props.validationKey(),
      conversationKey : this.state.address
    };

    // Read the messages.
    Fetcher.fetchJSON("/api/readConversation", body, this.parseUpdate.bind(this));
  }


  /**
   * Parse the Pane's update responses from the server.
   *
   * @param  {ServerResponse} response
   *  A Server Response returned from a
   *  readConversation request submitted to the server.
   */
  parseUpdate(response) {
    // Check for Errors.
    if(response.errors.length > 0) {
      this.setState({address : "", messages : []});
      return;
    }

    if(response.body.length === 0)
      return;

    let messageArray = response.body;
    let newUpdate = this.state.messages;

    for(let newMwssage of messageArray)
      newUpdate.push(newMwssage);

    // Display the new messages.
    this.setState({messages : newUpdate}, this.scrollToBottom);
  }


  /**
   * Scroll to the most recent messages (the bottom of the chat pane).
   */
  scrollToBottom() {
    this.refs.bottom.scrollIntoView({behavior : "smooth"});
  }


  /**
   * Send a message to the Server.
   */
  deliver() {
    let body = {
      validationKey : this.props.validationKey(),
      text : this.refs.message.value,
      conversationKey : this.state.address
    };

    // Clear the message field
    this.refs.message.value = "";

    // Send the request.
    Fetcher.fetchJSON("/api/sendToConversation", body, this.handleResponse.bind(this));
  }


  /**
   * Parse a ServerResponse from sending a Message to teh server.
   *
   * @param  {ServerResponse} response
   *  The Response.
   */
  handleResponse(response) {
    if(response.errors.length !== 0)
      this.refs.errorLog.logErrors(response.errors);
  }


  /**
   * Handle Key Press Events from the Message TextArea.
   * Basically, deliver the message when ENTER is hit,
   * otherwise, don't do anything special.
   *
   * @param  {KeyEvent} e
   *  The Event.
   */
  handleKeyPress(e) {
    if(e.charCode === 13) {
      e.preventDefault();

      if(this.refs.message.value.length > 0)
        this.deliver();
    }
  }


  /**
   * Life Cycle Method for Rendering.
   */
  render() {
    // Only Render Pane if it has an Address.
    if(this.state.address === "")
      return (
        <div className = "flexible screenSaver">
          Select a Conversation
        </div>
      );

    let messageLoader = this.state.startIndex === 0
      ? (<div className = "padded"> All Messages Loaded </div>)
      : (<div className = "clickable button"
          onClick = {() => this.loadHistory(this.state.startIndex - 1, false)}>
          Load Old Messages </div>);

    return (
      <div className = "flexible flexDisplay columnFlex">
        <div className = "chatPane">
          {messageLoader}
          {this.state.messages.map((message, index) =>
            (<Message
              key = {index}
              authored = {message.sender === this.props.username()}
              message = {message} />)
          )}
          <div ref = "bottom"> </div>
        </div>
        <Logger ref = "errorLog" />
        <div className = "padded">
          <div className = "flexDisplay messagePane bordered">
            <textarea
              ref = "message"
              onKeyPress = {this.handleKeyPress.bind(this)}
              className = "highlyFlexible clickable padded" />
            <div className = "color-secondary-1-4 clickable button"
              onClick = {this.deliver.bind(this)}>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddressPane;
