const express = require('express');
const bodyParser = require("body-parser");

const UserLog = require("./modules/UserLog").UserLog;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var log = new UserLog();

// Default Response.
app.get("/", (req, res) => {
  res.send("Connect on port 3000 for React Client.");
});

app.get("/api/newUser", (req, res) => {
  res.json(log.loginNewUser("hello", "world"));
});

// Create New User Call.
// username, spassword REQUIRED.
// If no Errors, the new User's Validation Key is sent to the Client.
app.post("/api/newUser", (req, res) => {
  res.json(log.loginNewUser(req.body.username, req.body.password));
});

// Login to the Server.
// username, spassword REQUIRED.
// If no Errors, the new User's Validation Key is sent to the Client.
app.post("/api/login", (req, res) => {
  res.json(log.login(req.body.username, req.body.password));
});

const port = 5000;

app.listen(port, () => `Server running on port ${port}`);
