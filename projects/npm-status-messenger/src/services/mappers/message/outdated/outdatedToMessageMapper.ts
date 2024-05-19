import { OutdatedData } from "../../../outdated/outdated";

export const mapOutdatedToMessage = (
  data: OutdatedData,
  packageName?: string
): string => {
  const outdatedEntriesMap = new Map(Object.entries(data));
  let message = "Outdated Packages";
  message = packageName ? `${message} for ${packageName}:` : `${message}:`;

  outdatedEntriesMap.forEach(
    (entry, key) => (message += `\n${key}: ${entry.current} -> ${entry.latest}`)
  );

  return message;
};
