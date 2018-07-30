const express = require('express');
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Default Response
app.get("/", (req, res) => {
  res.send("Connect on port 3000 for React Client.");
});

const port = 5000;

app.listen(port, () => `Server running on port ${port}`);
