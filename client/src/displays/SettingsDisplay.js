import React, {Component} from 'react';

import JoinPane from './panes/JoinPane';
import CreatePane from "./panes/CreatePane";
import ChatsPane from './panes/ChatsPane';
import TitleBar from './components/TitleBar';
import ColumnSelector from './components/ColumnSelector';


/**
 * Component Displaying Converstion settings.
 * @extends Component
 *
 * @author Chatahm Abate
 */
class SettingsDisplay extends Component {

  /**
   * Constructor.
   */
  constructor() {
    super();

    this.state = {
      panes : {},
      currentPane : "",
      timerID : null,
      refresh : null
    };
  }


  /**
   * Life Cycle Method.
   */
  componentDidMount() {
    let timerID = setInterval(this.tick.bind(this), 1000);

    // Set the panes.
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


  /**
   * Set the refresh Function.
   *
   * @param {Function} refresh
   *  The refresh Function.
   */
  setRefresh(refresh) {
    this.setState({refresh : refresh});
  }


  /**
   * Life Cycle Method
   */
  componentWillUnmount() {
    // Clear the Timer.
    clearInterval(this.state.timerID);
  }


  /**
   * Tick Method.
   */
  tick() {
    if(this.state.refresh)
      this.state.refresh();
  }


  /**
   * Life Cycle method for rendering.
   */
  render() {
    return (
      <div className = "flexDisplay mainBlock">
        <div className = "flexible flexDisplay columnFlex color-primary-4 applet">
          <TitleBar addresses = {this.props.locations}
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
