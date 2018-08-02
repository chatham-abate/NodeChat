
/**
 * Module for modifying Class Names of HTML Elements.
 *
 * @author Chatham Abate
 */
class ClassModifier {

  /**
   * Toggle the Class Names of an Element.
   * Given 2 Class Names, the one Class Name which is not present
   * in the given Elements's Class Names will be added to the given Element's
   * Class Names. While the other given Class Name which is present,
   * will be removed.
   *
   * For this Function to work, one given Class Name must be a Class Name of
   * the given Element, and the other Class Name should not be.
   *
   * @param  {Object} element
   *  The HTML DOM Element.
   * @param  {String} class1
   *  The first Class Name option.
   * @param  {String} class2
   *  The second Class Name option.
   */
  static toggleClasses(element, class1, class2) {
    if(element.className.indexOf(class1) !== -1)
      this.swapClasses(element, class1, class2);
    else
      this.swapClasses(element, class2, class1);
  }


  /**
   * Swap the CLass Names of an Element.
   * Given 2 Class Names, the first Class Name will be removed from
   * the given Elements Class Names, then the second given Class Name
   * will be added to the given Element's class Names.
   *
   * @param  {Object} element
   *  The HTML DOM Element.
   * @param  {String} class1  [description]
   *  A Class Name of element.
   * @param  {String} class2
   *  The Class Name to add to element's Class Names.
   *  This Class Name should not already be a Class Name of element.
   */
  static swapClasses(element, class1, class2) {
    this.removeClass(element, class1);
    element.className += " " + class2;
  }


  /**
   * Reset the value and Class Name of an Input Field.
   * The value of the field will be set to "",
   * and required will be removed from the fields Class Names.
   *
   * @param  {Object} input
   *  The HTML DOM Element Input Field.
   */
  static clearInput(input) {
    this.removeClass(input, "required");
    input.value = "";
  }


  /**
   * Remove a Class Name from an Element.
   *
   * @param  {Object} element
   *  The HTML DOM Element to remove the Class NAme from.
   * @param  {String} className
   *  The Class Name to remove.
   *  If className is not a Class Name of element,
   *  nothing happens.
   */
  static removeClass(element, className) {
    let newClass = "";

    let oldClasses = element.className.split(" ");

    // Loop Over all Class Names of element.
    for(let oldClass of oldClasses)
      // Only keep the CLass Name if it does not equal className.
      if(oldClass !== className)
        newClass += oldClass + " ";

    element.className = newClass;
  }
}

export default ClassModifier;
