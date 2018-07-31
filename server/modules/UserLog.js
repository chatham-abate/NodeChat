const User = require("./User").User;
const TextHandler = require("./TextHandler").TextHandler;
const ServerResponse = require("./ServerResponse").ServerResponse;

class UserLog {
  constructor() {
    this.users = {}
  }

  login(username, password) {
    let validationKey = this.findValidtionKey(username);

    const INVALID_USERNAME_ERROR  = "Username Not Found";

    if(validationKey === null)
      return new ServerResponse(null, [INVALID_USERNAME_ERROR]);

    const WRONG_PASSWORD_ERROR = "Incorrect Password";

    if(password != this.users[validationKey].password)
      return new ServerResponse(null, [WRONG_PASSWORD_ERROR]);

    return new ServerResponse(validationKey);
  }

  validate(validationKey, callback) {
    const VALIDATION_ERROR = "Invalid Validation Key";

    if(validationKey in this.users)
      return callback(this.users[validationKey]);

    return new ServerResponse(null, [VALIDATION_ERROR]);
  }

  findValidtionKey(username) {
    for(let vKey in this.users)
      if(this.users[vKey].username === username)
        return vKey;

    return null;
  }

  usernameErrorLog(username) {
    let errorLog = [];

    const NAME_TAKEN_ERROR = "Username Already Taken";

    if(this.findValidtionKey(username) != null)
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
    } while(validationKey in this.users);

    this.users[validationKey] = new User(username, password);

    return new ServerResponse(validationKey);
  }
}

module.exports.UserLog = UserLog;
