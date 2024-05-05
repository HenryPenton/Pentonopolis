export const stripCommand = (incomingText: string): string => {
  const split = incomingText.split(" ");

  split.shift();
  return split.join(" ");
};
