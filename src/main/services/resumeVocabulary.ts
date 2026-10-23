/** Observed speech spellings of names in Ganesh's supplied resume. */
const RESUME_NAME_CORRECTIONS: Array<[RegExp, string]> = [
  [/\b(?:(?:shares?|says)\s+(?:psi|p\s*s\s*i|sci|eye)|share(?:psi|sci)|shareseye)\b/gi, 'SharesEye'],
  [/\b(?:g\s*e\s*i\s*c\s*o|g[ -]?echo|geico)\b/gi, 'GEICO'],
  [/\b(?:ara|aura)\b/gi, 'AURA'],
  [/\b(?:eli\s+lil(?:ly|v)|lilv|lilly)\b/gi, 'Eli Lilly'],
];

export function normalizeResumeNames(value: string): string {
  for (const [pattern, replacement] of RESUME_NAME_CORRECTIONS) value = value.replace(pattern, replacement);
  return value;
}

export const RESUME_ENTITIES = new Set(['shareseye', 'geico', 'aura', 'lilly', 'bewino', 'cognizant', 'glakh']);

// Interview phrasing is not a missing project fact. Keep substantive technical
// terms, so a question about an undocumented implementation still falls back.
export const PERSONAL_QUESTION_SCAFFOLD = new Set([
  'experience', 'previous', 'past', 'current', 'recent', 'project', 'projects',
  'role', 'roles', 'responsibility', 'responsibilities', 'contribution', 'contributions',
  'company', 'companies', 'job', 'team', 'background', 'did', 'done', 'there',
  'involved', 'involvement', 'worked', 'developed', 'built', 'handled', 'please',
  'through', 'walk', 'us', 'explain', 'eli',
]);
