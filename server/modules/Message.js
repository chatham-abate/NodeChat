
class Message {
  constructor(text, date, sender) {
    this.sender = sender;
    this.text = text;
    this.date = date;
  }
}

module.exports.Message = Message;
