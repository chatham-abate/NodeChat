

/**
 * This is the Conversation Datastructure.
 * This will store all relevant data for a single Conversation.
 * This makes sure  the entire history of a group chat is only stored once.
 */
class Conversation {

  constructor(owner, name, isPublic = true) {
    this.unreadLog = {};
    this.fullLog = [];

    this.isPublic = isPublic;
    this.name = name;

    this.owners = new Set([owner]);
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

    return true;
  }

  store(message) {
    for(let username in this.unreadLog)
      this.unreadLog[username].push(message);

    this.fullLog.push(message);
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

    return {
      unreadLength : unreadLen,
      name : this.displayName,
      isPublic : this.isPublic,
      users : usernames,
      joined : joined
    };
  }
}

module.exports.Conversation = Conversation;
