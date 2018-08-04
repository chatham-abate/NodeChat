
/**
 * Server Response Template for communication with teh Client.
 *
 * @author Chatham Abate
 */
class ServerResponse {

  static get EMPTY_SUCCESS_RESPONSE() {
    return new ServerResponse("SUCCESS", []);
  }

  /**
   * Constructor.
   *
   * @param {*} body
   *  The body of the response.
   * @param {Array} errors
   *  The Array of errors.
   */
  constructor(body, errors = []) {
    this.body = body;
    this.errors = errors;
  }
}

module.exports.ServerResponse = ServerResponse;
