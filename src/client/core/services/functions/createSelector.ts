export function createSelector(element: Element | null) {
  let selector = '';
  while (true) {
    if (!element) return selector;
    const index = fetchPreviousSiblingElements(element)
      .filter(x => x.tagName === element!.tagName)
      .length;
    const prefix = index
      ? element.localName + `:nth-of-type(${index + 1})`
      : element.localName;
    const suffix = selector
      ? `>${selector}`
      : '';
    selector = prefix + suffix;
    element = element.parentElement;
  }
}

function fetchPreviousSiblingElements(element: Element) {
  const result = [];
  while (true) {
    if (!element.previousElementSibling) return result;
    result.push(element.previousElementSibling);
    element = element.previousElementSibling;
  }
}
