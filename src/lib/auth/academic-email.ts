const ACADEMIC_TLDS = ["edu", "ac"];

export function extractDomain(email: string): string {
  const at = email.lastIndexOf("@");
  return at === -1 ? "" : email.slice(at + 1).toLowerCase();
}

export function isAcademicEmail(email: string): boolean {
  const domain = extractDomain(email);
  if (!domain) return false;

  const parts = domain.split(".");
  if (parts.length < 2) return false;

  const tld = parts[parts.length - 1];
  const secondLevel = parts[parts.length - 2];

  // Matches .edu, .edu.<cc> (e.g. .edu.in) and .ac.<cc> (e.g. .ac.uk)
  if (tld === "edu") return true;
  if (ACADEMIC_TLDS.includes(secondLevel) && /^[a-z]{2}$/.test(tld)) {
    return true;
  }
  return false;
}

export function getStudentRole(email: string): {
  isStudent: boolean;
  universityDomain: string | null;
  role: "student" | "general";
} {
  const domain = extractDomain(email);
  const academic = isAcademicEmail(email);
  return {
    isStudent: academic,
    universityDomain: academic ? domain : null,
    role: academic ? "student" : "general",
  };
}
