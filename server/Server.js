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
  res.json(log.validate(req.body.validationKey, (validationKey) => {
    let message = new Message(req.body.messageText, req.body.messageDate,
      log.getUsername(validationKey));

    return log.sendAll(message);
  }));
});

// Retrieve the Username Mapping for a specific User.
// valdationKey REQUIRED
// The Username Mappng will map each username on the server to the number
// of unread messages sent from that username to the the given User.
app.post("/api/getUserMap", (req, res) => {
  res.json(log.validate(req.body.validationKey, (validationKey) => {
    return log.usernameMap(validationKey);
  }));
});


// BETA MESSAGING

// Send a Direct Message to a specific User.
// validationKey, messageText, messageDate, recipientUsername REQUIRED.
// If no Errors, an Empty Success Response is sent to the Client.
app.post("/api/sendDirectMessage", (req, res) => {
  res.json(log.validate(req.body.validationKey, (validationKey) => {
    let message = new Message(req.body.messageText, req.body.messageDate,
      log.getUsername(validationKey));

    return log.sendDirectMessage(validationKey,
      message, req.body.recipientUsername);
  }));
});

// Retrieve a Client's unread Messages from the General Chat.
// validationKey REQUIRED.
app.post("/api/readGenChat", (req, res) => {
  res.json(log.validate(req.body.validationKey, (validationKey) => {
    return log.readMessages(validationKey);
  }));
});

// Retrieve a Client's unread Messages from a private conversation.
// validationKey, participant REQUIRED.
app.post("/api/readPrivateChat", (req, res) => {
  res.json(log.validate(req.body.validationKey, (validationKey) => {
    return log.readMessages(validationKey, req.body.participant);
  }));
});

const port = 5000;

app.listen(port, () => `Server running on port ${port}`);
