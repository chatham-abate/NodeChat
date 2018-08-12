import React, {Component} from 'react';

import Fetcher from '../componentModules/Fetcher';
import FormInput from '../components/FormInput';
import ColumnSelector from '../components/ColumnSelector';
import ButtonBar from '../components/ButtonBar';
import Logger from '../components/Logger';

class ChatsPane extends Component {

  constructor() {
    super();

    this.state = {
      conversations : {},
      users : [],
      soloActions : {
        "Exit" : "/api/exitConversation",
        "Terminate" : "/api/terminateConversation"
      },
      actions : {
        "Add" : "/api/addUser",
        "Remove" : "/api/removeUser",
        "Promote" : "/api/promoteUser"
      }
    };
  }

  componentDidMount() {
    this.refresh();
    this.props.setRefresh(this.refresh.bind(this))
  }

  refresh() {
    let body = {
      validationKey : this.props.validationKey(),
      withUsers : true
    };

    Fetcher.fetchJSON("/api/conversationMap", body,
      (json) => this.setState({conversations : json.body}));

    Fetcher.fetchJSON("/api/usersArray", {},
      (json) => this.setState({users : json.body}));
  }

  resetForm() {
    this.refs.conversationName.unflagAndClear();
    this.refs.conversationKey.unflagAndClear();
    this.refs.username.unflagAndClear();

    this.refs.chat.untoggle();
    this.refs.user.untoggle();
  }

  preformSoloAction(url) {
    if(this.refs.conversationName.flag() && this.refs.conversationKey.flag())
      return;

    let body = {
      validationKey : this.props.validationKey(),
      conversationKey : this.refs.conversationKey.value
    }

    Fetcher.fetchJSON(url, body, (json) => {
      if(json.errors.length !== 0)
        this.refs.exitErrorLog.logErrors(json.errors);
      else {
        this.resetForm();
        this.refs.mainLog.success();
      }
    });
  }

  preformAction(url) {
    let chatFlag =
      this.refs.conversationName.flag() && this.refs.conversationKey.flag();
    let userFlag = this.refs.username.flag();

    if(chatFlag || userFlag)
      return;

    let body = {
      validationKey : this.props.validationKey(),
      conversationKey : this.refs.conversationKey.value,
      username : this.refs.username.value
    };

    Fetcher.fetchJSON(url, body, (json) => {
      if(json.errors.length !== 0)
        this.refs.mainLog.logErrors(json.errors);
      else {
        this.refs.username.unflagAndClear();
        this.refs.user.untoggle();
        this.refs.mainLog.success();
      }
    });
  }

  selectChat(code) {
    this.refs.conversationKey.value = code;
    this.refs.conversationName.value = this.state.conversations[code].name;
  }

  checkChat(key) {
    return this.state.conversations[key].isPublic;
  }

  selectUser(user) {
    this.refs.username.value = user;
  }

  checkUser(user) {
    let code = this.refs.chat.selection;

    if(code in this.state.conversations)
      return this.state.conversations[code].users.includes(user);

    return false;
  }

  checkOwner(user) {
    let code = this.refs.chat.selection;

    if(code in this.state.conversations)
      return this.state.conversations[code].owners.includes(user);

    return false;
  }

  render() {
    return (
      <div className = "flexible flexDisplay">
        <ColumnSelector toggleable labeled secondary
          ref = "chat"
          check = {this.checkChat.bind(this)}
          handleClick = {this.selectChat.bind(this)}
          items = {this.state.conversations} />
        <ColumnSelector toggleable
          ref = "user"
          items = {this.state.users}
          handleClick = {this.selectUser.bind(this)}
          checkFlag = {this.checkOwner.bind(this)}
          check = {this.checkUser.bind(this)} />
        <div className =  "flexible">
          <FormInput ref = "conversationName"
            placeholder = "Conversation Name"
            type = "text"
            readOnly />
          <FormInput ref = "conversationKey"
            placeholder = "Conversation Key"
            type = "text"
            readOnly />
          <ButtonBar attempt = {this.preformSoloAction.bind(this)}
            actions = {this.state.soloActions} />
          <Logger ref = "exitErrorLog" />
          <br />
          <br />
          <FormInput ref = "username"
            placeholder = "Username"
            type = "text"
            readOnly />
          <ButtonBar attempt = {this.preformAction.bind(this)}
            actions = {this.state.actions} />
          <Logger ref = "mainLog" success = "Action Completed" />
        </div>
      </div>
    );
  }
}

export default ChatsPane;
