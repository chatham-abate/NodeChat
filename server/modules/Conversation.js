const Message = require("./Message").Message;
const fs = require("fs");
const mkdirp = require('mkdirp');

const ServerResponse = require('./ServerResponse').ServerResponse;

/**
 * This is the Conversation Datastructure.
 * This will store all relevant data for a single Conversation.
 * This makes sure  the entire history of a group chat is only stored once.
 */
class Conversation {

  static get CHUNK_SIZE() {
    return 5;
  }

  static loadConversation(path) {
    let convoRawData = fs.readFileSync(path + "/infoData.json");
    let convoJSON = JSON.parse(convoRawData);

    console.log("Loading Conversation " + convoJSON.name + "...");
    let conversation = new Conversation(
      convoJSON.owners, convoJSON.name, convoJSON.isPublic, path, false);

    conversation.currentChunk = convoJSON.currentChunk;
    conversation.currentChunkIndex = convoJSON.currentChunkIndex;
    
    let unreadRaw = fs.readFileSync(path + "/unreadLog.json");
    let unreadJSON = JSON.parse(unreadRaw);

    conversation.unreadLog = unreadJSON;

    return conversation;
  }

  constructor(owners, name, isPublic, path, save) {
    this.path = path;

    this.unreadLog = {};
    this.fullLog = [];

    this.currentChunk = [];
    this.currentChunkIndex = 0;

    this.isPublic = isPublic;
    this.name = name;

    this.owners = new Set(owners);

    if(save)
      this.save(true);
  }

  save(createLog) {
    console.log("Saving " + this.name + " @ " + this.path);

    if(!fs.existsSync(this.path))
      fs.mkdirSync(this.path);


    let unreadLog = JSON.stringify(this.unreadLog, null, 2);
    let infoData = JSON.stringify({
      isPublic : this.isPublic,
      name : this.name,
      currentChunkIndex : this.currentChunkIndex,
      currentChunk : this.currentChunk,
      owners : Array.from(this.owners)
    }, null, 2);

    fs.writeFileSync(this.path + "/unreadLog.json", unreadLog);
    fs.writeFileSync(this.path + "/infoData.json", infoData);

    if(createLog) {
      let fullLogJSON = JSON.stringify([]);
      fs.writeFileSync(this.path + "/fullLog.json", fullLogJSON);
    }
  }

  get displayName() {
    if(this.name)
      return this.name;

    let displayName = "";

    for(let member in this.unreadLog)
      displayName += member + ",";

    return displayName.substring(0, displayName.length-1);
  }

  get membersArray() {
    let array = [];

    for(let member in this.unreadLog)
      array.push(member);

    return array;
  }

  isPermitted(username) {
    return this.owners.has(username);
  }

  promote(username) {
    if(!(username in this.unreadLog))
      return false;

    if(!this.owners.has(username))
      this.owners.add(username);

    return true;
  }

  addUser(username) {
    this.unreadLog[username] = [];
  }

  removeUser(username) {
    if(!(username in this.unreadLog))
      return false;

    delete this.unreadLog[username];

    if(this.owners.has(username))
      this.owners.delete(username);

    return true;
  }

  store(message) {
    for(let username in this.unreadLog)
      this.unreadLog[username].push(message);

    this.fullLog.push(message);

    this.currentChunk.push(message);

    if(this.currentChunk.length >= Conversation.CHUNK_SIZE)
      this.saveChunk();
  }

  saveChunk() {
    console.log("Saving Chunk for " + this.name + " @ " + this.path + "/fullLog.json");
    fs.readFile(this.path + "/fullLog.json", 'utf8', (err, data) => {
      let log = JSON.parse(data);
      log.push(this.currentChunk);
      this.currentChunk = [];
      let logJSON = JSON.stringify(log, null, 2);
      fs.writeFileSync(this.path + "/fullLog.json", logJSON);

      this.currentChunkIndex++;
    });
  }

  loadJoinedChunks(startIndex) {
    let file = fs.readFileSync(this.path + "/fullLog.json", 'utf8');
    let history = [];
    let log = JSON.parse(file);

    for(let ind = startIndex; ind < log.length; ind++)
      for(let message of log[ind])
        history.push(message);

    for(let message of this.currentChunk)
      history.push(message);

    return history;
  }

  read(username) {
    if(!(username in this.unreadLog))
      return [];

    let unread = this.unreadLog[username];
    this.unreadLog[username] = [];

    return unread;
  }

  getMapEntry(username, withUsers) {
    let joined = (username in this.unreadLog);

    let unreadLen = joined ? this.unreadLog[username].length : 0;

    let usernames = withUsers ? Object.keys(this.unreadLog) : [];
    let owners = withUsers ? Array.from(this.owners) : [];

    return {
      unreadLength : unreadLen,
      name : this.displayName,
      isPublic : this.isPublic,
      users : usernames,
      owners : owners,
      joined : joined
    };
  }
}

module.exports.Conversation = Conversation;
