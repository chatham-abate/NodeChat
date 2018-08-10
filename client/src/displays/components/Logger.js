import React, {Component} from 'react';

class Logger extends Component {

  constructor() {
    super();
    
    this.state = {
      entries : [],
      errorLog : false
    };
  }

  logResponse(response) {
    if(response.errors.length !== 0)
      this.logErrors(response.errors);
    else
      this.success();
  }

  clear() {
    this.setState({entries : []});
  }

  success() {
    this.setState({entries : [this.props.success],
      errorLog : false})
  }

  logErrors(errors) {
    this.setState({entries : errors,
     errorLog : true});
  }

  render() {
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
