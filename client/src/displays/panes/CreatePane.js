import React, {Component} from 'react';
import FormInput from '../components/FormInput';
import Fetcher from '../componentModules/Fetcher';
import Logger from '../components/Logger';


/**
 * Pane Component for Creating Conversations.
 * @extends Component
 *
 * @author Chatham Abate
 */
class CreatePane extends Component {

  /**
   * Constructor.
   */
  constructor() {
    super();

    this.state = {
      options : ["Public", "Private"],
      toggled : "Public"
    };
  }


  /**
   * Life Cycle Method.
   */
  componentDidMount() {
    this.props.setRefresh(null);
  }


  /**
   * Submit a Create Conversation request to the server.
   */
  createConversation() {
    // Check the Conversation name.
    if(this.refs.conversationName.flag())
      return;

    this.refs.conversationName.unflag();

    let body = {
      validationKey : this.props.validationKey(),
      name : this.refs.conversationName.value,
      isPublic : (this.state.toggled === "Public")
    };

    // Submit the request.
    Fetcher.fetchJSON("/api/createConversation", body,
      this.parseResponse.bind(this));

    // Reset the Pane.
    this.resetPane();
  }


  /**
   * Reset the Pane.
   */
  resetPane() {
    this.refs.conversationName.unflagAndClear();
    this.refs.log.clear();
  }


  /**
   * Parse the server response.
   *
   * @param  {Object} json
   *  The Response.
   */
  parseResponse(json) {
    this.refs.log.logResponse(json);
  }


  /**
   * Life Cycle Methid for Rendering.
   */
  render() {
    return (
      <div className = "flexible flexDisplay">
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
