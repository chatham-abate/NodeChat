import React, {Component} from 'react';
import Fetcher from '../componentModules/Fetcher';
import Message from '../components/Message';

class AddressPane extends Component {
  constructor() {
    super();

    this.state = {
      address : "",
      messages : [],
      startIndex : null
    };
  }

  componentDidMount() {
    // this.switchAddress(this.props.initialAddress);
  }

  switchAddress(address) {
    this.setState({address : address, startIndex : null}, () =>
      this.loadHistory(true));
  }

  loadHistory(scroll) {
    let body = {
      validationKey : this.props.validationKey(),
      endIndex : this.state.startIndex,
      conversationKey : this.state.address
    };

    let callback = scroll ? this.scrollToBottom.bind(this) : (() => {});

    Fetcher.fetchJSON("/api/loadConversation", body,
      json => this.setState(json.body, callback));
  }

  update() {
    if(this.state.address === "")
      return;

    let body = {
      validationKey : this.props.validationKey(),
      conversationKey : this.state.address
    };

    Fetcher.fetchJSON("/api/readConversation", body, this.parseUpdate.bind(this));
  }

  parseUpdate(response) {
    if(response.errors.length > 0) {
      this.setState({address : "", messages : []});
      return;
    }

    if(response.body.length === 0)
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
      text : this.refs.message.value,
      conversationKey : this.state.address
    };

    this.refs.message.value = "";

    Fetcher.fetchJSON("/api/sendToConversation", body, this.handleResponse.bind(this));
  }

  handleResponse(response) {
    // @TODO
  }

  handleKeyPress(e) {
    if(e.charCode === 13) {
      e.preventDefault();

      if(this.refs.message.value.length > 0)
        this.deliver();
    }
  }

  render() {

    if(this.state.address === "")
      return (
        <div className = "flexible screenSaver">
          Select a Conversation
        </div>
      );

    let messageLoader = this.state.startIndex === 0
      ? (<div className = "padded"> All Messages Loaded </div>)
      : (<div className = "clickable button"
          onClick = {() => this.loadHistory(false)}>
          Load Old Messages </div>);

    return (
      <div className = "flexible flexDisplay columnFlex">
        <div className = "chatPane">
          {messageLoader}
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
              className = "highlyFlexible clickable padded" />
            <div className = "color-secondary-1-4 clickable button"
              onClick = {this.deliver.bind(this)}>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddressPane;
