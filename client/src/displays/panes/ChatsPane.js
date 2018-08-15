import React, {Component} from 'react';

import Fetcher from '../componentModules/Fetcher';
import FormInput from '../components/FormInput';
import ColumnSelector from '../components/ColumnSelector';
import ButtonBar from '../components/ButtonBar';
import Logger from '../components/Logger';


/**
 * Pane Component For Displaying Conversation Settings.
 * @extends Component
 *
 * @author Chatham Abate
 */
class ChatsPane extends Component {

  /**
   * Constructor.
   */
  constructor() {
    super();

    this._mounted = false;
  }


  /**
   * Life Cycle Method.
   */
  componentDidMount() {
    this._mounted = true;

    this.refresh();
    this.props.setRefresh(this.refresh.bind(this))
  }


  /**
   * Life cycle method.
   */
  componentWillUnmount() {
    this._mounted = false;
  }


  /**
   * Refresh the Display.
   */
  refresh() {
    let body = {
      validationKey : this.props.validationKey(),
      withUsers : true
    };

    // Refresh teh conversations column.
    Fetcher.fetchJSON("/api/conversationMap", body,
      (json) => {
        if(this._mounted)
          this.refs.chat.setItems(json.body);
        });

    // Refresh the Users Column.
    Fetcher.fetchJSON("/api/usersArray", {},
      (json) => {
        if(this._mounted)
          this.refs.user.setItems(json.body);
      });
  }


  /**
   * Reset the Form.
   */
  resetForm() {
    // Un flag and Clear all Fields.
    this.refs.conversationName.unflagAndClear();
    this.refs.conversationKey.unflagAndClear();
    this.refs.username.unflagAndClear();

    // Untoggle both selection columns.
    this.refs.chat.untoggle();
    this.refs.user.untoggle();
  }


  /**
   * Submit a solo action to the server.
   * This is a request which only modifies the
   * Client's profile for a specfic Conversation.
   * Hence why no other jUser's username is required.

   * @param  {string} url
   *  The Url tosubmit the form to.
   */
  preformSoloAction(url) {
    if(this.refs.conversationName.flag() && this.refs.conversationKey.flag())
      return;

    let body = {
      validationKey : this.props.validationKey(),
      conversationKey : this.refs.conversationKey.value
    }

    // Submit the request.
    Fetcher.fetchJSON(url, body, (json) => {
      if(json.errors.length !== 0)
        this.refs.exitErrorLog.logErrors(json.errors);
      else {
        this.resetForm();
        this.refs.exitErrorLog.success();
      }
    });
  }


  /**
   * Submit a request to the server in hopes of modifying
   * another User's status within a specific Conversation.
   * Ex. Removing, Adding, or Promoting a User.
   *
   * @param  {string} url
   *  The Url to submit the request to.
   */
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

    // Submit the request.
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


  /**
   * Select a Conversation.
   * This function is intended to be used as the onClick function
   *  for the Conversation selection Coloumn.
   *
   * @param  {string} code
   *  The COnversation Key of the selected Conversation.
   */
  selectChat(code) {
    this.refs.conversationKey.value = code;
    this.refs.conversationName.value = this.refs.chat.items[code].name;
  }


  /**
   * Check if a Conversation is Public.
   *
   * @param  {string} key
   *  The Conversation KEy of the Conversation to check.
   */
  checkChat(key) {
    return this.refs.chat.items[key].isPublic;
  }


  /**
   * Select a User.
   * Similair to selectChat, this function
   * is also intended to be used as an onClick Event.
   *
   * @param  {string} user
   *  The name of the User.
   */
  selectUser(user) {
    this.refs.username.value = user;
  }


  /**
   * Check if a User is a member of the selected Conversation.
   *
   * @param  {string} user
   *  The User's username.
   *
   * @return {boolean}
   *  Whether or not the given User is a member of the selected Conversation.
   */
  checkUser(user) {
    let code = this.refs.chat.selection;

    if(code in this.refs.chat.items)
      return this.refs.chat.items[code].users.includes(user);

    return false;
  }


  /**
   * Check if a User is an owner of teh selected Conversation.
   *
   * @param  {string} user
   *  The username of the User.
   *
   * @return {boolean}
   *  Whether or not the User is an owner of the selected Conversation.
   */
  checkOwner(user) {
    let code = this.refs.chat.selection;

    if(code in this.refs.chat.items)
      return this.refs.chat.items[code].owners.includes(user);

    return false;
  }


  /**
   * Life Cycle Method for Rendering.
   */
  render() {
    return (
      <div className = "flexible flexDisplay">
        <ColumnSelector toggleable labeled secondary mutable
          ref = "chat"
          check = {this.checkChat.bind(this)}
          handleClick = {this.selectChat.bind(this)} />
        <ColumnSelector toggleable mutable
          ref = "user"
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
            actions = {{
              "Exit" : "/api/exitConversation",
              "Terminate" : "/api/terminateConversation"
            }} />
          <Logger ref = "exitErrorLog" success = "Action Completed" />
          <FormInput ref = "username"
            placeholder = "Username"
            type = "text"
            readOnly />
          <ButtonBar attempt = {this.preformAction.bind(this)}
            actions = {{
              "Add" : "/api/addUser",
              "Remove" : "/api/removeUser",
              "Promote" : "/api/promoteUser"
            }} />
          <Logger ref = "mainLog" success = "Action Completed" />
        </div>
      </div>
    );
  }
}

export default ChatsPane;
