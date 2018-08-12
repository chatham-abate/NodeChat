const User = require("./User").User;
const TextHandler = require("./TextHandler").TextHandler;
const ServerResponse = require("./ServerResponse").ServerResponse;
const Message = require("./Message").Message;
const Conversation = require("./Conversation").Conversation;


/**
 * UserLog serves as the backend datastructure
 * for storing Conversations and Users.
 *
 * @author Chatham Abate
 */
class UserLog {

  /**
   * Default User Not Found Error.
   * @type {ServerResponse}
   */
  static get USERNAME_NOT_FOUND_ERROR() {
    return new ServerResponse(null, ["Username Not Found"]);
  }

  /**
   * User Already Added Error.
   * @type {ServerResponse}
   */
  static get USER_ALREADY_ADDED_ERROR() {
    return new ServerResponse(null, ["User Already in Conversation"]);
  }

  /**
   * User Not in Conversation Error.
   * @type {ServerResponse}
   */
  static get USER_NOT_IN_CONVO_ERROR() {
    return new ServerResponse(null, ["User Not in Conversation"]);
  }

  /**
   * General Chat Name.
   * @type {string}
   */
  static get GENERAL_CHAT_NAME() {
    return "General";
  }

  /**
   * General Chat Key.
   * @type {string}
   */
  static get GENERAL_CHAT_KEY() {
    return "~";
  }

  static serverMessage(text) {
    return new Message(text, UserLog.GENERAL_CHAT_KEY);
  }

  /**
   * Constructor
   */
  constructor() {
    this.users = {}

    this.publics = {};
    this.privates = {};

    this.publics[UserLog.GENERAL_CHAT_KEY] =
      new Conversation(UserLog.GENERAL_CHAT_KEY, UserLog.GENERAL_CHAT_NAME);
  }


  /**
   * GET the Users Array Response.
   * A Server Repsonse containing the array of Usernames in use.
   *
   * @return {ServerResponse}
   *  The Response.
   */
  get usersArrayResponse() {
   let users = [];

   for(let userKey in  this.users)
     users.push(this.users[userKey].username);

   return new ServerResponse(users);
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
      UserLog.GENERAL_CHAT_KEY, this.publics[UserLog.GENERAL_CHAT_KEY],
      UserLog.serverMessage(username + " has joined the Server."));

    return ServerResponse.EMPTY_SUCCESS_RESPONSE;
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
   * Validate A Conversation call.
   * A conversation call entails any
   * request pertaining to a specific conversation.
   *
   * @param  {string}   validationKey
   *  The Validation Key of the user.
   * @param  {string}   conversationKey
   *  The Conversation Key of the requested Conversation.
   * @param  {Function} callback
   *  The callback Function,
   *  should take validationKey and conversationKey as parameters.
   *  If the given Validation Key is valid
   *  and the given Conversation Key is in the user's joined conversations,
   *  the callback will be called.
   *
   * @return {ServerResponse}
   *  If the callback is called, its return value.
   *  Otherwise, an error.
   */
  validateConversation(validationKey, conversationKey, callback) {
    const CONVERSATION_VALIDATION_ERROR = "Invalid Conversation Key";

    return this.validate(validationKey, (validationKey) => {
      if(conversationKey in this.users[validationKey].conversations)
        return callback(validationKey, conversationKey);

      return new ServerResponse(null, [CONVERSATION_VALIDATION_ERROR]);
    });
  }


  /**
   * Validate the permissions of a request.
   * Checks if the given user is an owner of the given conversation.

   * @param  {string}   validationKey
   *  The Validation Key of the requester.
   * @param  {string}   conversationKey
   *  The Conversation Key of the requested Conversation.
   * @param  {Function} callback
   *  The Function to call,
   *  if the given user is an owenr of the given conversation.
   *  Should take parameters (validationKey, conversationKey).
   *
   * @return {ServerResponse}
   *  If the User is an Owner, the return value of the callback Function.
   *  Otherwise, a Server Response error.
   */
  validatePermissions(validationKey, conversationKey, callback) {
    const INVALID_PERMISSION_ERROR = "Invalid Permissions";

    return this.validateConversation(validationKey, conversationKey,
      (validationKey, conversationKey) => {
        let user = this.users[validationKey];
        if(user.conversations[conversationKey].isPermitted(user.username))
          return callback(validationKey, conversationKey);

        return new ServerResponse(null, [INVALID_PERMISSION_ERROR]);
      });
  }


  /**
   * Validate a Conversation action.
   * Actions pertain to the modification of another user's status in a Conversation.
   * Ex. Adding a User, Removing a User, Promoting a User.
   *
   * @param  {string}   validationKey
   *  The Validation Key of the requester.
   * @param  {string}   conversationKey
   *  The Conversation Key of the requested Conversation.
   * @param  {string}   username
   *  The Username of the User in question.
   * @param  {Function} callback
   *  The callback function.
   *  Should take paramters (username, conversationKey).
   *
   * @return {ServerResponse}
   *  If the Callbcak function is called, its return value.
   *  Otherwise, the errors.
   */
  validateAction(validationKey, conversationKey, username, callback) {
    const SELF_ACTION_ERROR = "Cannot Preform Action On Self";

    return this.validatePermissions(validationKey, conversationKey,
      (validationKey, conversationKey) => {
        // Check for action on Self
        if(this.users[validationKey].username !== username)
          return callback(username, conversationKey);

        return new ServerResponse(null, [SELF_ACTION_ERROR]);
      }
    );
  }


  /**
   * Create a Conversation.
   *
   * @param  {string}  validationKey
   *  The Validation Key of the Creator.
   * @param  {string}  name
   *  The Name of the conversation.
   * @param  {Boolean} isPublic
   *  Whether the conversation should be public or not.
   *
   * @return {ServerResponse}
   *  If no errors, the Conversation key of the created Chat.
   *  Otherwise, the errors.
   */
  createConversation(validationKey, name, isPublic) {
    let errorLog = this.conversationNameErrorLog(name);

    if(errorLog.length !== 0)
      return new ServerResponse(null, errorLog);

    // Create the Conversation
    let newConvo =
      new Conversation(this.users[validationKey].username, name, isPublic);

    let conversationKey = "";

    // Generate the key.
    do {
      conversationKey = TextHandler.generateKey();
    } while(this.findConversation(conversationKey) !== null);

    let location = isPublic ? this.publics : this.privates;
    location[conversationKey] = newConvo;

    let creationMessage = UserLog.serverMessage(
      this.users[validationKey].username + " has created the Conversation.");

    // Add the Creator.
    this.users[validationKey]
      .joinConversation(conversationKey, newConvo, creationMessage);

    return new ServerResponse({conversationKey : conversationKey});
  }


  /**
   * Join a Conversation.
   *
   * @param  {string} validationKey
   *  The Validation Key of the user trying to join.
   * @param  {string} conversationKey
   *  The Conversation Key of the desired conversation.
   *
   * @return {ServerResponse}
   *  If no errors, an Empty Success Reponse.
   *  Otherwise, the errors.
   */
  joinConversation(validationKey, conversationKey) {
    const CONVERSATION_NOT_FOUND = "Conversation Not Found";
    const NOT_PUBLIC = "Conversation is Private";

    // Find Conversation
    let conversation = this.findConversation(conversationKey);

    if(!conversation)
      return new ServerResponse(null, [CONVERSATION_NOT_FOUND]);

    // Check the Conversations Privacy settings
    if(!conversation.isPublic)
      return new ServerResponse(null, [NOT_PUBLIC]);

    // Check if User already added.
    if(this.users[validationKey].username in conversation.unreadLog)
      return UserLog.USER_ALREADY_ADDED_ERROR;

    let joinMessage = UserLog.serverMessage(
      this.users[validationKey].username + " has joined the Conversation.");

    this.users[validationKey]
      .joinConversation(conversationKey, conversation, joinMessage);

    return ServerResponse.EMPTY_SUCCESS_RESPONSE;
  }


  /**
   * Exit a Conversation.
   *
   * @param  {string} validationKey
   *  The Validation Key of the User wanting to exit.
   * @param  {string} conversationKey
   *  The COnversation Key of the requested Conversation.
   *
   * @return {ServerResponse}
   * If no errors, an Empty Success Reponse.
   * Otherwise, the errors.       [
   */
  exitConversation(validationKey, conversationKey) {
    let exitMessage = UserLog.serverMessage(
      this.users[validationKey].username + " has exited the Conversation.");

    this.users[validationKey].exitConversation(conversationKey, exitMessage);

    if(conversationKey in this.privates
      && Object.keys(this.privates[conversationKey].unreadLog).length === 0)
      delete this.privates[conversationKey];

    return ServerResponse.EMPTY_SUCCESS_RESPONSE;
  }


  /**
   * Terminate A Conversation.
   *
   * @param  {string} conversationKey
   *  The Converation Key of the Conversation to Terminate.
   *
   * @return {ServerResponse}
   *  An Empty Success Response.
   *  Given that the Conversation Key is Validated before this function is called,
   *  this function should always be successful
   */
  terminateConversation(conversationKey) {
    // Remove All Users
    for(let userKey in this.users)
      if(conversationKey in this.users[userKey].conversations)
        this.users[userKey].exitConversation(conversationKey);

    // Delete from the Log.
    if(conversationKey in this.publics)
      delete this.publics[conversationKey];
    else
      delete this.privates[conversationKey];

    return ServerResponse.EMPTY_SUCCESS_RESPONSE;
  }


  /**
   * Promote a User.
   *
   * @param  {string} username
   *  The Username of the User to promote.
   * @param  {string} conversationKey
   *  The Conversation Key of the requested Conversation.
   *
   * @return {ServerResponse}
   *  If no errors, an Empty Success Reponse.
   *  Otherwise, the errors.
   */
  promoteUser(username, conversationKey) {
    const ALREADY_PERMITTED = "User Already an Owner";

    let conversation = this.findConversation(conversationKey);

    // Check if the user is already promoted.
    if(conversation.isPermitted(username))
      return new ServerResponse(null, [ALREADY_PERMITTED]);

    let promoted = conversation.promote(username);

    if(!promoted)
      return UserLog.USER_NOT_IN_CONVO_ERROR;

    conversation.store(username + " has been become an Owner.");

    return ServerResponse.EMPTY_SUCCESS_RESPONSE;
  }


  /**
   * Remove a User from a Conversation.
   *
   * @param  {string} username
   *  The username of the User to remove.
   * @param  {string} conversationKey
   *  The Conversation Key of the Conversation to remove the given User from.
   *
   * @return {ServerResponse}
   *  If no errors, an Empty Success Reponse.
   *  Otherwise, the errors.
   */
  removeUser(username, conversationKey) {
    let validationKey = this.findValidtionKey(username);
    let exitMessage =
      UserLog.serverMessage(username + " has been removed from the Converation.");

    // Check if the username is of a valid User.
    if(!validationKey)
      return UserLog.USERNAME_NOT_FOUND_ERROR;

    if(this.users[validationKey].exitConversation(conversationKey, exitMessage))
      return ServerResponse.EMPTY_SUCCESS_RESPONSE;

    return UserLog.USER_NOT_IN_CONVO_ERROR;
  }


  /**
   * Add A User to a Conversation.
   *
   * @param {string} username
   *  The Username of the user to add.
   * @param {string} conversationKey
   *  The Conversation Key of the requested Converation.
   *
   * @return {ServerResponse}
   *  If no errors, an Empty Success Reponse.
   *  Otherwise, the errors.
   */
  addUser(username, conversationKey) {
    let conversation = this.findConversation(conversationKey);

    let userKey = this.findValidtionKey(username);

    // Check if the User is Found.
    if(!userKey)
      return UserLog.USERNAME_NOT_FOUND_ERROR;

    // Check if teh User is already added.
    if(username in conversation.unreadLog)
      return UserLog.USER_ALREADY_ADDED_ERROR;

    let additionMessgae = UserLog.serverMessage(
      username + " has been added to the Conversation."
    );

    this.users[userKey]
      .joinConversation(conversationKey, conversation, additionMessgae);

    return ServerResponse.EMPTY_SUCCESS_RESPONSE;
  }


  /**
   * Send A Message to a Conversation.
   *
   * @param  {string} message
   *  The Message.
   * @param  {string} conversationKey
   *  The Conversation Key of the Conversation to send the Message to.
   *
   * @return {ServerResponse}
   *  If no errors, an Empty Success Reponse.
   *  Otherwise, the errors.
   */
  sendMessage(message, conversationKey) {
    let conversation = this.findConversation(conversationKey);

    let errorLog = [];

    // Validate the Message.
    TextHandler.validateMessage(message, errorLog);

    if(errorLog.length !== 0)
      return new ServerResponse(null, errorLog);

    conversation.store(message);

    return ServerResponse.EMPTY_SUCCESS_RESPONSE;
  }


  /**
   * Read A Conversation.
   *
   * @param  {string} validationKey
   *  The Validation Key of the User.
   * @param  {string} conversationKey
   *  The Conversation Key of the COnversation to read.
   *
   * @return {ServerResponse}
   *  A ServerResponse containing the User's array of unread messages.
   */
  readConversation(validationKey, conversationKey) {
    // find the Conversation and User.
    let conversation = this.findConversation(conversationKey);
    let user = this.users[validationKey];

    return new ServerResponse(conversation.read(user.username));
  }


  /**
   * Get a User's Conversation Map.
   * For each Conversation that the given User is a member of,
   * the returned map will map that conversation's conversationKey to
   * its User specific map entry.
   *
   * @param  {string} validationKey
   *  The validation Key of the requested User.
   * @param  {boolean} withUsers
   *  Whether or not each conversation's array of
   *  username's should be included as well.
   *
   * @return {ServerResponse}
   *  The Server Reponse containing the map.
   */
  getConversationMap(validationKey, withUsers) {
    return new ServerResponse(this.users[validationKey].conversationMap(withUsers));
  }


  /**
   * Get the Public Conversation Map.
   * This map iwill contain the map entries of every Public Conversation.
   *
   * @param  {string} validationKey
   *  The Validation Key of the User requesting the map.
   * @param  {boolean} withUsers
   *  Whether or not each conversation's Users array should be included or not.
   * @return {[type]}               [description]
   */
  getPublicConversationMap(validationKey, withUsers) {
    let map = {};
    let username = this.users[validationKey].username;

    for(let cKey in this.publics)
      map[cKey] = this.publics[cKey].getMapEntry(username, withUsers);

    return new ServerResponse(map);
  }


  /**
   * Load A COnversation's Message History.
   *
   * @param  {string} validationKey
   *  The Validation Key of the requesting User.
   * @param  {string} conversationKey
   *  The Converation Key fo teh requested Conversation.
   * @param  {number} endIndex
   *  The Index of the earliest Message to load from
   *  the conversation's Mesage Log.
   *
   * @return {ServerResponse}
   *  If no errors, A Server Response containing teh Message Array.
   *  Otherwise the Errors.
   */
  loadConversationHistory(validationKey, conversationKey, endIndex) {
    const CHUNK_LENGTH = 20;
    const END_INDEX_ERROR = "Invalid Index";

    // Find and read the Conversation.
    let conversation = this.findConversation(conversationKey);
    conversation.read(this.users[validationKey].username);

    if(endIndex === null)
      endIndex = conversation.fullLog.length;
    else if(endIndex > conversation.fullLog.length)
      return new ServerResponse(null, [END_INDEX_ERROR]);

    let startIndex = endIndex - CHUNK_LENGTH;

    if(startIndex < 0)
      startIndex = 0;

    let messages = [];

    // Load the Mesages.
    for(let i = startIndex; i < conversation.fullLog.length; i++)
      messages.push(conversation.fullLog[i]);

    let body = {
      messages : messages,
      startIndex : startIndex
    };

    return new ServerResponse(body);
  }

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

  findConversation(conversationKey) {
    if(conversationKey in this.privates)
      return this.privates[conversationKey];

    if(conversationKey in this.publics)
      return this.publics[conversationKey];

    return null;
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

    TextHandler.validateNameText(username, errorLog);

    // Check if the Name is taken.
    if(errorLog.length === 0 && this.findValidtionKey(username))
      errorLog.push(NAME_TAKEN_ERROR);

    return errorLog;
  }


  /**
   * Test a Conversation Name for Errors.
   *
   * @param  {string} username
   *  The Converation Name.
   *
   * @return {Array}
   *  The Error Log.
   */
  conversationNameErrorLog(cName) {
    const CONVO_NAME_TAKEN = "Conversation Name Taken";

    let check = (location, name) => {
      for(let cKey in location)
        if(location[cKey].name === name)
          return true;
       return false;
    };

    let errorLog = [];

    // Validate the Name.
    TextHandler.validateNameText(cName, errorLog);

    if(errorLog.length !== 0)
      return errorLog;

   // CHeck if name is already taken.
    let found = (check(this.publics, cName) || check(this.privates, cName));

    if(found)
      errorLog = [CONVO_NAME_TAKEN];

    return errorLog;
  }
}

module.exports.UserLog = UserLog;
