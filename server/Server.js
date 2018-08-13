const express = require('express');
const bodyParser = require("body-parser");
const readline = require('readline');
const mkdirp = require('mkdirp');

const UserLog = require("./modules/UserLog").UserLog;
const Message = require("./modules/Message").Message;


const app = express();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var log = new UserLog("./saves");

// Default Response.
app.get("/", (req, res) => {
  res.send("Connect on port 3000 for React Client.");
});

// Create New User Call.
// username, password REQUIRED.
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

// Retrieve the Array of Users on the Server.
// The Array contains each User's username.
app.post("/api/usersArray", (req, res) => {
  res.json(log.usersArrayResponse);
});

// Retrieve the Server's Public Conversation Map.
// validationKey REQUIRED.
app.post("/api/publicConversationMap", (req, res) => {
  res.json(log.validate(req.body.validationKey, (validationKey) =>
    log.getPublicConversationMap(validationKey, req.body.withUsers)));
});

// Retrieve a Specific User's Converation Map.
// validationKey REQUIRED.
app.post("/api/conversationMap", (req, res) => {
 res.json(log.validate(req.body.validationKey, (validationKey) => {
   return log.getConversationMap(validationKey, req.body.withUsers);
 }))
});

// Conversation Request.
// The following requests handle the modification of
// any chat conversations on teh server.

// Join A Conversation.
// validationKey, conversationKey REQUIRED.
// If no errors, an Empty Success Response is sent to the Client.
app.post("/api/joinConversation", (req, res) => {
  res.json(
    log.validate(req.body.validationKey, (validationKey) =>
      log.joinConversation(validationKey, req.body.conversationKey))
  );
});

// Send a Message to a Conversation.
// validationKey, conversationKey, text REQUIRED.
// If no errors, an Empty Success Response is sent to the Client.
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

// Read a Conversation.
// validationKey, conversationKey REQUIRED.
// If no errors, the array of unread messages will be sent to the Client.
app.post("/api/readConversation", (req, res) => {
  res.json(
    log.validateConversation(req.body.validationKey, req.body.conversationKey,
        log.readConversation.bind(log)
    )
  );
});

app.post("/api/loadConversation", (req, res) => {
  res.json(
    log.validateConversation(req.body.validationKey, req.body.conversationKey,
      (validationKey, conversationKey) =>
        log.loadChunkHistory(validationKey, conversationKey, req.body.startIndex)
    )
  );
});

// Create a Conversation.
// validationKey, name, isPublic REQUIRED.
// If no errors, the Conversations's
// conversationKey will be sent back to the Client.
app.post("/api/createConversation", (req, res) => {
  res.json(
    log.validate(req.body.validationKey, (validationKey) =>
        log.createConversation(validationKey, req.body.name, req.body.isPublic)
    )
  );
});

// Exit a Conversation
// validationKey, conversationKey REQUIRED.
// If no errors, an Empty Success Response is sent to the Client.
app.post("/api/exitConversation", (req, res) => {
  res.json(
    log.validateConversation(req.body.validationKey, req.body.conversationKey,
      log.exitConversation.bind(log))
  );
});

// Terminate a Conversation.
// validationKey, conversationKey REQUIRED.
// If no errors, an Empty Success Response is sent to the Client.
app.post("/api/terminateConversation", (req, res) => {
  res.json(
    log.validatePermissions(req.body.validationKey, req.body.conversationKey,
      (validationKey, conversationKey) =>
        log.terminateConversation(conversationKey)
    )
  );
});

// User Actions
// The following requests require the User to be
// an owner of the requested Conversation.

// Add a User to a Conversation.
// validationKey, conversationKey, username REQUIRED.
// If no errors, an Empty Success Response is sent to the Client.
app.post("/api/addUser", (req, res) => {
  res.json(
    log.validateAction(req.body.validationKey, req.body.conversationKey, req.body.username,
      (username, conversationKey) =>
        log.addUser(username, conversationKey)
      )
  );
});

// Remove a User from  a Conversation
// validationKey, conversationKey, username REQUIRED.
// If no errors, an Empty Success Response is sent to the Client.
app.post("/api/removeUser", (req, res) => {
  res.json(
    log.validateAction(req.body.validationKey, req.body.conversationKey, req.body.username,
      (username, conversationKey) =>
        log.removeUser(username, conversationKey)
      )
  );
});

// Promote a User to an owner of a Conversation.
// validationKey, conversationKey, username REQUIRED.
// If no errors, an Empty Success Response is sent to the Client.
app.post("/api/promoteUser", (req, res) => {
  res.json(
    log.validateAction(req.body.validationKey, req.body.conversationKey, req.body.username,
      (username, conversationKey) =>
        log.promoteUser(username, conversationKey)
    )
  );
});

// Command Line Controller for the Server.
rl.on('line', (cmd) => {
  if(cmd.startsWith("init")) {
    // Init Directories and General Chat.
    console.log("Initializing General Chat...");
    log.initGeneralChat();
  } else if(cmd.startsWith("load")) {
    // Load saed data from the server.
    console.log("Loading Data...");
    log.loadFromSave();
  } else if(cmd.startsWith("save")) {
    // Saver server data.
    console.log("Saving Data...");
    log.save();
    console.log("Data Saved!");
  } else if(cmd === "close") {
    // CLose and save the server.
    console.log("Saving Data...");
    log.save();
    console.log("Closing...");

    rl.close();
    process.stdin.destroy();
    process.exit();
  } else {
    console.log("Command Not Found.");
  }
});

const port = 5000;

app.listen(port, () => `Server running on port ${port}`);
