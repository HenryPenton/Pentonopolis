import { NPMAuditData } from "../audit/audit";

export const mapAuditToMessage = (audit: NPMAuditData): string => {
  const vulnerabilityMap = new Map(
    Object.entries(audit.metadata.vulnerabilities)
  );

  let message = `Vulnerabilities: `;

  vulnerabilityMap.forEach((vulnerabilityCount, vulnerabilityName) => {
    message += `${vulnerabilityName}: ${vulnerabilityCount}, `;
  });

  return message.slice(0, message.length - 2);
};
