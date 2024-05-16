import { OutdatedData } from "../../../outdated/outdated";

export const mapOutdatedToMessage = (data: OutdatedData): string => {
  const outdatedEntriesMap = new Map(Object.entries(data));
  let message = "Outdated Packages:";

  outdatedEntriesMap.forEach(
    (entry, key) => (message += `\n${key}: ${entry.current} -> ${entry.latest}`)
  );

  return message;
};
