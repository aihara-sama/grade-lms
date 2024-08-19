export const isDocCloseToBottom = () => {
  const scrollPosition = window.innerHeight + window.scrollY;
  const bottomPosition = document.documentElement.scrollHeight - 100;

  return scrollPosition >= bottomPosition;
};
