import React, { Component } from 'react';

/**
 * Log Component, intended for displaying Server Responses
 * @extends Component
 *
 * @author Chatham Abate
 */
class Log extends Component {

  /**
   * Constructor
   */
  constructor() {
    super();

    this.state = {
      entries : [],
      errorLog : false
    }
  }


  /**
   * Life Cycle Method
   */
  componentDidMount() {
    if(this.props.errorLog)
      this.setState({errorLog : true});
  }


  /**
   * Log Entries.
   *
   * @param  {Array} entries
   *  Preferably An Array of Strings
   */
  logEntries(entries) {
    this.setState({entries : entries});
  }


  /**
   * Clear the Log.
   */
  clear() {
   this.setState({entries : []})
  }


  /**
   * Life Cycle Method for Rendering.
   */
  render() {
    // Only render when there are entries.
    if(this.state.entries.length !== 0) {
      let logClassName =
        this.state.errorLog ?
          "color-secondary-1-4" : "color-complement-4";

      return (
        <div className = {"flexDisplay " + logClassName}>
          <div className = "clickable faded logEntry"
            onClick = {this.clear.bind(this)}>
            {this.state.entries.map(entry =>
              <div key = {entry}> {entry} </div>)}
          </div>
        </div>
      );
    }

    return null;
  }
}

export default Log;
