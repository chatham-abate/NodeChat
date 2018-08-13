import React, {Component} from 'react';

/**
 * Component for Displaying a log of either Error or Success Messages.
 * @extends Component
 *
 * @author Chatham Abate
 */
class Logger extends Component {

  /**
   * Constructor.
   */
  constructor() {
    super();

    this.state = {
      entries : [],
      errorLog : false
    };
  }


  /**
   * Log A ServerResponse from the Server.
   *
   * @param  {string} response
   *  The Response.
   */
  logResponse(response) {
    // Determine if Response is an Error or Success.
    if(response.errors.length !== 0)
      this.logErrors(response.errors);
    else
      this.success();
  }


  /**
   * Clear the Log.
   */
  clear() {
    this.setState({entries : []});
  }


  /**
   * Log the Log's success Message.
   */
  success() {
    this.setState({entries : [this.props.success],
      errorLog : false})
  }


  /**
   * Log Errors.
   *
   * @param  {Array} errors
   *  An Array of String error Messages.
   */
  logErrors(errors) {
    this.setState({entries : errors,
     errorLog : true});
  }


  /**
   * Life Cycle Method for Rendering.
   */
  render() {
    // Determine Background Color.
    if(this.state.entries.length !== 0) {
      let logClassName =
        this.state.errorLog ?
          "color-secondary-1-4" : "color-secondary-2-4";

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

export default Logger;
