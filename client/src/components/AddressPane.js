import React, {Component} from 'react';
import Fetcher from './componentModules/Fetcher';
import Message from './Message';

class AddressPane extends Component {
  constructor() {
    super();

    this.state = {
      address : "",
      messages : []
    };
  }

  switchAddress(address) {
    this.setState({address : address});
  }

  update() {
    let body = {
      validationKey : this.props.validationKey()
    };

    if(this.state.address !== "")
      body.participant = this.state.address;

    Fetcher.fetchJSON("/api/read", body, this.parseUpdate.bind(this));
  }

  parseUpdate(response) {
    if(response.body.length === 0 || response.errors.length > 0)
      return;

    let messageArray = response.body;
    let newUpdate = this.state.messages;

    for(let newMwssage of messageArray)
      newUpdate.push(newMwssage);

    this.setState({messages : newUpdate}, this.scrollToBottom);
  }

  scrollToBottom() {
    this.refs.bottom.scrollIntoView({behavior : "smooth"});
  }

  deliver() {
    let body = {
      validationKey : this.props.validationKey(),
      messageText : this.refs.message.value,
      messageDate : new Date()
    };

    this.refs.message.value = "";

    if(this.state.address !== "")
      body.recipientUsername = this.state.address;

    Fetcher.fetchJSON("/api/send", body, this.handleResponse.bind(this));
  }

  handleResponse(response) {
    console.log(response);
  }

  handleKeyPress(e) {
    if(e.charCode === 13) {
      e.preventDefault();

      if(this.refs.message.value.length > 0)
        this.deliver();
    }
  }

  render() {
    return (
      <div className = "color-secondary-2-4 flexible flexDisplay columnFlex">
        <div className = "chatPane">
          {this.state.messages.map((message, index) =>
            (<Message
              key = {index}
              authored = {message.sender === this.props.username()}
              message = {message} />))}
          <div ref = "bottom"> </div>
        </div>
        <div className = "padded">
          <div className = "flexDisplay messagePane bordered">
            <textarea
              ref = "message"
              onKeyPress = {this.handleKeyPress.bind(this)}
              className = "flexible clickable padded" />
          </div>
        </div>
      </div>
    );
  }
}

export default AddressPane;
