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

  exitConversation(conversationKey) {
    if(!(conversationKey in this.conversations))
      return false;

    this.conversations[conversationKey].removeUser(this.username);
    delete this.conversations[conversationKey];

    return true;
  }

  conversationMap(withUsers) {
    let map = {};

    for(let cKey in this.conversations) {
      let convo = this.conversations[cKey];

      map[cKey] = convo.getMapEntry(this.username, withUsers);
    }

    return map;
  }
}

module.exports.User = User;
