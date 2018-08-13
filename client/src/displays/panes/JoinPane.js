import React, {Component} from 'react';
import FormInput from '../components/FormInput';
import Logger from '../components/Logger';
import Fetcher from '../componentModules/Fetcher';
import ColumnSelector from '../components/ColumnSelector';

/**
 * Pane Component For Joining Public Conversations.
 * @extends Component
 *
 * @author Chatham Abate
 */
class JoinPane extends Component {

  /**
   * Constructor.
   */
  constructor() {
    super();

    this.state = {
      publics : {}
    };

    this._mounted = false;
  }


  /**
   * Life Cycle Method.
   */
  componentDidMount() {
    this._mounted = true;

    this.refresh();
    this.props.setRefresh(this.refresh.bind(this));
  }

  componentWillUnmount() {
    this._mounted = false;
  }


  /**
   * Refresh the Public conversations selection menu.
   */
  refresh() {
    let body = {
      validationKey : this.props.validationKey(),
      withUsers : false
    };

    // Fetch the Data.
    Fetcher.fetchJSON("/api/publicConversationMap", body,
      (json) => {
        if(this._mounted)
          this.setState({publics : json.body});
      });
  }


  /**
   * Attempt to join a Conversation.
   */
  attemptJoin() {
    // Check conversation code.
    if(this.refs.conversationCode.flag())
      return;

    let body = {
      validationKey : this.props.validationKey(),
      conversationKey : this.refs.conversationCode.value
    };

    // Submit.
    Fetcher.fetchJSON("/api/joinConversation", body, this.parseResponse.bind(this));

    // Reset the Pane.
    this.resetPane();
  }


  /**
   * Parse a join Response.
   *
   * @param  {Object} json
   *  The response.
   */
  parseResponse(json) {
    this.refs.log.logResponse(json);
  }


  /**
   * Reset the Form.
   */
  resetPane() {
    this.refs.log.clear();
    this.refs.conversationCode.unflagAndClear();
  }


  /**
   * Check if the User has already joined a conversation.
   *
   * @param  {string} code
   *  The Conversation's Conversation Key.
   */
  check(code) {
    return this.state.publics[code].joined;
  }


  /**
   * Select a Conversation.
   *
   * @param  {string} code
   *  The conversation Key of the Conversation.
   */
  selectChat(code) {
    this.refs.conversationCode.value = code;
  }


  /**
   * Life Cycle method for Rendering.
   */
  render() {
    return (
      <div className = "flexible flexDisplay">
        <ColumnSelector labeled
          items = {this.state.publics}
          check = {this.check.bind(this)}
          handleClick = {this.selectChat.bind(this)} />

        <div className = "flexible">
          <FormInput
            ref = "conversationCode"
            type = "text"
            attempt = {this.attemptJoin.bind(this)}
            placeholder = "Public Conversation Code" />

            <div className = "flexDisplay">
              <span className = "clickable button"
                onClick = {this.attemptJoin.bind(this)}>
                Join
              </span>
            </div>

            <Logger ref = "log" success = "Conversation Joined" />
        </div>
      </div>
    );
  }
}

export default JoinPane;
