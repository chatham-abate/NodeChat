
/**
 * Module for Fetching Data from a Server.
 *
 * @author Chatham Abate
 */
class Fetcher {

  /**
   * Fetch JSON Data from a Server using POST.
   *
   * @param  {String}   url      
   *  The URL to POST to.
   * @param  {Object}   body
   *  The body of the fetch request.
   * @param  {Function} callback
   *  The Callback function.
   */
  static fetchJSON(url, body, callback) {
    fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
       headers: {
         "Content-Type" : "application/json"
       }
    }).then(res => res.json())
      .then(resJSON => callback(resJSON));
  }
}

export default Fetcher;
