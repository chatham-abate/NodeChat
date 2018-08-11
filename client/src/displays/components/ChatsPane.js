import React, {Component} from 'react';
import Fetcher from '../componentModules/Fetcher';
import FormInput from './FormInput';
import ColumnSelector from './ColumnSelector';
import Logger from './Logger';

class ChatsPane extends Component {

  constructor() {
    super();

    this.state = {
      conversations : {},
      users : [],
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

  exitConversation() {
    if(this.refs.conversationKey.flag() && this.refs.conversationName.flag())
      return;

    let body = {
      validationKey : this.props.validationKey(),
      conversationKey : this.refs.conversationKey.value
    };

    Fetcher.fetchJSON("/api/exitConversation", body, (json) => {
      if(json.errors.length !== 0)
        this.refs.exitErrorLog.logErrors(json.errors);
      else {
        this.resetForm();
        this.refs.mainLog.success();
      }
    })
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
          <div className = "clickable button"
            onClick = {this.exitConversation.bind(this)}>
            Exit Conversation
          </div>
          <Logger ref = "exitErrorLog" />
          <br />
          <FormInput ref = "username"
            placeholder = "Username"
            type = "text"
            readOnly />
          <div className = "flexDisplay">
            {Object.keys(this.state.actions).map((label) => (
              <div className = "clickable button" key = {label}
                onClick = {() => this.preformAction(this.state.actions[label])}>
                {label}
              </div>
            ))}
          </div>
          <Logger ref = "mainLog" success = "Action Completed" />
        </div>
      </div>
    );
  }
}

export default ChatsPane;
