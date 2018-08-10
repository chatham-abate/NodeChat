import React, {Component} from 'react';
import FormInput from './FormInput';
import Fetcher from '../componentModules/Fetcher';
import Logger from './Logger';

class CreatePane extends Component {

  constructor() {
    super();

    this.state = {
      options : ["Public", "Private"],
      toggled : "Public"
    };
  }

  componentDidMount() {
    this.props.setRefresh(null);
  }

  createConversation() {
    if(this.refs.conversationName.flag())
      return;

    this.refs.conversationName.unflag();

    let body = {
      validationKey : this.props.validationKey(),
      name : this.refs.conversationName.value,
      isPublic : (this.state.toggled === "Public")
    };

    Fetcher.fetchJSON("/api/createConversation", body,
      this.parseResponse.bind(this));

    this.resetPane();
  }

  resetPane() {
    this.refs.conversationName.unflagAndClear();
    this.refs.log.clear();
  }

  parseResponse(json) {
    this.refs.log.logResponse(json);
  }

  render() {
    return (
      <div className = "flexible flexDisplay color-primary-4">
        <div className = "flexible">
          <FormInput type = "text" placeholder = "Conversation Name"
            ref = "conversationName"
            attempt = {this.createConversation.bind(this)} />
          <div className = "flexDisplay">
            {this.state.options.map((option) => (
              <div className = {"flexible clickable button"
              + (option === this.state.toggled ? " toggled" : "")}
                onClick = {() => this.setState({toggled : option})}
                key = {option}>
                {option}
              </div>
            ))}
          </div>
          <div className = "clickable button"
            onClick = {this.createConversation.bind(this)}>
            Create
          </div>

          <Logger ref = "log" success = "Conversation Created" />
        </div>
      </div>
    );
  }
}

export default CreatePane;
