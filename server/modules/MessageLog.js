
/**
 * The Message Stack's purpose is to
 * store messages sent and recieved by a User.
 *
 * The Stack will be used to track which messages
 * have been read by the Client.
 * This way All Messages which are yet to be sent to the
 * Client are accounted for.
 * The Message Stack should either store in entirety or
 * discard messages as they are read.
 *
 * Preferably public Messages should not need to be saved.
 * The Messages in the general Chat section wil be
 * of the highest frequency, and thus do not need
 * to be historically stored.
 *
 * The Client will simply only be able to retireve
 * unread meassages in this case.
 *
 * For private messages, Being able to load historical messages
 * is more practical.
 *
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
