const assert = require('node:assert/strict');
const { normalizeInterviewTerms, getInterviewVocabularyStats } = require('../dist/main/services/interviewVocabulary.js');
const { INTERVIEW_TERMS } = require('../dist/main/services/interviewVocabularyCatalog.js');
const { cleanQuestionText } = require('../dist/main/services/questionDetectionService.js');
const corrections = [
  ['Tell me about says PSI.', 'Tell me about SharesEye.'],
  ['Explain ShareSci.', 'Explain SharesEye.'],
  ['Tell me about shares PSI and GEICO.', 'Tell me about SharesEye and GEICO.'],
  ["What is react j's?", 'What is React?'],
  ['What is reactiveize?', 'What is React?'],
  ['Explain reactiveness in frontend components.', 'Explain React in frontend components.'],
  ['Compare React.js and Angular j s.', 'Compare React and Angular.'],
  ['Explain node j s and next js.', 'Explain Node.js and Next.js.'],
  ['What is a w s?', 'What is AWS?'],
  ['Explain java script and type script.', 'Explain JavaScript and TypeScript.'],
  ['What is flex box?', 'What is Flexbox?'],
  ['What is virtual down?', 'What is virtual DOM?'],
  ['Explain postgres sequel database queries.', 'Explain PostgreSQL database queries.'],
  ['Explain sequel joins and database tables.', 'Explain SQL joins and database tables.'],
  ['What is graph q l?', 'What is GraphQL?'],
  ['Explain o r m and j w t.', 'Explain ORM and JWT.'],
  ['Explain c i c d.', 'Explain CI/CD.'],
  ['What is Ara?', 'What is AURA?'],
  ['What is g e i c o?', 'What is GEICO?'],
  ['Explain kubernets.', 'Explain Kubernetes.'],
  ['What is javascrpit?', 'What is JavaScript?'],
];
corrections.push(
  ['Explain ay double you ess.', 'Explain AWS.'],
  ['What is ee see two?', 'What is EC2?'],
  ['Explain ess three.', 'Explain S3.'],
  ['Explain jay double you tee.', 'Explain JWT.'],
  ['Compare kubernets and cloudformatoin.', 'Compare Kubernetes and CloudFormation.'],
  ['How does authentcation differ from authorisation?', 'How does authentication differ from authorization?'],
  ['Explain API gate way and terra form in AWS.', 'Explain API Gateway and Terraform in AWS.'],
  ['Explain h tee tee pee ess.', 'Explain HTTPS.'],
  ['Explain ay pee eye.', 'Explain API.'],
  ['What is ess cue ell?', 'What is SQL?'],
  ['Explain aitch tee em ell.', 'Explain HTML.'],
  ['Explain eye ay em in AWS.', 'Explain IAM in AWS.'],
  ['Explain ess ess ar in React.', 'Explain SSR in React.'],
  ['Compare s c s s and c s s.', 'Compare SCSS and CSS.'],
);
// QRS is deliberately outside our catalog: spelling letters is not permission
// to invent an unknown acronym.
const unchanged = [
  'Explain reactive programming with RxJS.',
  'What is reactiveness?',
  'How do you react to criticism?',
  'The service is down as expected.',
  'I watched the sequel yesterday.',
  'What is Java?',
  'Explain Kafka at GEICO.',
  'Tell me about an unknown project SharePoint.',
  'I wrote kubernets in my notes.',
  'Explain a quantum frobnicator.',
  'Explain cue ar ess.',
  'What is the snow flake outside?',
  'Tell me about the post man.',
  'How do you use state funds?',
  'Explain reactive streams and Spring WebFlux.',
  'What is authentication versus authorization?',
  'Explain Java versus JavaScript.',
  'Explain JavaScript closures and prototypes.',
  'The experience in kubernets was useful.',
];
for (const [input, expected] of corrections) {
  assert.equal(normalizeInterviewTerms(input), expected, input);
  assert.equal(normalizeInterviewTerms(expected), expected, `Correction must be idempotent: ${input}`);
}
for (const input of unchanged) assert.equal(normalizeInterviewTerms(input), input, `Ambiguous/ordinary phrase must stay unchanged: ${input}`);
let catalogAliases = 0;
for (const entry of INTERVIEW_TERMS) {
  for (const alias of entry.aliases) {
    const input = `Explain software term ${alias}?`;
    const expected = `Explain software term ${entry.canonical}?`;
    assert.equal(normalizeInterviewTerms(input), expected, `Catalog alias: ${alias}`);
    assert.equal(normalizeInterviewTerms(expected), expected, `Stable catalog spelling: ${entry.canonical}`);
    catalogAliases++;
  }
}
assert.equal(cleanQuestionText('Interviewer: Okay, explain says PSI.'), 'Explain SharesEye?');
console.log(getInterviewVocabularyStats());
console.log(`PASS: ${catalogAliases} catalog alias checks, ${corrections.length} interview vocabulary cases, ${unchanged.length} ambiguity/ordinary-language cases, idempotence and question detection.`);
