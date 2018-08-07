const MessageLog = require("./MessageLog").MessageLog;

class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;

    this.genChatLog = new MessageLog();
    this.privateChatLogs = {};
  }

  get privateMessageMap() {
    let map = {};

    for(let user in this.privateChatLogs)
      map[user] = this.privateChatLogs[user].unreadLength;

    return map;
  }

  storeMessage(message, participant) {
    if(!participant) {
      this.genChatLog.store(message);
      return;
    }

    if(!(participant in this.privateChatLogs))
      this.privateChatLogs[participant] = new MessageLog();

    this.privateChatLogs[participant].store(message);
  }

  readMessages(participant) {
    if(participant) {
      if(participant in this.privateChatLogs)
        return this.privateChatLogs[participant].read();

      return [];
    }

    return this.genChatLog.read();
  }
}

module.exports.User = User;
