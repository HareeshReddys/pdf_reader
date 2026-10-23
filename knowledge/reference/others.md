# Others interview reference

Generated from https://full-stack-interview-ecru.vercel.app/fullstack-dev/ for local search.
# Others Missing Fullstack Interview Topics

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/others-missing-fullstack-interview-topics

## OAuth 2.0; OAuth Flow; Authorization Code Grant; Client Credentials; PKCE

- OAuth 2.0 is used to allow one app to access another app safely.

- The user does not share the password directly with the third-party app.

- Authorization Code Grant is mostly used when a user logs in through Google, GitHub, or similar providers.

- Client Credentials flow is mostly used for server-to-server communication.

- PKCE adds extra security for frontend and mobile apps.

## OAuth vs JWT; Authentication vs Authorization; Token Types

- OAuth is mainly a permission system, not just a login system.

- JWT is a token format used to store and pass user information safely.

- Authentication checks who the user is.

- Authorization checks what the user is allowed to do.

- In real projects, OAuth and JWT are often used together.

## Access Token and Refresh Token; Token Rotation; Silent Refresh; Token Expiry

- Access token is short-lived and is used to call protected APIs.

- Refresh token is long-lived and is used to get a new access token.

- Token rotation means creating a new refresh token each time it is used.

- Silent refresh renews the session without asking the user to log in again.

- Short token expiry reduces risk if a token is stolen.

## NextAuth.js / Auth.js; Next.js Authentication; Session Provider; NextAuth Config

- NextAuth.js, now also called Auth.js, helps us add authentication in Next.js apps.

- It supports providers like Google, GitHub, and credentials login.

- SessionProvider makes session data available in client components.

- The auth config defines providers, callbacks, pages, and session strategy.

- It saves time because we do not need to build the full auth flow from scratch.

## NextAuth Providers; Google Auth; GitHub OAuth; Credentials Provider; Social Login

- Providers are login options like Google, GitHub, or email/password.

- Google and GitHub providers use OAuth behind the scenes.

- Credentials provider is used for custom email and password login.

- Social login improves user experience because users can login quickly.

- For credentials login, we must handle password hashing and validation carefully.

## NextAuth Session; useSession Hook; getServerSession; JWT vs Database Session

- useSession is used in client components to read logged-in user data.

- getServerSession is used on the server side to check the current user.

- JWT session stores session data inside a signed token.

- Database session stores session details in the database.

- Database sessions are easier to revoke, but JWT sessions are usually faster and simpler.

## RBAC; Role-Based Access Control; User Roles; Permission System

- RBAC means giving access based on the user's role.

- Common roles are admin, user, manager, and guest.

- Each role can have different permissions.

- It helps protect pages, APIs, and actions from unauthorized users.

- Example: only admin can delete users or manage settings.

## bcrypt; Password Hashing; Salt Rounds; Secure Password Storage

- bcrypt is used to store passwords safely.

- We should never store plain passwords in the database.

- bcrypt converts the password into a hashed value.

- Salt rounds make the hash harder to crack.

- During login, we compare the entered password with the saved hash.

## Session vs Token Based Auth; Cookie Session; JWT Token; Stateful vs Stateless Auth

- Session-based auth stores session data on the server.

- Token-based auth stores user details in a token like JWT.

- Session auth is stateful because the server remembers the session.

- Token auth is stateless because the server can verify the token directly.

- Both are useful, and the best choice depends on the project.

## Secure Cookie; HttpOnly; SameSite; Secure Flag; Cookie Security

- Secure cookies help protect login data in the browser.

- HttpOnly stops JavaScript from reading the cookie.

- Secure flag sends the cookie only over HTTPS.

- SameSite helps reduce CSRF attacks.

- For auth cookies, these settings are very important.

## Multi-Factor Authentication; MFA; TOTP; 2FA

- MFA means using more than one step to login.

- 2FA is a common type of MFA.

- TOTP generates time-based codes in apps like Google Authenticator.

- Even if the password is leaked, MFA adds another protection layer.

- It is useful for admin accounts and sensitive applications.

## Tailwind CSS; Utility-First CSS; Class Based Styling

- Tailwind CSS is a utility-first CSS framework.

- We style elements using small classes directly in HTML or JSX.

- It helps build UI quickly without writing many custom CSS files.

- Classes like flex, p-4, text-center, and bg-blue-500 are commonly used.

- It is very useful for fast and consistent UI development.

## Tailwind Config; tailwind.config.ts; Theme Extension; Custom Colors

- Tailwind config is used to customize Tailwind for a project.

- We can add custom colors, fonts, spacing, and breakpoints.

- Content paths tell Tailwind where to scan class names.

- Theme extension adds new values without removing default values.

- This helps keep the design consistent across the app.

## Tailwind Responsive Design; sm md lg xl; Mobile First Tailwind

- Tailwind follows a mobile-first approach.

- Base classes apply to small screens first.

- Prefixes like sm, md, lg, and xl apply styles for larger screens.

- Example: text-sm md:text-lg changes text size on bigger screens.

- It makes responsive design easier and faster.

## Tailwind Dark Mode; dark: Prefix; Tailwind Theming

- Tailwind supports dark mode using the dark: prefix.

- We can enable dark mode using class mode or system preference.

- Example: bg-white dark:bg-black changes background based on theme.

- Dark mode styles can be added without writing separate CSS files.

- It is useful for modern apps with light and dark themes.

## Tailwind @apply Directive; Reusable Styles; Extract Classes

- @apply lets us reuse Tailwind classes inside a CSS file.

- It is useful when the same class list is repeated many times.

- Example: a button style can be moved into one CSS class.

- We should not overuse it because Tailwind is mainly utility-first.

- Use it only when it improves readability.

## Tailwind JIT Mode; Unused CSS Removal; Build Size

- Tailwind JIT creates CSS only for the classes used in the project.

- It helps reduce final CSS file size.

- It also supports dynamic values like w-[300px].

- Old Tailwind versions used purge to remove unused CSS.

- Modern Tailwind is fast because JIT is built in.

## Tailwind vs CSS Modules; Styling Approach; Trade-offs

- Tailwind uses utility classes directly in markup.

- CSS Modules use scoped CSS files for components.

- Tailwind is faster for building UI quickly.

- CSS Modules can look cleaner when styles are complex.

- Both are good, and teams choose based on project style.

## Tailwind Plugins; Forms Plugin; Typography Plugin; Custom Plugin

- Tailwind plugins add extra ready-made utilities or styles.

- Forms plugin improves default form styling.

- Typography plugin is useful for blog or article content.

- We can also create custom plugins for project-specific utilities.

- Plugins help avoid repeating common styles.

## Tailwind Arbitrary Values; Square Bracket Syntax; One-Off Style

- Arbitrary values are used when Tailwind does not have the exact value we need.

- They are written inside square brackets.

- Example: w-[420px] or text-[#333333].

- They are useful for one-time custom styles.

- We should not overuse them because too many custom values can reduce consistency.

## GraphQL Subscriptions; Real-Time GraphQL; WebSocket; PubSub Pattern

- GraphQL subscriptions are used for real-time updates.

- They usually work using WebSocket connections.

- The server sends new data when something changes.

- They are useful for chat apps, live notifications, and dashboards.

- PubSub is a common pattern used behind subscriptions.

## GraphQL Fragments; Fragment Reuse; Shared Query Fields

- Fragments help reuse common fields in GraphQL queries.

- They avoid writing the same field list again and again.

- Named fragments can be shared across multiple queries.

- Inline fragments are useful when working with different object types.

- Fragments make large GraphQL queries cleaner.

## GraphQL Directives; @include; @skip; @deprecated

- Directives change how a GraphQL query or schema behaves.

- @include adds a field only when a condition is true.

- @skip removes a field when a condition is true.

- @deprecated marks a field as old and not recommended.

- Custom directives can be created for advanced use cases.

## GraphQL DataLoader; N+1 Problem; Batch Loading

- DataLoader helps reduce repeated database calls in GraphQL.

- It batches multiple requests into one request.

- It also caches data during the same request cycle.

- It is commonly used to solve the N+1 query problem.

- This improves performance in GraphQL APIs.

## Apollo Client; InMemoryCache; useQuery; Apollo State Management

- Apollo Client is a popular GraphQL client for frontend apps.

- useQuery is used to fetch data from a GraphQL API.

- InMemoryCache stores fetched data on the client side.

- It can update UI automatically when cached data changes.

- Apollo is powerful, but it can feel heavy for small projects.

## Apollo Client vs urql; GraphQL Client Comparison

- Apollo Client has many features built in.

- urql is lighter and simpler than Apollo.

- Apollo is good for large apps with complex caching needs.

- urql is good when we want a smaller and simpler GraphQL client.

- The choice depends on app size and team preference.

## GraphQL Error Handling; Partial Data; graphQLErrors; networkError

- GraphQL can return data and errors together.

- graphQLErrors are errors returned by the GraphQL server.

- networkError happens when the request itself fails.

- Partial data means some fields succeeded and some failed.

- Frontend should handle both data and error states clearly.

## GraphQL Federation; Supergraph; Subgraph; Apollo Federation

- GraphQL federation combines multiple GraphQL services into one API.

- Each service owns one part of the schema.

- Subgraphs are smaller GraphQL services.

- Supergraph is the combined schema used by clients.

- It is useful for large teams and microservice-based systems.

## GraphQL vs REST; Over-fetching; Under-fetching; When To Use

- REST uses multiple endpoints for different resources.

- GraphQL usually uses one endpoint and lets the client ask for exact fields.

- GraphQL reduces over-fetching and under-fetching.

- REST is simpler and easier for many basic APIs.

- GraphQL is useful when frontend needs flexible data shapes.

## Core Web Vitals; LCP; CLS; INP; Web Performance Metrics

- Core Web Vitals are important performance metrics for user experience.

- LCP checks how fast the main content loads.

- CLS checks how much the page layout moves unexpectedly.

- INP checks how quickly the page responds to user actions.

- Good scores help users feel the website is fast and smooth.

## LCP; Largest Contentful Paint; Render Time

- LCP measures when the biggest visible content appears on the screen.

- This content can be an image, heading, or large text block.

- A slow LCP makes the page feel slow.

- We can improve LCP by optimizing images, fonts, server response, and render blocking files.

- It is one of the most important loading performance metrics.

## CLS; Cumulative Layout Shift; Layout Stability

- CLS measures unexpected movement on a page.

- Example: a button moves down after an image loads.

- High CLS gives a bad user experience.

- We can reduce CLS by setting image sizes and reserving space for ads or dynamic content.

- Stable layouts feel more professional and easier to use.

## INP; Interaction to Next Paint; Responsiveness Metric

- INP measures how fast the page reacts after user interaction.

- Example interactions are click, tap, and keyboard input.

- A good INP means the page feels responsive.

- Long JavaScript tasks can make INP worse.

- We can improve it by reducing heavy work on the main thread.

## FCP; First Contentful Paint; Loading Performance

- FCP measures when the first visible content appears.

- It can be text, image, SVG, or canvas content.

- Fast FCP gives users confidence that the page is loading.

- Slow server response or large CSS can delay FCP.

- It is useful for understanding early page load performance.

## TTFB; Time To First Byte; Server Response Time

- TTFB measures how long the browser waits for the first byte from the server.

- Slow TTFB usually means backend, database, network, or hosting delay.

- Improving caching can reduce TTFB.

- Using a CDN can also help for static content.

- Good TTFB helps the whole page load faster.

## Lighthouse; Performance Audit; SEO Audit; Accessibility Audit

- Lighthouse is a tool used to check website quality.

- It gives scores for performance, accessibility, SEO, and best practices.

- It also gives suggestions to improve the page.

- We can run it from Chrome DevTools.

- It is useful before deployment and during performance tuning.

## Performance Profiling; Chrome DevTools; Flame Chart; Long Tasks

- Performance profiling helps us find why a page is slow.

- Chrome DevTools shows how JavaScript, rendering, and painting are working.

- A flame chart shows which tasks are taking more time.

- Long tasks can block user interactions.

- Profiling helps fix real performance problems instead of guessing.

## Bundle Analysis; Webpack Bundle Analyzer; Reduce Bundle Size

- Bundle analysis shows what is inside the final JavaScript bundle.

- It helps find large dependencies.

- Removing unused packages can improve load time.

- Code splitting can load only the needed code.

- Smaller bundles usually make websites faster.

## AWS S3; Object Storage; Presigned URL; Static File Hosting

- AWS S3 is used to store files like images, PDFs, backups, and static assets.

- It is object storage, not a normal database.

- Presigned URLs allow temporary secure upload or download access.

- S3 can also host static websites.

- It is commonly used in web apps for file uploads.

## AWS CloudFront and CDN; Edge Caching; Static Assets

- CloudFront is AWS's CDN service.

- A CDN stores files closer to users in different locations.

- It improves loading speed for images, scripts, and static files.

- It also reduces load on the original server.

- CloudFront is commonly used with S3 and web applications.

## AWS EC2 vs Lambda; Server vs Serverless

- EC2 is a virtual server where we manage the machine.

- Lambda runs code without managing a server.

- EC2 is good for long-running apps and full control.

- Lambda is good for event-based and short tasks.

- Lambda can have cold starts, but it scales automatically.

## AWS Lambda; Serverless Function; Cold Start; Event Trigger

- AWS Lambda runs small functions in the cloud.

- It runs only when triggered by an event.

- Common triggers are API Gateway, S3 upload, or scheduled jobs.

- Cold start means the first request may take extra time.

- It is useful when we want automatic scaling without managing servers.

## Vercel Serverless Functions; API Routes; Edge Functions

- Vercel serverless functions are used to run backend code in a Vercel app.

- API routes in Next.js can run as serverless functions.

- Edge functions run closer to users for faster response.

- They are good for small APIs, auth checks, and dynamic logic.

- For heavy long-running tasks, a dedicated backend may be better.

## Feature Flags; Feature Toggles; Gradual Rollout; A/B Testing

- Feature flags let us turn features on or off without redeploying code.

- They help release features slowly to a few users first.

- They are useful for A/B testing.

- They reduce risk because we can disable a bad feature quickly.

- Tools like LaunchDarkly help manage feature flags.

## Kubernetes; K8s; Container Orchestration

- Kubernetes is used to manage containers in production.

- It can start, stop, scale, and restart containers automatically.

- It helps run applications reliably across many machines.

- K8s is just the short name for Kubernetes.

- It is mostly used in large or cloud-native systems.

## Kubernetes Pod; Pod vs Container; Pod Lifecycle

- A pod is the smallest deployable unit in Kubernetes.

- A pod can contain one or more containers.

- Containers inside the same pod can share network and storage.

- Usually, one pod runs one main application container.

- Kubernetes creates and destroys pods based on the desired state.

## Kubernetes Deployment; ReplicaSet; Rolling Update; Desired State

- A Deployment manages running pods in Kubernetes.

- It makes sure the required number of pods are always running.

- ReplicaSet is used internally to maintain pod copies.

- Rolling update replaces old pods with new pods slowly.

- Desired state means we tell Kubernetes what we want, and it tries to keep it that way.

## Kubernetes Service; ClusterIP; NodePort; LoadBalancer

- A Service gives a stable way to access pods.

- Pods can change, but the service address stays stable.

- ClusterIP exposes the service inside the cluster.

- NodePort exposes it through a port on the node.

- LoadBalancer exposes it using an external cloud load balancer.

## Kubernetes ConfigMap; Environment Config; Non-Secret Config

- ConfigMap stores non-secret configuration values.

- Examples are app mode, API URL, and feature settings.

- It helps keep config separate from application code.

- ConfigMap values can be used as environment variables.

- Secrets should not be stored in ConfigMap.

## Kubernetes Secret; Store Credentials; Secret vs ConfigMap

- Secret is used to store sensitive values like passwords and tokens.

- It is better than storing secrets directly in code.

- Secrets can be mounted as files or used as environment variables.

- ConfigMap is for normal config, Secret is for sensitive config.

- In real projects, secrets should be managed carefully with access control.

## Kubernetes Ingress; Ingress Controller; HTTP Routing

- Ingress manages HTTP and HTTPS routing into a Kubernetes cluster.

- It can route traffic based on host name or path.

- Ingress needs an Ingress Controller to work.

- It is commonly used for exposing web apps.

- It can also handle TLS certificates.

## Kubernetes HPA; Horizontal Pod Autoscaler; Auto Scaling

- HPA automatically increases or decreases the number of pods.

- It usually scales based on CPU or memory usage.

- It helps handle high traffic without manual work.

- When traffic goes down, it can reduce pods to save cost.

- It is useful for apps with changing traffic.

## Blue-Green Deployment; Zero Downtime; Instant Rollback

- Blue-green deployment uses two environments: old and new.

- Traffic is moved from the old version to the new version.

- If the new version has issues, traffic can quickly move back.

- It helps reduce downtime during release.

- It needs extra infrastructure because two versions run at the same time.

## Canary Release; Gradual Rollout; Traffic Split

- Canary release sends a small percentage of users to the new version first.

- If everything works well, traffic is increased slowly.

- It reduces risk during deployment.

- It helps catch bugs before all users are affected.

- It is commonly used in production systems.

## Rolling Deployment; Rolling Update; Minimal Downtime

- Rolling deployment replaces old instances with new ones step by step.

- Some users use the old version while others use the new version during the rollout.

- It avoids stopping the full application at once.

- It is simpler than blue-green deployment.

- Rollback may take more time compared to blue-green deployment.

## Deployment Rollback; Bad Release Recovery

- Rollback means going back to a previous working version.

- It is used when a new deployment has bugs.

- Good rollback strategy reduces production downtime.

- Versioned builds and database migration planning are important.

- Teams should test rollback steps before real issues happen.

## Circuit Breaker Pattern; Fail Fast; Fallback Response

- Circuit breaker protects a system from repeated failures.

- If a service keeps failing, the circuit opens and stops calls for some time.

- This avoids wasting resources on failed requests.

- Fallback response can be returned instead of crashing.

- It is useful in microservices and external API calls.

## Retry With Backoff; Exponential Backoff; Transient Error Handling

- Retry means trying a failed request again.

- Backoff means waiting before retrying.

- Exponential backoff increases the waiting time after each failure.

- It is useful for temporary network or service issues.

- We should set retry limits to avoid overloading the system.

## Dead Letter Queue; DLQ; Poison Message; Queue Error Handling

- A dead letter queue stores messages that failed many times.

- It prevents bad messages from blocking the main queue.

- Failed messages can be checked later by developers.

- A poison message is a message that always fails processing.

- DLQ helps improve reliability in message-based systems.

## Bulkhead Pattern; Resource Isolation; Failure Isolation

- Bulkhead pattern separates resources so one failure does not affect everything.

- It is like separate sections in a ship.

- Example: different thread pools for different services.

- If one service is overloaded, other services can still work.

- It improves system stability.

## Operational vs Programmer Errors; Node.js Error Types

- Operational errors are expected runtime problems like database down or invalid input.

- Programmer errors are bugs in code like undefined access or wrong logic.

- Operational errors should be handled gracefully.

- Programmer errors should usually be fixed in code, not ignored.

- Good error handling makes Node.js apps more reliable.

## Unhandled Rejection; uncaughtException; Fatal Error; Graceful Degradation

- Unhandled rejection happens when a Promise error is not caught.

- uncaughtException happens when an error reaches the top level without handling.

- These errors can make the app unstable.

- We should log the error and shut down safely when needed.

- Graceful degradation means the app still provides limited service when some parts fail.

## tRPC; Type-Safe API; Router; Procedure

- tRPC helps create type-safe APIs between frontend and backend.

- It is very useful when both frontend and backend use TypeScript.

- A router groups API procedures.

- A procedure is like an API function.

- It reduces the need to manually write API types.

## tRPC vs REST vs GraphQL; API Approach Comparison

- REST is simple and widely used.

- GraphQL gives the client more control over requested data.

- tRPC gives strong TypeScript safety from backend to frontend.

- tRPC is best when the app is TypeScript-first and controlled by one team.

- REST is better when many different clients need to use the API.

## Zod; Schema Validation; Runtime Validation; Type Inference

- Zod is a TypeScript-first validation library.

- It checks data at runtime.

- It is commonly used for forms, API inputs, and environment variables.

- z.object is used to define object schemas.

- Zod can also infer TypeScript types from schemas.

## Zod vs Yup; Validation Library Comparison

- Both Zod and Yup are used for validation.

- Zod works very well with TypeScript.

- Yup is older and commonly used with form libraries.

- Zod type inference is usually cleaner.

- For modern TypeScript apps, many developers prefer Zod.

## Zod with tRPC; Input Validation; Type Safe Input

- Zod is commonly used with tRPC to validate inputs.

- It checks API input before the procedure runs.

- It gives type safety to both frontend and backend.

- Invalid input can be rejected early.

- This makes APIs safer and easier to maintain.

## useDeferredValue; Deferred Value Hook; Non-Urgent Update

- useDeferredValue lets React delay updating a less important value.

- It helps keep the UI responsive during heavy rendering.

- Example: typing in search input while filtering a large list.

- The input updates immediately, but the filtered result can update later.

- It is useful for performance optimization in React.

## React Suspense; Suspense Boundary; Loading Fallback

- React Suspense lets us show fallback UI while something is loading.

- A Suspense boundary wraps the part that may load slowly.

- Fallback can be a loader, skeleton, or simple message.

- It is used with lazy components and modern data fetching patterns.

- It improves user experience during loading states.

## Concurrent Rendering; React Concurrent Features; Render Priority

- Concurrent rendering lets React prepare UI updates without blocking the page.

- React can pause and continue rendering when needed.

- Important updates can get higher priority.

- It helps keep the app responsive.

- This is used internally by React features like transitions.

## React Transitions; startTransition; useTransition

- Transitions mark some updates as non-urgent.

- Urgent updates, like typing, happen first.

- Non-urgent updates, like filtering a big list, can happen later.

- startTransition is used to wrap non-urgent updates.

- useTransition also gives a pending state for showing loading UI.

## Automatic Batching; React 18; Batch State Updates

- Automatic batching groups multiple state updates into one render.

- It reduces unnecessary re-renders.

- React 18 batches updates in more places than older versions.

- This improves performance automatically.

- flushSync can be used when we need an update immediately.

## React 18 Features; Concurrent Features; New Root API; Streaming SSR

- React 18 introduced concurrent rendering features.

- createRoot is the new way to render React apps.

- Automatic batching improves performance.

- Transitions help separate urgent and non-urgent updates.

- Streaming SSR can send HTML to the browser in parts.

## MSW; Mock Service Worker; API Mocking

- MSW is used to mock API requests during development and testing.

- It intercepts HTTP requests and returns mock responses.

- Tests can run without depending on a real backend.

- It makes frontend testing more stable.

- It is useful for testing success, error, and loading states.

## Test Fixtures; Test Factory; Seed Test Data

- Test fixtures are reusable sample data for tests.

- They keep tests clean and consistent.

- A test factory creates test data dynamically.

- Seed data is used to prepare a test database.

- Good test data makes tests easier to understand.

## Snapshot Testing; Jest Snapshot; UI Regression

- Snapshot testing saves the expected output of a component or function.

- Later tests compare new output with the saved snapshot.

- It helps catch unexpected UI changes.

- Snapshots should be reviewed carefully before updating.

- They are useful, but they should not replace proper behavior tests.

## Testing Custom Hooks; renderHook; act

- Custom hooks can be tested separately from components.

- renderHook is used to run a hook in a test environment.

- act is used when the hook changes state.

- We can test return values and state changes.

- This keeps hook logic reliable and easy to maintain.

## Testing API Integration; Supertest; Express Route Tests

- API integration tests check if routes work correctly.

- Supertest is commonly used to test Express APIs.

- We can test status codes, response body, and validation errors.

- It is useful for testing real request and response flow.

- These tests give confidence that backend routes work as expected.

## Visual Regression Testing; Percy; Chromatic; Screenshot Test

- Visual regression testing checks if UI changed unexpectedly.

- It compares screenshots before and after changes.

- Tools like Percy and Chromatic help automate this.

- It is useful for design systems and important UI pages.

- It catches visual bugs that normal tests may miss.

## Notification API; Push Notification; Browser Notification

- Notification API lets web apps show browser notifications.

- The user must give permission first.

- Notifications can be used for alerts, reminders, and updates.

- Push notifications can work even when the app is not open.

- We should use notifications carefully to avoid annoying users.

## Clipboard API; navigator.clipboard; Copy Paste Browser

- Clipboard API is used to copy or read text from the clipboard.

- navigator.clipboard.writeText copies text.

- navigator.clipboard.readText reads text with permission.

- It is commonly used for copy buttons.

- It works only in secure contexts like HTTPS.

## Intersection Observer; Lazy Load Images; Infinite Scroll

- Intersection Observer tells us when an element enters or leaves the viewport.

- It is useful for lazy loading images.

- It is also used for infinite scrolling.

- It is better than listening to scroll events manually.

- Threshold controls how much of the element should be visible.

## ResizeObserver; Element Resize; Responsive Component

- ResizeObserver watches size changes of an element.

- It is useful when component layout depends on its own size.

- It works better than only using window resize events.

- Examples include charts, cards, and responsive panels.

- It helps build smarter responsive components.

## Page Visibility API; visibilitychange Event; Background Tab

- Page Visibility API tells whether the tab is visible or hidden.

- document.visibilityState gives the current state.

- visibilitychange event runs when the state changes.

- It can pause videos, timers, or polling when the tab is hidden.

- This helps save browser resources.

## Geolocation API; navigator.geolocation; Location Permission

- Geolocation API gets the user's current location.

- The browser asks the user for permission first.

- getCurrentPosition gives the current location once.

- watchPosition tracks location changes over time.

- It is useful for maps, delivery apps, and location-based features.

## Broadcast Channel API; Cross Tab Communication; Inter-Tab Sync

- Broadcast Channel API lets browser tabs communicate with each other.

- Tabs from the same origin can send messages.

- It is useful for logout sync across tabs.

- It can also sync theme, cart, or app state.

- It is simpler than using localStorage events for some cases.

## Memory Management; Garbage Collection; Memory Leak; Heap Snapshot

- Memory management means using browser memory carefully.

- Garbage collection removes unused objects automatically.

- Memory leaks happen when unused objects are still referenced.

- Chrome Memory DevTools can help find leaks.

- Common causes are uncleared timers, event listeners, and large cached data.

## HTTP/2; Multiplexing; Header Compression

- HTTP/2 improves performance compared to HTTP/1.1.

- Multiplexing allows many requests over one connection.

- Header compression reduces repeated header data.

- It reduces the need for old tricks like domain sharding.

- Most modern browsers and servers support HTTP/2.

## HTTP/3; QUIC Protocol; UDP Based HTTP

- HTTP/3 is the newer version of HTTP.

- It uses QUIC, which is built on UDP.

- It can improve performance on unstable networks.

- It reduces connection setup time.

- It is useful for modern high-performance web delivery.

## HTTP Caching; Cache-Control; ETag; Browser Cache

- HTTP caching stores responses so they can be reused later.

- Cache-Control tells the browser how long to cache a response.

- ETag helps check if the resource changed.

- Caching reduces server load and improves speed.

- Correct caching is very important for static files and APIs.

## HTTP Methods; GET POST PUT PATCH DELETE; Safe and Idempotent

- HTTP methods describe what action the client wants to perform.

- GET reads data and should not change server data.

- POST creates data or triggers an action.

- PUT usually replaces full data, while PATCH updates partial data.

- DELETE removes data.

## HTTP Headers; Request Headers; Response Headers

- HTTP headers send extra information with requests and responses.

- Content-Type tells the format of the body.

- Authorization sends login or token information.

- Accept tells what response format the client expects.

- Headers are important for auth, caching, security, and content handling.

## Cookie Attributes; Path; Domain; Expires; Max-Age

- Cookie attributes control how cookies behave.

- Path controls where the cookie is sent.

- Domain controls which domain can receive the cookie.

- Expires and Max-Age control how long the cookie stays.

- Correct cookie settings are important for auth and security.

## Content Security Policy; CSP Header; XSS Prevention

- CSP is a security header that controls which resources can load.

- It helps reduce XSS attacks.

- We can allow scripts only from trusted sources.

- A nonce can allow only specific inline scripts.

- CSP is very useful for improving frontend security.

## HSTS; HTTP Strict Transport Security; Force HTTPS

- HSTS tells browsers to always use HTTPS for a website.

- It protects users from downgrade attacks.

- After HSTS is enabled, the browser avoids insecure HTTP access.

- HSTS preload can include the site in browser preload lists.

- It should be used only after HTTPS is properly working.

## Subresource Integrity; SRI; CDN Security

- SRI checks whether an external file was changed unexpectedly.

- It uses a hash value in the script or link tag.

- If the downloaded file hash does not match, the browser blocks it.

- It is useful when loading files from a CDN.

- It adds extra protection for third-party scripts.

## Rate Limiting Strategies; Token Bucket; Leaky Bucket; Sliding Window

- Rate limiting controls how many requests a user can make.

- It protects APIs from abuse and overload.

- Fixed window is simple but can allow bursts.

- Sliding window is smoother and more accurate.

- Token bucket and leaky bucket are common strategies for traffic control.

## API Gateway; Gateway Pattern; Auth at Gateway

- API Gateway sits in front of backend services.

- It routes requests to the correct service.

- It can handle auth, rate limiting, logging, and caching.

- It hides internal service details from clients.

- It is common in microservice architectures.

## Service Mesh; Istio; Envoy Proxy; Sidecar Pattern

- Service mesh manages communication between microservices.

- It can handle retries, security, observability, and traffic control.

- Envoy is a popular proxy used in service mesh.

- Sidecar means a proxy runs next to each service instance.

- Istio is a well-known service mesh tool.

## Event Sourcing; Event Store; Rebuild State

- Event sourcing stores changes as events instead of only storing the latest state.

- Each event explains what happened in the system.

- The current state can be rebuilt by replaying events.

- It gives a strong audit history.

- It is useful in complex business systems, but it adds complexity.

## CQRS; Read Model; Write Model

- CQRS separates read operations and write operations.

- Commands change data.

- Queries read data.

- Separate read and write models can improve performance and flexibility.

- It is useful in complex systems, but not needed for every app.

## CAP Theorem; Consistency; Availability; Partition Tolerance

- CAP theorem applies to distributed systems.

- Consistency means all users see the latest data.

- Availability means the system responds even when there are issues.

- Partition tolerance means the system works even when network parts fail.

- During network failure, systems usually choose between consistency and availability.

## Database Sharding; Horizontal Partition; Shard Key

- Sharding splits a large database into smaller parts.

- Each part is called a shard.

- A shard key decides where data should go.

- It helps scale very large databases.

- Bad shard key choice can cause uneven load.

## Database Replication; Primary Replica; Read Replica; Replication Lag

- Replication copies data from one database to another.

- Primary database handles writes.

- Read replicas can handle read traffic.

- Replication improves availability and read performance.

- Replication lag means replicas may be slightly behind the primary.

## Connection Pooling; Database Pool; Pool Size; PgBouncer

- Connection pooling reuses database connections.

- Opening a new database connection for every request is expensive.

- A pool keeps a limited number of ready connections.

- Pool size should be configured based on app and database capacity.

- PgBouncer is a common connection pooler for PostgreSQL.

## Optimistic Locking and Pessimistic Locking; Concurrency Control

- Locking helps handle multiple users updating the same data.

- Optimistic locking assumes conflicts are rare.

- It usually uses a version column to detect changes.

- Pessimistic locking locks the row before updating.

- Optimistic locking is common for web apps because it avoids holding locks too long.

## nvm; Node Version Manager; .nvmrc

- nvm is used to install and switch Node.js versions.

- Different projects may need different Node versions.

- .nvmrc stores the Node version used by the project.

- Team members can use the same version easily.

- It helps avoid version mismatch issues.

## pnpm; npm vs yarn; Package Manager; Workspaces

- pnpm is a fast JavaScript package manager.

- It saves disk space using hard links.

- It is stricter than npm in dependency handling.

- pnpm workspaces are useful for monorepos.

- Many teams use pnpm for faster installs and cleaner dependency management.

## Turborepo; Monorepo Build; Task Pipeline; Build Cache

- Turborepo helps manage monorepo projects.

- It can run build, test, and lint tasks across packages.

- It caches task results to make future runs faster.

- It only reruns tasks when needed.

- It is useful for large frontend or full-stack codebases.

## Nx; Nx Monorepo; Generators; Affected Commands

- Nx is a powerful monorepo tool.

- It supports generators for creating apps, libraries, and configs.

- Affected commands run tasks only for changed projects.

- Nx has strong caching and dependency graph features.

- It is useful for large teams and enterprise projects.

## ESLint Config; Flat Config; Lint Rules

- ESLint checks JavaScript and TypeScript code quality.

- It catches common mistakes before runtime.

- eslint.config.js is the newer flat config format.

- Rules can be customized based on project needs.

- It is commonly used with Prettier and Git hooks.

## Prettier Config; Code Formatting; Prettier vs ESLint

- Prettier formats code automatically.

- It keeps code style consistent across the team.

- ESLint focuses more on code quality and possible bugs.

- Prettier focuses mainly on formatting.

- Format on save makes development smoother.

## Husky; Git Hooks; pre-commit; lint-staged

- Husky helps run scripts during Git actions.

- pre-commit hook runs before a commit is created.

- lint-staged runs checks only on changed files.

- It helps stop bad code before it enters the repository.

- Common checks are lint, format, and tests.

## Semantic Versioning; Major Minor Patch; Breaking Change

- Semantic versioning uses three numbers: major, minor, and patch.

- Major version changes when there is a breaking change.

- Minor version changes when a new feature is added without breaking old code.

- Patch version changes for bug fixes.

- It helps users understand release impact.

## Changesets; Version Management; Changelog; Release Automation

- Changesets help manage package versions and changelogs.

- They are useful in monorepos.

- Developers add a changeset when they make a release-worthy change.

- Changesets can generate changelog entries automatically.

- They make releases more organized.

## React Native Overview; Mobile with React; Expo; React Native vs Flutter

- React Native is used to build mobile apps using React.

- It can create apps for both Android and iOS.

- Expo makes React Native development easier.

- React Native is good for teams already familiar with React.

- Flutter uses Dart and has a different UI approach.

## Storybook; Component Development; Design System Tool

- Storybook lets us build and test UI components separately.

- Each component state can be shown as a story.

- It is useful for design systems.

- Designers, testers, and developers can review components easily.

- It helps document reusable UI components.

## shadcn/ui; Radix UI; Headless Components; Accessible Components

- shadcn/ui provides copy-paste UI components built using Radix UI and Tailwind.

- The components are not installed as a normal UI library package.

- We copy them into our project and customize them.

- Radix UI gives accessible headless primitives.

- This approach gives more control over design and code.

## Radix UI; Headless UI Library; Accessible Primitives

- Radix UI provides unstyled accessible components.

- It handles hard accessibility behavior for components like dialogs and dropdowns.

- We can style Radix components however we want.

- It saves time because accessibility is difficult to build from scratch.

- It is commonly used with Tailwind and design systems.

## Framer Motion; Animation Library; Variants; Page Transition

- Framer Motion is a popular animation library for React.

- It provides motion components for easy animations.

- Variants help manage animation states.

- It is useful for page transitions, modals, and interactive UI.

- It makes complex animations easier to write.

## React Spring; Spring Animation; useSpring

- React Spring is an animation library based on spring physics.

- It creates natural and smooth animations.

- useSpring is used to create animated values.

- It is useful for interactive and physics-like UI effects.

- It can be a good choice when natural motion is important.

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066
