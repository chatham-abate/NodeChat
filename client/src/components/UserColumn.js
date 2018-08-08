import React, { Component } from 'react';
import Fetcher from './componentModules/Fetcher';

class UserColumn extends Component {

  constructor() {
    super();

    this.state = {
      conversations : {}
    };
  }

  componentDidMount() {
    this.update();
  }

  update() {
    Fetcher.fetchJSON("/api/conversationMap",
      {validationKey : this.props.validationKey()},
      json => this.setState({conversations : json.body}));
  }

  render() {

    return (
      <div className = "color-primary-4 userColumn">
        {Object.keys(this.state.conversations).map((conversationKey) => {
          return (
            <div key = {conversationKey}
              onClick = {() => this.props.switchAddress(conversationKey)}
              className = {"clickable button " +
                (this.state.conversations[conversationKey].unreadLength > 0 ? "unread" : "") }>
              {this.state.conversations[conversationKey].name}
            </div>
          );
        })}
      </div>
    );
  }
}

export default UserColumn;
