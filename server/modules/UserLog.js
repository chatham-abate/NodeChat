const User = require("./User").User;
const TextHandler = require("./TextHandler").TextHandler;
const ServerResponse = require("./ServerResponse").ServerResponse;
const Message = require("./Message").Message;


/**
 * UserLog serves as the backend datastructure for storing Messages and Users.
 *
 * @author Chatham Abate
 */
class UserLog {

  /**
   * Default User Not Found Error.
   *
   * @type {ServerResponse}
   */
  static get USERNAME_NOT_FOUND_ERROR() {
    return new ServerResponse(null, ["Username Not Found"]);
  }


  /**
   * Constructor
   */
  constructor() {
    this.users = {}

    this.conversations = {};

    this.generalChatMessages = [];
  }


  /**
   * Login a pre existing User.
   *
   * @param  {string} username
   *  The Username of the User.
   * @param  {string} password
   *  The Password of the User.
   *
   * @return {ServerResponse}
   *  The Response to sen to the Client.
   *  If there are no errors,
   *  the response will contain the requested User's Validation Key.
   */
  login(username, password) {
    // Find the User first.
    let validationKey = this.findValidtionKey(username);

    if(!validationKey)
      return UserLog.USERNAME_NOT_FOUND_ERROR;

    const WRONG_PASSWORD_ERROR = "Incorrect Password";

    // Check the Password.
    if(password != this.users[validationKey].password)
      return new ServerResponse(null, [WRONG_PASSWORD_ERROR]);

    return new ServerResponse(validationKey);
  }


  /**
   * Validate a function call.
   * If the given Validation Key is invalid,
   * the callback function is ignored
   * and an error ServerResponse is returned.
   *
   * @param  {string}   validationKey
   *  The Validation Key of the Userthe Function is being requested from.
   * @param  {Function} callback
   *  The function to call if the given Validation Key is legitimate.
   *  callback should take a Validation Key as a parameter, and return
   *  a ServerResponse.
   *
   * @return {ServerResponse}
   *  The Response to send to the Client.
   */
  validate(validationKey, callback) {
    const VALIDATION_ERROR = "Invalid Validation Key";

    // Check the Validation Key.
    if(validationKey in this.users)
      return callback(validationKey);

    return new ServerResponse(null, [VALIDATION_ERROR]);
  }

  createConversation(validationKey, name) {

  }

  // MESSAGNG V1

  /**
   * Retrieve a User's unread Messages.
   *
   * @param  {string} validationKey
   *  The Validation Key of the desired User.
   * @param {string} participant
   *
   * @return {ServerResponse}
   *  The Response to send back to the client.
   */
  readMessages(validationKey, participant) {
    return new ServerResponse(
      this.users[validationKey].readMessages(participant));
  }


  /**
   * Retrieve the Unread Message Length Username Map for a given User.
   * The map returned, will map usernames
   * to the number of unread messages from that given user.
   *
   * @param  {string} validationKey [
   *  The Validation Key of the User.
   *
   * @return {ServerResponse}
   *  The map of usernames to numbers.
   */
  usernameMap(validationKey) {
    let user = this.users[validationKey];

    // Get the Message Map.
    let map = user.messageMap;

    // Fill the Map with unrepresented Users.
    for(let userKey in this.users) {
      let username = this.users[userKey].username;

      if(username !== user.username && !(username in map)) {
        map[username] = 0;
      }
    }

    return new ServerResponse(map);
  }


  /**
   * Load Historical Messages of a specific User.
   *
   * @param  {string} validationKey
   *  The Validation Key of the desired User.
   * @param  {number} startIndex
   *  The Starting Index of the Message Chunk.
   *  The message Chunk wll actually back track from the Start Index,
   *  easier to be considered as an Ending Index.
   *  If Start Index is null, the latest Message Chunk will be returned.
   * @param  {string} participant
   *  The Name of the desired participant.
   *  i/e a Username or the Server Character (~).
   *
   * @return {ServerResponse}
   *  The response containng the Array of old Messages.
   */
  loadHistory(validationKey, startIndex, participant) {
    // Find the participant.
    if(this.findValidtionKey(participant) === null
      && participant !== TextHandler.SERVER_CHARACTER)
      return this.USERNAME_NOT_FOUND_ERROR;

    const CHUNK_LENGTH = 20;

    let user = this.users[validationKey];

    // Make sure no messages can be returned twice.
    // Reading the Messages before returning them prevents this.
    user.readMessages(participant);

    let messageArray = participant === TextHandler.SERVER_CHARACTER
      ? this.generalChatMessages
      : user.allPrivateMessages(participant);

    let responseArray = [];

    let startInd = startIndex ? startIndex : messageArray.length;

    // Back Track.
    startInd -= CHUNK_LENGTH;

    if(startInd < 0)
      startInd = 0;

    // Load the Chunk.
    for(let i = startInd; i < messageArray.length; i++)
      responseArray.push(messageArray[i]);

    let body = {
      messages : responseArray,
      startIndex : startInd
    };

    return new ServerResponse(body)
  }


  /**
   * Send a Message.
   *
   * @param  {string} senderKey
   *  The Validation Key of the Sender.
   * @param  {Message} message
   *  The Message.
   * @param  {string} participant
   *  The name of the participant.
   *
   * @return {ServerResponse}
   *  An Empty Success Response, if there are no errors.
   */
  sendMessage(senderKey, message, participant) {
    let errorLog = [];

    // Validate the message.
    TextHandler.validateMessage(message, errorLog);

    if(errorLog.length !== 0)
      return new ServerResponse(null, errorLog);

    // If the message is sent to the General Chat.
    if(participant === TextHandler.SERVER_CHARACTER) {
      this.generalChatMessages.push(message);

      for(let vKey in this.users)
        this.users[vKey].storeMessage(message, TextHandler.SERVER_CHARACTER);

      return ServerResponse.EMPTY_SUCCESS_RESPONSE;
    }

    // Find the recipient.
    let recipientKey = this.findValidtionKey(participant);

    if(!recipientKey)
      return UserLog.USERNAME_NOT_FOUND_ERROR;

    // Send the message.
    this.users[recipientKey].storeMessage(message, message.sender);
    this.users[senderKey].storeMessage(message, participant);

    return ServerResponse.EMPTY_SUCCESS_RESPONSE;
  }

  // *******

  /**
   * Find the Validation Key of User.
   *
   * @param  {string} username
   *  The Username of the desired User.
   *
   * @return {string}
   *  If found, the Validation Key of the user.
   *  Null otherwise.
   */
  findValidtionKey(username) {
    for(let vKey in this.users)
      if(this.users[vKey].username === username)
        return vKey;

    return null;
  }


  /**
   * Get the Username of a User.
   *
   * @param  {string} validationKey [description]
   *  The Validation Key of the User.
   *
   * @return {string}
   *  The Username of the User.
   */
  getUsername(validationKey) {
    return this.users[validationKey].username;
  }


  /**
   * Test a Username for Errors.
   *
   * @param  {string} username
   *  The Username.
   *
   * @return {Array}
   *  The Error Log.
   */
  usernameErrorLog(username) {
    let errorLog = [];

    const NAME_TAKEN_ERROR = "Username Already Taken";

    // Check if the Name is taken.
    if(this.findValidtionKey(username))
      errorLog.push(NAME_TAKEN_ERROR);

    // Validate the Characters of the Username.
    if(errorLog.length === 0)
      TextHandler.validateUsernameText(username, errorLog);

    return errorLog;
  }


  /**
   * Login a New User.
   *
   * @param  {string} username
   *  The desired Username of the new User.
   * @param  {string} password
   *  The desired password of the new User.
   *
   * @return {ServerResponse}
   *  If the new User is created with no errors,
   *  an Empty Success Response is returned.
   *  Otherwise, the errors are returned.
   */
  loginNewUser(username, password) {
    let errorLog = this.usernameErrorLog(username);
    TextHandler.validatePassword(password, errorLog);

    if(errorLog.length != 0)
      return new ServerResponse(null, errorLog);

    let validationKey = "";

    // Generate Validation Key.
    do {
      validationKey = TextHandler.generateKey();
    } while(validationKey in this.users);

    this.users[validationKey] = new User(username, password);

    return ServerResponse.EMPTY_SUCCESS_RESPONSE;
  }
}

module.exports.UserLog = UserLog;
