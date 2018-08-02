import React, { Component } from 'react';


class ErrorLog extends Component {

  constructor() {
    super();

    this.state = {
      errors : []
    }
  }

  logErrors(errors) {
    this.setState({errors : errors});
  }

  clear() {
    this.setState({errors : []});
  }

  render() {
    if(this.state.errors.length !== 0)
      return (
        <div className = "flexDisplay errorLog">
          <div className = "flexible centeredText lightlyPadded clickable faded"
            onClick = {this.clear.bind(this)}>
            {this.state.errors.map(error => <div key = {error}> {error} </div>)}
          </div>
        </div>
      );

    return null;
  }
}

export default ErrorLog;
