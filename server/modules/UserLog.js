const User = require("./User").User;
const TextHandler = require("./TextHandler").TextHandler;
const ServerResponse = require("./ServerResponse").ServerResponse;
const Message = require("./Message").Message;

class UserLog {

  /**
   * Default User Not Found Error.
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


  /**
   * Retrieve a User's unread Messages.
   *
   * @param  {string} validationKey
   *  The Validation Key of the desired User.
   *
   * @return {ServerResponse}
   *  The Response to send back to the client.
   */
  readMessages(validationKey, participant) {
    return new ServerResponse(
      this.users[validationKey].readMessages(participant));
  }


  usernameMap(validationKey) {
    let user = this.users[validationKey];
    let map = user.privateMessageMap;

    for(let userKey in this.users) {
      let username = this.users[userKey].username;

      if(username !== user.username && !(username in map))
        map[username] = 0;
    }

    return map;
  }


  // <<< SENDING METHODS IN-PROGRESS >>>

  sendAll(message) {
    let errorLog = [];

    // Validate the message.
    TextHandler.validateMessage(message, errorLog);

    if(errorLog.length !== 0)
      return new ServerResponse(null, errorLog);

    // Send to all Users.
    for(let vKey in this.users)
      this.users[vKey].storeMessage(message);

    return ServerResponse.EMPTY_SUCCESS_RESPONSE;
  }

  sendDirectMessage(senderKey, message, recipientUsername) {
    let errorLog = [];

    // Validate the Message.
    TextHandler.validateMessage(message, errorLog);

    if(errorLog.length !== 0)
      return new ServerResponse(null, errorLog);

    // Find the recipient.
    let recipientKey = this.findValidtionKey(recipientUsername);

    if(!recipientKey)
      return UserLog.USERNAME_NOT_FOUND_ERROR;

    // Send the message.
    this.users[recipientKey].storeMessage(message, message.sender);
    this.users[senderKey].storeMessage(message, recipientUsername);

    return ServerResponse.EMPTY_SUCCESS_RESPONSE;
  }

// <<< >>>


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
