/**
 * Class containing helper functions for parsing Text.
 *
 * @author Chatham Abate
 */
class TextHandler {

  /**
   * Validate a Username's Text.
   * All errors found will be pushed onto the given error log.
   *
   * @param  {string} username
   *  The Username.
   * @param  {Array} errorLog
   *  The Error Log.
   */
  static validateUsernameText(username, errorLog) {
    const USERNAME_LENGTH_ERROR = "Invalid Username Length";
    const MIN_USERNAME_LENGTH = 4;

    // Check Length
    if(username.length < MIN_USERNAME_LENGTH) {
      errorLog.push(USERNAME_LENGTH_ERROR);
      return;
    }

    // Validate Text
    this.validateFullUsername(username, errorLog);
    this.validateStartingCharacter(username, errorLog);
  }


  /**
   * Validate a Usrname's starting Character.
   *
   * @param  {string} username
   *  The Username.
   * @param  {Array} errorLog
   *  The Error Log.
   */
  static validateStartingCharacter(username, errorLog) {
    const PREFIX_ERROR  = "Invalid Starting Character";

    const START_CHARACTER_RANGES = [['a', 'z'], ['A', 'Z']];

    // Check starting character.
    if(!this.testCharacter(username.charAt(0), START_CHARACTER_RANGES))
      errorLog.push(PREFIX_ERROR + " : " + username.charAt(0));
  }


  /**
   * Validate every character of a Username.
   *
   * @param  {string} username
   *  The Username.
   * @param  {Array} errorLog
   *  The Error Log.
   */
  static validateFullUsername(username, errorLog) {
    const SYMBOL_ERROR = "Invalid Username Character";

    const USERNAME_CHARACTER_RANGES = [['a', 'z'], ['A', 'Z'],
                                       ['0', '9'], ['_', '_']];
    let foundInvalids = new Set([]);

    // Check each character.
    for(let character of username)
      if(!(this.testCharacter(character, USERNAME_CHARACTER_RANGES)
        || foundInvalids.has(character))) {
        errorLog.push(SYMBOL_ERROR + " : " + character);
        foundInvalids.add(character);
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