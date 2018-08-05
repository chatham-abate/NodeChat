const MessageLog = require("./MessageLog").MessageLog;

class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;

    this.genChatLog = new MessageLog();
    this.privateChatLogs = {};
  }

  storeMessage(message, participant) {
    if(!participant) {
      ths.genChatLog.store(message);
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
