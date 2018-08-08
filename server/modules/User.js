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

    this.generalUnread = [];

    this.privateLogs = {};
  }


  /**
   * Store a Message in a User's Message Logs.
   *
   * @param  {Message} message
   *  The Message.
   * @param  {string} participant
   *  The Participant for which the Message pertains to.
   *  This could be a specific username, of the Server Character.
   *  In otherwords, the conversation this message belongs to be placed in.
   */
  storeMessage(message, participant) {
    // For General Chat.
    if(participant === TextHandler.SERVER_CHARACTER) {
      this.generalUnread.push(message);
      return;
    }

    // For Private Conversations.
    if(!(participant in this.privateLogs))
      this.privateLogs[participant] = new MessageLog();

    this.privateLogs[participant].store(message);
  }


  /**
   * Get the full Messages Array for a single Private Conversation.
   *
   * @param  {string} privateParticipant
   *  The Username of the participant n the conversation.
   *  Note, the Server Character cannot be used in this method.
   *
   * @return {Array}
   *  The Messages Array.
   */
  allPrivateMessages(privateParticipant) {
    if(!(privateParticipant in this.privateLogs))
      return [];

    return this.privateLogs[privateParticipant].messages;
  }


  /**
   * Read the Messages of a Conversation.
   * This method will clear the Unread Messages Array
   * of the requested conversaton.
   *
   * @param  {string} participant
   *  The other participant (username) in the desired conversation.
   *  The Server Character can be used n this method to read
   *  the General Chat.
   *
   * @return {Array}
   *  The Array of Messages.
   */
  readMessages(participant) {
    // If General Chat.
    if(participant === TextHandler.SERVER_CHARACTER) {
      let unreadGen = this.generalUnread;
      this.generalUnread = [];

      return unreadGen;
    }

    // If Private Chat.
    if(!(participant in this.privateLogs))
      return [];

    return this.privateLogs[participant].read();
  }


  /**
   * Get the Unread Message Map.
   *
   * @return {Object}
   *  A mapping of Username's to the number of unread messages
   *  this User has from that specfic username.
   *  This map will also the Server Character
   *  to this User's number of unread General Chat Messages.
   */
  get messageMap() {
    let map = {};
    map[TextHandler.SERVER_CHARACTER] = this.generalUnread.length;

    for(let username in this.privateLogs)
      map[username] = this.privateLogs[username].unreadLength;

    return map;
  }
}

module.exports.User = User;
