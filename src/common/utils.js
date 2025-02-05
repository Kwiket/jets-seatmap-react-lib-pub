export class Utils {
  static generateId() {
    return '_' + Math.random().toString(36).substring(2, 9);
  }

  static getFocusableElements(parent) {
    if (!parent) {
      return [];
    }

    return [
      ...parent?.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
      ),
    ]?.filter(el => !el.disabled);
  }
}
