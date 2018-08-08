const User = require("./User").User;
const TextHandler = require("./TextHandler").TextHandler;
const ServerResponse = require("./ServerResponse").ServerResponse;
const Message = require("./Message").Message;
const Conversation = require("./Conversation").Conversation;


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

  static get VALIDATION_ERROR() {
    return new ServerResponse(null, ["Cannot Validate Action"]);
  }

  static get GENERAL_CHAT_NAME() {
    return "General";
  }

  static get GENERAL_CHAT_KEY() {
    return "~";
  }

  /**
   * Constructor
   */
  constructor() {

    this.users = {}

    // Initialize the General Chat
    this.conversations = {};

    this.conversations[UserLog.GENERAL_CHAT_KEY] =
      new Conversation(UserLog.GENERAL_CHAT_NAME, UserLog.GENERAL_CHAT_KEY);
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
    // Check the Validation Key.
    if(validationKey in this.users)
      return callback(validationKey);

    return UserLog.VALIDATION_ERROR;
  }

  validateConversation(validationKey, conversationKey, callback) {
    if(validationKey in this.users
      && conversationKey in this.users[validationKey].conversations)
      return callback(validationKey, conversationKey);

    return UserLog.VALIDATION_ERROR;
  }

  // Messaging V2
  // This new Version of Messaging will feature the Conversation Datastructure.
  // This will allow for Group Chats with customizable members.
  // Conversations will also Be how prvate Messaging chats are stored.
  // Old MessageLogs, result in message histories being stored twce.
  // They also restric the use of group chats aside from the General Chat.
  //
  // Should Conversations have Keys?

  createConversation(username, name) {
    const CONVERSATION_NAME_TAKEN = "Conversation Name Taken";

    let errorLog = [];
    TextHandler.validateNameText(name, errorLog);

    if(errorLog.length !== 0)
      return new ServerResponse(null, errorLog);

    for(let cKey in this.conversations)
      if(this.conversations[cKey].name === name)
        return new ServerResponse(null, [CONVERSATION_NAME_TAKEN]);

    let newConvo = new Conversation(name, this.users[validationKey].username);

    let conversationKey = "";

    do {
      conversationKey = TextHandler.generateKey();
    } while(conversationKey in this.conversations);

    this.conversations[convesationKey] = newConvo;
    this.users[validationKey].joinConversation(conversationKey, newConvo);

    return new ServerResponse({conversationKey : conversationKey});
  }

  addUser(userame, conversationKey) {
    const USER_ALREADY_ERROR = "User Already in Conversation";

    let conversation = this.conversations[conversationKey];

    let userKey = this.findValidtionKey(username);

    if(!userKey)
      return this.USERNAME_NOT_FOUND_ERROR;

    if(username in conversation.unreadLog)
      return new ServerResponse(null, USER_ALREADY_ERROR);

    this.users[userKey]
      .joinConversation(conversationKey, this.conversations[conversationKey]);

    return ServerResponse.EMPTY_SUCCESS_RESPONSE;
  }

  sendMessage(message, conversationKey) {
    let conversation = this.conversations[conversationKey];

    let errorLog = [];
    TextHandler.validateMessage(message, errorLog);

    if(errorLog.length !== 0)
      return new ServerResponse(null, errorLog);

    conversation.store(message);

    return ServerResponse.EMPTY_SUCCESS_RESPONSE;
  }

  readConversation(validationKey, conversationKey) {
    let conversation = this.conversations[conversationKey];
    let user = this.users[validationKey];

    return new ServerResponse(conversation.read(user.username));
  }

  getConversationMap(validationKey) {
    return new ServerResponse(this.users[validationKey].conversationMap);
  }

  loadConversationHistory(validationKey, conversationKey, endIndex) {
    const CHUNK_LENGTH = 20;
    const END_INDEX_ERROR = "Invalid Index";

    let conversation = this.conversations[conversationKey];
    conversation.read(this.users[validationKey].username);

    if(endIndex === null)
      endIndex = conversation.fullLog.length;
    else if(endIndex > conversation.fullLog.length)
      return new ServerResponse(null, [END_INDEX_ERROR]);

    let startIndex = endIndex - CHUNK_LENGTH;

    if(startIndex < 0)
      startIndex = 0;

    let messages = [];

    for(let i = startIndex; i < conversation.fullLog.length; i++)
      messages.push(conversation.fullLog[i]);

    let body = {
      messages : messages,
      startIndex : startIndex
    };

    return new ServerResponse(body);
  }

  // *****



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
      TextHandler.validateNameText(username, errorLog);

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

    this.users[validationKey].joinConversation(
        UserLog.GENERAL_CHAT_KEY, this.conversations[UserLog.GENERAL_CHAT_KEY]);

    return ServerResponse.EMPTY_SUCCESS_RESPONSE;
  }
}

module.exports.UserLog = UserLog;
