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
      { validationKey : this.props.validationKey() },
      userMap =>
      {
        this.setState({users : userMap})
        console.log(userMap);
      });
  }

  handleClick(username) {

  }

  render() {
    return (
      <div className = "userColumn">
        {Object.keys(this.state.users).map((username) => {
          let tag = (<b className = "tag">
            {this.state.users[username] > 0 ? this.state.users[username] : ""}
          </b>);

          return (
            <div key = {username}
              onClick = {() => this.handleClick(username)}
              className = "clickable button">
              {username} {tag}
            </div>
          );
        })}
      </div>
    );
  }
}

export default UserColumn;
