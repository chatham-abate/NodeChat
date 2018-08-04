const express = require('express');
const bodyParser = require("body-parser");

const UserLog = require("./modules/UserLog").UserLog;
const Message = require("./modules/Message").Message;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var log = new UserLog();

// Default Response.
app.get("/", (req, res) => {
  res.send("Connect on port 3000 for React Client.");
});

// Create New User Call.
// username, spassword REQUIRED.
// If no Errors, an Empty Success Response is sent to the Client.
app.post("/api/newUser", (req, res) => {
  res.json(log.loginNewUser(req.body.username, req.body.password));
});

// Login to the Server.
// username, password REQUIRED.
// If no Errors, the new User's Validation Key is sent to the Client.
app.post("/api/login", (req, res) => {
  res.json(log.login(req.body.username, req.body.password));
});

// Send a Message to all Users.
// validationKey, messageText, messageDate REQUIRED.
// If no Errors, an Empty Success Response is sent to the Client.
app.post("/api/sendAll", (req, res) => {
  res.json(log.validate(req.validationKey, (validationKey) => {
    let message = new Message(req.body.messageText, req.body.messageDate,
      log.getUsername(validationKey));

    return log.sendAll(message);
  }));
});

// Send a Direct Message to a specific User.
// validationKey, messageText, messageDate, recipientUsername REQUIRED.
// If no Errors, an Empty Success Response is sent to the Client.
app.post("/api/sendDirectMessage", (req, res) => {
  res.json(log.validate(req.validationKey, (validationKey) => {
    let message = new Message(req.body.messageText, req.body.messageDate,
      log.getUsername(validationKey));

    return log.sendDirectMessage(message, req.body.recipientUsername);
  }));
});

const port = 5000;

app.listen(port, () => `Server running on port ${port}`);
