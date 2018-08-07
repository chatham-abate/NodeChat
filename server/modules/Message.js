
class Message {
  constructor(text, sender) {
    this.sender = sender;
    this.text = text;
    this.date = new Date();
  }
}

module.exports.Message = Message;
