import React, {Component} from 'react';
import FormInput from '../components/FormInput';
import Logger from '../components/Logger';
import Fetcher from '../componentModules/Fetcher';
import ColumnSelector from '../components/ColumnSelector';

class JoinPane extends Component {

  constructor() {
    super();

    this.state = {
      publics : {}
    };
  }

  componentDidMount() {
    this.refresh();
    this.props.setRefresh(this.refresh.bind(this));
  }

  refresh() {
    let body = {
      validationKey : this.props.validationKey(),
      withUsers : false
    };

    Fetcher.fetchJSON("/api/publicConversationMap", body,
      (json) => this.setState({publics : json.body}));
  }

  attemptJoin() {
    if(this.refs.conversationCode.flag())
      return;

    let body = {
      validationKey : this.props.validationKey(),
      conversationKey : this.refs.conversationCode.value
    };

    Fetcher.fetchJSON("/api/joinConversation", body, this.parseResponse.bind(this));

    this.resetPane();
  }

  parseResponse(json) {
    this.refs.log.logResponse(json);
  }

  resetPane() {
    this.refs.log.clear();
    this.refs.conversationCode.unflagAndClear();
  }

  check(code) {
    return this.state.publics[code].joined;
  }

  selectChat(code) {
    this.refs.conversationCode.value = code;
  }

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
