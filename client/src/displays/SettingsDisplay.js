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
    let body = {
      validationKey : this.props.validationKey()
    };

    Fetcher.fetchJSON("/api/serverMap", body, json => this.setState(json));
  }

  render() {
    return (
      <div className = "color-secondary-1-4 columnFlex flexDisplay mainBlock">
        <div className = "inflexible lightlyPadded color-primary-3 centeredText">
          Settings
        </div>
        <div className = "padded flexible flexDisplay">
          <div className = "padded fixedWidth color-secondary-2-4">
            Selections Soon.
          </div>
          <div className = "padded darker flexible flexDisplay color-primary-4">
            <div className = "flexible">
              Settings soon
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SettingsDisplay;
