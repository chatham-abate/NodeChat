import React, {Component} from 'react';

class ColumnSelector extends Component {
  constructor() {
    super();

    this.state = {
      toggled : ""
    };
  }

  get selection() {
    return this.state.toggled;
  }

  untoggle() {
    this.setState({toggled : ""});
  }

  handleClick(item) {
    this.props.handleClick(item);

    if(this.props.toggleable)
      this.setState({toggled : item});
  }

  getClassName(item) {
    let secondaryClass = this.props.secondary ? " color-secondary-1-4" : "";

    let itemClass = "clickable button";

    if(this.props.toggleable && item === this.state.toggled)
      itemClass += " toggled";
    else if(this.props.check)
      itemClass += this.props.check(item)
        ? " color-secondary-2-4" : secondaryClass;

    if(this.props.checkFlag)
      itemClass += this.props.checkFlag(item) ? " unread" : "";

    return itemClass;
  }

  render() {
    if(this.props.labeled)
      return (
        <div className = "column">
          {Object.keys(this.props.items).map((key) => (
            <div className = {this.getClassName(key)}
              onClick = {() => this.handleClick(key)}
              key = {key}>
              {this.props.items[key].name}
            </div>
          ))}
        </div>
      );

    return (
      <div className = "column">
        {this.props.items.map((item) => (
          <div className = {this.getClassName(item)}
            onClick = {() => this.handleClick(item)}
            key = {item}>
            {item}
          </div>
        ))}
      </div>
    );
  }
}

export default ColumnSelector;
