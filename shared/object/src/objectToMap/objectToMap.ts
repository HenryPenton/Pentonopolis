export const objectToMap = <T extends object>(
  object: T
): Map<string, unknown> => {
  return new Map(Object.entries(object));
};
