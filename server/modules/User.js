const MessageLog = require("./MessageLog").MessageLog;
const TextHandler = require("./TextHandler").TextHandler;


/**
 * A User stores all nessacary Messagesa dn Data pertaining to as single User.
 *
 * @author Chatham Abate
 */
class User {

  /**
   * Constructor.
   *
   * @param {string} username
   *  The Username of the User.
   * @param {string} password
   *  The Password of the User.
   */
  constructor(username, password) {
    this.username = username;
    this.password = password;

    this.conversations = {};
  }

  joinConversation(conversationKey, conversation) {
    conversation.addUser(this.username);
    this.conversations[conversationKey] = conversation;
  }

  get conversationMap(){
    let map = {};

    for(let cKey in this.conversations) {
      let convo = this.conversations[cKey];

      map[cKey] = {
        unreadLength : convo.getUnreadLength(this.username),
        name : convo.name
      };
    }

    return map;
  }
}

module.exports.User = User;
