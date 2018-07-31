
class ClassModifier {

  static toggleClasses(element, class1, class2) {
    if(element.className.indexOf(class1) !== -1)
      this.swapClasses(element, class1, class2);
    else
      this.swapClasses(element, class2, class1);
  }

  static swapClasses(element, class1, class2) {
    this.removeClass(element, class1);
    element.className += " " + class2;
  }

  static clearInput(input) {
    this.removeClass(input, "required");
    input.value = "";
  }

  static removeClass(element, className) {
    let newClass = "";

    let oldClasses = element.className.split(" ");

    for(let oldClass of oldClasses)
      if(oldClass !== className)
        newClass += oldClass + " ";

    element.className = newClass;
  }
}

export default ClassModifier;
