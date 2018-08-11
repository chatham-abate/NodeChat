import React, { Component } from 'react';

import AddressPane from './panes/AddressPane';
import ColumnSelector from './components/ColumnSelector';
import Fetcher from './componentModules/Fetcher';
import TitleBar from './components/TitleBar';

class ChatDisplay extends Component {

  constructor() {
    super();

    this.state = {
      timerID : null,
      conversations : {},
      locations : {
        "Settings" : "settings",
        "Log Out" : "login"
      }
    };
  }

  componentDidMount() {
    this.fetchConversations();

    let timerID = setInterval(this.tick.bind(this), 1000);
    this.setState({timerID : timerID});
  }

  componentWillUnmount() {
    clearInterval(this.state.timerID);
  }

  switchAddress(address) {
    this.refs.addressPane.switchAddress(address);
  }

  checkAddress(address) {
    return this.state.conversations[address].isPublic;
  }

  checkUnread(address) {
    return this.state.conversations[address].unreadLength > 0;
  }

  fetchConversations() {
    let body = {
      validationKey : this.props.validationKey(),
      withUsers : false
    };

    Fetcher.fetchJSON("/api/conversationMap", body,
      json => this.setState({conversations : json.body}));
  }

  tick() {
    this.refs.addressPane.update();
    this.fetchConversations();
  }

  render() {
    return (
      <div className = "mainBlock flexDisplay">
        <div className = "flexible color-primary-4 applet flexDisplay columnFlex">
          <TitleBar title = "Chat Menu"
            addresses = {this.state.locations}
            switchDisplay = {this.props.switchDisplay} />
          <div className = "flexible flexDisplay">
            <ColumnSelector labeled secondary toggleable
              items = {this.state.conversations}
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
