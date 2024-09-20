export const isDocCloseToBottom = () => {
  const scrollPosition = window.innerHeight + window.scrollY;
  const bottomPosition = document.documentElement.scrollHeight - 100;

  return scrollPosition >= bottomPosition;
};

export const isCloseToBottom = (element: HTMLElement, range = 300) => {
  const scrollPosition = element.scrollTop; // Current scroll position
  const { scrollHeight } = element; // Total height of the scrollable area
  const visibleHeight = element.clientHeight; // Height of the visible part of the element

  // Check if the user is within 100px of the bottom
  return scrollHeight - scrollPosition - visibleHeight <= range;
};
