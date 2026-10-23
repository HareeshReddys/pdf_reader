export const SCENARIO_ANSWER_INSTRUCTIONS = `Scenario-answer guidance:
Answer the specific situation, not just a definition. Explain the approach and reason, with a relevant trade-off, failure handling or verification when needed. State necessary assumptions briefly. Include one concrete example only when it helps. Do not add a likely follow-up unless asked. Use code only when requested or helpful; include complexity, tests and edge cases when useful. If asked to write an AI prompt, produce the prompt rather than implementation code. Keep the answer brief; expand for requested depth or complete code.
Choose a documented project only when it is relevant: SharesEye for full-stack/React work, campaign automation for delivery workflow, GEICO for API integrations, AURA for the reliability-assistant concept. Explain hypothetical extensions with “I would”, never “I built”. Do not assert undocumented AWS services, libraries, architecture, incidents, numbers, or outcomes. Do not import another candidate's persona from reference answers. Distinguish documented experience from a proposed design; a useful hypothetical example is better than invented work history. Keep the role developer-focused unless the question or JD says otherwise.\n\n`;

export function isScenarioQuestion(question: string): boolean {
  return isExperienceIncidentQuestion(question)
    || /\b(?:scenario|suppose|imagine|what if|how would|what would|how do you|how did you|trade[ -]?offs?|in production|real[ -]world|real[ -]time example|million|500|canary|rollback|roll back|backfill|feature flags?|circuit breaker|rate[ -]?limit(?:er|ing)?|token bucket|worker threads?|image resizing|resize images|balance point|write (?:an? )?(?:ai )?prompt)\b/i.test(question)
    || /\b(?:design|implement|debug|troubleshoot|optimi[sz]e|scale)\b/i.test(question)
    || /\b(?:deploy|deployment|database migration|batch processing|concurrency|state management)\b/i.test(question) && /\b(?:handle|choose|safe|safely|fail|fails|failure|crash|crashes|approach|prevent|large|experience|example|reliable|pipeline)\b/i.test(question);
}

export function isExperienceIncidentQuestion(question: string): boolean {
  return /\b(?:production\s+(?:issues?|incidents?|bugs?|problems?|failures?)|outages?|incidents?)\b/i.test(question)
    && /\b(?:you|your|recent|latest|last|current|previous|found|faced|fixed|resolved|handled|tell me|eli lilly|geico|cognizant|bewino|shareseye|glakh)\b/i.test(question)
    && !/\b(?:how would|what would|suppose|imagine|what if)\b/i.test(question);
}

export function experienceIncidentInstructions(question: string): string {
  if (!isExperienceIncidentQuestion(question)) return '';
  const earlierRole = /\b(?:geico|cognizant|bewino|shareseye|glakh|previous (?:company|role|employer))\b/i.test(question);
  const currentRole = !earlierRole && /\b(?:recent|latest|last|current|eli lilly|lilly)\b/i.test(question);
  return `Production-incident interview guidance:\n${currentRole ? 'For this recent/current experience question, anchor the context in Eli Lilly, the documented current employer. Do not substitute an earlier GEICO or SharesEye incident. ' : 'Respect any explicitly named employer or earlier role; do not replace it with the current employer. '}
Use a documented incident if the supplied personal notes contain one. Otherwise state briefly that a specific incident is not documented, then provide a useful section explicitly labeled "Hypothetical practice scenario" based on the relevant documented responsibilities. For Eli Lilly, use global campaign delivery, release readiness, defect triage or vulnerability remediation as context. Choose one concrete practice issue, such as a campaign page failing to load content after a release because of a proposed environment-configuration mismatch. Do not give only a vague "if a defect appeared" lifecycle. Explain the hypothetical symptom and impact, how to verify the suspected mismatch against the approved release configuration, containment/rollback, the proposed configuration fix, QA checks and a preventive release check. This is a possible practice example, never an assertion that it happened. Keep the candidate's documented delivery-lead ownership distinct from engineering implementation. Use "I would" for unverified incident actions and expected results; do not fabricate an actual outage, technology, root cause, date, metric, recovery time or production outcome. Do not reuse campaign-automation savings as incident-recovery metrics. Cite the source note for the role context and distinguish it from the hypothetical incident.\n\n`;
}
