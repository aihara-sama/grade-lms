export const hasVerticalScrollbar = () => {
  return (
    document.documentElement.scrollHeight >
      document.documentElement.clientHeight ||
    document.body.scrollHeight > document.body.clientHeight
  );
};
