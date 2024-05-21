import { NPMAuditData } from "../../../audit/audit";

export const mapAuditToMessage = (
  audit: NPMAuditData,
  packageName: string
): string => {
  const vulnerabilityMap = new Map(
    Object.entries(audit.metadata.vulnerabilities)
  );

  let message = `Vulnerabilities for ${packageName}: `;

  vulnerabilityMap.forEach((vulnerabilityCount, vulnerabilityName) => {
    message += `${vulnerabilityName}: ${vulnerabilityCount}, `;
  });

  return message.slice(0, message.length - 2);
};
