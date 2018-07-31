
/**
 * Server Response Template for communication with teh Client.
 *
 * @author Chatham Abate
 */
class ServerResponse {

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
