import React, {Component} from 'react';

class TitleBar extends Component {

  render() {
    return (
      <div className = "bottomBordered flexDisplay">
        <div className = "lightlyPadded flexible">
          {this.props.title}
        </div>
        {Object.keys(this.props.addresses).map((label) => (
          <div className = "clickable lightlyPadded leftBordered"
            key = {label}
            onClick = {() =>this.props.switchDisplay(this.props.addresses[label])}>
            {label}
          </div>
        ))}
      </div>
    );
  }
}

export default TitleBar;
