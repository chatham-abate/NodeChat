import React, {Component} from 'react';

/**
 * Component For Displaying Multiple Selections in a single Column Display.
 * @extends Component
 *
 * @author Chatham Abate
 */
class ColumnSelector extends Component {

  /**
   * Constructor.
   */
  constructor() {
    super();

    this.state = {
      toggled : "",
      items : null
    };
  }


  /**
   * Get the Option which is currently toggled.
   *
   * @return {string}
   *  The Value of the Selection.
   */
  get selection() {
    return this.state.toggled;
  }


  /**
   * Get all of the Column's items.
   *
   * @return
   *  If the Displaye is labeled an Object will be returned.
   *  Otherwise an Array of containing each option.
   */
  get items() {
    if(this.state.items === null)
      return this.props.labeled ? {} : [];

    return this.state.items;
  }


  /**
   * Set the Items of the Display.
   *
   * @param items
   *  Either an Array or Object depending on if the Display is
   *  labeled or not.
   */
  setItems(items) {
    if(this.props.mutable)
      this.setState({items : items});
  }


  /**
   * Untoggle to Menu.
   */
  untoggle() {
    this.setState({toggled : ""});
  }


  /**
   * Handle when an Item is Clicked.
   *
   * @param  {string} item
   *  The Item's key or label.
   */
  handleClick(item) {
    this.props.handleClick(item);

    if(this.props.toggleable)
      this.setState({toggled : item});
  }


  /**
   * Determine the Appearance of an Item.
   *
   * @param  {string} item
   *  The item or label.
   */
  getClassName(item) {
    let secondaryClass = this.props.secondary ? " color-secondary-1-4" : "";

    let itemClass = "clickable button";

    // Determine Toggle and Check.
    if(this.props.toggleable && item === this.state.toggled)
      itemClass += " toggled";
    else if(this.props.check)
      itemClass += this.props.check(item)
        ? " color-secondary-2-4" : secondaryClass;

    // Determine if the item is flagged.
    if(this.props.checkFlag)
      itemClass += this.props.checkFlag(item) ? " unread" : "";

    return itemClass;
  }


  /**
   * Life Cycle Method for rendering.
   */
  render() {
    let items = this.props.mutable ? this.state.items : this.props.items;

    if(items === null)
      return (
        <div className = "column">

        </div>
      );

    if(this.props.labeled)
      return (
        <div className = "column">
          {Object.keys(items).map((key) => (
            <div className = {this.getClassName(key)}
              onClick = {() => this.handleClick(key)}
              key = {key}>
              {items[key].name}
            </div>
          ))}
        </div>
      );

    return (
      <div className = "column">
        {items.map((item) => (
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
