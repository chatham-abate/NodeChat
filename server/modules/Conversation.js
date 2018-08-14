const Message = require("./Message").Message;
const fs = require("fs");
const rimraf = require("rimraf");

const ServerResponse = require('./ServerResponse').ServerResponse;

/**
 * This is the Conversation Datastructure.
 * This will store all relevant data for a single Conversation.
 * Conversations save messages in groups also known as Chunks.
 * When a Conversation recieves enough messages, it will group all of
 * its unsaved Messages into a single Chunk and save it.
 *
 * @author Chatham Abate
 */
class Conversation {

  /**
   * The Chunk Size for Storing messages.
   * @type {number}
   */
  static get CHUNK_SIZE() {
    return 20;
  }


  /**
   * Load a Conversation from a path.
   *
   * @param  {string} path
   *  The Path of the conversation folder.
   *
   * @return {Conversation}
   *  The Conversation.
   */
  static loadConversation(path) {
    // Retrieve the Conversation Profile.
    let convoRawData = fs.readFileSync(path + "/profile.json");
    let convoJSON = JSON.parse(convoRawData);

    console.log("Loading Conversation " + convoJSON.name + "...");

    let conversation = new Conversation(
      convoJSON.owners, convoJSON.name, convoJSON.isPublic, path, false);

    // Set the Current Chunk.
    conversation.currentChunk = convoJSON.currentChunk;
    conversation.currentChunkIndex = convoJSON.currentChunkIndex;

    // Retrieve the User Data.
    let userMapRaw = fs.readFileSync(path + "/userData.json");
    let userMapJSON = JSON.parse(userMapRaw);

    // Set each user's initial unreadLog Array.
    // If the user had been stored mapped to a True value,
    // this means the user had unread messages when the server closed,
    // in this case, the user is mapped to PAUSED.
    // Otherwise, the user is mapped to an empty Array,
    for(let username in userMapJSON)
      conversation.unreadLog[username] = userMapJSON[username] ? "PAUSED" : [];

    return conversation;
  }


  /**
   * Constructor.
   *
   * @param {Array}  owners
   *  The Array of owners.
   * @param {string}  name
   *  The name of the conversation.
   * @param {Boolean} isPublic
   *  Whether the conversation is public or private.
   * @param {string}  path
   *  The Conversation's path.
   * @param {Boolean}  save
   *  Whether the Conversation should be saved upon its creation.
   *  This should be true only when a new Conversation
   *  which is not already stored in the server files is being created.
   */
  constructor(owners, name, isPublic, path, save) {
    this.path = path;

    this.unreadLog = {};

    this.currentChunk = [];
    this.currentChunkIndex = 0;

    this.isPublic = isPublic;
    this.name = name;

    this.owners = new Set(owners);

    if(save)
      this.save(true);
  }


  /**
   * Save teh Conversation.
   *
   * @param  {string} createLog
   *  Whether or not a fullLog.json file should be created on save.
   *  Similairly, this should also only be true upon this conversation's first save.
   *  Otherwise, the old fullLog.json file will be written over.
   */
  save(createLog) {
    console.log("Saving " + this.name + " @ " + this.path);

    // Create the path, if not already created.
    if(!fs.existsSync(this.path))
      fs.mkdirSync(this.path);

    let userMap = {};

    // Check if the User has unread Mesages.
    for(let username in this.unreadLog)
      userMap[username] = (this.unreadLog[username] === "PAUSED"
        || this.unreadLog[username].length > 0);

    // Create the Conversations Profile data.
    let profileData = JSON.stringify({
      name : this.name,
      isPublic : this.isPublic,
      owners : Array.from(this.owners),
      currentChunkIndex : this.currentChunkIndex,
      currentChunk : this.currentChunk
    }, null, 2);

    // Write the Profile and User Data.
    fs.writeFileSync(this.path + "/profile.json", profileData);
    fs.writeFileSync(this.path + "/userData.json",
      JSON.stringify(userMap, null, 2));

    if(createLog) {
      let fullLogJSON = JSON.stringify([]);
      fs.writeFileSync(this.path + "/fullLog.json", fullLogJSON);
    }
  }


  /**
   * Delete a Conversation's Save Data.
   */
  deleteRecords() {
    rimraf(this.path, () =>
      console.log( this.name + " @ " + this.path + " Deleted"));
  }


  /**
   * Get the Conversation's Array of usernames.
   *
   * @return {Array}
   *  The Usernames.
   */
  get membersArray() {
    return Object.keys(this.unreadLog);
  }


  /**
   * Get the latest Message Chunk.
   *
   * @return {Array}
   *  An Array of messages.
   */
  get latestChunkObject() {
    // If the Current Chunk is empty, and not the only Chunk.
    if(this.currentChunk.length === 0 && this.currentChunkIndex > 0)
      return {
        messages : this.loadJoinedChunks(this.currentChunkIndex - 1),
        startIndex : this.currentChunkIndex - 1
      };

    return {
      messages : this.currentChunk,
      startIndex : this.currentChunkIndex
    };
  }


  /**
   * Detemine if a User is an Owner of this Conversation.

   * @param  {String}  username
   *  The Username of the User in question.
   *
   * @return {Boolean}
   *  If the User is an Owner.
   */
  isPermitted(username) {
    return this.owners.has(username);
  }


  /**
   * Promote a User to Owner.
   *
   * @param  {string} username
   *  The Username of the User to promote.
   *
   * @return {Boolean}
   *  If the User was promoted.
   */
  promote(username) {
    if(!(username in this.unreadLog))
      return false;

    if(!this.owners.has(username))
      this.owners.add(username);

    return true;
  }


  /**
   * Add a User to The Conversation.
   *
   * @param {string} username
   *  The Username of the User to add.
   */
  addUser(username) {
    this.unreadLog[username] = [];
  }


  /**
   * Remove a User from the Conversation.
   *
   * @param  {string} username
   *  The Username of the User to remove.
   *
   * @return {Boolean}
   *  Whether the User was removed.
   */
  removeUser(username) {
    if(!(username in this.unreadLog))
      return false;

    // Delete From Message Log.
    delete this.unreadLog[username];

    // Delete from owners set.
    if(this.owners.has(username))
      this.owners.delete(username);

    return true;
  }


  /**
   * Store a Message.
   * i.e. Send a Message to all User's and
   * store the Message in teh conversation's Current Chunk.
   *
   * @param  {Message} message
   *  The Message to Store.
   */
  store(message) {
    for(let username in this.unreadLog) {
      // If a User is Paused, Don't touch it.
      if(this.unreadLog[username] === "PAUSED")
        continue;

      // Pause a User when he reaches the Chunk Size of unread Messages.
      // This basically means the User is AFK, there is no reason to
      // keep pushing messages onto his unread Array, if he is not reading them.
      if(this.unreadLog[username].length === Conversation.CHUNK_SIZE-1)
        this.unreadLog[username] = "PAUSED";
      else
        this.unreadLog[username].push(message);
    }

    this.currentChunk.push(message);

    // If the Chunk Size has been reached, save the chunk.
    if(this.currentChunk.length >= Conversation.CHUNK_SIZE)
      this.saveChunk();
  }


  /**
   * Save the Conversations Current Chunk.
   */
  saveChunk() {
    console.log("Saving Chunk for " + this.name + " @ " + this.path + "/fullLog.json");

    // Load the Full Log.
    let fullLogRaw = fs.readFileSync(this.path + "/fullLog.json");
    let fullLog = JSON.parse(fullLogRaw);

    // Push the Current Chunk.
    fullLog.push(this.currentChunk);

    // Clear the Current Chunk.
    this.currentChunk = [];
    let logJSON = JSON.stringify(fullLog, null, 2);

    // Write the New Full  Log.
    fs.writeFileSync(this.path + "/fullLog.json", logJSON);
    this.currentChunkIndex++;
  }


  /**
   * Load historical Messages.
   * All Historical Chunks requested will be joined into
   * a single Array.
   *
   * @param  {Number} startIndex
   *  The Index of the Starting Chunk.
   *
   * @return {Array}
   *  The Historical Messages.
   */
  loadJoinedChunks(startIndex) {
    // Read the Full Log.
    let file = fs.readFileSync(this.path + "/fullLog.json", 'utf8');
    let history = [];
    let log = JSON.parse(file);

    // Join the Chunks.
    for(let ind = startIndex; ind < log.length; ind++)
      for(let message of log[ind])
        history.push(message);

    // Push the Current Chunks.
    for(let message of this.currentChunk)
      history.push(message);

    return history;
  }


  /**
   * Read a User's Unread Messages.
   *
   * @param  {string} username
   *  The User's Username.
   *
   * @return {Array}
   *  The User's Unread Mesages.
   */
  read(username) {
    if(!(username in this.unreadLog))
      return [];

    // If a User's log is Paused, unpause it by reseting its value
    // to an empty Array.
    // This way new Messages can start to be logged for this User.
    if(this.unreadLog[username] === "PAUSED") {
      this.unreadLog[username] = [];
      return [];
    } else {
      // Otherwise return the User's unread log.
      let unread = this.unreadLog[username];
      this.unreadLog[username] = [];

      return unread;
    }
  }


  /**
   * Get this Conversation's Map Entry for a specific User.
   *
   * @param  {string} username
   *  The Username of the User.
   * @param  {Boolean} withUsers
   *  If the Map entry should include the Conversation's Array of Usernames.
   *
   * @return {Object}
   *  The Map Entry.
   */
  getMapEntry(username, withUsers) {
    let joined = (username in this.unreadLog);

    let unread = (joined && (this.unreadLog[username] === "PAUSED"
      || this.unreadLog[username].length > 0));

    let unreadLen = joined ? this.unreadLog[username].length : 0;

    let usernames = withUsers ? Object.keys(this.unreadLog) : [];
    let owners = withUsers ? Array.from(this.owners) : [];

    return {
      unread : unread,
      name : this.name,
      isPublic : this.isPublic,
      users : usernames,
      owners : owners,
      joined : joined
    };
  }
}

module.exports.Conversation = Conversation;
