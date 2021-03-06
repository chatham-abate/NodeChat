import React, { Component } from 'react';

import ClassModifier from "../componentModules/ClassModifier";

/**
 * Input Component.
 * @extends Component
 *
 * @author Chatham Abate
 */
class FormInput extends Component {

  /**
   * GET The value of the Input Field.
   *
   * @return {String}
   *  The value.
   */
  get value() {
    return this.refs.field.value;
  }


  /**
   * SET the value of the Input Field.
   *
   * @param  {string} value
   *  The Value.
   */
  set value(value) {
    this.refs.field.value = value;
  }


  /**
   * Check if the field is flagged or not.
   *
   * @return {boolean}
   *  True if the field is flagged, false otherwise.
   */
  flagged() {
    return (this.refs.field.className.indexOf("required") !== -1);
  }


  /**
   * Flag the input field.
   * If the value of the field is "", it will be flagged.
   * When the field is flagged, required is added to its Class Names.
   *
   * @return {boolean}
   *  Whether the field was flagged or not.
   */
  flag() {
    // Check the Value.
    if(this.value === "") {
      // Flag
      this.refs.field.className += " required";

      return true;
    }

    return false;
  }


  /**
   * Unflag the input field.
   * This method will remove required
   * from the input field's list of Class Names.
   */
  unflag() {
    // Only Unflag if the Input Field is flagged to begin with.
    if(this.flagged())
      ClassModifier.removeClass(this.refs.field, "required");
  }


  /**
   * Unflag the input field and clear its value.
   */
  unflagAndClear() {
    this.unflag();

    this.refs.field.value = "";
  }


  /**
   * Handle the field's Key Press Event.
   *
   * @param  {KeyEvent} e
   *  The Key Event.
   */
  handleKeyPress(e) {
    if(!this.props.readOnly && e.charCode === 13)
      this.props.attempt();
  }


  /**
   * Life Cycle Methdo for Rendering.
   */
  render() {
    return (
      <div className = "flexDisplay">
        <input className = "flexible clickable padded"
          onKeyPress = {this.handleKeyPress.bind(this)}
          type = {this.props.type}
          placeholder = {this.props.placeholder}
          ref = "field"
          readOnly = {this.props.readOnly} />
      </div>
    );
  }
}

export default FormInput;
