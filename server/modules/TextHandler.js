/**
 * Class containing helper functions for parsing Text.
 *
 * @author Chatham Abate
 */
class TextHandler {

  static get SERVER_CHARACTER() {
    return "~";
  }

  static validateMessage(message, errorLog) {
    const MESSAGE_MAX_LENGTH = 300;
    const MESSAGE_LENGTH_ERROR = "Invalid Message Length";

    if(message.text.length > MESSAGE_MAX_LENGTH
        || message.text.length === 0)
      errorLog.push(MESSAGE_LENGTH_ERROR);
  }


  /**
   * Validate a Username's Text.
   * All errors found will be pushed onto the given error log.
   *
   * @param  {string} username
   *  The Username.
   * @param  {Array} errorLog
   *  The Error Log.
   */
  static validateNameText(name, errorLog) {
    const NAME_LENGTH_ERROR = "Invalid Name Length";
    const MIN_NAME_LENGTH = 4;
    const MAX_NAME_LENGTH = 18;

    // Check Length
    if(name.length < MIN_NAME_LENGTH || name.length > MAX_NAME_LENGTH) {
      errorLog.push(NAME_LENGTH_ERROR);
      return;
    }

    // Validate Text
    this.validateFullName(name, errorLog);
    this.validateStartingCharacter(name, errorLog);
  }


  /**
   * Validate a Usrname's starting Character.
   *
   * @param  {string} username
   *  The Username.
   * @param  {Array} errorLog
   *  The Error Log.
   */
  static validateStartingCharacter(name, errorLog) {
    const PREFIX_ERROR  = "Invalid Name Starting Character";

    const START_CHARACTER_RANGES = [['a', 'z'], ['A', 'Z']];

    // Check starting character.
    if(!this.testCharacter(name.charAt(0), START_CHARACTER_RANGES))
      errorLog.push(PREFIX_ERROR);
  }


  /**
   * Validate every character of a Username.
   *
   * @param  {string} username
   *  The Username.
   * @param  {Array} errorLog
   *  The Error Log.
   */
  static validateFullName(name, errorLog) {
    const SYMBOL_ERROR = "Invalid Name Character(s)";

    const NAME_CHARACTER_RANGES = [['a', 'z'], ['A', 'Z'],
                                       ['0', '9'], ['_', '_']];

    // Check each character.
    for(let character of name)
      if(!this.testCharacter(character, NAME_CHARACTER_RANGES)) {
        errorLog.push(SYMBOL_ERROR);
        return;
      }
  }


  /**
   * Test whether a Character is within a given range.
   *
   * @param  {string} character
   *  The single Character.
   * @param  {Array} ranges
   *  The Array of ranges to test against.
   *  Each range is represented by a 2 element Array,
   *
   * @return {boolean}
   *  If the given Character is within any of the specified ranges.
   */
  static testCharacter(character, ranges) {
    for(let range of ranges)
      if(character >= range[0] && character <= range[1])
        return true;

    return false;
  }


  /**
   * Validate a Password's length.
   *
   * @param  {string} password
   *  The Password.
   * @param  {Array} errorLog
   *  The Error Log.
   */
  static validatePassword(password, errorLog) {
    const MIN_PW_LENGTH = 4;
    const PASSWORD_LENGTH_ERROR = "Invalid Password Length";

    // Test Length.
    if(password.length < MIN_PW_LENGTH)
      errorLog.push(PASSWORD_LENGTH_ERROR);
  }


  /**
   * Generate a random Validation Key.
   *
   * @return {string}
   *  The Key.
   */
  static generateKey() {
    const KEY_LENGTH = 8;
    const KEY_CHARS = "ABCD1234";

    let key = "";

    for(let i = 0; i < KEY_LENGTH; i++) {
      let randomIndex = Math.floor(Math.random() * KEY_CHARS.length);

      key += KEY_CHARS.charAt(randomIndex);
    }

    return key;
  }
}

module.exports.TextHandler = TextHandler;
