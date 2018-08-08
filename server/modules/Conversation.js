

class Conversation {
  constructor() {
    this.unreadLog = {};

    this.fullLog = [];
  }

  join(username) {
    this.unreadLog[username]= [];
  }

  store(message) {
    for(let username in this.unreadLog)
      this.unreadLog.push(message);

    this.fullLog.push(message);
  }

  read(username) {
    if(!(username in this.unreadLog))
      return null;

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
