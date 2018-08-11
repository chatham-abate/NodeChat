import React, {Component} from 'react';

class ButtonBar extends Component {
  render() {
    return (
      <div className = "flexDisplay">
        {Object.keys(this.props.actions).map((label) => (
          <div className = "clickable button"
            key = {label}
            onClick = {() => this.props.attempt(this.props.actions[label])}>
            {label}
          </div>
        ))}
      </div>
    );
  }
}

export default ButtonBar;
