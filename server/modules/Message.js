const TextHandler = require("./TextHandler").TextHandler;

/**
 * This Class Represents a Single Message.
 *
 * @author Chatham Abate
 */
class Message {
  
  /**
   * Constructor.
   *
   * @param {string} text
   *  The Message Text.
   * @param {string} sender [
   *  The Message Sender.
   */
  constructor(text, sender) {
    this.sender = sender;
    this.text = text;
    this.date = new Date();
  }
}

module.exports.Message = Message;
