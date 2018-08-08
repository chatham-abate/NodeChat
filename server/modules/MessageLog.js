
/**
 * A Message Log facilitates the storage of Messages in a conversation.
 *
 * @author Chatham Abate
 */
class MessageLog {

  constructor() {
    this.unreadMessages = [];
    this.messages = [];
  }

  get unreadLength() {
    return this.unreadMessages.length;
  }

  store(message) {
    this.unreadMessages.push(message);
    this.messages.push(message);
  }

  read() {
    let unread = this.unreadMessages;
    this.unreadMessages = [];

    return unread;
  }
}

module.exports.MessageLog = MessageLog;
