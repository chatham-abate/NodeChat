import React, {Component} from 'react';

import Fetcher from './componentModules/Fetcher';


class SettingsDisplay extends Component {

  constructor() {
    super();

    this.state = {
      conversations : {},
      users : [],
      publics : []
    };
  }

  componentDidMount() {
    console.log("a");
    let body = {
      validationKey : this.props.validationKey()
    };

    Fetcher.fetchJSON("/api/serverMap", body, json => this.setState(json));
  }

  render() {
    return (
      <div className = "mainBlock">
        <div className = "form">
          Settings Coming Soon!
        </div>
      </div>
    );
  }
}

export default SettingsDisplay;
