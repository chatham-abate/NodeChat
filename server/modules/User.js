
/**
 * A User stores all nessacary Conversations and Data pertaining to as single User.
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


  /** ############
   * Join a Conversation.
   *
   * @param  {string} conversationKey
   *  The conversationKey of the Conversation.
   * @param  {Conversation} conversation
   *  The actual Conversation.
   */
  joinConversation(conversationKey, conversation, message) {
    conversation.addUser(this.username);
    this.conversations[conversationKey] = conversation;

    if(message)
      conversation.store(message);
  }


  /**
   * Exit a Conversation.
   * @param  {string} conversationKey
   *  The key of the conversation.
   *
   * @return {boolean}
   *  True, if a converation was exited, False otherwise.
   */
  exitConversation(conversationKey, message) {
    // Cannot be removed from a Conversation you are not a member of.
    if(!(conversationKey in this.conversations))
      return false;

    this.conversations[conversationKey].removeUser(this.username);
    
    if(message)
      this.conversations[conversationKey].store(message);

    delete this.conversations[conversationKey];

    return true;
  }


  /**
   * Retrieve a User's Converation Map.
   * For each Conversation this User is a member of,
   * this maps Conversation Keys to Conversation map entries,
   *
   * @param  {boolean} withUsers
   *  Whether or not each Conversation Map entry
   *  should contain an array of their users.
   *
   * @return {Object}
   *  The Map.
   */
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
