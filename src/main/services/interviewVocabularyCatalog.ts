/** Interview terms spanning the reference library and Ganesh's stack.
 * Aliases are candidate speech spellings, never personal experience claims. */
export type InterviewTerm = { canonical: string; category: string; aliases: readonly string[] };
export const INTERVIEW_TERMS: readonly InterviewTerm[] = [
  {
    "canonical": "React",
    "category": "frontend",
    "aliases": [
      "react js",
      "react j s"
    ]
  },
  {
    "canonical": "Next.js",
    "category": "frontend",
    "aliases": [
      "next js",
      "next j s"
    ]
  },
  {
    "canonical": "Node.js",
    "category": "frontend",
    "aliases": [
      "node js",
      "node j s"
    ]
  },
  {
    "canonical": "Angular",
    "category": "frontend",
    "aliases": [
      "angular js"
    ]
  },
  {
    "canonical": "Vue.js",
    "category": "frontend",
    "aliases": [
      "vue js",
      "view js"
    ]
  },
  {
    "canonical": "Svelte",
    "category": "frontend",
    "aliases": [
      "svelt"
    ]
  },
  {
    "canonical": "JavaScript",
    "category": "frontend",
    "aliases": [
      "java script"
    ]
  },
  {
    "canonical": "TypeScript",
    "category": "frontend",
    "aliases": [
      "type script"
    ]
  },
  {
    "canonical": "JSX",
    "category": "frontend",
    "aliases": [
      "j s x"
    ]
  },
  {
    "canonical": "TSX",
    "category": "frontend",
    "aliases": [
      "t s x"
    ]
  },
  {
    "canonical": "Redux",
    "category": "frontend",
    "aliases": [
      "re dux"
    ]
  },
  {
    "canonical": "Zustand",
    "category": "frontend",
    "aliases": [
      "zoo stand"
    ]
  },
  {
    "canonical": "Jotai",
    "category": "frontend",
    "aliases": [
      "joe tai"
    ]
  },
  {
    "canonical": "TanStack",
    "category": "frontend",
    "aliases": [
      "tan stack"
    ]
  },
  {
    "canonical": "Webpack",
    "category": "frontend",
    "aliases": [
      "web pack"
    ]
  },
  {
    "canonical": "Babel",
    "category": "frontend",
    "aliases": [
      "bay bel"
    ]
  },
  {
    "canonical": "ESLint",
    "category": "frontend",
    "aliases": [
      "es lint"
    ]
  },
  {
    "canonical": "Prettier",
    "category": "frontend",
    "aliases": [
      "prett ier"
    ]
  },
  {
    "canonical": "Storybook",
    "category": "frontend",
    "aliases": [
      "story book"
    ]
  },
  {
    "canonical": "Tailwind",
    "category": "frontend",
    "aliases": [
      "tail wind"
    ]
  },
  {
    "canonical": "Bootstrap",
    "category": "frontend",
    "aliases": [
      "boot strap"
    ]
  },
  {
    "canonical": "Material UI",
    "category": "frontend",
    "aliases": [
      "material u i"
    ]
  },
  {
    "canonical": "Sass",
    "category": "frontend",
    "aliases": []
  },
  {
    "canonical": "SCSS",
    "category": "frontend",
    "aliases": [
      "s c s s"
    ]
  },
  {
    "canonical": "Flexbox",
    "category": "frontend",
    "aliases": [
      "flex box"
    ]
  },
  {
    "canonical": "CSS Grid",
    "category": "frontend",
    "aliases": [
      "c s s grid"
    ]
  },
  {
    "canonical": "DOM",
    "category": "frontend",
    "aliases": [
      "d o m"
    ]
  },
  {
    "canonical": "virtual DOM",
    "category": "frontend",
    "aliases": [
      "virtual dome"
    ]
  },
  {
    "canonical": "Shadow DOM",
    "category": "frontend",
    "aliases": [
      "shadow d o m"
    ]
  },
  {
    "canonical": "useState",
    "category": "frontend",
    "aliases": [
      "use state"
    ]
  },
  {
    "canonical": "useEffect",
    "category": "frontend",
    "aliases": [
      "use effect"
    ]
  },
  {
    "canonical": "useMemo",
    "category": "frontend",
    "aliases": [
      "use memo"
    ]
  },
  {
    "canonical": "useCallback",
    "category": "frontend",
    "aliases": [
      "use callback"
    ]
  },
  {
    "canonical": "useReducer",
    "category": "frontend",
    "aliases": [
      "use reducer"
    ]
  },
  {
    "canonical": "useContext",
    "category": "frontend",
    "aliases": [
      "use context"
    ]
  },
  {
    "canonical": "useRef",
    "category": "frontend",
    "aliases": [
      "use ref"
    ]
  },
  {
    "canonical": "useLayoutEffect",
    "category": "frontend",
    "aliases": [
      "use layout effect"
    ]
  },
  {
    "canonical": "React Router",
    "category": "frontend",
    "aliases": [
      "react route r"
    ]
  },
  {
    "canonical": "React Query",
    "category": "frontend",
    "aliases": []
  },
  {
    "canonical": "RTK Query",
    "category": "frontend",
    "aliases": [
      "r t k query"
    ]
  },
  {
    "canonical": "StrictMode",
    "category": "frontend",
    "aliases": [
      "strict mode"
    ]
  },
  {
    "canonical": "Suspense",
    "category": "frontend",
    "aliases": []
  },
  {
    "canonical": "hydration",
    "category": "frontend",
    "aliases": []
  },
  {
    "canonical": "reconciliation",
    "category": "frontend",
    "aliases": []
  },
  {
    "canonical": "memoization",
    "category": "frontend",
    "aliases": [
      "memoisation"
    ]
  },
  {
    "canonical": "debouncing",
    "category": "frontend",
    "aliases": [
      "de bouncing"
    ]
  },
  {
    "canonical": "throttling",
    "category": "frontend",
    "aliases": [
      "throtling"
    ]
  },
  {
    "canonical": "accessibility",
    "category": "frontend",
    "aliases": [
      "accessability"
    ]
  },
  {
    "canonical": "localStorage",
    "category": "frontend",
    "aliases": [
      "local storage"
    ]
  },
  {
    "canonical": "sessionStorage",
    "category": "frontend",
    "aliases": [
      "session storage"
    ]
  },
  {
    "canonical": "Service Worker",
    "category": "frontend",
    "aliases": []
  },
  {
    "canonical": "Progressive Web App",
    "category": "frontend",
    "aliases": []
  },
  {
    "canonical": "Promise",
    "category": "javascript",
    "aliases": []
  },
  {
    "canonical": "async/await",
    "category": "javascript",
    "aliases": [
      "async await"
    ]
  },
  {
    "canonical": "Event Loop",
    "category": "javascript",
    "aliases": []
  },
  {
    "canonical": "microtask",
    "category": "javascript",
    "aliases": [
      "micro task"
    ]
  },
  {
    "canonical": "macrotask",
    "category": "javascript",
    "aliases": [
      "macro task"
    ]
  },
  {
    "canonical": "prototype",
    "category": "javascript",
    "aliases": [
      "proto type"
    ]
  },
  {
    "canonical": "closure",
    "category": "javascript",
    "aliases": []
  },
  {
    "canonical": "currying",
    "category": "javascript",
    "aliases": [
      "curriying"
    ]
  },
  {
    "canonical": "hoisting",
    "category": "javascript",
    "aliases": []
  },
  {
    "canonical": "destructuring",
    "category": "javascript",
    "aliases": [
      "de structuring"
    ]
  },
  {
    "canonical": "polyfill",
    "category": "javascript",
    "aliases": [
      "poly fill"
    ]
  },
  {
    "canonical": "iterable",
    "category": "javascript",
    "aliases": []
  },
  {
    "canonical": "generator",
    "category": "javascript",
    "aliases": []
  },
  {
    "canonical": "WeakMap",
    "category": "javascript",
    "aliases": [
      "weak map"
    ]
  },
  {
    "canonical": "WeakSet",
    "category": "javascript",
    "aliases": [
      "weak set"
    ]
  },
  {
    "canonical": "Nullish Coalescing",
    "category": "javascript",
    "aliases": []
  },
  {
    "canonical": "Optional Chaining",
    "category": "javascript",
    "aliases": []
  },
  {
    "canonical": "Garbage Collection",
    "category": "javascript",
    "aliases": []
  },
  {
    "canonical": "ECMAScript",
    "category": "javascript",
    "aliases": [
      "ecma script"
    ]
  },
  {
    "canonical": "Java",
    "category": "backend",
    "aliases": []
  },
  {
    "canonical": "Spring Boot",
    "category": "backend",
    "aliases": []
  },
  {
    "canonical": "Spring MVC",
    "category": "backend",
    "aliases": [
      "spring m v c"
    ]
  },
  {
    "canonical": "Spring Security",
    "category": "backend",
    "aliases": []
  },
  {
    "canonical": "Hibernate",
    "category": "backend",
    "aliases": [
      "hiber nate"
    ]
  },
  {
    "canonical": "JPA",
    "category": "backend",
    "aliases": [
      "j p a"
    ]
  },
  {
    "canonical": "JDBC",
    "category": "backend",
    "aliases": [
      "j d b c"
    ]
  },
  {
    "canonical": "JVM",
    "category": "backend",
    "aliases": [
      "j v m"
    ]
  },
  {
    "canonical": "JDK",
    "category": "backend",
    "aliases": [
      "j d k"
    ]
  },
  {
    "canonical": "JRE",
    "category": "backend",
    "aliases": [
      "j r e"
    ]
  },
  {
    "canonical": "Maven",
    "category": "backend",
    "aliases": [
      "may ven"
    ]
  },
  {
    "canonical": "Gradle",
    "category": "backend",
    "aliases": [
      "gray dle"
    ]
  },
  {
    "canonical": "Lombok",
    "category": "backend",
    "aliases": [
      "lom bok"
    ]
  },
  {
    "canonical": "Servlet",
    "category": "backend",
    "aliases": [
      "serv let"
    ]
  },
  {
    "canonical": "Tomcat",
    "category": "backend",
    "aliases": [
      "tom cat"
    ]
  },
  {
    "canonical": "Express.js",
    "category": "backend",
    "aliases": [
      "express js"
    ]
  },
  {
    "canonical": "NestJS",
    "category": "backend",
    "aliases": [
      "nest js"
    ]
  },
  {
    "canonical": "FastAPI",
    "category": "backend",
    "aliases": [
      "fast api"
    ]
  },
  {
    "canonical": "Django",
    "category": "backend",
    "aliases": []
  },
  {
    "canonical": "Flask",
    "category": "backend",
    "aliases": []
  },
  {
    "canonical": "GraphQL",
    "category": "backend",
    "aliases": [
      "graph q l"
    ]
  },
  {
    "canonical": "REST API",
    "category": "backend",
    "aliases": [
      "rest a p i"
    ]
  },
  {
    "canonical": "gRPC",
    "category": "backend",
    "aliases": [
      "g r p c"
    ]
  },
  {
    "canonical": "WebSocket",
    "category": "backend",
    "aliases": [
      "web socket",
      "web sockets"
    ]
  },
  {
    "canonical": "Webhook",
    "category": "backend",
    "aliases": [
      "web hook",
      "web hooks"
    ]
  },
  {
    "canonical": "microservices",
    "category": "backend",
    "aliases": [
      "micro services"
    ]
  },
  {
    "canonical": "monolith",
    "category": "backend",
    "aliases": [
      "mono lith"
    ]
  },
  {
    "canonical": "middleware",
    "category": "backend",
    "aliases": [
      "middle ware"
    ]
  },
  {
    "canonical": "serialization",
    "category": "backend",
    "aliases": [
      "serialisation"
    ]
  },
  {
    "canonical": "Dependency Injection",
    "category": "backend",
    "aliases": []
  },
  {
    "canonical": "Inversion of Control",
    "category": "backend",
    "aliases": []
  },
  {
    "canonical": "multithreading",
    "category": "backend",
    "aliases": [
      "multi threading"
    ]
  },
  {
    "canonical": "synchronization",
    "category": "backend",
    "aliases": [
      "synchronisation"
    ]
  },
  {
    "canonical": "ExecutorService",
    "category": "backend",
    "aliases": [
      "executor service"
    ]
  },
  {
    "canonical": "CompletableFuture",
    "category": "backend",
    "aliases": [
      "completable future"
    ]
  },
  {
    "canonical": "HashMap",
    "category": "backend",
    "aliases": [
      "hash map"
    ]
  },
  {
    "canonical": "ConcurrentHashMap",
    "category": "backend",
    "aliases": [
      "concurrent hash map"
    ]
  },
  {
    "canonical": "PostgreSQL",
    "category": "database",
    "aliases": [
      "postgre sql",
      "postgres sql",
      "postgre sequel"
    ]
  },
  {
    "canonical": "MySQL",
    "category": "database",
    "aliases": [
      "my sql",
      "my sequel"
    ]
  },
  {
    "canonical": "MongoDB",
    "category": "database",
    "aliases": [
      "mongo db",
      "mongo d b"
    ]
  },
  {
    "canonical": "MariaDB",
    "category": "database",
    "aliases": [
      "maria db"
    ]
  },
  {
    "canonical": "DynamoDB",
    "category": "database",
    "aliases": [
      "dynamo db",
      "dynamo d b"
    ]
  },
  {
    "canonical": "SQLite",
    "category": "database",
    "aliases": [
      "sql lite"
    ]
  },
  {
    "canonical": "Redis",
    "category": "database",
    "aliases": []
  },
  {
    "canonical": "Prisma",
    "category": "database",
    "aliases": [
      "priz ma"
    ]
  },
  {
    "canonical": "Drizzle",
    "category": "database",
    "aliases": [
      "driz zle"
    ]
  },
  {
    "canonical": "Sequelize",
    "category": "database",
    "aliases": [
      "sequel ize"
    ]
  },
  {
    "canonical": "TypeORM",
    "category": "database",
    "aliases": [
      "type orm"
    ]
  },
  {
    "canonical": "Mongoose",
    "category": "database",
    "aliases": [
      "mongo ose"
    ]
  },
  {
    "canonical": "Elasticsearch",
    "category": "database",
    "aliases": [
      "elastic search"
    ]
  },
  {
    "canonical": "Cassandra",
    "category": "database",
    "aliases": [
      "cassan dra"
    ]
  },
  {
    "canonical": "Neo4j",
    "category": "database",
    "aliases": [
      "neo four j"
    ]
  },
  {
    "canonical": "Snowflake",
    "category": "database",
    "aliases": [
      "snow flake"
    ]
  },
  {
    "canonical": "ORM",
    "category": "database",
    "aliases": [
      "o r m"
    ]
  },
  {
    "canonical": "ACID",
    "category": "database",
    "aliases": [
      "a c i d"
    ]
  },
  {
    "canonical": "DDL",
    "category": "database",
    "aliases": [
      "d d l"
    ]
  },
  {
    "canonical": "DML",
    "category": "database",
    "aliases": [
      "d m l"
    ]
  },
  {
    "canonical": "DCL",
    "category": "database",
    "aliases": [
      "d c l"
    ]
  },
  {
    "canonical": "TCL",
    "category": "database",
    "aliases": [
      "t c l"
    ]
  },
  {
    "canonical": "normalization",
    "category": "database",
    "aliases": [
      "normalisation"
    ]
  },
  {
    "canonical": "denormalization",
    "category": "database",
    "aliases": [
      "de normalization",
      "denormalisation"
    ]
  },
  {
    "canonical": "transaction",
    "category": "database",
    "aliases": []
  },
  {
    "canonical": "replication",
    "category": "database",
    "aliases": []
  },
  {
    "canonical": "sharding",
    "category": "database",
    "aliases": [
      "shard ing"
    ]
  },
  {
    "canonical": "partitioning",
    "category": "database",
    "aliases": []
  },
  {
    "canonical": "Deadlock",
    "category": "database",
    "aliases": [
      "dead lock"
    ]
  },
  {
    "canonical": "B-tree",
    "category": "database",
    "aliases": [
      "b tree"
    ]
  },
  {
    "canonical": "primary key",
    "category": "database",
    "aliases": []
  },
  {
    "canonical": "foreign key",
    "category": "database",
    "aliases": []
  },
  {
    "canonical": "materialized view",
    "category": "database",
    "aliases": [
      "materialised view"
    ]
  },
  {
    "canonical": "connection pooling",
    "category": "database",
    "aliases": []
  },
  {
    "canonical": "AWS",
    "category": "cloud",
    "aliases": [
      "a w s"
    ]
  },
  {
    "canonical": "Azure",
    "category": "cloud",
    "aliases": [
      "az ure"
    ]
  },
  {
    "canonical": "GCP",
    "category": "cloud",
    "aliases": [
      "g c p"
    ]
  },
  {
    "canonical": "EC2",
    "category": "cloud",
    "aliases": [
      "e c two",
      "e c 2"
    ]
  },
  {
    "canonical": "S3",
    "category": "cloud",
    "aliases": [
      "s three",
      "s 3"
    ]
  },
  {
    "canonical": "ECS",
    "category": "cloud",
    "aliases": [
      "e c s"
    ]
  },
  {
    "canonical": "EKS",
    "category": "cloud",
    "aliases": [
      "e k s"
    ]
  },
  {
    "canonical": "ECR",
    "category": "cloud",
    "aliases": [
      "e c r"
    ]
  },
  {
    "canonical": "ELB",
    "category": "cloud",
    "aliases": [
      "e l b"
    ]
  },
  {
    "canonical": "ALB",
    "category": "cloud",
    "aliases": [
      "a l b"
    ]
  },
  {
    "canonical": "NLB",
    "category": "cloud",
    "aliases": [
      "n l b"
    ]
  },
  {
    "canonical": "RDS",
    "category": "cloud",
    "aliases": [
      "r d s"
    ]
  },
  {
    "canonical": "VPC",
    "category": "cloud",
    "aliases": [
      "v p c"
    ]
  },
  {
    "canonical": "IAM",
    "category": "cloud",
    "aliases": [
      "i a m"
    ]
  },
  {
    "canonical": "CloudFront",
    "category": "cloud",
    "aliases": [
      "cloud front"
    ]
  },
  {
    "canonical": "CloudFormation",
    "category": "cloud",
    "aliases": [
      "cloud formation"
    ]
  },
  {
    "canonical": "CloudWatch",
    "category": "cloud",
    "aliases": [
      "cloud watch"
    ]
  },
  {
    "canonical": "CloudTrail",
    "category": "cloud",
    "aliases": [
      "cloud trail"
    ]
  },
  {
    "canonical": "Route53",
    "category": "cloud",
    "aliases": [
      "route fifty three",
      "route 53"
    ]
  },
  {
    "canonical": "API Gateway",
    "category": "cloud",
    "aliases": [
      "api gate way"
    ]
  },
  {
    "canonical": "Lambda",
    "category": "cloud",
    "aliases": [
      "lam da"
    ]
  },
  {
    "canonical": "SQS",
    "category": "cloud",
    "aliases": [
      "s q s"
    ]
  },
  {
    "canonical": "SNS",
    "category": "cloud",
    "aliases": [
      "s n s"
    ]
  },
  {
    "canonical": "SES",
    "category": "cloud",
    "aliases": [
      "s e s"
    ]
  },
  {
    "canonical": "Fargate",
    "category": "cloud",
    "aliases": [
      "far gate"
    ]
  },
  {
    "canonical": "Auto Scaling",
    "category": "cloud",
    "aliases": []
  },
  {
    "canonical": "Availability Zone",
    "category": "cloud",
    "aliases": []
  },
  {
    "canonical": "CDN",
    "category": "cloud",
    "aliases": [
      "c d n"
    ]
  },
  {
    "canonical": "DNS",
    "category": "cloud",
    "aliases": [
      "d n s"
    ]
  },
  {
    "canonical": "Docker",
    "category": "cloud",
    "aliases": [
      "dock er"
    ]
  },
  {
    "canonical": "Kubernetes",
    "category": "cloud",
    "aliases": [
      "kuber netes",
      "k eight s"
    ]
  },
  {
    "canonical": "Helm",
    "category": "cloud",
    "aliases": []
  },
  {
    "canonical": "Terraform",
    "category": "cloud",
    "aliases": [
      "terra form"
    ]
  },
  {
    "canonical": "Ansible",
    "category": "cloud",
    "aliases": [
      "ansi ble"
    ]
  },
  {
    "canonical": "Jenkins",
    "category": "cloud",
    "aliases": [
      "jen kins"
    ]
  },
  {
    "canonical": "GitHub Actions",
    "category": "cloud",
    "aliases": [
      "git hub actions"
    ]
  },
  {
    "canonical": "GitLab",
    "category": "cloud",
    "aliases": [
      "git lab"
    ]
  },
  {
    "canonical": "CI/CD",
    "category": "cloud",
    "aliases": [
      "c i c d"
    ]
  },
  {
    "canonical": "DevOps",
    "category": "cloud",
    "aliases": [
      "dev ops"
    ]
  },
  {
    "canonical": "Nginx",
    "category": "cloud",
    "aliases": [
      "engine x"
    ]
  },
  {
    "canonical": "Prometheus",
    "category": "cloud",
    "aliases": [
      "promethe us"
    ]
  },
  {
    "canonical": "Grafana",
    "category": "cloud",
    "aliases": [
      "gra fana"
    ]
  },
  {
    "canonical": "OpenTelemetry",
    "category": "cloud",
    "aliases": [
      "open telemetry"
    ]
  },
  {
    "canonical": "Datadog",
    "category": "cloud",
    "aliases": [
      "data dog"
    ]
  },
  {
    "canonical": "OAuth",
    "category": "security",
    "aliases": [
      "o auth"
    ]
  },
  {
    "canonical": "OIDC",
    "category": "security",
    "aliases": [
      "o i d c"
    ]
  },
  {
    "canonical": "JWT",
    "category": "security",
    "aliases": [
      "j w t"
    ]
  },
  {
    "canonical": "SAML",
    "category": "security",
    "aliases": [
      "s a m l"
    ]
  },
  {
    "canonical": "SSO",
    "category": "security",
    "aliases": [
      "s s o"
    ]
  },
  {
    "canonical": "MFA",
    "category": "security",
    "aliases": [
      "m f a"
    ]
  },
  {
    "canonical": "RBAC",
    "category": "security",
    "aliases": [
      "r b a c"
    ]
  },
  {
    "canonical": "ABAC",
    "category": "security",
    "aliases": [
      "a b a c"
    ]
  },
  {
    "canonical": "CORS",
    "category": "security",
    "aliases": [
      "c o r s"
    ]
  },
  {
    "canonical": "CSRF",
    "category": "security",
    "aliases": [
      "c s r f"
    ]
  },
  {
    "canonical": "XSS",
    "category": "security",
    "aliases": [
      "x s s"
    ]
  },
  {
    "canonical": "HTTPS",
    "category": "security",
    "aliases": [
      "h t t p s"
    ]
  },
  {
    "canonical": "TLS",
    "category": "security",
    "aliases": [
      "t l s"
    ]
  },
  {
    "canonical": "SSL",
    "category": "security",
    "aliases": [
      "s s l"
    ]
  },
  {
    "canonical": "OWASP",
    "category": "security",
    "aliases": [
      "o wasp"
    ]
  },
  {
    "canonical": "authentication",
    "category": "security",
    "aliases": [
      "authentification"
    ]
  },
  {
    "canonical": "authorization",
    "category": "security",
    "aliases": [
      "authorisation"
    ]
  },
  {
    "canonical": "encryption",
    "category": "security",
    "aliases": [
      "en cryption"
    ]
  },
  {
    "canonical": "Hashing",
    "category": "security",
    "aliases": [
      "hash ing"
    ]
  },
  {
    "canonical": "SQL injection",
    "category": "security",
    "aliases": [
      "s q l injection"
    ]
  },
  {
    "canonical": "Keycloak",
    "category": "security",
    "aliases": [
      "key cloak"
    ]
  },
  {
    "canonical": "Auth0",
    "category": "security",
    "aliases": [
      "auth zero",
      "auth 0"
    ]
  },
  {
    "canonical": "vulnerability",
    "category": "security",
    "aliases": [
      "vulnerabilty"
    ]
  },
  {
    "canonical": "Kafka",
    "category": "system-design",
    "aliases": [
      "kaf ka"
    ]
  },
  {
    "canonical": "RabbitMQ",
    "category": "system-design",
    "aliases": [
      "rabbit mq",
      "rabbit m q"
    ]
  },
  {
    "canonical": "ActiveMQ",
    "category": "system-design",
    "aliases": [
      "active mq"
    ]
  },
  {
    "canonical": "Redis Streams",
    "category": "system-design",
    "aliases": []
  },
  {
    "canonical": "Pub/Sub",
    "category": "system-design",
    "aliases": [
      "pub sub"
    ]
  },
  {
    "canonical": "Load Balancer",
    "category": "system-design",
    "aliases": []
  },
  {
    "canonical": "Rate Limiting",
    "category": "system-design",
    "aliases": []
  },
  {
    "canonical": "Circuit Breaker",
    "category": "system-design",
    "aliases": []
  },
  {
    "canonical": "Event Sourcing",
    "category": "system-design",
    "aliases": []
  },
  {
    "canonical": "CQRS",
    "category": "system-design",
    "aliases": [
      "c q r s"
    ]
  },
  {
    "canonical": "CAP theorem",
    "category": "system-design",
    "aliases": []
  },
  {
    "canonical": "Eventual Consistency",
    "category": "system-design",
    "aliases": []
  },
  {
    "canonical": "idempotency",
    "category": "system-design",
    "aliases": [
      "idem potency"
    ]
  },
  {
    "canonical": "Observability",
    "category": "system-design",
    "aliases": []
  },
  {
    "canonical": "Distributed Tracing",
    "category": "system-design",
    "aliases": []
  },
  {
    "canonical": "Backpressure",
    "category": "system-design",
    "aliases": [
      "back pressure"
    ]
  },
  {
    "canonical": "Caching",
    "category": "system-design",
    "aliases": [
      "cache ing"
    ]
  },
  {
    "canonical": "Consistent Hashing",
    "category": "system-design",
    "aliases": []
  },
  {
    "canonical": "Leader Election",
    "category": "system-design",
    "aliases": []
  },
  {
    "canonical": "Pagination",
    "category": "system-design",
    "aliases": [
      "pagi nation"
    ]
  },
  {
    "canonical": "WebRTC",
    "category": "system-design",
    "aliases": [
      "web r t c"
    ]
  },
  {
    "canonical": "TCP",
    "category": "system-design",
    "aliases": [
      "t c p"
    ]
  },
  {
    "canonical": "UDP",
    "category": "system-design",
    "aliases": [
      "u d p"
    ]
  },
  {
    "canonical": "HTTP",
    "category": "system-design",
    "aliases": [
      "h t t p"
    ]
  },
  {
    "canonical": "RPC",
    "category": "system-design",
    "aliases": [
      "r p c"
    ]
  },
  {
    "canonical": "SSE",
    "category": "system-design",
    "aliases": [
      "s s e"
    ]
  },
  {
    "canonical": "BFF",
    "category": "system-design",
    "aliases": [
      "b f f"
    ]
  },
  {
    "canonical": "Array",
    "category": "algorithms",
    "aliases": []
  },
  {
    "canonical": "Linked List",
    "category": "algorithms",
    "aliases": []
  },
  {
    "canonical": "Binary Search",
    "category": "algorithms",
    "aliases": []
  },
  {
    "canonical": "Binary Search Tree",
    "category": "algorithms",
    "aliases": []
  },
  {
    "canonical": "BST",
    "category": "algorithms",
    "aliases": [
      "b s t"
    ]
  },
  {
    "canonical": "BFS",
    "category": "algorithms",
    "aliases": [
      "b f s"
    ]
  },
  {
    "canonical": "DFS",
    "category": "algorithms",
    "aliases": [
      "d f s"
    ]
  },
  {
    "canonical": "LIFO",
    "category": "algorithms",
    "aliases": [
      "l i f o"
    ]
  },
  {
    "canonical": "FIFO",
    "category": "algorithms",
    "aliases": [
      "f i f o"
    ]
  },
  {
    "canonical": "Recursion",
    "category": "algorithms",
    "aliases": [
      "re cursion"
    ]
  },
  {
    "canonical": "Dynamic Programming",
    "category": "algorithms",
    "aliases": []
  },
  {
    "canonical": "Backtracking",
    "category": "algorithms",
    "aliases": [
      "back tracking"
    ]
  },
  {
    "canonical": "Sliding Window",
    "category": "algorithms",
    "aliases": []
  },
  {
    "canonical": "Two Pointers",
    "category": "algorithms",
    "aliases": []
  },
  {
    "canonical": "Dijkstra",
    "category": "algorithms",
    "aliases": [
      "dijk stra"
    ]
  },
  {
    "canonical": "Heap",
    "category": "algorithms",
    "aliases": []
  },
  {
    "canonical": "Trie",
    "category": "algorithms",
    "aliases": []
  },
  {
    "canonical": "Time Complexity",
    "category": "algorithms",
    "aliases": []
  },
  {
    "canonical": "Space Complexity",
    "category": "algorithms",
    "aliases": []
  },
  {
    "canonical": "Big O",
    "category": "algorithms",
    "aliases": [
      "big oh"
    ]
  },
  {
    "canonical": "Quicksort",
    "category": "algorithms",
    "aliases": [
      "quick sort"
    ]
  },
  {
    "canonical": "Mergesort",
    "category": "algorithms",
    "aliases": [
      "merge sort"
    ]
  },
  {
    "canonical": "Bubble Sort",
    "category": "algorithms",
    "aliases": []
  },
  {
    "canonical": "Jest",
    "category": "quality-delivery",
    "aliases": []
  },
  {
    "canonical": "Vitest",
    "category": "quality-delivery",
    "aliases": [
      "vi test"
    ]
  },
  {
    "canonical": "Cypress",
    "category": "quality-delivery",
    "aliases": [
      "cy press"
    ]
  },
  {
    "canonical": "Playwright",
    "category": "quality-delivery",
    "aliases": [
      "play wright"
    ]
  },
  {
    "canonical": "Selenium",
    "category": "quality-delivery",
    "aliases": [
      "sele nium"
    ]
  },
  {
    "canonical": "JUnit",
    "category": "quality-delivery",
    "aliases": [
      "j unit"
    ]
  },
  {
    "canonical": "Mockito",
    "category": "quality-delivery",
    "aliases": [
      "mock ito"
    ]
  },
  {
    "canonical": "Postman",
    "category": "quality-delivery",
    "aliases": [
      "post man"
    ]
  },
  {
    "canonical": "Swagger",
    "category": "quality-delivery",
    "aliases": [
      "swag ger"
    ]
  },
  {
    "canonical": "OpenAPI",
    "category": "quality-delivery",
    "aliases": [
      "open api"
    ]
  },
  {
    "canonical": "TDD",
    "category": "quality-delivery",
    "aliases": [
      "t d d"
    ]
  },
  {
    "canonical": "BDD",
    "category": "quality-delivery",
    "aliases": [
      "b d d"
    ]
  },
  {
    "canonical": "E2E",
    "category": "quality-delivery",
    "aliases": [
      "e two e",
      "e 2 e"
    ]
  },
  {
    "canonical": "RTL",
    "category": "quality-delivery",
    "aliases": [
      "r t l"
    ]
  },
  {
    "canonical": "SOLID",
    "category": "quality-delivery",
    "aliases": [
      "s o l i d"
    ]
  },
  {
    "canonical": "DRY",
    "category": "quality-delivery",
    "aliases": [
      "d r y"
    ]
  },
  {
    "canonical": "KISS",
    "category": "quality-delivery",
    "aliases": [
      "k i s s"
    ]
  },
  {
    "canonical": "YAGNI",
    "category": "quality-delivery",
    "aliases": [
      "y a g n i"
    ]
  },
  {
    "canonical": "Jira",
    "category": "quality-delivery",
    "aliases": [
      "jee ra"
    ]
  },
  {
    "canonical": "Confluence",
    "category": "quality-delivery",
    "aliases": [
      "con fluence"
    ]
  },
  {
    "canonical": "Scrum",
    "category": "quality-delivery",
    "aliases": []
  },
  {
    "canonical": "Kanban",
    "category": "quality-delivery",
    "aliases": [
      "kan ban"
    ]
  },
  {
    "canonical": "Agile",
    "category": "quality-delivery",
    "aliases": []
  },
  {
    "canonical": "SLA",
    "category": "quality-delivery",
    "aliases": [
      "s l a"
    ]
  },
  {
    "canonical": "SLO",
    "category": "quality-delivery",
    "aliases": [
      "s l o"
    ]
  },
  {
    "canonical": "SLI",
    "category": "quality-delivery",
    "aliases": [
      "s l i"
    ]
  },
  {
    "canonical": "KPI",
    "category": "quality-delivery",
    "aliases": [
      "k p i"
    ]
  },
  {
    "canonical": "OKR",
    "category": "quality-delivery",
    "aliases": [
      "o k r"
    ]
  },
  {
    "canonical": "RACI",
    "category": "quality-delivery",
    "aliases": [
      "r a c i"
    ]
  },
  {
    "canonical": "MTTR",
    "category": "quality-delivery",
    "aliases": [
      "m t t r"
    ]
  },
  {
    "canonical": "GitHub",
    "category": "quality-delivery",
    "aliases": [
      "git hub"
    ]
  },
  {
    "canonical": "Git",
    "category": "quality-delivery",
    "aliases": []
  },
  {
    "canonical": "Rebase",
    "category": "quality-delivery",
    "aliases": [
      "re base"
    ]
  },
  {
    "canonical": "cherry-pick",
    "category": "quality-delivery",
    "aliases": [
      "cherry pick"
    ]
  },
  {
    "canonical": "pull request",
    "category": "quality-delivery",
    "aliases": []
  },
  {
    "canonical": "Flutter",
    "category": "quality-delivery",
    "aliases": []
  },
  {
    "canonical": "Firebase",
    "category": "quality-delivery",
    "aliases": [
      "fire base"
    ]
  },
  {
    "canonical": "FCM",
    "category": "quality-delivery",
    "aliases": [
      "f c m"
    ]
  },
  {
    "canonical": "Contentful",
    "category": "quality-delivery",
    "aliases": [
      "content full"
    ]
  },
  {
    "canonical": "CSS",
    "category": "frontend",
    "aliases": [
      "c s s"
    ]
  },
  {
    "canonical": "HTML",
    "category": "frontend",
    "aliases": [
      "h t m l"
    ]
  },
  {
    "canonical": "SSR",
    "category": "frontend",
    "aliases": [
      "s s r"
    ]
  },
  {
    "canonical": "SSG",
    "category": "frontend",
    "aliases": [
      "s s g"
    ]
  },
  {
    "canonical": "ISR",
    "category": "frontend",
    "aliases": [
      "i s r"
    ]
  },
  {
    "canonical": "CSR",
    "category": "frontend",
    "aliases": [
      "c s r"
    ]
  },
  {
    "canonical": "SPA",
    "category": "frontend",
    "aliases": [
      "s p a"
    ]
  },
  {
    "canonical": "PWA",
    "category": "frontend",
    "aliases": [
      "p w a"
    ]
  },
  {
    "canonical": "SEO",
    "category": "frontend",
    "aliases": [
      "s e o"
    ]
  },
  {
    "canonical": "ARIA",
    "category": "frontend",
    "aliases": [
      "a r i a"
    ]
  },
  {
    "canonical": "HOC",
    "category": "frontend",
    "aliases": [
      "h o c"
    ]
  },
  {
    "canonical": "DOM API",
    "category": "frontend",
    "aliases": []
  },
  {
    "canonical": "RxJS",
    "category": "frontend",
    "aliases": [
      "rx js"
    ]
  },
  {
    "canonical": "Vite",
    "category": "frontend",
    "aliases": []
  },
  {
    "canonical": "Vue",
    "category": "frontend",
    "aliases": []
  },
  {
    "canonical": "Recoil",
    "category": "frontend",
    "aliases": [
      "re coil"
    ]
  },
  {
    "canonical": "API",
    "category": "backend",
    "aliases": [
      "a p i"
    ]
  },
  {
    "canonical": "JSON",
    "category": "backend",
    "aliases": [
      "j s o n"
    ]
  },
  {
    "canonical": "XML",
    "category": "backend",
    "aliases": [
      "x m l"
    ]
  },
  {
    "canonical": "YAML",
    "category": "backend",
    "aliases": [
      "y a m l"
    ]
  },
  {
    "canonical": "OOP",
    "category": "backend",
    "aliases": [
      "o o p"
    ]
  },
  {
    "canonical": "IOC",
    "category": "backend",
    "aliases": [
      "i o c"
    ]
  },
  {
    "canonical": "SOLID principles",
    "category": "backend",
    "aliases": []
  },
  {
    "canonical": "DTO",
    "category": "backend",
    "aliases": [
      "d t o"
    ]
  },
  {
    "canonical": "DAO",
    "category": "backend",
    "aliases": [
      "d a o"
    ]
  },
  {
    "canonical": "POJO",
    "category": "backend",
    "aliases": [
      "p o j o"
    ]
  },
  {
    "canonical": "HashSet",
    "category": "backend",
    "aliases": [
      "hash set"
    ]
  },
  {
    "canonical": "ArrayList",
    "category": "backend",
    "aliases": [
      "array list"
    ]
  },
  {
    "canonical": "LinkedHashMap",
    "category": "backend",
    "aliases": [
      "linked hash map"
    ]
  },
  {
    "canonical": "Optional",
    "category": "backend",
    "aliases": []
  },
  {
    "canonical": "Stream API",
    "category": "backend",
    "aliases": []
  },
  {
    "canonical": "Spring WebFlux",
    "category": "backend",
    "aliases": [
      "spring web flux"
    ]
  },
  {
    "canonical": "Spring Data",
    "category": "backend",
    "aliases": []
  },
  {
    "canonical": "Spring Cloud",
    "category": "backend",
    "aliases": []
  },
  {
    "canonical": "Resilience4j",
    "category": "backend",
    "aliases": [
      "resilience four j"
    ]
  },
  {
    "canonical": "SQL",
    "category": "database",
    "aliases": [
      "s q l"
    ]
  },
  {
    "canonical": "NoSQL",
    "category": "database",
    "aliases": [
      "no sql"
    ]
  },
  {
    "canonical": "MVCC",
    "category": "database",
    "aliases": [
      "m v c c"
    ]
  },
  {
    "canonical": "CTE",
    "category": "database",
    "aliases": [
      "c t e"
    ]
  },
  {
    "canonical": "UPSERT",
    "category": "database",
    "aliases": [
      "up sert"
    ]
  },
  {
    "canonical": "EXPLAIN",
    "category": "database",
    "aliases": []
  },
  {
    "canonical": "UUID",
    "category": "database",
    "aliases": [
      "u u i d"
    ]
  },
  {
    "canonical": "HTTP2",
    "category": "system-design",
    "aliases": [
      "h t t p two"
    ]
  },
  {
    "canonical": "HTTP3",
    "category": "system-design",
    "aliases": [
      "h t t p three"
    ]
  },
  {
    "canonical": "FTP",
    "category": "system-design",
    "aliases": [
      "f t p"
    ]
  },
  {
    "canonical": "IP",
    "category": "system-design",
    "aliases": [
      "i p"
    ]
  },
  {
    "canonical": "URI",
    "category": "system-design",
    "aliases": [
      "u r i"
    ]
  },
  {
    "canonical": "URL",
    "category": "system-design",
    "aliases": [
      "u r l"
    ]
  },
  {
    "canonical": "REST",
    "category": "system-design",
    "aliases": [
      "r e s t"
    ]
  },
  {
    "canonical": "CRUD",
    "category": "system-design",
    "aliases": [
      "c r u d"
    ]
  },
  {
    "canonical": "MTU",
    "category": "system-design",
    "aliases": [
      "m t u"
    ]
  },
  {
    "canonical": "npm",
    "category": "quality-delivery",
    "aliases": [
      "n p m"
    ]
  },
  {
    "canonical": "pnpm",
    "category": "quality-delivery",
    "aliases": [
      "p n p m"
    ]
  },
  {
    "canonical": "Mocha",
    "category": "quality-delivery",
    "aliases": [
      "mo cha"
    ]
  },
  {
    "canonical": "Chai",
    "category": "quality-delivery",
    "aliases": []
  },
  {
    "canonical": "TestNG",
    "category": "quality-delivery",
    "aliases": [
      "test n g"
    ]
  },
  {
    "canonical": "SonarQube",
    "category": "quality-delivery",
    "aliases": [
      "sonar cube"
    ]
  },
  {
    "canonical": "Gherkin",
    "category": "quality-delivery",
    "aliases": [
      "gher kin"
    ]
  },
  {
    "canonical": "UAT",
    "category": "quality-delivery",
    "aliases": [
      "u a t"
    ]
  },
  {
    "canonical": "QA",
    "category": "quality-delivery",
    "aliases": [
      "q a"
    ]
  },
  {
    "canonical": "PR",
    "category": "quality-delivery",
    "aliases": [
      "p r"
    ]
  }
];
