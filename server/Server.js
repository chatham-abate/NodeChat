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

// V2 Messaging

app.post("/api/conversationMap", (req, res) => {
  res.json(log.validate(req.body.validationKey,
    validationKey => log.getConversationMap(validationKey)));
});

app.post("/api/sendToConversation", (req, res) => {
  res.json(
    log.validateConversation(req.body.validationKey, req.body.conversationKey,
      (validationKey, conversationKey) => {
        let msg = new Message(req.body.text, log.getUsername(validationKey));

        return log.sendMessage(msg, conversationKey);
      }
    )
  );
});

app.post("/api/readConversation", (req, res) => {
  res.json(
    log.validateConversation(req.body.validationKey, req.body.conversationKey,
      (validationKey, conversationKey) =>
        log.readConversation(validationKey, conversationKey)
    )
  );
});

app.post("/api/loadConversation", (req, res) => {
  res.json(
    log.validateConversation(req.body.validationKey, req.body.conversationKey,
      (validationKey, conversationKey) =>
        log.loadConversationHistory(
          validationKey, conversationKey, req.body.endIndex)
    )
  );
});

const port = 5000;

app.listen(port, () => `Server running on port ${port}`);
