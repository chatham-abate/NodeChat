

/**
 * This is the Conversation Datastructure.
 * This will store all relevant data for a single Conversation.
 * This makes sure  the entire history of a group chat is only stored once.
 */
class Conversation {

  constructor(name, owner) {
    this.unreadLog = {};
    this.fullLog = [];

    this.name = name;

    this.owners = new Set([owner]);
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

  getUnreadLength(username) {
    if(!(username in this.unreadLog))
      return 0;

    return this.unreadLog[username].length;
  }
}

module.exports.Conversation = Conversation;
