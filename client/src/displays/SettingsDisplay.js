import React, {Component} from 'react';

import Fetcher from './componentModules/Fetcher';
import JoinPane from './components/JoinPane';
import CreatePane from "./components/CreatePane";
import ChatsPane from './components/ChatsPane';
import TitleBar from './components/TitleBar';
import ColumnSelector from './components/ColumnSelector';


class SettingsDisplay extends Component {

  constructor() {
    super();

    this.state = {
      panes : {},
      currentPane : "",
      timerID : null,
      refresh : null,
      locations : {
        "Chat Menu" : "chat",
        "Log Out" : "login"
      }
    };
  }

  componentDidMount() {
    let timerID = setInterval(this.tick.bind(this), 1000);

    this.setState({
      panes : {
        "Join" : (<JoinPane setRefresh = {this.setRefresh.bind(this)}
          validationKey = {this.props.validationKey} />),
        "Create" : (<CreatePane setRefresh = {this.setRefresh.bind(this)}
          validationKey = {this.props.validationKey} />),
        "Conversations" : (<ChatsPane setRefresh = {this.setRefresh.bind(this)}
         validationKey = {this.props.validationKey}/>)
      },
      currentPane : "Join",
      timerID : timerID
    });
  }

  setRefresh(refresh) {
    this.setState({refresh : refresh});
  }

  componentWillUnmount() {
    clearInterval(this.state.timerID);
  }

  tick() {
    if(this.state.refresh)
      this.state.refresh();
  }

  render() {
    return (
      <div className = "flexDisplay mainBlock">
        <div className = "flexible flexDisplay columnFlex color-primary-4 applet">
          <TitleBar addresses = {this.state.locations}
            title = "Settings"
            switchDisplay = {this.props.switchDisplay} />
          <div className = "flexible flexDisplay">
            <ColumnSelector toggleable
              items = {Object.keys(this.state.panes)}
              handleClick = {(pane) => this.setState({currentPane : pane})} />
            {this.state.panes[this.state.currentPane]}
          </div>
        </div>
      </div>
    );
  }
}

export default SettingsDisplay;
