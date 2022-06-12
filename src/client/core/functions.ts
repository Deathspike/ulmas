export function createSelector(element: Element | null) {
  let selector = '';
  while (true) {
    if (!element) return selector;
    const index = fetchPreviousSiblings(element)
      .filter(x => x.tagName === element?.tagName)
      .length;
    const prefix = index
      ? element.localName + `:nth-of-type(${index + 1})`
      : element.localName;
    const suffix = selector
      ? '>' + selector
      : '';
    selector = element.id
      ? `#${element.id}` + suffix
      : prefix + suffix;
    element = element.id
      ? null
      : element.parentElement;
  }
}

function fetchPreviousSiblings(element: Element) {
  const result = [];
  while (true) {
    if (!element.previousElementSibling) return result;
    result.push(element.previousElementSibling);
    element = element.previousElementSibling;
  }
}
