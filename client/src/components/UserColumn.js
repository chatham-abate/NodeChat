import React, { Component } from 'react';
import Fetcher from './componentModules/Fetcher';

class UserColumn extends Component {

  constructor() {
    super();

    this.state = {
      users : {}
    };
  }

  componentDidMount() {
    this.update();
  }

  update() {
    Fetcher.fetchJSON("/api/getUserMap",
      {validationKey : this.props.validationKey()},
      json => this.setState({users : json.body}));
  }

  render() {
    return (
      <div className = "color-primary-4 userColumn">
        {Object.keys(this.state.users).map((username) => {
          return (
            <div key = {username}
              onClick = {() => this.props.switchAddress(username)}
              className = {"clickable button " +
                (this.state.users[username] > 0 ? "unread" : "") }>
              {username}
            </div>
          );
        })}
      </div>
    );
  }
}

export default UserColumn;
