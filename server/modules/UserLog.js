const User = require("./User").User;
const TextHandler = require("./TextHandler").TextHandler;
const ServerResponse = require("./ServerResponse").ServerResponse;

class UserLog {
  constructor() {
    this.users = {}
  }

  usernameErrorLog(username) {
    errorLog = [];

    const NAME_TAKEN_ERROR = "Username Already Taken";

    for(let user in this.users)
      if(user.username === username)
        errorLog.push(NAME_TAKEN_ERROR);

    if(errorLog.length === 0)
      TextHandler.validateUsernameText(username, errorLog);

    return errorLog;
  }

  loginNewUser(username, password) {
    let errorLog = this.usernameErrorLog(username);
    TextHandler.validatePassword(password, errorLog);

    if(errorLog.length != 0)
      return new ServerResponse(null, errorLog);

    let validationKey = "";

    do {
      validationKey = TextHandler.generateKey();
    } while(!(validationKey in this.users));

    this.users[validationKey] = new User(username, password);

    return new ServerResponse(validationKey);
  }
}

module.exports.UserLog = UserLog;
