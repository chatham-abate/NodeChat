const MessageLog = require("./MessageLog").MessageLog;
const TextHandler = require("./TextHandler").TextHandler;

class User {

  constructor(username, password) {
    this.username = username;
    this.password = password;

    this.generalUnread = [];

    this.privateLogs = {};
  }

  storeMessage(message, participant) {
    if(participant === TextHandler.SERVER_CHARACTER) {
      this.generalUnread.push(message);
      return;
    }

    if(!(participant in this.privateLogs))
      this.privateLogs[participant] = new MessageLog();

    this.privateLogs[participant].store(message);
  }

  allPrivateMessages(privateParticipant) {
    if(!(privateParticipant in this.privateLogs))
      return [];

    this.privateLogs[privateParticipant].read();
    return this.privateLogs[privateParticipant].messages;
  }

  readMessages(participant) {
    if(participant === TextHandler.SERVER_CHARACTER) {
      let unreadGen = this.generalUnread;
      this.generalUnread = [];

      return unreadGen;
    }

    if(!(participant in this.privateLogs))
      return [];

    return this.privateLogs[participant].read();
  }

  get messageMap() {
    let map = {};
    map[TextHandler.SERVER_CHARACTER] = this.generalUnread.length;

    for(let username in this.privateLogs)
      map[username] = this.privateLogs[username].unreadLength;

    return map;
  }
}

module.exports.User = User;
