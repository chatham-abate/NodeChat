import React, { Component } from 'react';
import UserColumn from './components/UserColumn';
import AddressPane from './components/AddressPane';

class ChatDisplay extends Component {

  constructor() {
    super();

    this.state = {
      timerID : null
    };
  }

  componentDidMount() {
    let timerID = setInterval(this.tick.bind(this), 1000);

    this.setState({timerID : timerID});
  }

  componentWillUnmount() {
    clearInterval(this.state.timerID);
  }

  switchAddress(address) {
    this.refs.addressPane.switchAddress(address);
  }

  tick() {
    this.refs.userColumn.update();
    this.refs.addressPane.update();
  }

  render() {
    return (
      <div className = "mainBlock flexDisplay">
        <AddressPane ref = "addressPane"
          username = {this.props.username}
          initialAddress = {this.props.initialAddress}
          validationKey = {this.props.validationKey} />
        <UserColumn ref = "userColumn"
          switchDisplay = {this.props.switchDisplay}
          switchAddress = {this.switchAddress.bind(this)}
          initialAddress = {this.props.initialAddress}
          validationKey = {this.props.validationKey} />
      </div>
    );
  }
}

export default ChatDisplay;
