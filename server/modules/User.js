
class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;

    this.unreadMessages = [];
  }

  readMessages() {
    return this.unreadMessages;
    this.unreadMessages = [];
  }
}

module.exports.User = User;
