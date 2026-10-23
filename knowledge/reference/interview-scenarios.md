# Scenario practice: developer interviews

Practice questions synthesized from the user's shared chats:
- https://chatgpt.com/share/6acc8328-3f34-83ec-85ee-033c10b82374
- https://chatgpt.com/share/6acc8357-2840-83e8-b0ea-b38b39136b41

These are general practice outlines, NOT resume evidence. Shared answers include hypothetical examples and other candidates' personas. Never claim these deployments, incidents, tools, or results were the user's experience. Original screenshot-only questions were not independently transcribed; these practice variants reflect the available chat text.

## How would you safely update one million database records?

I would first establish correctness, identify the target rows, and choose a bounded batch approach rather than one long transaction. Each committed batch needs a durable progress checkpoint and idempotent updates so a retry does not corrupt data. A stable indexed key is preferable to repeatedly scanning changing offsets. Batch size should be measured against lock waits, transaction duration and customer-facing latency, not chosen as a universal fixed number. Verify final counts and invariants, with a pause/resume and recovery plan.

Follow-up: A worker crashes halfway through. Resume from committed progress; account for a crash after commit but before checkpoint using idempotency or an atomic progress update.

## How would you choose concurrency for 500 API calls, image resizing, and database writes?

I would distinguish waiting on I/O from CPU work. Network calls need bounded concurrency, deadlines, cancellation, upstream rate limits and safe retries. CPU-heavy work needs a bounded worker pool or a library that already offloads processing; adding threads indiscriminately can increase memory pressure. Database writes should use suitable batching or controlled pooled connections while preserving transaction semantics. Measure throughput, memory and tail latency before increasing parallelism.

Follow-up: An API becomes slow or returns 429. Respect its retry policy, reduce pressure, and avoid retry storms; do not launch all requests without limits.

## How would you choose worker threads versus separate processes for image resizing?

I would evaluate CPU and memory costs, native-library behavior, communication overhead and failure isolation. Worker threads are a parallelism option; separate processes provide a stronger crash boundary. A fixed pool and bounded queue matter more than creating one worker per image. Check whether the image library already uses a native pool. Verify with representative image sizes, throughput, memory usage and deliberate worker failures.

## How would you make a deployment pipeline safe and recover from failing tasks?

I would build and test an immutable artifact, validate configuration and secrets, deploy with health checks, and watch both service health and user-visible errors. Select rolling, canary or blue-green behavior according to the actual platform rather than assume every platform supports every traffic-shifting mode. Keep a verified previous artifact and a tested rollback procedure. Application rollback is safe only when data and schema remain compatible. Deployment success is not proof that business transactions work.

Follow-up: How large should the canary be? Use risk, traffic volume, baseline metrics and an observation window; sample percentages and alarm thresholds are illustrative, not universal defaults.

## How would you handle database migrations during a deployment and rollback?

I would separate additive changes, application compatibility, backfill and later cleanup. Test old and new application versions against the transitional schema. Backfill safely and verify data before deleting old structures. A backup is a recovery resource, not a guarantee of immediate lossless rollback. Stop rollout or disable a feature when needed, preserving data while investigating.

## What would you do if a feature flag rollout caused production errors?

I would stop further exposure, disable the risky path if the flag genuinely bypasses it, and verify recovery using errors, latency and business metrics. Check whether the feature already changed data; a flag does not undo writes or replace a recovery plan. Investigate the failure, test the repair and re-enable gradually. Explain the developer's design, tests, deployment safeguards and ownership rather than invent a past incident.

## How would you choose React state management and handle slow API results?

I would separate local UI state, shared client state and server data. Keep state close to its owners and introduce a shared store only for a real coordination need. Include loading, empty, error and stale-request behavior; prevent older responses from overwriting newer selections. Use a hypothetical SharesEye screen when relevant, but do not claim a specific state library was used unless documented. Verify with tests for rapid user input, failed requests and changing data.

## How would you solve and test an array balance-point problem?

I would clarify the index convention, required sentinel and whether the current element is excluded. Compute a total, maintain a left sum and derive the right sum at each position. Check from left to right if the first valid index is required. Explain linear time and constant auxiliary space, then test no solution, a single item, boundaries, negative values, multiple solutions and numeric limits. Tests must call the actual exported function and contain assertions, not undefined placeholders or comments only.

## Write an AI prompt for a FastAPI Redis token-bucket rate limiter

Produce a prompt, not implementation code. Specify the route/decorator contract, Python/FastAPI, authenticated user identity, refill at 120 requests per minute and burst capacity of 240 tokens. Request atomic refill/check/consume using Redis Lua in one round trip, async pooled connections, idle-key expiry, HTTP 429 with remaining and retry headers, and a deliberate failure policy. Clarify that independent regional buckets are best-effort regional enforcement, not an exact global cap. Require tests for bursts, refill, concurrent requests, expiry, Redis failure and boundaries; ask for code, Lua, dependencies and route usage as deliverables of the requested AI implementation.
