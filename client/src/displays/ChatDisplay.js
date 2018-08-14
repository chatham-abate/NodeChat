import React, { Component } from 'react';

import AddressPane from './panes/AddressPane';
import ColumnSelector from './components/ColumnSelector';
import Fetcher from './componentModules/Fetcher';
import TitleBar from './components/TitleBar';

/**
 * Display for viewing and sending messages to Conversations.
 * @extends Component
 *
 * @author Chatham Abate
 */
class ChatDisplay extends Component {

  /**
   * Constructor.
   */
  constructor() {
    super();

    this.state = {
      timerID : null
    };

    this._mounted = false;
  }


  /**
   * Life Cycle Method.
   */
  componentDidMount() {
    this._mounted = true;

    // Fetch conversations.
    this.fetchConversations();

    // Then start timer.
    let timerID = setInterval(this.tick.bind(this), 1000);
    this.setState({timerID : timerID});
  }


  /**
   * Life Cycle Method.
   */
  componentWillUnmount() {
    // Clear the Timer.
    clearInterval(this.state.timerID);

    this._mounted = false;
  }


  /**
   * Switch the Address of the Conversation being displayed.
   *
   * @param  {string} address
   *  The Conversation Key of the Conversation to display.
   */
  switchAddress(address) {
    this.refs.addressPane.switchAddress(address);
  }


  /**
   * Check if a Conversation is Public.
   *
   * @param  {string} address
   *  The Conversation Key of the Conversation.
   *
   * @return {boolean}
   *  If the Conversation if public.
   */
  checkAddress(address) {
    return this.refs.chats.items[address].isPublic;
  }


  /**
   * Check if a Conversation has unread messages.
   *
   * @param  {string} address
   *  The Conversation Key of the Conversation to check.
   *
   * @return {boolean}
   *  If the Conversation has unread messages.
   */
  checkUnread(address) {
    return this.refs.chats.items[address].unread;
  }


  /**
   * Fetch Conversation Data from the server.
   */
  fetchConversations() {
    let body = {
      validationKey : this.props.validationKey(),
      withUsers : false
    };

    // Make sure Column has not unmounted.
    Fetcher.fetchJSON("/api/conversationMap", body,
      json => {
        if(this._mounted)
          this.refs.chats.setItems(json.body);
      });
  }


  /**
   * Update the Conversation Pane, and Fetch the Conversations.
   */
  tick() {
    this.refs.addressPane.update();
    this.fetchConversations();
  }


  /**
   * Life Cycle Method for rendering.
   */
  render() {
    return (
      <div className = "mainBlock flexDisplay">
        <div className = "flexible color-primary-4 applet flexDisplay columnFlex">
          <TitleBar title = {this.props.username()}
            addresses = {this.props.locations}
            switchDisplay = {this.props.switchDisplay} />
          <div className = "flexible flexDisplay">
            <ColumnSelector labeled secondary toggleable mutable
              ref = "chats"
              handleClick = {this.switchAddress.bind(this)}
              check = {this.checkAddress.bind(this)}
              checkFlag = {this.checkUnread.bind(this)} />
            <AddressPane ref = "addressPane"
              username = {this.props.username}
              initialAddress = {this.props.initialAddress}
              validationKey = {this.props.validationKey} />
          </div>
        </div>
      </div>
    );
  }
}

export default ChatDisplay;
