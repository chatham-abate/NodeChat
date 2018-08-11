import React, {Component} from 'react';

import Fetcher from './componentModules/Fetcher';
import JoinPane from './components/JoinPane';
import CreatePane from "./components/CreatePane";
import ChatsPane from './components/ChatsPane';


class SettingsDisplay extends Component {

  constructor() {
    super();

    this.state = {
      panes : {},
      currentPane : "",
      timerID : null,
      refresh : null
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
        <div className = "flexible flexDisplay color-primary-4 applet">
          <div className = "column">
            {Object.keys(this.state.panes).map((title) => (
              <div className = {"clickable button" +
                (title === this.state.currentPane ? " toggled" : "")}
                key = {title}
                onClick = {() => this.setState({currentPane : title})}>
                {title}
              </div>
            ))}
            <div className = "clickable button"
              onClick = {() => this.props.switchDisplay("chat")}>
              Back
            </div>
          </div>

          {this.state.panes[this.state.currentPane]}
        </div>
      </div>
    );
  }
}

export default SettingsDisplay;
